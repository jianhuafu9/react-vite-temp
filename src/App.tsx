import { Route, Routes, HashRouter } from "react-router-dom";
import "./styles/App.less";
import { useEffect, useState } from "react";
import Home from "@/pages/home";
import About from "@/pages/about";
import Report from "@/pages/report";

const App = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    const version = localStorage.getItem("version");
    if (!version) {
      localStorage.setItem("version", "1.1.1");
    }
    setInit(true);
  }, []);

  useEffect(() => {
    if (init) {
      const version = localStorage.getItem("version");
      const worker = new Worker(
        new URL("./lib/versionWorker.js", import.meta.url)
      );
      worker.postMessage({
        type: "start",
        interval: 5000,
        pathname: window.location.pathname,
        currentVersion: version,
      });
      worker.onmessage = (e) => {
        const data = e.data;
        if (data.type === "update") {
          const result = confirm(`页面有更新，${data.versionContent}`);
          if (result) {
            localStorage.setItem("version", data.newVersion);
            window.location.reload();
          } else {
            console.log("取消更新:");
          }
        }
      };
    }
  }, [init]);
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
