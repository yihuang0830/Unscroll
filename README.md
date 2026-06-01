# FocusFeed

**English** | [中文](#中文)

---

## English

A minimal Chrome extension that hides recommendation feeds on Bilibili, 小红书, YouTube, Reddit, and Instagram — so you can search for what you came for and leave, without getting sucked into endless scrolling.

**Supported sites:**

| Site | What's hidden | What's kept |
|------|--------------|-------------|
| **Bilibili** | Homepage recommendation grid | Header, search bar |
| **小红书** | Explore/discovery feed | Header, search bar |
| **Instagram** | Home feed & Stories | Top nav, search |
| **YouTube** | Homepage feed & Shorts shelf; sidebar related videos on watch page | Header, search bar |
| **Reddit** | Homepage & subreddit post listings | Header, search bar |

Search results, video/post pages, and profile pages are **never affected**.

**Features:**
- Per-site toggle — disable any site in one click
- **Scheduled activation** — set a time window (e.g. 09:00–18:00) during which blocking is active; outside those hours the feeds are visible as normal
- Changes take effect immediately, no page refresh needed
- Works on all Chromium-based browsers (Edge, Brave, Arc, Opera, Vivaldi)

### Installation

> Not yet on the Chrome Web Store. Load it manually in under a minute.

**Step 1 — Download the extension**

Option A: Clone with git
```bash
git clone https://github.com/yihuang0830/FocusFeed.git
```

Option B: Download ZIP
- Click the green **Code** button on this page → **Download ZIP**
- Unzip the folder somewhere you won't accidentally delete it (e.g. `~/Documents/FocusFeed`)

**Step 2 — Open Chrome Extensions**

Go to `chrome://extensions` in your browser address bar.

**Step 3 — Enable Developer Mode**

Toggle the **Developer mode** switch in the top-right corner of the Extensions page.

**Step 4 — Load the extension**

Click **Load unpacked** and select the `FocusFeed` folder (the one that contains `manifest.json`).

The FocusFeed icon will appear in your Chrome toolbar.

**Step 5 — Pin it (optional but recommended)**

Click the puzzle piece icon 🧩 in your toolbar → click the pin icon next to FocusFeed so it's always one click away.

### Usage

- **All five sites are blocked by default** when you first install.
- Click the FocusFeed icon to open the popup and toggle any site on or off.
- To use scheduled activation: toggle **定时开启 / Schedule** on, then set your start and end times. The popup shows whether blocking is currently active.
- Overnight ranges work too (e.g. 22:00–06:00).

### Updating

If the extension stops working after a site redesign:
1. Pull the latest code (`git pull`) or re-download the ZIP
2. Go to `chrome://extensions` → click the **refresh** icon on the FocusFeed card

---

## 中文

一个轻量 Chrome 插件，屏蔽 Bilibili、小红书、Instagram、YouTube、Reddit 的推荐 feed，只留顶栏和搜索栏。搜完就走，再也不被刷不完的推荐带跑。

**支持的网站：**

| 网站 | 隐藏内容 | 保留内容 |
|------|---------|---------|
| **Bilibili** | 首页推荐视频 | 顶栏、搜索栏 |
| **小红书** | 发现页推荐流 | 顶栏、搜索栏 |
| **Instagram** | 首页 Feed 和 Stories | 顶部导航、搜索 |
| **YouTube** | 首页推荐 + Shorts；视频页侧边栏推荐 | 顶栏、搜索栏 |
| **Reddit** | 首页和版块的帖子列表 | 顶栏、搜索栏 |

搜索结果页、视频/帖子详情页、个人主页**不受任何影响**。

**功能：**
- 每个网站单独开关，一键切换
- **定时开启** — 设置一个时间段（例如 09:00–18:00），只在这段时间内屏蔽 feed；时间段外 feed 正常显示。支持跨夜时间段（例如 22:00–06:00）
- 修改立即生效，不需要刷新页面
- 支持所有 Chromium 内核浏览器（Edge、Brave、Arc、Opera、Vivaldi）

### 安装方法

> 尚未上架 Chrome 应用商店，目前请手动加载，不超过一分钟。

**第一步 — 下载插件文件**

方式 A：用 git 克隆
```bash
git clone https://github.com/yihuang0830/FocusFeed.git
```

方式 B：下载压缩包
- 点击本页面绿色的 **Code** 按钮 → **Download ZIP**
- 解压到一个不会误删的位置（例如 `~/Documents/FocusFeed`）

**第二步 — 打开 Chrome 扩展页面**

在浏览器地址栏输入 `chrome://extensions` 并回车。

**第三步 — 开启开发者模式**

点击页面右上角的 **开发者模式** 开关，打开它。

**第四步 — 加载插件**

点击 **加载已解压的扩展程序**，选择 `FocusFeed` 文件夹（即包含 `manifest.json` 的那个文件夹）。

加载成功后，FocusFeed 图标会出现在 Chrome 工具栏中。

**第五步 — 固定到工具栏（可选，推荐）**

点击工具栏右侧的拼图图标 🧩 → 找到 FocusFeed → 点击旁边的图钉图标，让它常驻工具栏。

### 使用方法

- **安装后五个网站默认全部开启屏蔽。**
- 点击 FocusFeed 图标打开弹窗，可以对每个网站单独开关。
- 使用定时开启：打开 **⏰ 定时开启** 开关，设置开始和结束时间。弹窗会实时显示当前是否处于屏蔽状态。
- 支持跨夜时间段，例如设置 22:00–06:00，在晚上到凌晨期间屏蔽。

### 更新插件

如果某个网站改版导致插件失效：
1. 拉取最新代码（`git pull`）或重新下载 ZIP
2. 前往 `chrome://extensions` → 点击 FocusFeed 卡片上的**刷新**图标

---

## File Structure

```
FocusFeed/
├── manifest.json                   # Extension config (Manifest V3)
├── popup/
│   ├── popup.html                  # Toggle UI + schedule picker
│   └── popup.js                    # Reads/writes chrome.storage, notifies content scripts
└── content/
    ├── common.js                   # Shared utilities + isWithinSchedule()
    ├── bilibili.js/.css
    ├── xiaohongshu.js/.css
    ├── instagram.js/.css
    ├── youtube.js/.css
    └── reddit.js/.css
```

## License

MIT
