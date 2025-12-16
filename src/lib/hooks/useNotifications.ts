import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markNotificationAsRead,
} from "@/lib/api/notification";
import type { Notification, NotificationListResponse } from "@/types/types";
import { useSocket } from "@/lib/socket/SocketContext";

const NOTIFICATIONS_QUERY_KEY = ["notifications"] as const;

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const { notifications: realtimeNotifications, addNotification } = useSocket();

  // Initial / paginated notifications from REST API
  const notificationsQuery = useQuery<NotificationListResponse, Error>({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: () => getNotifications({ page: 1, pageSize: 10 }),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: (_data, id) => {
      // Optimistically update cached notifications
      queryClient.setQueryData<NotificationListResponse | undefined>(
        NOTIFICATIONS_QUERY_KEY,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              notifications: old.data.notifications.map((n: Notification) =>
                n.id === id ? { ...n, read: true } : n
              ),
            },
          };
        }
      );
    },
  });

  const allNotifications: Notification[] = [
    // Real-time first, then persisted (avoid duplicates by id)
    ...realtimeNotifications,
    ...(notificationsQuery.data?.data.notifications || []).filter(
      (n) => !realtimeNotifications.some((rt) => rt.id === n.id)
    ),
  ];

  return {
    // Combined list
    notifications: allNotifications,
    // Original query result
    notificationsQuery,
    // Actions
    markAsRead: (id: string) => markReadMutation.mutate(id),
    markAsReadAsync: (id: string) => markReadMutation.mutateAsync(id),
    // Expose adding manual notifications if caller wants
    addNotification,
  };
};
