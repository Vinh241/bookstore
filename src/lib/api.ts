import { Category, Product, Order, OrderWithItems } from "@/types";
import axiosInstance from "./axios";

interface User {
  id: number;
  email: string;
  full_name: string;
  phone_number?: string;
  is_admin?: boolean;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await axiosInstance.get("/categories");

    return response?.data?.data?.categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const fetchFlashSaleProducts = async (): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get("/products/flash-sale");

    return response?.data?.data || [];
  } catch (error) {
    console.error("Error fetching flash sale products:", error);
    return [];
  }
};

export const fetchProductDetails = async (
  id: string | number
): Promise<Product | null> => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    return response?.data || null;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const fetchProductReviews = async (
  productId: string | number
): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/products/${productId}/reviews`);
    return (
      response?.data || { reviews: [], average_rating: 0, review_count: 0 }
    );
  } catch (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    return { reviews: [], average_rating: 0, review_count: 0 };
  }
};

export const fetchCategoryProducts = async (
  params: any
): Promise<{ products: Product[]; total: number; totalPages: number }> => {
  try {
    const response = await axiosInstance.get(`/products`, {
      params,
    });

    // Return a properly structured response similar to what the detail page expects
    return {
      products: response?.data?.data || [],
      total: response?.data?.total || 0,
      totalPages: response?.data?.totalPages || 0,
    };
  } catch (error) {
    console.error(`Error fetching products for category :`, error);
    return { products: [], total: 0, totalPages: 0 };
  }
};

export const fetchPublishers = async (): Promise<any[]> => {
  try {
    const response = await axiosInstance.get("/publishers");
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching publishers:", error);
    return [];
  }
};

export const fetchCategoryDetails = async (
  id: string | number
): Promise<Category | null> => {
  try {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    return null;
  }
};

export const getProductsByIds = async (
  productIds: number[]
): Promise<Product[]> => {
  try {
    const response = await axiosInstance.post("/products/by-ids", {
      ids: productIds,
    });
    return response?.data?.data || [];
  } catch (error) {
    console.error("Error fetching products by ids:", error);
    return [];
  }
};

// API Functions for Payment and Orders
export const createMomoPayment = async (paymentData: {
  amount: number;
  orderInfo: string;
  orderData: any;
}) => {
  try {
    const response = await axiosInstance.post("/payments/momo", paymentData);
    return response.data;
  } catch (error) {
    console.error("Error creating MoMo payment:", error);
    throw error;
  }
};

export const getPaymentStatus = async (orderId: string | number) => {
  try {
    const response = await axiosInstance.get(`/payments/${orderId}/status`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching payment status for order ${orderId}:`, error);
    throw error;
  }
};

export const createOrder = async (orderData: any) => {
  try {
    const response = await axiosInstance.post("/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Order API functions
export const fetchUserOrders = async (): Promise<Order[]> => {
  try {
    const response = await axiosInstance.get("/orders");
    return response?.data?.data?.orders || [];
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

export const fetchOrderDetails = async (
  orderId: string | number
): Promise<OrderWithItems | null> => {
  try {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response?.data?.data?.order || null;
  } catch (error) {
    console.error(`Error fetching order details for order ${orderId}:`, error);
    throw error;
  }
};

// Authentication API functions
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    return response.data.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerUser = async (
  email: string,
  password: string,
  full_name: string,
  phone_number?: string
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post("/auth/register", {
      email,
      password,
      full_name,
      phone_number,
    });
    return response.data.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await axiosInstance.get("/auth/me");
    return response.data.data.user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

// Set auth token for API requests
export const setAuthToken = (token: string | null): void => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

// Admin API functions
export const fetchAdminDashboardStats = async () => {
  try {
    const response = await axiosInstance.get("/admin/dashboard/stats");
    return (
      response?.data?.data || {
        orderCount: 0,
        totalRevenue: 0,
        productCount: 0,
        lowStockCount: 0,
      }
    );
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    throw error;
  }
};

export const fetchAdminRecentOrders = async (limit = 10) => {
  try {
    const response = await axiosInstance.get("/admin/dashboard/recent-orders", {
      params: { limit },
    });
    return response?.data?.data?.orders || [];
  } catch (error) {
    console.error("Error fetching admin recent orders:", error);
    throw error;
  }
};

export const fetchAdminOrders = async (params: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const response = await axiosInstance.get("/admin/orders", {
      params,
    });
    return {
      orders: response?.data?.data?.orders || [],
      total: response?.data?.data?.total || 0,
      totalPages: response?.data?.data?.totalPages || 0,
    };
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return { orders: [], total: 0, totalPages: 0 };
  }
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  try {
    const response = await axiosInstance.patch(`/admin/orders/${orderId}`, {
      status,
    });
    return response?.data?.data || null;
  } catch (error) {
    console.error(`Error updating order status:`, error);
    throw error;
  }
};

export const fetchAdminOrderDetails = async (orderId: number) => {
  try {
    const response = await axiosInstance.get(`/admin/orders/${orderId}`);
    return response?.data?.data?.order || null;
  } catch (error) {
    console.error(`Error fetching order details:`, error);
    throw error;
  }
};

export const fetchAdminBestsellingProducts = async (limit = 5) => {
  try {
    const response = await axiosInstance.get(
      `/admin/dashboard/bestselling-products?limit=${limit}`
    );
    return response?.data?.data?.products || [];
  } catch (error) {
    console.error("Error fetching admin bestselling products:", error);
    return [];
  }
};

export const fetchAdminSalesByDate = async (
  startDate?: string,
  endDate?: string
) => {
  try {
    let url = "/admin/dashboard/sales-by-date";
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    const response = await axiosInstance.get(url);
    return response?.data?.data?.salesByDate || [];
  } catch (error) {
    console.error("Error fetching admin sales by date:", error);
    return [];
  }
};
