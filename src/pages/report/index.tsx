import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

interface SubTab {
  title: string;
  value: string;
  content: string;
}

interface MainTab {
  title: string;
  value: string;
  content?: string; // 可选的内容，当没有子分类时显示
  subTabs?: SubTab[]; // 可选的子分类数组
}

const Report = () => {
  const [mainTabs, setMainTabs] = useState<MainTab[]>();
  const [activeMainTab, setActiveMainTab] = useState("main_1");

  useEffect(() => {
    // 生成示例数据
    const tabs: MainTab[] = [];
    for (let i = 0; i < 20; i++) {
      // 偶数索引的主分类有子分类，奇数索引的主分类直接有内容
      if (i % 2 === 0) {
        const mainTab: MainTab = {
          title: `主分类-${i + 1}（有子分类）`,
          value: `main_${i + 1}`,
          subTabs: [],
        };
        
        // 为每个主Tab创建子Tab
        for (let j = 0; j < 4; j++) {
          mainTab.subTabs?.push({
            title: `a_vs_b_vs_c_mfuzz_cluster-${i + 1}-${j + 1}`,
            value: `sub_${i + 1}_${j + 1}`,
            content: `这是主分类 ${i + 1} 的子分类 ${j + 1} 的内容`,
          });
        }
        
        tabs.push(mainTab);
      } else {
        // 没有子分类的主分类，直接有内容
        tabs.push({
          title: `主分类-${i + 1}（无子分类）`,
          value: `main_${i + 1}`,
          content: `这是主分类 ${i + 1} 的直接内容，没有子分类`,
        });
      }
    }
    
    console.log("tabs:", tabs);
    setMainTabs(tabs);
  }, []);

  return (
    <div className="w-[1280px] mx-auto h-screen mt-10">
      {mainTabs && (
        <div className="flex flex-col gap-4">
          {/* 主Tab */}
          <Tabs 
            defaultValue="main_1" 
            value={activeMainTab}
            onValueChange={setActiveMainTab}
            className="w-full"
          >
            <TabsList className="h-full flex-wrap justify-start bg-white p-0 pb-3">
              {mainTabs.map((mainTab) => (
                <TabsTrigger
                  className="text-base py-2 px-4 font-semibold"
                  key={mainTab.value}
                  value={mainTab.value}
                >
                  {mainTab.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* 主分类内容 */}
            {mainTabs.map((mainTab) => (
              <TabsContent
                key={mainTab.value}
                value={mainTab.value}
                className="mt-0"
              >
                {mainTab.subTabs && mainTab.subTabs.length > 0 ? (
                  // 有子分类时显示子Tab
                  <Tabs defaultValue={mainTab.subTabs[0]?.value}>
                    <TabsList className="h-full flex-wrap justify-start bg-gray-50 p-0">
                      {mainTab.subTabs.map((subTab) => (
                        <TabsTrigger
                          className="text-sm py-1"
                          key={subTab.value}
                          value={subTab.value}
                        >
                          {subTab.title}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {mainTab.subTabs.map((subTab) => (
                      <TabsContent
                        className="pl-3 border mt-4 p-4 rounded-md"
                        key={subTab.value}
                        value={subTab.value}
                      >
                        <div>{subTab.content}</div>
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : (
                  // 没有子分类时直接显示主分类内容
                  <div className="pl-3 border mt-4 p-4 rounded-md">
                    {mainTab.content}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Report;
