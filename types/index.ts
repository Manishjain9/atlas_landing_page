export interface Screen {
  idx: number;
  name: string;
  desc: string;
  tag: string;
  color: string;
  colorBg: string;
  status: 'ready' | 'soon';
  /** Google Drive file ID — drives thumbnail + video embed */
  videoId?: string;
}

export interface Category {
  label: string;
  color: string;
  screens: Screen[];
}

export interface RoadmapItem {
  phase: string;
  title: string;
  desc: string;
  tags: string[];
  active: boolean;
  num: string;
}

export interface FormData {
  name: string;
  email: string;
  diocese: string;
  role: string;
  painPoints: string;
  rating: number;
  interests: string[];
}
