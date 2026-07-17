# High-End Romantic Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将首页升级为性能稳定、移动端友好、可搜索分享，并以高级香槟金 3D 空间相册为视觉核心的情侣纪念网站。

**Architecture:** 保留 App Router 服务端页面壳，把导航、Hero 媒体、倒计时、空间相册、音乐和留言拆成小型客户端岛。用 `next/font`、`next/image`、MotionValue、LazyMotion 和动态导入降低首屏成本；SEO 由 Next.js metadata、路由文件和 JSON-LD 在服务端输出。

**Tech Stack:** Next.js 14 App Router、React 18、Tailwind CSS 3、Framer Motion 11、Supabase、Node.js test runner。

## Global Constraints

- 公开站点 URL 固定为 `https://couple-site-dusky.vercel.app`。
- 公开名称固定为“杜明洋 × 陈柯嘉”。
- 颜色固定围绕 `#FFFBF5`、`#D4898C`、`#C9A96E`、`#FFF3E8`、`#3D2B2B`、`#6B5A52`。
- 字体角色固定为 Playfair Display、Noto Serif SC 和系统无衬线字体。
- 动画必须尊重 `prefers-reduced-motion`，持续视差不得用于触摸设备。
- 指针移动不得触发 React state 更新；连续动画只改变 `transform` 和 `opacity`。
- 每个任务独立提交，不混入 `.playwright-cli/` 或其他审计临时文件。

---

## File Map

- `app/layout.js`: 字体变量、全局 metadata、canonical、OG、Twitter。
- `app/page.js`: 服务端页面壳、初始内容与 JSON-LD。
- `app/globals.css`: 统一设计 tokens、焦点、reduced-motion 和基础排版。
- `app/sitemap.js`, `app/robots.js`, `app/opengraph-image.js`: 搜索和分享入口。
- `app/admin/layout.js`: 管理页面 `noindex`。
- `components/CoupleSite.jsx`: 精简后的页面编排。
- `components/navigation/SiteNavigation.jsx`: 桌面导航和无障碍移动菜单。
- `components/sections/HeroSection.jsx`: poster 优先的视频控制、Hero 排版和局部视差。
- `components/sections/CountdownSection.jsx`: 独立每秒更新。
- `components/sections/GallerySection.jsx`: 数据到空间画廊/灯箱的编排。
- `components/gallery/SpatialGallery.jsx`: 桌面 3D 舞台。
- `components/gallery/MobileGalleryRail.jsx`: 移动拖动与吸附。
- `components/gallery/GalleryFrame.jsx`: 多层香槟金相框。
- `components/gallery/GalleryLightbox.jsx`: 键盘、焦点、滑动和灯箱。
- `components/motion/MotionProvider.jsx`, `components/motion/reveal.js`: LazyMotion 与统一 reveal。
- `components/ui/SectionHeader.jsx`, `MusicToggle.jsx`, `MessageBoard.jsx`: 从 barrel 文件拆出的交互单元。
- `lib/content.js`: 服务端读取 Supabase 内容并与 fallback 合并。
- `lib/gallery-motion.mjs`: 可测试的空间坐标和指针映射函数。
- `lib/site-metadata.mjs`: 站点常量和 JSON-LD 工厂。
- `tests/gallery-motion.test.mjs`, `tests/site-metadata.test.mjs`: 纯函数回归测试。

### Task 1: Hero 媒体、字体与稳定排版

**Files:**
- Modify: `app/layout.js`
- Modify: `app/globals.css`
- Modify: `components/sections/HeroSection.jsx`
- Create: `public/hero-poster.webp`

**Interfaces:**
- Consumes: `HeroSection({ scrollTo, isMobile })`
- Produces: `HeroSection({ scrollTo })`，组件内部使用媒体查询决定播放和视差策略。

- [ ] **Step 1: 记录当前失败基线**

运行：

```powershell
Test-Path public/hero-bg-mobile.mp4
Select-String -Path components/sections/HeroSection.jsx -Pattern 'preload="auto"|marginTop: "-63vh"|hero-bg-mobile'
```

