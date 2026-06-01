# FocusFeed

**English** | [中文](#中文)

---

## English

A minimal Chrome extension that hides recommendation feeds on Bilibili, 小红书 (Xiaohongshu), and Instagram — so you can search for what you came for and leave, without getting sucked into endless scrolling.

**What it does:**
- Hides the homepage recommendation feed on each site
- Keeps the header, navigation bar, and search bar fully visible
- Search results, video pages, and posts are completely unaffected
- Per-site toggle in the popup — turn it off for any site in one click

### Installation

> Chrome Web Store submission is pending. In the meantime, load it manually in under a minute.

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

![Developer mode toggle](https://i.imgur.com/placeholder.png)

**Step 4 — Load the extension**

Click **Load unpacked** and select the `FocusFeed` folder (the one that contains `manifest.json`).

The FocusFeed icon will appear in your Chrome toolbar.

**Step 5 — Pin it (optional but recommended)**

Click the puzzle piece icon 🧩 in your toolbar → click the pin icon next to FocusFeed so it's always one click away.

### Usage

- **All three sites are blocked by default** when you first install.
- Click the FocusFeed icon to open the popup and toggle any site on or off.
- Changes take effect immediately — no page refresh needed.

### Updating

If the extension stops working after a site redesign:
1. Pull the latest code (`git pull`) or re-download the ZIP
2. Go to `chrome://extensions` → click the **refresh** icon on the FocusFeed card

---

## 中文

一个轻量 Chrome 插件，屏蔽 Bilibili、小红书、Instagram 的推荐 feed，只留顶栏和搜索栏。搜完就走，再也不被刷不完的推荐带跑。

**功能：**
- 自动隐藏各网站首页的推荐内容流
- 顶栏、导航栏、搜索栏完全保留
- 搜索结果页、视频页、帖子页正常显示，不受影响
- 弹窗里可以对每个网站单独开关，一键切换

### 安装方法

> Chrome 应用商店审核中，目前请手动加载，不超过一分钟。

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

- **安装后三个网站默认全部开启屏蔽。**
- 点击 FocusFeed 图标打开弹窗，可以对每个网站单独开关。
- 修改立即生效，不需要刷新页面。

### 更新插件

如果某个网站改版导致插件失效：
1. 拉取最新代码（`git pull`）或重新下载 ZIP
2. 前往 `chrome://extensions` → 点击 FocusFeed 卡片上的**刷新**图标

---

## File Structure

```
FocusFeed/
├── manifest.json         # Extension config (Manifest V3)
├── popup/
│   ├── popup.html        # Toggle UI
│   └── popup.js          # Reads/writes chrome.storage, notifies content scripts
└── content/
    ├── common.js         # Shared hide/show utilities
    ├── bilibili.js/.css
    ├── xiaohongshu.js/.css
    └── instagram.js/.css
```

## License

MIT
