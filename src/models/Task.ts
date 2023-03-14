export enum TaskPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export interface Task {
  text: string;
  priority: TaskPriority;
  createdAt: Date;
  completedAt: Date | undefined;
}