预期：文件检查为 `False`，并匹配到不存在资源、自动预载和 `vh` 拼接布局。

- [ ] **Step 2: 生成稳定 poster**

从 `public/hero-bg.mp4` 选择清晰首帧，输出宽度不超过 1920 的 `public/hero-poster.webp`。如果本机 FFmpeg 可用，执行：

```powershell
ffmpeg -y -ss 00:00:01 -i public/hero-bg.mp4 -frames:v 1 -vf "scale='min(1920,iw)':-2" -quality 82 public/hero-poster.webp
```

然后验证：

```powershell
Get-Item public/hero-poster.webp | Select-Object Name,Length
```

预期：文件存在且大小低于原始 2.6MB 视频。

- [ ] **Step 3: 使用 next/font 和稳定 Hero 网格**

在 `app/layout.js` 创建：

```js
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  variable: "--font-noto-serif-sc",
  display: "swap",
});
```

移除 Google Fonts `<link>`，将变量挂到 `<body>`。在 Hero 中改为 `grid-template-rows: 1fr auto auto auto 1fr` 的稳定内容组，用 `clamp()` 设置标题、段落和按钮间距，删除所有 `marginTop: "*vh"`。

- [ ] **Step 4: 实现 poster 优先的视频生命周期**

视频固定使用：

```jsx
<video
  ref={videoRef}
  poster="/hero-poster.webp"
  muted
  loop
  playsInline
  preload="metadata"
  aria-hidden="true"
>
  <source src="/hero-bg.mp4" type="video/mp4" />
</video>
```

用 `matchMedia("(prefers-reduced-motion: reduce)")`、`navigator.connection?.saveData` 和 IntersectionObserver 决定播放；`visibilitychange` 与离开 Hero 时暂停。播放失败保持 poster，不安装全局 click/scroll/touchstart 监听。

- [ ] **Step 5: 验证和提交**

运行：

```powershell
npm run lint
npm run build
Select-String -Path components/sections/HeroSection.jsx -Pattern 'hero-bg-mobile|preload="auto"|marginTop: ".*vh"'
git diff --check
```

预期：lint/build 退出码为 0，搜索无结果，diff check 无输出。

提交：

```powershell
git add app/layout.js app/globals.css components/sections/HeroSection.jsx public/hero-poster.webp
git commit -m "perf: optimize hero media and typography"
```

### Task 2: 高级 3D 空间相册与图片管线

**Files:**
- Create: `lib/gallery-motion.mjs`
- Create: `tests/gallery-motion.test.mjs`
- Create: `components/gallery/GalleryFrame.jsx`
- Create: `components/gallery/SpatialGallery.jsx`
- Create: `components/gallery/MobileGalleryRail.jsx`
- Create: `components/gallery/GalleryLightbox.jsx`
- Modify: `components/sections/GallerySection.jsx`
- Modify: `next.config.js`
- Modify: `package.json`
- Replace: `public/gallery-7.jpg` through `public/gallery-12.jpg` with `.webp`
- Modify: `lib/data.js`

**Interfaces:**
- Produces: `mapPointerToStage({ x, y, width, height }) -> { rotateX, rotateY, x, y }`
- Produces: `getCardPose(index, total) -> { x, y, z, rotateX, rotateY, rotateZ }`
- Produces: `GalleryFrame({ item, index, priority, onOpen })`
- Produces: `GalleryLightbox({ items, activeIndex, onChange, onClose })`
- Consumes: `galleryItems: Array<{ image_url, caption, width?, height? }>`

- [ ] **Step 1: 写空间映射失败测试**

创建 `tests/gallery-motion.test.mjs`：

