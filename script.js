/**
 * 任務機 Mission Bot — 前端邏輯
 *
 * 部署前請將 WORKER_URL 換成你的 Cloudflare Worker 網址：
 * https://[你的worker名稱].[你的帳號].workers.dev
 */

const WORKER_URL = 'https://wtp-mission-bot.lawainspace.workers.dev';

// ── DOM 節點 ──
const chatEl  = document.getElementById('chat-messages');
const inputEl = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const btnLabel = document.getElementById('btn-label');

// ── 對話歷史（多輪對話） ──
const history = [];   // [{ role: 'user'|'assistant', content: '...' }]

// ── 初始化：注入歡迎訊息 ──
window.addEventListener('DOMContentLoaded', () => {
  appendBotMessage(
    '任務機啟動！⚙️\n' +
    '我是怪怪整理師的品牌助理。\n\n' +
    '你想先了解哪一塊？是角色、品牌故事，還是整理小隊的冒險世界？'
  );
  inputEl.focus();
});

// ── Enter 鍵送出 ──
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});

// ── 按鈕送出 ──
sendBtn.addEventListener('click', send);

// ══ 主要送出流程 ══
async function send() {
  const text = inputEl.value.trim();
  if (!text) return;

  // 1. 顯示使用者訊息
  appendUserMessage(text);
  history.push({ role: 'user', content: text });
  inputEl.value = '';
  setLoading(true);

  // 2. 顯示思考中…
  const thinkingEl = appendThinking();

  try {
    // 3. 呼叫 Cloudflare Worker
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // 4. 取出回答
    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) throw new Error('空回應');

    // 5. 顯示機器人回答
    thinkingEl.remove();
    appendBotMessage(reply);
    history.push({ role: 'assistant', content: reply });

  } catch (err) {
    thinkingEl.remove();
    appendBotMessage(
      '⚠️ 哎呀，任務機暫時出問題了！\n' +
      '請確認 Worker 是否正確部署，或稍後再試一次。'
    );
    console.error('[任務機] 錯誤：', err);
  } finally {
    setLoading(false);
    scrollToBottom();
  }
}

// ══ 訊息渲染 ══

function appendUserMessage(text) {
  const el = document.createElement('div');
  el.className = 'msg user';
  el.textContent = text;
  chatEl.appendChild(el);
  scrollToBottom();
}

function appendBotMessage(text) {
  const el = document.createElement('div');
  el.className = 'msg bot';
  // 使用 marked 渲染 Markdown（**粗體**、- 列表、換行等）
  el.innerHTML = marked.parse(text);
  chatEl.appendChild(el);
  scrollToBottom();
  return el;
}

function appendThinking() {
  const el = document.createElement('div');
  el.className = 'msg thinking';
  el.innerHTML = '思考中 <span class="dots"><span>.</span><span>.</span><span>.</span></span>';
  chatEl.appendChild(el);
  scrollToBottom();
  return el;
}

// ══ 工具函式 ══

function setLoading(loading) {
  sendBtn.disabled = loading;
  inputEl.disabled = loading;
  btnLabel.textContent = loading ? '…' : '出發 →';
}

function scrollToBottom() {
  chatEl.scrollTop = chatEl.scrollHeight;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
