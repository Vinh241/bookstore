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

export const fetchRelatedProducts = async (
  categoryId: number,
  productId: number | string,
  limit: number = 5
): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get(`/products`, {
      params: {
        category_id: categoryId,
        limit: limit + 1, // Fetch one extra to filter out current product
      },
    });

    // Filter out the current product
    const products = response?.data?.data || [];
    return products
      .filter((product: Product) => product.id !== Number(productId))
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
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
