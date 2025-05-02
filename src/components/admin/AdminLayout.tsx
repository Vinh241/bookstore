import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { ROUTES } from "@/constants";

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Admin Dashboard
          </h2>
        </div>
        <nav className="mt-4">
          <ul>
            <li>
              <NavLink
                to={ROUTES.ADMIN}
                end
                className={({ isActive }) =>
                  `block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 ${
                    isActive ? "bg-blue-50 text-blue-600 font-medium" : ""
                  }`
                }
              >
                Tổng quan
              </NavLink>
            </li>
            <li>
              <NavLink
                to={ROUTES.ADMIN_PRODUCTS}
                className={({ isActive }) =>
                  `block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 ${
                    isActive ? "bg-blue-50 text-blue-600 font-medium" : ""
                  }`
                }
              >
                Quản lý sản phẩm
              </NavLink>
            </li>
            <li>
              <NavLink
                to={ROUTES.ADMIN_ORDERS}
                className={({ isActive }) =>
                  `block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 ${
                    isActive ? "bg-blue-50 text-blue-600 font-medium" : ""
                  }`
                }
              >
                Quản lý đơn hàng
              </NavLink>
            </li>
            <li>
              <NavLink
                to={ROUTES.ADMIN_SALES}
                className={({ isActive }) =>
                  `block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 ${
                    isActive ? "bg-blue-50 text-blue-600 font-medium" : ""
                  }`
                }
              >
                Báo cáo doanh số
              </NavLink>
            </li>
            <li>
              <NavLink
                to={ROUTES.HOME}
                className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              >
                Về trang chủ
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
