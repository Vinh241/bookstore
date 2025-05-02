import React, { useState } from "react";

const AdminSales: React.FC = () => {
  const [dateRange, setDateRange] = useState("month");

  // Dummy data for sales chart (by day for the last 30 days)
  const dailySales = [
    { date: "01/05", amount: 1250000 },
    { date: "02/05", amount: 950000 },
    { date: "03/05", amount: 1100000 },
    { date: "04/05", amount: 1300000 },
    { date: "05/05", amount: 850000 },
    { date: "06/05", amount: 750000 },
    { date: "07/05", amount: 1500000 },
    { date: "08/05", amount: 1750000 },
    { date: "09/05", amount: 2000000 },
    { date: "10/05", amount: 1850000 },
    { date: "11/05", amount: 1650000 },
    { date: "12/05", amount: 1400000 },
  ];

  // Dummy data for top selling categories
  const topCategories = [
    { name: "Văn học", amount: 15500000, percentage: 35 },
    { name: "Tâm lý - Kỹ năng sống", amount: 12500000, percentage: 28 },
    { name: "Kinh tế", amount: 8500000, percentage: 19 },
    { name: "Thiếu nhi", amount: 4500000, percentage: 10 },
    { name: "Khác", amount: 3500000, percentage: 8 },
  ];

  // Sales summary
  const salesSummary = {
    total: 44500000,
    orders: 127,
    average: 350394,
    increase: 12,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Báo cáo doanh số</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tổng doanh thu
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {salesSummary.total.toLocaleString("vi-VN")} ₫
          </p>
          <p className="text-sm text-green-600 mt-2">
            +{salesSummary.increase}% so với tháng trước
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Đơn hàng</h3>
          <p className="text-3xl font-bold text-blue-600">
            {salesSummary.orders}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Trung bình {(salesSummary.orders / 30).toFixed(1)} đơn/ngày
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Giá trị trung bình
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {salesSummary.average.toLocaleString("vi-VN")} ₫
          </p>
          <p className="text-sm text-gray-500 mt-2">Trên mỗi đơn hàng</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Doanh thu theo thời gian
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setDateRange("week")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  dateRange === "week"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tuần
              </button>
              <button
                onClick={() => setDateRange("month")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  dateRange === "month"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tháng
              </button>
              <button
                onClick={() => setDateRange("year")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  dateRange === "year"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Năm
              </button>
            </div>
          </div>

          <div className="h-64 flex items-end space-x-2">
            {dailySales.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-blue-500 hover:bg-blue-600 rounded-t"
                  style={{
                    height: `${Math.max(30, (day.amount / 2000000) * 100)}%`,
                    transition: "all 0.3s ease",
                  }}
                ></div>
                <div className="text-xs text-gray-500 mt-2 w-full text-center overflow-hidden truncate">
                  {day.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Doanh thu theo danh mục
          </h3>

          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {category.name}
                  </span>
                  <span className="text-sm text-gray-700">
                    {category.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {category.amount.toLocaleString("vi-VN")} ₫
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Sản phẩm bán chạy
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Sản phẩm
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Danh mục
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Đã bán
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Doanh thu
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded">
                        <img
                          src="https://picsum.photos/100"
                          alt="Product"
                          className="h-10 w-10 rounded object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Đắc Nhân Tâm
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Tâm lý - Kỹ năng sống
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    125
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    15.000.000 ₫
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded">
                        <img
                          src="https://picsum.photos/101"
                          alt="Product"
                          className="h-10 w-10 rounded object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Nhà Giả Kim
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Văn học
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    98
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    8.330.000 ₫
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded">
                        <img
                          src="https://picsum.photos/102"
                          alt="Product"
                          className="h-10 w-10 rounded object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Tuổi Trẻ Đáng Giá Bao Nhiêu
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Tâm lý - Kỹ năng sống
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    87
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    6.525.000 ₫
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSales;
