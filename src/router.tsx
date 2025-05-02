import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import HomePage from "./pages/home";
import BookDetailPage from "./pages/book-detail";
import CategoryPage from "./pages/category";
import CartPage from "./pages/cart";
import CheckoutPage from "./pages/checkout";
import CheckoutSuccessPage from "./pages/checkout/success";
import PaymentResultPage from "./pages/payment/payment-result";
import AboutUsPage from "./pages/about-us";
import PolicyPage from "./pages/policy";
import ContactPage from "./pages/contact";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import MyOrdersPage from "./pages/my-orders";
import OrderDetailPage from "./pages/orders/[id]";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin";
import AdminProducts from "./pages/admin/products";
import AdminOrders from "./pages/admin/orders";
import AdminSales from "./pages/admin/sales";
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
        path: ROUTES.CHECKOUT,
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${ROUTES.CHECKOUT}/success`,
        element: (
          <ProtectedRoute>
            <CheckoutSuccessPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.PAYMENT_RESULT,
        element: (
          <ProtectedRoute>
            <PaymentResultPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.MY_ORDERS,
        element: (
          <ProtectedRoute>
            <MyOrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${ROUTES.ORDER_DETAIL}/:id`,
        element: (
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        ),
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
      {
        path: ROUTES.ABOUT_US,
        element: <AboutUsPage />,
      },
      {
        path: ROUTES.POLICY,
        element: <PolicyPage />,
      },
      {
        path: ROUTES.CONTACT,
        element: <ContactPage />,
      },
      // Auth routes
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTES.REGISTER,
        element: <RegisterPage />,
      },
    ],
  },
  // Admin routes
  {
    path: ROUTES.ADMIN,
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
      {
        path: "sales",
        element: <AdminSales />,
      },
    ],
  },
]);

export default router;
