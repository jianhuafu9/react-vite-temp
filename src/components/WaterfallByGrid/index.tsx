import { useEffect, useState } from "react";

interface ImageItem {
  title: string;
  description: string;
  url: string;
}

interface WaterfallByGridProps {
  initialImages?: ImageItem[];
}

// 模拟获取更多图片的函数
const fetchMoreImages = (page: number, perPage: number): ImageItem[] => {
  // 这里模拟API请求，实际项目中应该从服务器获取数据
  return Array.from({ length: perPage }, (_, i) => {
    const id = page * perPage + i + 1;
    // 随机选择图片URL，模拟不同图片
    const imageNumber = Math.floor(Math.random() * 6) + 1;
    const imageType = imageNumber === 4 ? "png" : "jpeg";

    return {
      title: `图片${id}`,
      description: `这是第${page}页的第${i + 1}张图片，总第${id}张`,
      url: `./assets/image_${imageNumber}.${imageType}`,
    };
  });
};

const WaterfallByGrid = ({ initialImages }: WaterfallByGridProps) => {
  // 初始图片数据
  const defaultImages: ImageItem[] = [
    {
      title: "图片1",
      description: "描述1",
      url: "./assets/image_1.jpeg",
    },
    {
      title: "图片2",
      description: "描述2",
      url: "./assets/image_5.jpeg",
    },
    {
      title: "图片3",
      description: "描述3",
      url: "./assets/image_3.jpeg",
    },
    {
      title: "图片4",
      description: "描述4",
      url: "./assets/image_4.png",
    },
    {
      title: "图片5",
      description: "描述5",
      url: "./assets/image_2.jpeg",
    },
    {
      title: "图片6",
      description: "描述6",
      url: "./assets/image_6.jpeg",
    },
  ];

  const [images, setImages] = useState<ImageItem[]>(initialImages || defaultImages);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // 加载更多图片
  const loadMoreImages = async () => {
    if (loading) return;

    setLoading(true);

    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newImages = fetchMoreImages(page, 6); // 每次加载6张图片
    setImages((prevImages) => [...prevImages, ...newImages]);
    setPage((prevPage) => prevPage + 1);

    setLoading(false);
  };

  // 设置Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading) {
          loadMoreImages();
        }
      },
      { threshold: 0.1 } // 当目标元素10%可见时触发
    );

    const loaderElement = document.getElementById("grid-waterfall-loader");
    if (loaderElement) {
      observer.observe(loaderElement);
    }

    return () => {
      if (loaderElement) {
        observer.unobserve(loaderElement);
      }
    };
  }, [loading, page]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Grid实现瀑布流</h1>

      {/* 
        使用CSS列布局实现真正的瀑布流
        - 使用column-count设置不同屏幕尺寸下的列数
        - 每个项目会自动按照高度填充空白区域
      */}
      <div 
        className="columns-1 sm:columns-2 lg:columns-3 gap-4"
        style={{ columnFill: 'balance' }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="break-inside-avoid overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group mb-4 inline-block w-full"
          >
            <div className="relative">
              <img
                src={image.url}
                alt={image.title}
                className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="font-bold text-lg">{image.title}</h3>
                <p className="text-sm opacity-90">{image.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 加载更多触发器 */}
      <div
        id="grid-waterfall-loader"
        className="w-full h-20 flex items-center justify-center mt-8"
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        ) : (
          <span className="text-gray-400">向下滚动加载更多</span>
        )}
      </div>
    </div>
  );
};

export default WaterfallByGrid;