```js
import test from "node:test";
import assert from "node:assert/strict";
import { getCardPose, mapPointerToStage } from "../lib/gallery-motion.mjs";

test("pointer mapping is centered and bounded", () => {
  assert.deepEqual(
    mapPointerToStage({ x: 500, y: 300, width: 1000, height: 600 }),
    { rotateX: 0, rotateY: 0, x: 0, y: 0 }
  );
  const edge = mapPointerToStage({ x: 1000, y: 0, width: 1000, height: 600 });
  assert.ok(Math.abs(edge.rotateX) <= 3);
  assert.ok(Math.abs(edge.rotateY) <= 5);
  assert.ok(Math.abs(edge.x) <= 18);
  assert.ok(Math.abs(edge.y) <= 10);
});

test("card poses create deterministic depth", () => {
  assert.deepEqual(getCardPose(0, 6), getCardPose(0, 6));
  assert.notEqual(getCardPose(0, 6).z, getCardPose(1, 6).z);
});
```

在 `package.json` 添加 `"test": "node --test tests/*.test.mjs"`，运行 `npm test`，预期因模块不存在失败。

- [ ] **Step 2: 实现纯空间函数并通过测试**

在 `lib/gallery-motion.mjs` 使用归一化坐标和显式上限：

```js
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function mapPointerToStage({ x, y, width, height }) {
  const nx = clamp((x / width - 0.5) * 2, -1, 1);
  const ny = clamp((y / height - 0.5) * 2, -1, 1);
  return {
    rotateX: Number((-ny * 3).toFixed(3)),
    rotateY: Number((nx * 5).toFixed(3)),
    x: Number((nx * 18).toFixed(3)),
    y: Number((ny * 10).toFixed(3)),
  };
}

const DEPTHS = [8, -18, 22, -8, 14, -24];

export function getCardPose(index, total) {
  const column = index % 3;
  const row = Math.floor(index / 3);
  return {
    x: (column - 1) * 18,
    y: row * 12,
    z: DEPTHS[index % DEPTHS.length],
    rotateX: row % 2 ? -1.2 : 1.2,
    rotateY: (column - 1) * -2.4,
    rotateZ: ((index * 7) % 5) - 2,
  };
}
```

运行 `npm test`，预期 2 tests pass。

- [ ] **Step 3: 转换本地照片并配置 next/image**

使用 Sharp 将六张 JPG 输出为质量 82 的 WebP，保留原图直至逐张验证成功：

```powershell
npx sharp-cli -i public/gallery-7.jpg -o public/gallery-7.webp webp --quality 82
```

对 8–12 重复同一命令。更新 `lib/data.js` 的扩展名并增加真实宽高；在 `next.config.js` 添加 Supabase 项目域名的精确 `remotePatterns`。逐张确认 WebP 可读取后，才删除对应 JPG。

- [ ] **Step 4: 构建多层香槟金相框**

`GalleryFrame` 使用四层 DOM 与 `next/image`：

```jsx
<m.button className="gallery-card" onClick={onOpen} aria-label={`查看照片：${item.caption}`}>
  <span className="gallery-frame-outer">
    <span className="gallery-frame-bevel">
      <span className="gallery-frame-mat">
        <span className="gallery-photo">
          <Image
            src={item.image_url}
            alt={item.caption}
            fill
            sizes="(max-width: 767px) 78vw, (max-width: 1199px) 30vw, 24vw"
            priority={priority}
          />
        </span>
      </span>
    </span>
  </span>
  <span className="gallery-plaque">{item.caption}</span>
</m.button>
```

相框样式只使用统一 CSS 变量；方向性高光通过 MotionValue 写入 CSS 自定义属性。

- [ ] **Step 5: 构建桌面舞台和移动轨道**

`SpatialGallery` 在 `pointermove` 中调用 `mapPointerToStage` 并更新 MotionValue，不调用 setState；Motion spring 使用 stiffness 90、damping 22、mass 0.8。`MobileGalleryRail` 使用 Framer Motion drag、`dragElastic={0.12}` 和基于卡宽的吸附索引，提供上一张/下一张可访问按钮。

- [ ] **Step 6: 完成灯箱交互**

打开时保存触发按钮，锁定 body 滚动，将焦点移到关闭按钮；监听 ArrowLeft、ArrowRight、Escape；关闭时恢复滚动和焦点。对话框使用：

```jsx
<m.div role="dialog" aria-modal="true" aria-label="照片查看器">
```

当 `activeIndex >= items.length` 时调用 `onClose()`。

