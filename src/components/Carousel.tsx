import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CarouselProps {
  banners: {
    id: string;
    image: string;
    title: string;
    description: string;
    link: string;
  }[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

const Carousel = ({
  banners,
  autoSlide = true,
  autoSlideInterval = 5000,
}: CarouselProps) => {
  const [current, setCurrent] = useState(0);

  const prev = () => {
    setCurrent((current) => (current === 0 ? banners.length - 1 : current - 1));
  };

  const next = () => {
    setCurrent((current) => (current === banners.length - 1 ? 0 : current + 1));
  };

  useEffect(() => {
    if (!autoSlide) return;

    const slideInterval = setInterval(next, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [autoSlide, autoSlideInterval]);

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <Link
            key={banner.id}
            to={banner.link}
            className="min-w-full relative h-96"
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-end p-8">
              <h2 className="text-white text-3xl font-bold mb-2">
                {banner.title}
              </h2>
              <p className="text-white/80 text-lg max-w-lg">
                {banner.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button
          onClick={prev}
          className="p-1 rounded-full shadow bg-white/50 text-gray-800 hover:bg-white"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={next}
          className="p-1 rounded-full shadow bg-white/50 text-gray-800 hover:bg-white"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
          {banners.map((_, i) => (
            <div
              key={i}
              className={`
                transition-all w-2 h-2 bg-white rounded-full
                ${current === i ? "p-1.5" : "bg-opacity-50"}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
