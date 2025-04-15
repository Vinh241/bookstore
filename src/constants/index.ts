// App Routes
export const ROUTES = {
  HOME: "/",
  BOOK_DETAIL: "/books",
  CATEGORY: "/category",
  CART: "/cart",
  FLASH_SALE: "/flash-sale",
  NEW_BOOKS: "/new-books",
  BEST_SELLERS: "/best-sellers",
  // Account pages
  LOGIN: "/login",
  REGISTER: "/register",
  ACCOUNT: "/account",
  WISHLIST: "/wishlist",
  CHECK_ORDER: "/check-order",
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
