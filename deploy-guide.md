# 任務機 Demo — 部署指南

## 檔案結構

```
web-demo/
├── index.html            ← 主頁面
├── style.css             ← 樣式
├── script.js             ← 前端邏輯（需填入 Worker URL）
├── worker.js             ← Cloudflare Worker（需另行部署）
├── assets/
│   └── mission-console.png   ← 任務機框架圖
└── deploy-guide.md       ← 本文件
```

---

## Step 1｜部署 Cloudflare Worker（約 5 分鐘）

**目的：** 建立一個安全的 API 代理，把 DeepSeek API Key 藏在雲端。

1. 前往 [https://dash.cloudflare.com/](https://dash.cloudflare.com/)，登入或免費註冊
2. 左側選 **Workers & Pages** → **Create**
3. 選 **Create Worker** → 給一個名稱（例如 `wtp-mission-bot`）
4. 點 **Edit code**，把 `worker.js` 的全部內容貼入，覆蓋原有內容
5. 點右上角 **Deploy** 儲存部署
6. 回到 Worker 頁面 → **Settings** → **Variables**
   - 點 **Add variable** → 選 **Secret**
   - 變數名稱：`DEEPSEEK_API_KEY`
   - 數值：填入你的 DeepSeek API Key
   - 點 **Save**
7. 記下你的 Worker URL：`https://wtp-mission-bot.[帳號].workers.dev`

---

## Step 2｜填入 Worker URL

打開 `script.js`，找到第一行常數，替換成你的 URL：

```js
// 改這一行：
const WORKER_URL = 'https://YOUR_WORKER_NAME.YOUR_ACCOUNT.workers.dev';

// 換成（範例）：
const WORKER_URL = 'https://wtp-mission-bot.mixcode.workers.dev';
```

---

## Step 3｜建立 GitHub Repo 並上傳

1. 到 [https://github.com/new](https://github.com/new) 建立新的公開 repo
   - 名稱建議：`wtp-branding-bot`
   - 選 **Public**（GitHub Pages 需要公開 repo）
2. 把 `web-demo/` 裡的所有檔案上傳到 repo 根目錄
   - 上傳順序：index.html / style.css / script.js / assets/mission-console.png
   - `worker.js` 可以選擇不上傳（已部署到 Cloudflare，也不含機密資訊）

---

## Step 4｜開啟 GitHub Pages

1. Repo 頁面 → **Settings** → 左側 **Pages**
2. **Source**：選 `Deploy from a branch`
3. **Branch**：選 `main`，資料夾選 `/ (root)`
4. 點 **Save**
5. 等約 1–2 分鐘，頁面上方會出現：

   ```
   Your site is live at https://[你的帳號].github.io/wtp-branding-bot
   ```

6. 點連結確認頁面正常開啟 ✅

---

## Step 5｜測試對話

1. 打開 GitHub Pages 網址
2. 確認任務機歡迎訊息出現在螢幕區
3. 試問幾個問題：
   - 「迪迪是什麼個性？」
   - 「怪怪整理師的品牌精神是什麼？」
   - 「你們的官方網站在哪？」

---

## 微調 CSS 螢幕位置

如果對話顯示區和任務機螢幕框位置有偏差，打開 `style.css` 調整：

```css
.screen-area {
  top:    6%;    /* 向下移 → 增大數值 */
  left:   11%;   /* 向右移 → 增大數值 */
  width:  78%;   /* 顯示區寬度 */
  height: 52%;   /* 顯示區高度 */
}
```

> **提示：** 未來換成高解析度大圖時，這四個數值可能需要重新校準。

---

## 未來替換高畫質大圖

1. 把新的 PNG 命名為 `mission-console.png`（或任意名稱）
2. 放入 `assets/` 資料夾，替換舊檔
3. 重新校準 `style.css` 中的 `.screen-area` 位置百分比
4. 確認新 PNG 的螢幕區域也是透明的（`挖空`），否則對話會被遮住
