import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import HomePage from "./pages/home";
import BookDetailPage from "./pages/book-detail";
import CategoryPage from "./pages/category";
import CartPage from "./pages/cart";
import { ROUTES } from "./constants";

// Khởi tạo router
const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: `${ROUTES.BOOK_DETAIL}/:id`,
        element: <BookDetailPage />,
      },
      {
        path: `${ROUTES.CATEGORY}/:categoryId`,
        element: <CategoryPage />,
      },
      {
        path: ROUTES.CART,
        element: <CartPage />,
      },
      {
        path: ROUTES.FLASH_SALE,
        element: <CategoryPage />,
      },
      {
        path: ROUTES.NEW_BOOKS,
        element: <CategoryPage />,
      },
      {
        path: ROUTES.BEST_SELLERS,
        element: <CategoryPage />,
      },
    ],
  },
]);

export default router;
