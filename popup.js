function getTypeLabel(type) {
  const map = {
    "bilibili-live": "🔴 B站直播",
    "bilibili-vod": "🎬 B站视频",
    "playlist": "📺 播放列表"
  };
  return map[type] || "❓ 未知";
}

function getTypeClass(type) {
  const map = {
    "bilibili-live": "live",
    "bilibili-vod": "vod",
    "playlist": "playlist"
  };
  return map[type] || "";
}

function render(urls) {
  const div = document.getElementById("list");
  if (!urls || urls.length === 0) {
    div.innerHTML = '<div class="empty">🎯 还没有抓到地址<br>请打开视频/直播页面后刷新</div>';
    return;
  }
  
  div.innerHTML = urls.map(item => `
    <div class="item">
      <span class="type ${getTypeClass(item.type)}">${getTypeLabel(item.type)}</span>
      <div class="url">${escapeHtml(item.url)}</div>
      <button class="copy" data-url="${escapeHtml(item.url)}">📋 复制</button>
    </div>
  `).join("");
  
  document.querySelectorAll('.copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.url;
      navigator.clipboard.writeText(url);
      btn.textContent = "✅ 已复制";
      setTimeout(() => btn.textContent = "📋 复制", 1500);
    });
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m]));
}

chrome.storage.local.get(["urls"], (r) => render(r.urls || []));
document.getElementById("clearBtn").onclick = () => {
  chrome.storage.local.set({ urls: [] }, () => render([]));
};
chrome.storage.onChanged.addListener((changes) => {
  if (changes.urls) render(changes.urls.newValue || []);
});