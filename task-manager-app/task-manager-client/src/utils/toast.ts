// src/utils/toast.ts
export function toast(message: string) {
  const el = document.createElement("div");
  el.innerText = message;

  el.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #4f46e5;
    color: white;
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 14px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    z-index: 9999;
    animation: fadeIn 0.2s ease;
  `;

  document.body.appendChild(el);

  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  }, 2000);
}