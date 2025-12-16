import api from "./api";
import type {
  NotificationListResponse,
  NotificationMarkReadResponse,
} from "@/types/types";

export interface ListNotificationsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  filter?: string | Record<string, any>;
  sort?: string;
}

/**
 * Get notifications for the authenticated user (paginated)
 */
export const getNotifications = async (
  params?: ListNotificationsParams
): Promise<NotificationListResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.pageSize)
    queryParams.append("pageSize", params.pageSize.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.filter) {
    const filterStr =
      typeof params.filter === "string"
        ? params.filter
        : JSON.stringify(params.filter);
    queryParams.append("filter", filterStr);
  }
  if (params?.sort) queryParams.append("sort", params.sort);

  const queryString = queryParams.toString();
  const url = `/notification${queryString ? `?${queryString}` : ""}`;

  const response = await api.get<NotificationListResponse>(url);
  return response.data;
};

/**
 * Mark a specific notification as read
 */
export const markNotificationAsRead = async (
  notificationId: string
): Promise<NotificationMarkReadResponse> => {
  const response = await api.patch<NotificationMarkReadResponse>(
    `/notification/${notificationId}`
  );
  return response.data;
};
