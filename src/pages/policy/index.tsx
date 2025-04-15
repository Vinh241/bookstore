const PolicyPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Chính sách</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Chính sách đổi trả</h2>
        <div className="space-y-3">
          <p>
            BookStore cam kết đảm bảo sự hài lòng của khách hàng với các sản
            phẩm mua tại cửa hàng chúng tôi. Chính sách đổi trả của chúng tôi
            như sau:
          </p>
          <h3 className="text-xl font-medium mt-4 mb-2">
            Điều kiện đổi trả hàng
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Sản phẩm còn nguyên vẹn, không có dấu hiệu đã qua sử dụng.</li>
            <li>
              Có đầy đủ hóa đơn, tem nhãn và sản phẩm còn trong thời hạn đổi trả
              (7 ngày kể từ khi nhận hàng).
            </li>
            <li>
              Sản phẩm bị lỗi kỹ thuật do nhà sản xuất hoặc do quá trình vận
              chuyển.
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Chính sách vận chuyển</h2>
        <div className="space-y-3">
          <p>
            BookStore hợp tác với các đơn vị vận chuyển uy tín để đảm bảo sản
            phẩm được giao đến tay khách hàng nhanh chóng và an toàn.
          </p>
          <h3 className="text-xl font-medium mt-4 mb-2">Thời gian giao hàng</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Nội thành Hà Nội và TP.HCM: 1-2 ngày làm việc</li>
            <li>Các tỉnh thành khác: 2-5 ngày làm việc</li>
            <li>Vùng sâu vùng xa: 5-7 ngày làm việc</li>
          </ul>
          <h3 className="text-xl font-medium mt-4 mb-2">Phí vận chuyển</h3>
          <p>
            Phí vận chuyển sẽ được tính dựa trên khoảng cách và trọng lượng của
            đơn hàng. Đơn hàng trên 300.000đ sẽ được miễn phí vận chuyển (áp
            dụng cho khu vực nội thành).
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Chính sách bảo mật thông tin
        </h2>
        <div className="space-y-3">
          <p>
            BookStore cam kết bảo mật mọi thông tin cá nhân của khách hàng và
            chỉ sử dụng thông tin trong nội bộ công ty. Chúng tôi không chia sẻ
            thông tin khách hàng với bất kỳ bên thứ ba nào mà không có sự đồng ý
            của khách hàng.
          </p>
          <p>
            Thông tin cá nhân của khách hàng sẽ được lưu trữ cho đến khi có yêu
            cầu hủy bỏ hoặc khách hàng tự đăng nhập và thực hiện hủy bỏ. Trong
            mọi trường hợp, thông tin của khách hàng sẽ được bảo mật trên máy
            chủ của BookStore.
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Chính sách thanh toán</h2>
        <div className="space-y-3">
          <p>
            BookStore chấp nhận nhiều hình thức thanh toán khác nhau để đảm bảo
            sự thuận tiện cho khách hàng:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Thanh toán khi nhận hàng (COD)</li>
            <li>Thanh toán qua thẻ tín dụng/ghi nợ (Visa, Mastercard)</li>
            <li>Thanh toán qua ví điện tử (Momo, ZaloPay, VNPay)</li>
            <li>Chuyển khoản ngân hàng</li>
          </ul>
          <p className="mt-4">
            Mọi giao dịch thanh toán đều được bảo mật và mã hóa để đảm bảo an
            toàn cho khách hàng.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
