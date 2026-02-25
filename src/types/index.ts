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
