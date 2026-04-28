chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const url = details.url;
    let pathname = "";
    try {
      pathname = new URL(url).pathname;
    } catch (e) {
      return;
    }
    
    const pageUrl = details.initiator || details.documentUrl || "";
    const isBilibili = pageUrl.includes("bilibili.com");
    const isBilibiliLive = pageUrl.includes("live.bilibili.com");
    
    let shouldCapture = false;
    let type = "unknown";
    
    // B站直播：只抓 .m3u8
    if (isBilibiliLive && pathname.endsWith(".m3u8")) {
      shouldCapture = true;
      type = "bilibili-live";
    }
    // B站视频：抓 .m4s (DASH 分段)
    else if (isBilibili && !isBilibiliLive && pathname.endsWith(".m4s")) {
      shouldCapture = true;
      type = "bilibili-vod";
    }
    // 其他平台：抓 .m3u8 / .mpd
    else if (pathname.endsWith(".m3u8") || pathname.endsWith(".mpd")) {
      shouldCapture = true;
      type = "playlist";
    }
    
    if (shouldCapture) {
      chrome.storage.local.get(["urls"], (result) => {
        let urls = result.urls || [];
        if (!urls.some(item => item.url === url)) {
          urls.unshift({ url, type, time: Date.now() });
          if (urls.length > 100) urls = urls.slice(0, 100);
          chrome.storage.local.set({ urls });
        }
      });
    }
  },
  { urls: ["<all_urls>"] }
);