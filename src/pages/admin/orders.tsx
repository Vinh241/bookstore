import React, { useState } from "react";

const AdminOrders: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState("all");

  // Dummy data for orders
  const orders = [
    {
      id: 12345,
      customer: "Nguyễn Văn A",
      email: "nguyenvana@gmail.com",
      date: "12/05/2023",
      amount: 850000,
      status: "delivered",
      items: 3,
    },
    {
      id: 12344,
      customer: "Trần Thị B",
      email: "tranthib@gmail.com",
      date: "11/05/2023",
      amount: 1250000,
      status: "processing",
      items: 5,
    },
    {
      id: 12343,
      customer: "Lê Văn C",
      email: "levanc@gmail.com",
      date: "10/05/2023",
      amount: 475000,
      status: "shipped",
      items: 2,
    },
    {
      id: 12342,
      customer: "Phạm Thị D",
      email: "phamthid@gmail.com",
      date: "09/05/2023",
      amount: 560000,
      status: "pending",
      items: 2,
    },
    {
      id: 12341,
      customer: "Hoàng Văn E",
      email: "hoangvane@gmail.com",
      date: "08/05/2023",
      amount: 920000,
      status: "cancelled",
      items: 4,
    },
  ];

  // Filter orders based on status
  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let color = "";
    let text = "";

    switch (status) {
      case "pending":
        color = "bg-yellow-100 text-yellow-800";
        text = "Chờ xử lý";
        break;
      case "processing":
        color = "bg-blue-100 text-blue-800";
        text = "Đang xử lý";
        break;
      case "shipped":
        color = "bg-indigo-100 text-indigo-800";
        text = "Đang vận chuyển";
        break;
      case "delivered":
        color = "bg-green-100 text-green-800";
        text = "Đã giao";
        break;
      case "cancelled":
        color = "bg-red-100 text-red-800";
        text = "Đã hủy";
        break;
      default:
        color = "bg-gray-100 text-gray-800";
        text = status;
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
      >
        {text}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex space-x-2 mb-2 sm:mb-0">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  statusFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  statusFilter === "pending"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Chờ xử lý
              </button>
              <button
                onClick={() => setStatusFilter("processing")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  statusFilter === "processing"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Đang xử lý
              </button>
              <button
                onClick={() => setStatusFilter("shipped")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  statusFilter === "shipped"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Đang vận chuyển
              </button>
              <button
                onClick={() => setStatusFilter("delivered")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  statusFilter === "delivered"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Đã giao
              </button>
              <button
                onClick={() => setStatusFilter("cancelled")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  statusFilter === "cancelled"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Đã hủy
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng..."
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Mã đơn hàng
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Khách hàng
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ngày đặt
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tổng tiền
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.customer}
                    </div>
                    <div className="text-sm text-gray-500">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.amount.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        Chi tiết
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900">
                        Cập nhật
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Trước
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Sau
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">1</span> đến{" "}
                <span className="font-medium">5</span> của{" "}
                <span className="font-medium">5</span> kết quả
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Trước</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  aria-current="page"
                  className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Sau</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
