(function () {
  if (document.getElementById("unscroll-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "unscroll-overlay";
  overlay.style.cssText = [
    "position:fixed", "inset:0", "z-index:2147483647",
    "background:rgba(0,0,0,0.88)",
    "display:flex", "align-items:center", "justify-content:center",
    "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
  ].join(";");

  overlay.innerHTML = `
    <div style="text-align:center;color:#f0f0f0;padding:40px;max-width:320px">
      <div style="font-size:56px;margin-bottom:20px">⏰</div>
      <div style="font-size:26px;font-weight:600;margin-bottom:10px">时间到了！</div>
      <div style="font-size:14px;color:#aaa;margin-bottom:32px;line-height:1.6">
        放松时间结束，Feed 已重新屏蔽<br>回来专注吧
      </div>
      <button id="unscroll-overlay-close" style="
        padding:12px 36px;background:#4f8ef7;border:none;border-radius:8px;
        color:#fff;font-size:15px;font-weight:500;cursor:pointer;
      ">好的，继续专注</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.getElementById("unscroll-overlay-close").onclick = () => overlay.remove();
})();
