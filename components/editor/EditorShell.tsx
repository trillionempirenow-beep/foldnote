"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type * as FabricNS from "fabric";
import { createClient } from "@/lib/supabase/client";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/lib/types/editor";
import type {
  EditorPage,
  EditorProject,
  StickerAsset,
  BackgroundAsset,
} from "@/lib/types/editor";
import {
  DEFAULT_FONT_VAR,
  FONT_OPTIONS,
  resolveFontFamily,
} from "@/lib/editor/fonts";
import { Topbar } from "./Topbar";
import { Toolbar } from "./Toolbar";
import { BottomPages } from "./BottomPages";
import { PropertyPanel, type SelectionInfo } from "./PropertyPanel";
import { LayersPanel, type LayerEntry } from "./LayersPanel";
import { AssetGrid } from "./AssetGrid";

type SaveStatus = "saved" | "saving" | "unsaved";

const EMPTY_SELECTION: SelectionInfo = {
  kind: "none",
  locked: false,
  isMulti: false,
  isGroupObject: false,
};

export function EditorShell({
  project,
  initialPages,
}: {
  project: EditorProject;
  initialPages: EditorPage[];
}) {
  const supabase = createClient();

  const [title, setTitle] = useState(project.title);
  const [pages, setPages] = useState(initialPages);
  const [currentPageId, setCurrentPageId] = useState(initialPages[0].id);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [selection, setSelection] = useState<SelectionInfo>(EMPTY_SELECTION);
  const [layers, setLayers] = useState<LayerEntry[]>([]);
  const [activePanel, setActivePanel] = useState<
    "none" | "layers" | "stickers" | "backgrounds"
  >("none");
  const [history, setHistory] = useState({ canUndo: false, canRedo: false });
  const [scale, setScale] = useState(1);
  const [stickers, setStickers] = useState<StickerAsset[]>([]);
  const [backgrounds, setBackgrounds] = useState<BackgroundAsset[]>([]);

  const stageWrapperRef = useRef<HTMLDivElement>(null);
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricNS.Canvas | null>(null);
  const fabricModRef = useRef<typeof FabricNS | null>(null);
  const layerObjectsRef = useRef<FabricNS.FabricObject[]>([]);
  const activePageIdRef = useRef(currentPageId);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const historyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const historyRef = useRef<{ stack: string[]; index: number }>({
    stack: [],
    index: -1,
  });
  const suppressHistoryRef = useRef(false);

  // Responsive scaling for the fixed-size canvas.
  useEffect(() => {
    const el = stageWrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const availableW = el.clientWidth - 48;
      const availableH = el.clientHeight - 48;
      const s = Math.min(
        availableW / CANVAS_WIDTH,
        availableH / CANVAS_HEIGHT,
        1,
      );
      setScale(s > 0 ? s : 1);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Load the sticker/background libraries once. Both tables are public-read.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [{ data: stickerRows }, { data: bgRows }] = await Promise.all([
        supabase
          .from("stickers")
          .select("id, name, category, asset_url, featured")
          .order("category", { ascending: true }),
        supabase
          .from("backgrounds")
          .select("id, name, collection, asset_url")
          .order("collection", { ascending: true }),
      ]);
      if (cancelled) return;
      if (stickerRows) setStickers(stickerRows as StickerAsset[]);
      if (bgRows) setBackgrounds(bgRows as BackgroundAsset[]);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rebuildLayers = useCallback((canvas: FabricNS.Canvas) => {
    const objects = canvas.getObjects();
    layerObjectsRef.current = objects;
    const active = canvas.getActiveObject();
    setLayers(
      objects.map((obj, i) => ({
        key: i,
        kind:
          obj.type === "i-text" || obj.type === "text"
            ? "text"
            : obj.type === "image"
              ? "image"
              : "other",
        label:
          obj.type === "i-text" || obj.type === "text"
            ? ((obj as FabricNS.IText).text || "Text").slice(0, 18)
            : obj.type === "image"
              ? "Image"
              : obj.type === "group"
                ? "Group"
                : "Shape",
        active: obj === active,
        visible: obj.visible !== false,
      })),
    );
  }, []);

  const readSelection = useCallback((canvas: FabricNS.Canvas) => {
    const active = canvas.getActiveObject();
    if (!active) {
      setSelection(EMPTY_SELECTION);
      return;
    }
    const activeObjects = canvas.getActiveObjects();
    const isMulti = activeObjects.length > 1;
    const isText =
      !isMulti && (active.type === "i-text" || active.type === "text");
    const isImage = !isMulti && active.type === "image";
    const isGroupObject = !isMulti && active.type === "group";

    let fontVarName: string | undefined;
    if (isText) {
      const textObj = active as FabricNS.IText;
      const family = textObj.fontFamily || "";
      const match = FONT_OPTIONS.find(
        (f) => resolveFontFamily(f.varName) === family,
      );
      fontVarName = match?.varName ?? DEFAULT_FONT_VAR;
    }

    setSelection({
      kind: isMulti
        ? "multi"
        : isText
          ? "text"
          : isImage
            ? "image"
            : isGroupObject
              ? "group"
              : "other",
      locked: Boolean(active.lockMovementX),
      isMulti,
      isGroupObject,
      fontVarName,
      fontSize: isText ? (active as FabricNS.IText).fontSize : undefined,
      fill: isText ? ((active as FabricNS.IText).fill as string) : undefined,
      bold: isText
        ? (active as FabricNS.IText).fontWeight === "bold" ||
          (active as FabricNS.IText).fontWeight === 700
        : undefined,
      italic: isText
        ? (active as FabricNS.IText).fontStyle === "italic"
        : undefined,
    });
  }, []);

  const flushSave = useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    const pageId = activePageIdRef.current;
    setSaveStatus("saving");
    const json = canvas.toJSON();
    const { error } = await supabase
      .from("pages")
      .update({ canvas_json: json, updated_at: new Date().toISOString() })
      .eq("id", pageId);
    setSaveStatus(error ? "unsaved" : "saved");
    setPages((prev) =>
      prev.map((p) =>
        p.id === pageId ? { ...p, canvas_json: json as Record<string, unknown> } : p,
      ),
    );
  }, [supabase]);

  const scheduleSave = useCallback(() => {
    setSaveStatus("unsaved");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      void flushSave();
    }, 1500);
  }, [flushSave]);

  const pushHistoryImmediate = useCallback((canvas: FabricNS.Canvas) => {
    const json = JSON.stringify(canvas.toJSON());
    historyRef.current = { stack: [json], index: 0 };
    setHistory({ canUndo: false, canRedo: false });
  }, []);

  const pushHistoryDebounced = useCallback((canvas: FabricNS.Canvas) => {
    if (historyTimerRef.current) clearTimeout(historyTimerRef.current);
    historyTimerRef.current = setTimeout(() => {
      const json = JSON.stringify(canvas.toJSON());
      const h = historyRef.current;
      const stack = h.stack.slice(0, h.index + 1);
      stack.push(json);
      if (stack.length > 50) stack.shift();
      historyRef.current = { stack, index: stack.length - 1 };
      setHistory({ canUndo: historyRef.current.index > 0, canRedo: false });
    }, 500);
  }, []);

  const handleChange = useCallback(
    (canvas: FabricNS.Canvas) => {
      rebuildLayers(canvas);
      if (suppressHistoryRef.current) return;
      scheduleSave();
      pushHistoryDebounced(canvas);
    },
    [rebuildLayers, scheduleSave, pushHistoryDebounced],
  );

  // Initialize Fabric once, client-side only.
  useEffect(() => {
    let disposed = false;
    (async () => {
      const mod = await import("fabric");
      if (disposed || !canvasElRef.current) return;
      fabricModRef.current = mod;
      const canvas = new mod.Canvas(canvasElRef.current, {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true,
      });
      fabricRef.current = canvas;

      canvas.on("object:modified", () => handleChange(canvas));
      canvas.on("object:added", () => handleChange(canvas));
      canvas.on("object:removed", () => handleChange(canvas));
      canvas.on("text:changed", () => handleChange(canvas));
      canvas.on("selection:created", () => {
        readSelection(canvas);
        rebuildLayers(canvas);
      });
      canvas.on("selection:updated", () => {
        readSelection(canvas);
        rebuildLayers(canvas);
      });
      canvas.on("selection:cleared", () => {
        readSelection(canvas);
        rebuildLayers(canvas);
      });

      const first = initialPages[0];
      suppressHistoryRef.current = true;
      const json =
        first.canvas_json && Object.keys(first.canvas_json).length
          ? first.canvas_json
          : { objects: [] };
      await canvas.loadFromJSON(json);
      canvas.requestRenderAll();
      suppressHistoryRef.current = false;
      pushHistoryImmediate(canvas);
      rebuildLayers(canvas);
    })();

    return () => {
      disposed = true;
      fabricRef.current?.dispose();
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchToPage = useCallback(
    async (pageId: string) => {
      const canvas = fabricRef.current;
      if (!canvas || pageId === activePageIdRef.current) return;
      await flushSave();
      const page = pages.find((p) => p.id === pageId);
      if (!page) return;
      suppressHistoryRef.current = true;
      const json =
        page.canvas_json && Object.keys(page.canvas_json).length
          ? page.canvas_json
          : { objects: [] };
      await canvas.loadFromJSON(json);
      canvas.requestRenderAll();
      suppressHistoryRef.current = false;
      pushHistoryImmediate(canvas);
      rebuildLayers(canvas);
      readSelection(canvas);
      activePageIdRef.current = pageId;
      setCurrentPageId(pageId);
      setSaveStatus("saved");
    },
    [flushSave, pages, pushHistoryImmediate, rebuildLayers, readSelection],
  );

  const handleAddPage = useCallback(async () => {
    await flushSave();
    const nextPosition =
      pages.reduce((max, p) => Math.max(max, p.position), -1) + 1;
    const { data, error } = await supabase
      .from("pages")
      .insert({ project_id: project.id, position: nextPosition, canvas_json: {} })
      .select("id, position, canvas_json, background_id")
      .single();
    if (error || !data) return;
    const newPage = data as EditorPage;
    setPages((prev) => [...prev, newPage]);
    await switchToPage(newPage.id);
  }, [flushSave, pages, project.id, supabase, switchToPage]);

  const handleDeletePage = useCallback(
    async (pageId: string) => {
      if (pages.length <= 1) return;
      const remaining = pages.filter((p) => p.id !== pageId);
      await supabase.from("pages").delete().eq("id", pageId);
      setPages(remaining);
      if (pageId === currentPageId) {
        activePageIdRef.current = "";
        await switchToPage(remaining[0].id);
      }
    },
    [pages, supabase, currentPageId, switchToPage],
  );

  const handleRename = useCallback(
    async (newTitle: string) => {
      setTitle(newTitle);
      await supabase.from("projects").update({ title: newTitle }).eq("id", project.id);
    },
    [supabase, project.id],
  );

  const handleAddText = useCallback(() => {
    const canvas = fabricRef.current;
    const mod = fabricModRef.current;
    if (!canvas || !mod) return;
    const text = new mod.IText("Double-click to edit", {
      left: CANVAS_WIDTH / 2 - 100,
      top: CANVAS_HEIGHT / 2 - 20,
      fontFamily: resolveFontFamily(DEFAULT_FONT_VAR),
      fontSize: 28,
      fill: "#3a312b",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.requestRenderAll();
  }, []);

  const handleAddImage = useCallback(
    async (file: File) => {
      const canvas = fabricRef.current;
      const mod = fabricModRef.current;
      if (!canvas || !mod) return;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${project.id}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("uploads")
        .upload(path, file, { contentType: file.type });
      if (error) return;
      const { data: pub } = supabase.storage.from("uploads").getPublicUrl(path);
      const img = await mod.FabricImage.fromURL(pub.publicUrl, {
        crossOrigin: "anonymous",
      });
      const maxDim = 320;
      const s = Math.min(
        maxDim / (img.width || maxDim),
        maxDim / (img.height || maxDim),
        1,
      );
      img.set({ left: 80, top: 80, scaleX: s, scaleY: s });
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.requestRenderAll();
    },
    [supabase, project.id],
  );

  const handleAddSticker = useCallback(
    async (sticker: StickerAsset) => {
      const canvas = fabricRef.current;
      const mod = fabricModRef.current;
      if (!canvas || !mod) return;
      const img = await mod.FabricImage.fromURL(sticker.asset_url);
      const targetSize = 96;
      const s = targetSize / Math.max(img.width || targetSize, img.height || targetSize);
      const jitter = () => Math.random() * 120 - 60;
      img.set({
        left: CANVAS_WIDTH / 2 - targetSize / 2 + jitter(),
        top: CANVAS_HEIGHT / 2 - targetSize / 2 + jitter(),
        scaleX: s,
        scaleY: s,
        angle: Math.random() * 16 - 8,
      });
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.requestRenderAll();
    },
    [],
  );

  const handleSetBackground = useCallback(
    async (bg: BackgroundAsset) => {
      const canvas = fabricRef.current;
      const mod = fabricModRef.current;
      if (!canvas || !mod) return;
      const img = await mod.FabricImage.fromURL(bg.asset_url);
      img.set({
        scaleX: CANVAS_WIDTH / (img.width || CANVAS_WIDTH),
        scaleY: CANVAS_HEIGHT / (img.height || CANVAS_HEIGHT),
        originX: "left",
        originY: "top",
        selectable: false,
        evented: false,
      });
      canvas.set("backgroundImage", img);
      canvas.requestRenderAll();
      handleChange(canvas);
      const pageId = activePageIdRef.current;
      await supabase.from("pages").update({ background_id: bg.id }).eq("id", pageId);
      setPages((prev) =>
        prev.map((p) => (p.id === pageId ? { ...p, background_id: bg.id } : p)),
      );
    },
    [handleChange, supabase],
  );

  const handleConvertToPolaroid = useCallback(() => {
    const canvas = fabricRef.current;
    const mod = fabricModRef.current;
    if (!canvas || !mod) return;
    const active = canvas.getActiveObject();
    if (!active || active.type !== "image") return;
    const img = active as FabricNS.FabricImage;
    const w = (img.width || 0) * (img.scaleX || 1);
    const h = (img.height || 0) * (img.scaleY || 1);
    const pad = 18;
    const captionSpace = 70;
    const frameW = w + pad * 2;
    const frameH = h + pad + captionSpace;
    const left = img.left || 0;
    const top = img.top || 0;
    const angle = img.angle || 0;

    canvas.remove(img);
    img.set({ left: pad, top: pad, angle: 0 });

    const frame = new mod.Rect({
      left: 0,
      top: 0,
      width: frameW,
      height: frameH,
      fill: "#ffffff",
      rx: 2,
      ry: 2,
      shadow: new mod.Shadow({
        color: "rgba(58,49,43,0.35)",
        blur: 14,
        offsetY: 6,
      }),
    });
    const caption = new mod.IText("write a caption...", {
      left: pad,
      top: h + pad + 14,
      fontFamily: resolveFontFamily(DEFAULT_FONT_VAR),
      fontSize: 20,
      fill: "#3a312b",
      width: frameW - pad * 2,
    });
    const tape = new mod.Rect({
      left: frameW / 2 - 34,
      top: -12,
      width: 68,
      height: 24,
      fill: "#c97a7e",
      opacity: 0.8,
      angle: -4,
      shadow: new mod.Shadow({ color: "rgba(58,49,43,0.25)", blur: 4, offsetY: 2 }),
    });

    const group = new mod.Group([frame, img, caption, tape], { left, top, angle });
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.requestRenderAll();
    handleChange(canvas);
  }, [handleChange]);

  const withActive = useCallback(
    (fn: (canvas: FabricNS.Canvas, active: FabricNS.FabricObject) => void) => {
      const canvas = fabricRef.current;
      const active = canvas?.getActiveObject();
      if (!canvas || !active) return;
      fn(canvas, active);
    },
    [],
  );

  const handleDuplicate = useCallback(() => {
    withActive((canvas, active) => {
      active.clone().then((clone: FabricNS.FabricObject) => {
        clone.set({ left: (active.left || 0) + 24, top: (active.top || 0) + 24 });
        canvas.add(clone);
        canvas.setActiveObject(clone);
        canvas.requestRenderAll();
        handleChange(canvas);
      });
    });
  }, [withActive, handleChange]);

  const handleDelete = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const objects = canvas.getActiveObjects();
    objects.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    handleChange(canvas);
  }, [handleChange]);

  const handleToggleLock = useCallback(() => {
    withActive((canvas, active) => {
      const next = !active.lockMovementX;
      active.set({
        lockMovementX: next,
        lockMovementY: next,
        lockRotation: next,
        lockScalingX: next,
        lockScalingY: next,
        hasControls: !next,
      });
      canvas.requestRenderAll();
      readSelection(canvas);
    });
  }, [withActive, readSelection]);

  const handleGroup = useCallback(() => {
    const canvas = fabricRef.current;
    const mod = fabricModRef.current;
    const active = canvas?.getActiveObject();
    if (!canvas || !mod || !active || active.type !== "activeselection") return;
    // Discarding the selection restores each member's absolute canvas
    // transform (the same mechanism a normal deselect uses), so building a
    // fresh permanent Group from them afterwards keeps their positions.
    const objects = canvas.getActiveObjects().slice();
    canvas.discardActiveObject();
    objects.forEach((o) => canvas.remove(o));
    const group = new mod.Group(objects);
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.requestRenderAll();
    handleChange(canvas);
  }, [handleChange]);

  const handleUngroup = useCallback(() => {
    const canvas = fabricRef.current;
    const mod = fabricModRef.current;
    const active = canvas?.getActiveObject();
    if (!canvas || !mod || !active || active.type !== "group") return;
    const group = active as FabricNS.Group;
    canvas.remove(group);
    const objects = group.removeAll();
    objects.forEach((o) => canvas.add(o));
    const sel = new mod.ActiveSelection(objects, { canvas });
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
    handleChange(canvas);
  }, [handleChange]);

  const handleBringForward = useCallback(() => {
    withActive((canvas, active) => {
      canvas.bringObjectForward(active);
      canvas.requestRenderAll();
      rebuildLayers(canvas);
    });
  }, [withActive, rebuildLayers]);

  const handleSendBackward = useCallback(() => {
    withActive((canvas, active) => {
      canvas.sendObjectBackwards(active);
      canvas.requestRenderAll();
      rebuildLayers(canvas);
    });
  }, [withActive, rebuildLayers]);

  const applyTextProp = useCallback(
    (props: Partial<FabricNS.IText>) => {
      withActive((canvas, active) => {
        if (active.type !== "i-text" && active.type !== "text") return;
        active.set(props);
        canvas.requestRenderAll();
        readSelection(canvas);
        handleChange(canvas);
      });
    },
    [withActive, readSelection, handleChange],
  );

  const undo = useCallback(async () => {
    const canvas = fabricRef.current;
    const h = historyRef.current;
    if (!canvas || h.index <= 0) return;
    h.index -= 1;
    suppressHistoryRef.current = true;
    await canvas.loadFromJSON(JSON.parse(h.stack[h.index]));
    canvas.requestRenderAll();
    suppressHistoryRef.current = false;
    setHistory({ canUndo: h.index > 0, canRedo: h.index < h.stack.length - 1 });
    rebuildLayers(canvas);
    readSelection(canvas);
    scheduleSave();
  }, [rebuildLayers, readSelection, scheduleSave]);

  const redo = useCallback(async () => {
    const canvas = fabricRef.current;
    const h = historyRef.current;
    if (!canvas || h.index >= h.stack.length - 1) return;
    h.index += 1;
    suppressHistoryRef.current = true;
    await canvas.loadFromJSON(JSON.parse(h.stack[h.index]));
    canvas.requestRenderAll();
    suppressHistoryRef.current = false;
    setHistory({ canUndo: h.index > 0, canRedo: h.index < h.stack.length - 1 });
    rebuildLayers(canvas);
    readSelection(canvas);
    scheduleSave();
  }, [rebuildLayers, readSelection, scheduleSave]);

  // Save on tab close / navigation away.
  useEffect(() => {
    const handler = () => {
      void flushSave();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [flushSave]);

  // Keyboard shortcuts.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      const canvas = fabricRef.current;
      if (!canvas) return;
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        void undo();
      } else if (meta && (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))) {
        e.preventDefault();
        void redo();
      } else if ((e.key === "Backspace" || e.key === "Delete") && canvas.getActiveObject()) {
        const active = canvas.getActiveObject();
        if (active && (active.type === "i-text" || active.type === "text") && (active as FabricNS.IText).isEditing) {
          return;
        }
        e.preventDefault();
        handleDelete();
      } else if (meta && e.key.toLowerCase() === "d" && canvas.getActiveObject()) {
        e.preventDefault();
        handleDuplicate();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo, handleDelete, handleDuplicate]);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Topbar
        title={title}
        onRename={handleRename}
        saveStatus={saveStatus}
        onUndo={() => void undo()}
        onRedo={() => void redo()}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
      />

      <div className="flex flex-1 overflow-hidden">
        <Toolbar
          onAddText={handleAddText}
          onAddImage={handleAddImage}
          onToggleLayers={() =>
            setActivePanel((p) => (p === "layers" ? "none" : "layers"))
          }
          onToggleStickers={() =>
            setActivePanel((p) => (p === "stickers" ? "none" : "stickers"))
          }
          onToggleBackgrounds={() =>
            setActivePanel((p) => (p === "backgrounds" ? "none" : "backgrounds"))
          }
          activePanel={activePanel}
        />

        <div
          ref={stageWrapperRef}
          className="relative flex flex-1 items-center justify-center overflow-auto bg-kraft/15 p-6"
        >
          <div
            style={{ width: CANVAS_WIDTH * scale, height: CANVAS_HEIGHT * scale }}
          >
            <div
              className="paper-shadow origin-top-left bg-white"
              style={{
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                transform: `scale(${scale})`,
              }}
            >
              <canvas ref={canvasElRef} />
            </div>
          </div>

          <PropertyPanel
            selection={selection}
            onFontChange={(varName) =>
              applyTextProp({ fontFamily: resolveFontFamily(varName) })
            }
            onFontSizeChange={(size) => applyTextProp({ fontSize: size })}
            onColorChange={(color) => applyTextProp({ fill: color })}
            onToggleBold={() =>
              applyTextProp({
                fontWeight: selection.bold ? "normal" : "bold",
              })
            }
            onToggleItalic={() =>
              applyTextProp({
                fontStyle: selection.italic ? "normal" : "italic",
              })
            }
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onToggleLock={handleToggleLock}
            onGroup={handleGroup}
            onUngroup={handleUngroup}
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            onConvertToPolaroid={handleConvertToPolaroid}
          />

          {activePanel === "layers" && (
            <LayersPanel
              layers={layers}
              onSelect={(key) => {
                const canvas = fabricRef.current;
                const obj = layerObjectsRef.current[key];
                if (!canvas || !obj) return;
                canvas.discardActiveObject();
                canvas.setActiveObject(obj);
                canvas.requestRenderAll();
              }}
              onToggleVisible={(key) => {
                const canvas = fabricRef.current;
                const obj = layerObjectsRef.current[key];
                if (!canvas || !obj) return;
                obj.set({ visible: !obj.visible });
                canvas.requestRenderAll();
                handleChange(canvas);
              }}
            />
          )}

          {activePanel === "stickers" && (
            <AssetGrid
              title="Stickers"
              groups={Object.entries(
                stickers.reduce<Record<string, StickerAsset[]>>((acc, s) => {
                  (acc[s.category] ??= []).push(s);
                  return acc;
                }, {}),
              ).map(([label, items]) => ({ label, items }))}
              onPick={(item) => void handleAddSticker(item)}
            />
          )}

          {activePanel === "backgrounds" && (
            <AssetGrid
              title="Backgrounds"
              columns={2}
              itemClassName="flex h-20 items-center justify-center overflow-hidden rounded-lg border border-ink/10 transition-transform hover:-translate-y-0.5 hover:border-rose/40"
              groups={Object.entries(
                backgrounds.reduce<Record<string, BackgroundAsset[]>>((acc, b) => {
                  const key = b.collection || "Backgrounds";
                  (acc[key] ??= []).push(b);
                  return acc;
                }, {}),
              ).map(([label, items]) => ({ label, items }))}
              onPick={(item) => void handleSetBackground(item)}
            />
          )}
        </div>
      </div>

      <BottomPages
        pages={pages}
        currentPageId={currentPageId}
        onSelect={(id) => void switchToPage(id)}
        onAdd={() => void handleAddPage()}
        onDelete={(id) => void handleDeletePage(id)}
      />
    </div>
  );
}
