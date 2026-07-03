export enum NotificationEvents {
  CREATED = 'notification.created',
  CLEAR_ALL = 'notification.clear-all',
}
export type NotificationEventPayload = {
  text: string;
};
