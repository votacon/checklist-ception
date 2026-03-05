export type ItemColor = "red" | "yellow" | "green" | "blue" | "purple";

export type DropZone = "before" | "after" | "nest";

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  subtasks: ChecklistItem[];
  color?: ItemColor;
}

export interface BreadcrumbItem {
  id: string;
  text: string;
}

export interface CardLevel {
  depth: number;
  parentId: string | null;
  title: string;
  items: ChecklistItem[];
  activeChildId: string | null;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
  createdAt: number;
}

export interface AppState {
  checklists: Checklist[];
  activeChecklistId: string;
}
