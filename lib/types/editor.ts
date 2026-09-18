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

export type StickerAsset = {
  id: string;
  name: string;
  category: string;
  asset_url: string;
  featured: boolean;
};

export type BackgroundAsset = {
  id: string;
  name: string;
  collection: string | null;
  asset_url: string;
};
