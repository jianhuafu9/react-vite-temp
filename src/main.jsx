import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/tailwind.css";
import "./styles/variables.less";
import App from "./App";
// import { createVersionPolling } from "version-polling";

// createVersionPolling({
//   vcType: "versionJson",
//   silent: import.meta.env.MODE === "development", // 开发环境下不检测
//   onUpdate: (self) => {
//     console.log('222:', 222);
//     const result = confirm("页面有更新，点击确定刷新页面！");
//     if (result) {
//       self.onRefresh();
//     } else {
//       console.log("self:", self);
//       console.log("result:", result);
//       self.onCancel();
//     }
//   },
// });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
