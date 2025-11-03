export interface Notification {
  id: string;
  type: string;
  payload: Record<string, any>;
  createdAt: Date;
}

export interface CreateNotificationDto {
  type: string;
  payload: Record<string, any>;
}
