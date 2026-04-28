chrome.storage.local.get(["urls"], function(result) {
  const urls = result.urls || [];
  const container = document.getElementById("list");
  
  if (urls.length === 0) {
    container.innerText = "还没有抓到地址，请刷新视频页面";
    return;
  }
  
  const html = urls.map(url => `<div class="url-item">${url}</div>`).join("");
  container.innerHTML = html;
});