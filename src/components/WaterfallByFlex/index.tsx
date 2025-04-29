import { useEffect, useRef, useState, useCallback } from "react";

/**
 * 随机返回1-6之间的整数，模拟掷骰子效果
 * @returns {number} 1-6之间的随机整数
 */
const getRandomDiceNumber = (): number => {
  // Math.random()生成[0,1)之间的随机数
  // 乘以6得到[0,6)之间的随机数
  // Math.floor向下取整得到0-5之间的整数
  // 最后加1得到1-6之间的整数
  return Math.floor(Math.random() * 6) + 1;
};

interface ImageItem {
  title: string;
  description: string;
  url: string;
}

interface WaterfallColumnProps {
  images: ImageItem[];
  columnIndex: number;
}

// 瀑布流单列组件
const WaterfallColumn = ({ images, columnIndex }: WaterfallColumnProps) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {images.map((image, index) => (
        <div
          key={`${columnIndex}-${index}`}
          className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group"
        >
          <img
            src={image.url}
            alt={image.title}
            className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-bold text-lg">{image.title}</h3>
            <p className="text-sm opacity-90">{image.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// 模拟获取更多图片的函数
const fetchMoreImages = (page: number, perPage: number): ImageItem[] => {
  // 这里模拟API请求，实际项目中应该从服务器获取数据
  return Array.from({ length: perPage }, (_, i) => {
    const id = page * perPage + i + 1;
    // 随机选择图片URL，模拟不同图片
    const imageNumber = getRandomDiceNumber();
    const imageType = imageNumber === 4 ? "png" : "jpeg";

    return {
      title: `图片${id}`,
      description: `这是第${page}页的第${i + 1}张图片，总第${id}张`,
      url: `./assets/image_${imageNumber}.${imageType}`,
    };
  });
};

const WaterfallByFlex = () => {
  // 初始图片数据
  const initialImageList = [
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

  const [imageList, setImageList] = useState<ImageItem[]>(initialImageList);
  const [columns, setColumns] = useState<ImageItem[][]>([]);
  const [columnCount, setColumnCount] = useState(3); // 默认3列
  const containerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // 监听窗口大小变化，调整列数
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumnCount(1); // 小屏幕1列
      } else if (width < 1024) {
        setColumnCount(2); // 中等屏幕2列
      } else {
        setColumnCount(3); // 大屏幕3列
      }
    };

    handleResize(); // 初始化
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 根据列数分配图片
  useEffect(() => {
    if (columnCount <= 0) return;

    // 初始化列数组
    const newColumns: ImageItem[][] = Array.from({ length: columnCount }, () => []);

    // 按照顺序分配图片到各列
    imageList.forEach((image, index) => {
      const columnIndex = index % columnCount;
      newColumns[columnIndex].push(image);
    });

    setColumns(newColumns);
  }, [columnCount, imageList]); // 添加imageList作为依赖，当图片列表更新时重新分配

  // 加载更多图片
  const loadMoreImages = useCallback(async () => {
    if (loading) return;

    setLoading(true);

    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newImages = fetchMoreImages(page, 6); // 每次加载6张图片
    setImageList((prevImages) => [...prevImages, ...newImages]);
    setPage((prevPage) => prevPage + 1);

    setLoading(false);
  }, [page, loading]);

  // 设置Intersection Observer
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading) {
          loadMoreImages();
        }
      },
      { threshold: 0.1 } // 当目标元素10%可见时触发
    );

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loadMoreImages, loading]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        grid + flex + js实现的响应式瀑布流图片展示
      </h1>
      <div
        ref={containerRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {columns.map((columnImages, index) => (
          <WaterfallColumn
            key={index}
            images={columnImages}
            columnIndex={index}
          />
        ))}
      </div>

      {/* 加载更多触发器 */}
      <div
        ref={loaderRef}
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

export default WaterfallByFlex;
