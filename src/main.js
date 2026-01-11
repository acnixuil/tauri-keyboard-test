const statusText = document.getElementById('status');
const keysMap = new Map();

document.querySelectorAll('.key[data-key]').forEach(keyEl => {
  keysMap.set(keyEl.dataset.key, keyEl);
});

// 这些键会被强制拦截默认行为
const preventDefaultKeys = [
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
  'Tab', 'AltLeft', 'AltRight', 'ContextMenu', 
  'MetaLeft', 'MetaRight' // 尝试拦截 Win 键 (在某些全屏模式下有效)
];

// 1. 禁用右键菜单
document.addEventListener('contextmenu', event => event.preventDefault());

// 2. 核心按键监听
window.addEventListener('keydown', (e) => {
  // 核心拦截逻辑：只要是我们在测的键，或者是 Alt/Win，统统阻止浏览器默认行为
  // 注意：这能阻止 Alt 聚焦菜单栏，但无法阻止 Win 键弹出开始菜单（系统级限制）
  if (keysMap.has(e.code) || e.altKey || e.metaKey || e.ctrlKey) {
      e.preventDefault();
  }

  // 特殊处理：如果按下了 Win 键，重新聚焦窗口，防止焦点丢失（尝试修复方案）
  if (e.key === 'Meta') {
    // 这是一个 hack，试图在菜单弹出后把焦点拉回来，但不一定在所有系统有效
    setTimeout(() => window.focus(), 10);
  }

  statusText.innerText = `检测到按键: ${e.code} (${e.key})`;

  const keyEl = keysMap.get(e.code);
  if (keyEl) {
    keyEl.classList.add('active');
    keyEl.classList.add('tested');
  }
});

window.addEventListener('keyup', (e) => {
  // 同样要阻止 keyup 的默认行为，防止 Alt 松开时触发菜单
  if (e.altKey || e.key === 'Alt' || e.key === 'Meta') {
    e.preventDefault();
  }

  const keyEl = keysMap.get(e.code);
  if (keyEl) {
    keyEl.classList.remove('active');
  }
});

window.resetKeyboard = function() {
  document.querySelectorAll('.key.tested').forEach(el => {
    el.classList.remove('tested', 'active');
  });
  statusText.innerText = '键盘已重置，请开始测试...';
  document.activeElement.blur();
};