- [ ] **Step 7: 验证和提交**

运行：

```powershell
npm test
npm run lint
npm run build
git grep -n '<img' -- components/sections/GallerySection.jsx components/gallery
git grep -n 'setTilt\\|setGlare' -- components
git diff --check
```

预期：测试、lint、build 通过；两个 grep 无结果；diff check 无输出。

提交：

```powershell
git add package.json package-lock.json next.config.js lib/data.js lib/gallery-motion.mjs tests/gallery-motion.test.mjs components/sections/GallerySection.jsx components/gallery public/gallery-*.webp
git add -u public
git commit -m "feat: build immersive champagne gallery"
```

### Task 3: 统一动画系统与客户端边界

**Files:**
- Create: `components/motion/MotionProvider.jsx`
- Create: `components/motion/reveal.js`
- Modify: `app/page.js`
- Modify: `components/CoupleSite.jsx`
- Modify: `components/sections/CountdownSection.jsx`
- Modify: `components/sections/DiarySection.jsx`
- Modify: `components/sections/LettersSection.jsx`
- Modify: `components/ui/index.jsx`
- Create: `lib/content.js`

**Interfaces:**
- Produces: `MotionProvider({ children })`
- Produces: `reveal`, `revealGroup`, `revealItem`
- Produces: `CountdownSection({ startDate })`
- Produces: `getInitialContent() -> Promise<{ startDate, diaryEntries, galleryItems, loveLetters, messages }>`

- [ ] **Step 1: 记录 bundle 与客户端边界基线**

运行：

```powershell
npm run build
git grep -l 'from "framer-motion"' -- components app
```

保存首页 First Load JS 数值和直接导入 Motion 的文件列表到本次任务记录。

- [ ] **Step 2: 添加 LazyMotion 和统一变体**

`MotionProvider` 使用：

```jsx
<LazyMotion features={domAnimation} strict>
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
</LazyMotion>
```

`reveal.js` 导出统一的 `[0.22, 1, 0.36, 1]` 缓动、20px 最大位移和 0.7 秒标准时长。

- [ ] **Step 3: 缩小客户端更新范围**

把倒计时的 interval 和 `time` state 移入 `CountdownSection`。`CoupleSite` 不再每秒重渲染整页。使用 `next/dynamic` 延迟空间相册和留言板交互；首屏保留稳定占位高度。

创建 `getInitialContent()`，在服务端并行读取 diary、gallery、letters、messages 和 settings。每张表只有在查询成功且有数据时覆盖对应 fallback；`start_date` 解析失败时继续使用 `FALLBACK_START`。`app/page.js` await 该函数并把结果传给 `CoupleSite`，删除首页 mount 后再次请求 `/api/content` 的 effect。

- [ ] **Step 4: 替换 Motion 导入和重复变体**

客户端组件从 `framer-motion` 导入 `m`、`AnimatePresence` 或 hooks；所有展示 section 使用 `reveal`/`revealItem`。删除大面积 blur reveal 和离屏持续循环动画。

- [ ] **Step 5: 验证 bundle 和提交**

运行：

```powershell
npm run lint
npm run build
git diff --check
```

预期：检查通过，首页 First Load JS 不高于 Task 3 基线，倒计时更新不再位于 `CoupleSite`。

提交：

```powershell
git add app/page.js lib/content.js components/CoupleSite.jsx components/motion components/sections components/ui/index.jsx
git commit -m "perf: streamline motion and client boundaries"
```

### Task 4: 移动导航、触摸和基础可访问性

**Files:**
- Create: `components/navigation/SiteNavigation.jsx`
- Modify: `components/CoupleSite.jsx`
- Modify: `components/ui/index.jsx`
- Modify: `app/globals.css`

**Interfaces:**
- Produces: `SiteNavigation({ links })`
- Consumes: `links: Array<{ id: string, label: string }>`

- [ ] **Step 1: 记录当前可访问性缺口**

运行：

```powershell
Select-String -Path components/CoupleSite.jsx -Pattern '<Menu|aria-expanded|aria-controls'
Select-String -Path components/ui/index.jsx -Pattern 'placeholder="你的名字"|<label'
```

