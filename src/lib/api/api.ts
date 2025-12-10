import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";

let isRefreshing = false;

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
  suppressErrorToast?: boolean;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

const api: AxiosInstance = axios.create({
  // baseURL: "https://localhost:10000/",
  // baseURL: "http://localhost:10000",
  baseURL: "https://test-courier.servehalflife.com",

  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Global error handler (can be replaced with your own UI logic)
 */
const handleErrorResponse = (errorMessage: string) => {
  console.error("API Error:", errorMessage);
};

/**
 * Setup function for Axios interceptors
 */
const setup = (store: any) => {
  // Request interceptor
  api.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem("accessToken");
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // Response interceptor
  // instance.interceptors.response.use(
  //   (response: AxiosResponse) => {
  //     isRefreshing = false;
  //     return response;
  //   },
  //   async (error: AxiosError) => {
  //     const originalConfig = error.config as CustomAxiosRequestConfig;

  //     if (originalConfig.url !== "/auth/signin" && error.response) {
  //       if (error.response.status === 401 && !isRefreshing) {
  //         originalConfig._retry = true;
  //         isRefreshing = true;

  //         try {
  //           // Call refresh endpoint
  //           const rs = await instance.get<RefreshResponse>("/auth/refresh", {
  //             headers: {
  //               Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
  //             },
  //           });

  //           const { accessToken, refreshToken } = rs.data;

  //           // Save tokens in localStorage
  //           localStorage.setItem("accessToken", accessToken);
  //           localStorage.setItem("refreshToken", refreshToken);

  //           return instance(originalConfig);
  //         } catch (_error: any) {
  //           // Clear tokens if refresh fails
  //           localStorage.removeItem("accessToken");
  //           localStorage.removeItem("refreshToken");
  //           localStorage.removeItem("user");
  //           localStorage.removeItem("role");

  //           if (!originalConfig?.suppressErrorToast) {
  //             handleErrorResponse(
  //               error.response?.data?.message || error.message
  //             );
  //           }

  //           return Promise.reject(_error);
  //         } finally {
  //           isRefreshing = false;
  //         }
  //       } else {
  //         if (!originalConfig?.suppressErrorToast) {
  //           handleErrorResponse(error.response?.data?.message || error.message);
  //         }
  //         return Promise.reject(error);
  //       }
  //     }

  //     if (!originalConfig?.suppressErrorToast) {
  //       handleErrorResponse(error.response?.data?.message || error.message);
  //     }

  //     return Promise.reject(error);
  //   }
  // );
};

export default api;
export { setup };
