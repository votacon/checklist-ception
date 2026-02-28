export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  subtasks: ChecklistItem[];
}

export interface BreadcrumbItem {
  id: string;
  text: string;
}

export type Direction = "forward" | "backward";

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
