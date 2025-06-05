/// <reference lib="webworker" />
// 轮询获取version.json
let currentVersion = null;
let pollingInterval = 60000; // 默认轮询间隔为60秒
let timer = null;
let path = "/";
// 监听主线程发送的消息
self.addEventListener("message", function (e) {
  const data = e.data;
  if (data.type === "start") {
    // 初始化轮询
    currentVersion = data.currentVersion;
    if (data.interval) {
      pollingInterval = data.interval;
    }
    path = data.pathname;
    startPolling();
  } else if (data.type === "stop") {
    // 停止轮询
    stopPolling();
  } else if (data.type === "setInterval") {
    // 设置轮询间隔
    pollingInterval = data.interval;
    if (timer) {
      // 如果已经在轮询，重新启动以应用新的间隔
      stopPolling();
      startPolling();
    }
  }
});

// 开始轮询
function startPolling() {
  if (timer) {
    stopPolling();
  }

  // 立即执行一次检查
  checkVersion();

  // 设置定时器定期检查
  timer = setInterval(checkVersion, pollingInterval);
}

// 停止轮询
function stopPolling() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

// 检查版本
function checkVersion() {
  const url = path + "assets/version.json" + "?t=" + new Date().getTime();
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // 如果版本不同，通知主线程
      if (currentVersion && data.version && data.version !== currentVersion) {
        self.postMessage({
          type: "update",
          oldVersion: currentVersion,
          newVersion: data.version,
          versionContent: data.versionContent || "",
        });
        // 更新当前版本
        currentVersion = data.version;
      } else if (!currentVersion && data.version) {
        // 首次获取版本
        currentVersion = data.version;
      }
    })
    .catch((error) => {
      self.postMessage({
        type: "error",
        message: error.message,
      });
    });
}
