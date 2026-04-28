console.log("扩展已启动");
console.log("version 1.0");
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        const url = details.url;
        let pathname = "";
        try {
            pathname = new URL(url).pathname;
        } catch (e) {
            return;
        }
        if (pathname.endsWith(".m4s") || pathname.endsWith(".m3u8")) {
            console.log("抓到视频:", url);

            chrome.storage.local.get(["urls"], function (result) {
                console.log("读取到的当前 urls:", result.urls);
                let urls = result.urls || [];
                if (!urls.includes(url)) {
                    urls.push(url);
                    console.log("准备写入，新 urls 长度:", urls.length);
                    chrome.storage.local.set({ urls: urls }, function () {
                        console.log("写入完成");
                    });
                } else {
                    console.log("URL 已存在，跳过写入");
                }
            });
        }
    },
    { urls: ["<all_urls>"] }
);