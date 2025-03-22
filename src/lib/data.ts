export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  originalPrice: number;
  discount: number;
  isNew: boolean;
  category: string;
  description: string;
  publisher: string;
  publishDate: string;
  pages: number;
  language: string;
  reviews: {
    rating: number;
    count: number;
  };
}

export const categories = [
  { id: "van-hoc", name: "Văn Học" },
  { id: "kinh-te", name: "Kinh Tế" },
  { id: "tam-ly-ky-nang", name: "Tâm Lý - Kỹ Năng Sống" },
  { id: "nuoi-day-con", name: "Nuôi Dạy Con" },
  { id: "sach-thieu-nhi", name: "Sách Thiếu Nhi" },
  { id: "giao-khoa-tham-khao", name: "Giáo Khoa - Tham Khảo" },
  { id: "sach-hoc-ngoai-ngu", name: "Sách Học Ngoại Ngữ" },
  { id: "manga-comic", name: "Manga - Comic" },
];

export const books: Book[] = [
  {
    id: "1",
    title: "Cây Cam Ngọt Của Tôi",
    author: "José Mauro de Vasconcelos",
    coverImage:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1112&q=80",
    price: 76000,
    originalPrice: 108000,
    discount: 30,
    isNew: false,
    category: "van-hoc",
    description:
      "Cây Cam Ngọt Của Tôi là một tác phẩm được nhiều người biết đến, một tác phẩm bán chạy của José Mauro de Vasconcelos. Cuốn sách là câu chuyện về cậu bé Zezé, sống trong một gia đình nghèo ở Brazil và tình bạn đặc biệt của cậu với một cây cam ngọt.",
    publisher: "NXB Hội Nhà Văn",
    publishDate: "2020-08-10",
    pages: 244,
    language: "Tiếng Việt",
    reviews: {
      rating: 4.8,
      count: 123,
    },
  },
  {
    id: "2",
    title: "Nhà Giả Kim",
    author: "Paulo Coelho",
    coverImage:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8&w=1000&q=80",
    price: 69000,
    originalPrice: 79000,
    discount: 13,
    isNew: false,
    category: "van-hoc",
    description:
      "Tất cả những trải nghiệm trong chuyến phiêu du theo đuổi vận mệnh của mình đã giúp Santiago thấu hiểu được ý nghĩa sâu xa nhất của hạnh phúc, hòa hợp với vũ trụ và con người.",
    publisher: "NXB Hội Nhà Văn",
    publishDate: "2020-04-25",
    pages: 228,
    language: "Tiếng Việt",
    reviews: {
      rating: 4.7,
      count: 254,
    },
  },
  {
    id: "3",
    title: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    coverImage:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGJvb2t8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
    price: 68000,
    originalPrice: 86000,
    discount: 21,
    isNew: false,
    category: "tam-ly-ky-nang",
    description:
      "Đắc nhân tâm của Dale Carnegie là quyển sách duy nhất về thể loại self-help liên tục đứng đầu danh mục sách bán chạy nhất (best-selling Books) do báo The New York Times bình chọn suốt 10 năm liền.",
    publisher: "NXB Tổng hợp TP.HCM",
    publishDate: "2016-12-18",
    pages: 320,
    language: "Tiếng Việt",
    reviews: {
      rating: 4.5,
      count: 427,
    },
  },
  {
    id: "4",
    title: "Atomic Habits",
    author: "James Clear",
    coverImage:
      "https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGJvb2t8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
    price: 145000,
    originalPrice: 199000,
    discount: 27,
    isNew: true,
    category: "tam-ly-ky-nang",
    description:
      "Atomic Habits sẽ tái định hình cách bạn nghĩ về sự tiến bộ và thành công, và cung cấp cho bạn các công cụ và chiến lược bạn cần để thay đổi thói quen xấu và hình thành thói quen tốt.",
    publisher: "NXB Thế Giới",
    publishDate: "2019-10-15",
    pages: 320,
    language: "Tiếng Việt",
    reviews: {
      rating: 4.9,
      count: 189,
    },
  },
  {
    id: "5",
    title: "Muôn Kiếp Nhân Sinh",
    author: "Nguyên Phong",
    coverImage:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGJvb2t8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
    price: 145000,
    originalPrice: 168000,
    discount: 14,
    isNew: false,
    category: "tam-ly-ky-nang",
    description:
      "Muôn Kiếp Nhân Sinh là tác phẩm do Giáo sư John Vũ - Nguyên Phong biên soạn theo các câu chuyện có thật về những trải nghiệm của người bạn tâm giao - TS Nguyễn Phương, mang lại góc nhìn đa chiều về các kiếp sống, về luật nhân quả.",
    publisher: "NXB Tổng Hợp TPHCM",
    publishDate: "2020-07-07",
    pages: 400,
    language: "Tiếng Việt",
    reviews: {
      rating: 4.6,
      count: 245,
    },
  },
  {
    id: "6",
    title: "Chú Thuật Hồi Chiến - Tập 1",
    author: "Gege Akutami",
    coverImage:
      "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fG1hbmdhfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
    price: 30000,
    originalPrice: 35000,
    discount: 14,
    isNew: true,
    category: "manga-comic",
    description:
      "Chú Thuật Hồi Chiến là câu chuyện về Itadori Yuji, một học sinh trung học với khả năng thể chất phi thường, đang sống một cuộc sống bình thường cho đến khi anh tham gia vào Câu lạc bộ Huyền bí trong trường.",
    publisher: "NXB Kim Đồng",
    publishDate: "2021-03-15",
    pages: 192,
    language: "Tiếng Việt",
    reviews: {
      rating: 4.9,
      count: 278,
    },
  },
  {
    id: "7",
    title: "Doraemon - Tập 1",
    author: "Fujiko F. Fujio",
    coverImage:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y2FydG9vbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
    price: 18000,
    originalPrice: 20000,
    discount: 10,
    isNew: false,
    category: "manga-comic",
    description:
      "Doraemon là mèo máy được Sewashi (Nobita tương lai), cháu ba đời của Nobita gửi về quá khứ cho ông mình để giúp đỡ Nobita tiến bộ, tức là cũng sẽ cải thiện hoàn cảnh của con cháu Nobita sau này.",
    publisher: "NXB Kim Đồng",
    publishDate: "2019-08-05",
    pages: 116,
    language: "Tiếng Việt",
    reviews: {
      rating: 4.8,
      count: 526,
    },
  },
  {
    id: "8",
    title: "Thám Tử Lừng Danh Conan - Tập 100",
    author: "Gosho Aoyama",
    coverImage:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGNvbWljfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
    price: 20000,
    originalPrice: 25000,
    discount: 20,
    isNew: true,
    category: "manga-comic",
    description:
      "Kudo Shinichi, 17 tuổi, là một thám tử học sinh trung học phổ thông có tài suy luận tuyệt đỉnh. Trong một lần khi đang theo dõi một vụ tống tiền, cậu đã bị thành viên của Tổ chức Áo đen phát hiện.",
    publisher: "NXB Kim Đồng",
    publishDate: "2022-01-20",
    pages: 184,
    language: "Tiếng Việt",
    reviews: {
      rating: 4.7,
      count: 342,
    },
  },
];

export const newBooks = books.filter((book) => book.isNew);
export const discountBooks = books.filter((book) => book.discount >= 20);
export const bestSellerBooks = [books[0], books[1], books[2], books[6]];

export const banners = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    title: "Khuyến mãi mùa hè",
    description: "Giảm giá lên đến 50% cho tất cả sách văn học",
    link: "/khuyen-mai-mua-he",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    title: "Bộ sách thiếu nhi mới",
    description: "Khám phá bộ sách thiếu nhi mới nhất đã có mặt tại BookStore",
    link: "/sach-thieu-nhi-moi",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80",
    title: "Sách kỹ năng sống",
    description: "Bí quyết để thành công và hạnh phúc trong cuộc sống",
    link: "/sach-ky-nang-song",
  },
];
