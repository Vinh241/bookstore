export interface User {
  id: number;
  email: string;
  phone_number?: string;
  password_hash: string;
  full_name: string;
  is_admin?: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Address {
  id: number;
  user_id: number;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Publisher {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Author {
  id: number;
  name: string;
  biography?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  quantity_sold: number;
  category_id?: number;
  publisher_id?: number;
  author_id?: number;
  isbn?: string;
  publication_date?: Date;
  created_at: Date;
  updated_at: Date;
  author_name?: string;

  // Additional fields needed for UI
  image_url?: string;
  category_name?: string;
  publisher_name?: string;
  rating?: number;
  review_count?: number;
  images?: ProductImage[];
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  is_primary: boolean;
  created_at: Date;
  updated_at: Date;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type PaymentMethod =
  | "credit_card"
  | "paypal"
  | "bank_transfer"
  | "cash_on_delivery"
  | "momo";

export interface Order {
  id: number;
  user_id: number;
  status: OrderStatus;
  total_amount: number;
  shipping_address?: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  name?: string;
  slug?: string;
  isbn?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}
