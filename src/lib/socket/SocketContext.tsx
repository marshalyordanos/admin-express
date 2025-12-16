import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Socket } from "socket.io-client";
import { initializeSocket, getSocket, disconnectSocket, reconnectSocket } from "./socket";
import type { Notification } from "@/types/types";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.log("No access token found, skipping socket initialization");
      return;
    }

    // Initialize socket
    const socketInstance = initializeSocket(token);
    setSocket(socketInstance);

    // Set up connection status listeners
    socketInstance.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    // Listen for driver notifications
    socketInstance.on("notification.driver", (notification: Notification) => {
      console.log("Received driver notification:", notification);
      setNotifications((prev) => [notification, ...prev]);
    });

    // Cleanup on unmount
    return () => {
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.off("notification.driver");
      disconnectSocket();
    };
  }, []);

  // Listen for token changes and reconnect if needed
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken" && e.newValue) {
        // Token was updated, reconnect socket
        reconnectSocket(e.newValue);
        const newSocket = getSocket();
        if (newSocket) {
          setSocket(newSocket);
        }
      } else if (e.key === "accessToken" && !e.newValue) {
        // Token was removed, disconnect socket
        disconnectSocket();
        setSocket(null);
        setIsConnected(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        notifications,
        addNotification,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

/**
 * Hook to use socket context
 */
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
