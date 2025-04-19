import { Category, Product } from "@/types";
import axiosInstance from "./axios";

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