预期：菜单图标存在但缺少展开状态，留言输入缺少显式 label。

- [ ] **Step 2: 拆分无障碍导航**

菜单按钮至少 44px，包含：

```jsx
aria-expanded={menuOpen}
aria-controls="mobile-navigation"
aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"}
```

打开菜单后锁定背景滚动并聚焦第一个链接；Esc 关闭；关闭后恢复触发按钮焦点。菜单面板包含明确关闭按钮。

- [ ] **Step 3: 改善表单和触摸反馈**

留言字段添加视觉可隐藏但语义可见的 label、`aria-describedby` 状态区和提交中的 disabled 状态。所有图标按钮提供名称；触摸反馈不依赖缩小到低于可点击区域。

- [ ] **Step 4: 加入焦点与 reduced-motion 样式**

在 `globals.css` 增加统一 `:focus-visible` 环和：

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: 验证和提交**

运行 lint/build，并在 390×844 视口使用键盘验证打开、遍历、Esc 关闭、背景锁定和焦点恢复。提交：

```powershell
git add components/navigation/SiteNavigation.jsx components/CoupleSite.jsx components/ui/index.jsx app/globals.css
git commit -m "fix: refine mobile navigation and accessibility"
```

### Task 5: SEO、分享与结构化数据

**Files:**
- Create: `lib/site-metadata.mjs`
- Create: `tests/site-metadata.test.mjs`
- Modify: `app/layout.js`
- Modify: `app/page.js`
- Create: `app/opengraph-image.js`
- Create: `app/sitemap.js`
- Create: `app/robots.js`
- Create: `app/admin/layout.js`

**Interfaces:**
- Produces: `SITE_URL`, `SITE_NAME`, `SITE_DESCRIPTION`
- Produces: `buildWebsiteJsonLd() -> object`

- [ ] **Step 1: 写 metadata 失败测试**

创建测试：

```js
import test from "node:test";
import assert from "node:assert/strict";
import {
  SITE_URL,
  SITE_NAME,
  buildWebsiteJsonLd,
} from "../lib/site-metadata.mjs";

test("site identity is canonical and public", () => {
  assert.equal(SITE_URL, "https://couple-site-dusky.vercel.app");
  assert.match(SITE_NAME, /杜明洋.*陈柯嘉/);
});

test("website JSON-LD uses the canonical URL", () => {
  const jsonLd = buildWebsiteJsonLd();
  assert.equal(jsonLd["@type"], "WebSite");
  assert.equal(jsonLd.url, SITE_URL);
  assert.equal(jsonLd.inLanguage, "zh-CN");
  assert.deepEqual(
    jsonLd.about.map((person) => person.name),
    ["杜明洋", "陈柯嘉"]
  );
});
```

运行 `npm test`，预期因模块不存在失败。

- [ ] **Step 2: 实现站点常量和 JSON-LD**

创建站点常量与 `WebSite` JSON-LD；`about` 包含两个最小 `Person` 对象，只描述姓名，不声明婚姻状态或其他未提供事实。运行 `npm test`，预期全部通过。

- [ ] **Step 3: 完成 metadata、OG 与 Twitter**

设置 `metadataBase: new URL(SITE_URL)`、canonical、真实姓名 title、中文 description/keywords、Open Graph `website`、`zh_CN`、Twitter `summary_large_image`。`opengraph-image.js` 生成 1200×630 的瓷白、玫瑰粉、香槟金分享图。

- [ ] **Step 4: 增加 sitemap、robots 和 noindex**

`sitemap.js` 只返回首页；`robots.js` 允许首页并禁止 `/admin`、`/api`；`app/admin/layout.js` 导出 `{ robots: { index: false, follow: false } }`。

- [ ] **Step 5: 验证和提交**

运行：

```powershell
npm test
npm run lint
npm run build
git diff --check
```

启动生产服务后请求 `/sitemap.xml`、`/robots.txt` 和首页 HTML，确认 canonical、OG、Twitter 和 `application/ld+json` 存在。提交：

