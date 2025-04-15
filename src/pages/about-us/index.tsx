const AboutUsPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Về chúng tôi</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Giới thiệu về BookStore</h2>
        <p className="mb-4">
          BookStore được thành lập vào năm 2010, là một trong những nhà sách
          trực tuyến hàng đầu tại Việt Nam. Chúng tôi tự hào cung cấp hàng ngàn
          đầu sách chất lượng từ nhiều thể loại khác nhau, từ sách giáo khoa,
          sách tham khảo đến sách văn học, kinh tế, khoa học...
        </p>
        <p className="mb-4">
          Với phương châm "Tri thức là sức mạnh", chúng tôi luôn nỗ lực để mang
          đến cho độc giả những cuốn sách hay nhất, chất lượng nhất với giá cả
          hợp lý nhất.
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Tầm nhìn và sứ mệnh</h2>
        <div className="mb-4">
          <h3 className="text-xl font-medium mb-2">Tầm nhìn</h3>
          <p>
            Trở thành nhà sách trực tuyến số một Việt Nam, nơi mà mỗi người dân
            đều có thể tiếp cận với kho tàng tri thức của nhân loại một cách dễ
            dàng và thuận tiện nhất.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-medium mb-2">Sứ mệnh</h3>
          <p>
            Phổ biến văn hóa đọc tới mọi người dân Việt Nam, góp phần nâng cao
            dân trí và xây dựng một xã hội học tập suốt đời.
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Giá trị cốt lõi</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Chất lượng:</strong> Cam kết cung cấp những sản phẩm chất
            lượng cao, đảm bảo nguồn gốc xuất xứ rõ ràng.
          </li>
          <li>
            <strong>Tận tâm:</strong> Luôn lắng nghe và phục vụ khách hàng một
            cách tận tâm nhất.
          </li>
          <li>
            <strong>Đổi mới:</strong> Không ngừng đổi mới và cải tiến để mang
            đến trải nghiệm tốt nhất cho khách hàng.
          </li>
          <li>
            <strong>Trách nhiệm:</strong> Có trách nhiệm với cộng đồng và xã hội
            thông qua các hoạt động từ thiện và bảo vệ môi trường.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutUsPage;
