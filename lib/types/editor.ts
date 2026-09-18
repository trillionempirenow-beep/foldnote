export type EditorPage = {
  id: string;
  position: number;
  canvas_json: Record<string, unknown>;
  background_id: string | null;
};

export type EditorProject = {
  id: string;
  title: string;
  owner_id: string;
};

export const CANVAS_WIDTH = 760;
export const CANVAS_HEIGHT = 980;