```powershell
git add lib/site-metadata.mjs tests/site-metadata.test.mjs app/layout.js app/page.js app/opengraph-image.js app/sitemap.js app/robots.js app/admin/layout.js
git commit -m "feat: complete search and social metadata"
```

### Task 6: 组件边界、CSS 一致性和错误反馈

**Files:**
- Create: `components/ui/SectionHeader.jsx`
- Create: `components/ui/MusicToggle.jsx`
- Create: `components/ui/MessageBoard.jsx`
- Modify: `components/ui/index.jsx`
- Modify: `components/CoupleSite.jsx`
- Modify: `app/globals.css`
- Modify: `tailwind.config.js`

**Interfaces:**
- Produces: `SectionHeader({ enTitle, cnTitle })`
- Produces: `MusicToggle()`
- Produces: `MessageBoard({ messages, onAddMessage })`
- `onAddMessage(message) -> Promise<{ ok: boolean, error?: string }>`

- [ ] **Step 1: 拆分 UI barrel**

把三个独立组件移动到对应文件；`components/ui/index.jsx` 只保留兼容导出，随后逐个消费者改为直接导入，避免无关代码进入同一模块。

- [ ] **Step 2: 统一 tokens**

Tailwind 配色引用 CSS 变量；组件内的 `#C4827A`、`#B8897E` 等重复值替换为设计 tokens。删除未使用的 dark cinematic 工具类和不一致字体声明。

- [ ] **Step 3: 增加可恢复错误状态**

`handleAddMessage` 返回明确结果。留言失败时保留输入并显示 `role="status"` 文案“留言暂时未发送，请稍后重试。”；成功后才清空字段。内容读取失败记录一次开发环境日志并保留 fallback。

- [ ] **Step 4: 验证和提交**

运行：

```powershell
npm test
npm run lint
npm run build
git grep -n -E '#C4827A|#B8897E' -- app components
git diff --check
```

预期检查通过且颜色 grep 无结果。提交：

```powershell
git add components/ui components/CoupleSite.jsx app/globals.css tailwind.config.js
git commit -m "refactor: align components and design tokens"
```

### Task 7: 全量视觉、性能与回归验证

**Files:**
- Modify only if verification exposes a concrete defect in files already owned by Tasks 1–6.

**Interfaces:**
- Consumes the completed site; produces validation evidence and, only if needed, one narrowly scoped fix commit.

- [ ] **Step 1: 运行完整自动检查**

```powershell
npm test
npm run lint
npm run build
git diff --check
git status --short
```

预期：测试、lint、build 退出码 0；diff check 无输出；只有已知 `.playwright-cli/` 临时目录未跟踪且不进入提交。

- [ ] **Step 2: 桌面浏览器回归**

在 1440×1000 检查 Hero 排版、视频/poster、导航、全部 section、3D 舞台、相框高光、灯箱键盘操作、留言错误状态和控制台。确认网络中没有 `hero-bg-mobile.mp4` 404。

- [ ] **Step 3: 手机浏览器回归**

在 390×844 与 430×932 检查安全视口高度、姓名换行、菜单、横向相册拖动、灯箱滑动、44px 触摸目标、文字可读性和视频 fallback。

- [ ] **Step 4: reduced-motion 与键盘回归**

模拟 reduced motion，确认视频/持续视差停止；仅用 Tab、Enter、方向键和 Esc 完成导航、打开照片、切换照片和关闭灯箱。

- [ ] **Step 5: Core Web Vitals 对比**

对正式构建执行移动端和桌面端 Lighthouse，记录 Performance、LCP、CLS、TBT/INP 代理指标和首页 JS。若出现回退，定位到具体资源或 chunk，修复后重复完整检查。

- [ ] **Step 6: 审阅与发布准备**

对 `origin/master...HEAD` 做代码审阅，修复 Critical/Important 问题；确认 commits 主题独立。推送：

```powershell
git push -u origin agent/high-end-romantic-optimization
```

创建 draft PR，正文包含变更、动机、用户影响、验证结果和已知限制。
