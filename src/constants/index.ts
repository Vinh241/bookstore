// App Routes
export const ROUTES = {
  HOME: "/",
  BOOK_DETAIL: "/books",
  CATEGORY: "/category",
  CART: "/cart",
  CHECKOUT: "/checkout",
  PAYMENT_RESULT: "/payment-result",
  FLASH_SALE: "/flash-sale",
  NEW_BOOKS: "/new-books",
  BEST_SELLERS: "/best-sellers",
  // Account pages
  LOGIN: "/login",
  REGISTER: "/register",
  ACCOUNT: "/account",
  WISHLIST: "/wishlist",
  MY_ORDERS: "/my-orders",
  ORDER_DETAIL: "/orders",
  // Admin pages
  ADMIN: "/admin",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_STATISTICS: "/admin/statistics",
  ADMIN_USERS: "/admin/users",
  // Other categories
  SCHOOL_SUPPLIES: "/do-dung-hoc-tap",
  TOYS: "/do-choi",
  // Information pages
  ABOUT_US: "/ve-chung-toi",
  POLICY: "/chinh-sach",
  CONTACT: "/lien-he",
};

// Special Categories
export const CATEGORIES = {
  FLASH_SALE: "flash-sale",
  NEW_BOOKS: "new-books",
  BEST_SELLERS: "best-sellers",
};

// Helper function to create book detail URL
export const getBookDetailUrl = (id: number) => `${ROUTES.BOOK_DETAIL}/${id}`;

// Helper function to create category URL
export const getCategoryUrl = (categoryId: number) =>
  `${ROUTES.CATEGORY}/${categoryId}`;

// Helper function to create order detail URL
export const getOrderDetailUrl = (id: number) => `${ROUTES.ORDER_DETAIL}/${id}`;

export const BACKEND_URL = "http://localhost:3000";
