---
title: The 3-Second Load Time That Cost Us 23% of Users
date: '2025-06-20'
spoiler: A real performance optimization journey from 3.2s to 0.8s Time to Interactive
cta: 'react'
---

Three months ago, our product manager walked into our sprint planning with a screenshot of our competitor's app loading instantly next to ours showing a white screen for three seconds. "Why does theirs feel so much faster?" she asked.

I didn't have a good answer. Our Lighthouse scores were "okay" - hovering around 65-70. We'd shipped features fast, our users seemed happy enough, and performance optimization felt like something we'd "get to eventually."

Then we looked at the analytics. Our mobile bounce rate was 23% higher than desktop. Users on 3G connections were abandoning the app before it even loaded. We were bleeding users and didn't even know it.

This is the story of how we cut our Time to Interactive from 3.2 seconds to 0.8 seconds, reduced our bundle size by 60%, and improved our Core Web Vitals to consistently score above 90. More importantly, it's about the debugging process that got us there.

## The Wake-Up Call: Understanding What Was Actually Slow

Before optimizing anything, I needed to understand what "slow" actually meant. Our initial metrics looked like this:

**Before (Mobile 3G):**
* First Contentful Paint (FCP): 2.1s
* Largest Contentful Paint (LCP): 3.8s
* Time to Interactive (TTI): 3.2s
* Total Blocking Time (TBT): 890ms
* Cumulative Layout Shift (CLS): 0.18
* Bundle Size: 847KB (minified), 312KB (gzipped)

The real problem? I had no idea which of these numbers actually mattered to our users.

## Step 1: Identifying the Real Bottleneck

I started with Chrome DevTools Performance tab. Here's what I found that made me physically uncomfortable:

```
Main Thread Activity (First 5 seconds):
████████████████████████ Scripting (3200ms)
█████ Rendering (800ms)
██ Painting (320ms)
█ System (180ms)
```

Our JavaScript was blocking the main thread for over 3 seconds. Users were staring at a white screen while we parsed and executed 312KB of gzipped JavaScript (847KB minified) they didn't need yet.

### The Debugging Process

I used a simple but effective technique: **Binary search through imports**.

```tsx
// Step 1: Comment out half the imports
// import { HeavyChart } from './components/HeavyChart';
// import { RichTextEditor } from './components/RichTextEditor';
// import { VideoPlayer } from './components/VideoPlayer';
import { UserProfile } from './components/UserProfile';
import { Navigation } from './components/Navigation';

// Rebuild and measure. If it's faster, the problem is in the commented section.
// If not, it's in the uncommented section. Repeat.
```

After 30 minutes of this, I found the culprits:

1. **Chart.js** (188KB minified, 52KB gzipped) - Loaded on every page, used on one page
2. **Moment.js** (72KB minified, 18KB gzipped) - For date formatting; date-fns would be ~2KB per function
3. **Lodash** (Full library: 72KB minified, 24KB gzipped) - We used 5 functions (~1KB each if imported individually)
4. **React-Quill** (Rich text editor: 205KB minified, 58KB gzipped) - Loaded on home page, only used in settings

Here's what matters: browsers download the **gzipped** size (312KB total for our bundle), but must parse and execute the **minified** size (847KB). Both numbers kill performance.

These four libraries accounted for 152KB gzipped (49% of our total download) and were rarely used by most users.

## Step 2: Code Splitting Everything That Moves

The obvious fix was code splitting, but I'd tried this before and it felt like whack-a-mole. This time I needed a system.

### What I Actually Did

```tsx
// Before: Everything loads immediately
import { Chart } from 'chart.js';
import { RichTextEditor } from 'react-quill';
import { VideoPlayer } from 'react-player';

function Dashboard() {
  return (
    <div>
      <UserStats />
      <Chart data={data} />
      <ActivityFeed />
    </div>
  );
}
```

```tsx
// After: Lazy load by route and by interaction
import { lazy, Suspense } from 'react';

const Chart = lazy(() => import('./components/Chart'));
const RichTextEditor = lazy(() => import('./components/RichTextEditor'));
const VideoPlayer = lazy(() => import('./components/VideoPlayer'));

function Dashboard() {
  return (
    <div>
      <UserStats />
      <Suspense fallback={<ChartSkeleton />}>
        <Chart data={data} />
      </Suspense>
      <ActivityFeed />
    </div>
  );
}
```

**Result:** Initial bundle dropped from 847KB minified (312KB gzipped) to 380KB minified (142KB gzipped). But TTI was still 2.1s. Something else was wrong.

## Step 3: The Render That Nobody Asked For

I opened React DevTools Profiler and recorded a page load. What I saw made me question everything:

```
Component Render Timeline:
App                 ████████████████████ (1840ms)
├─ Dashboard        ████████████████ (1420ms)
   ├─ UserStats     ████ (340ms)
   ├─ ActivityFeed  ████████████ (980ms)
      ├─ FeedItem   ██ (45ms) x 20 items
```

ActivityFeed was rendering 20 FeedItems on mount, each making its own API call for user data. We were making 20 parallel requests for data we already had in Redux.

### The Fix: Virtualization + Data Prefetching

```tsx
// Before: Render everything, kill the browser
function ActivityFeed({ items }) {
  return (
    <div>
      {items.map(item => (
        <FeedItem key={item.id} item={item} />
      ))}
    </div>
  );
}

function FeedItem({ item }) {
  const user = useUser(item.userId); // Individual API call per item
  return <div>{user.name} did something</div>;
}
```

```tsx
// After: Virtualize the list, batch the data
import { FixedSizeList } from 'react-window';

function ActivityFeed({ items }) {
  // Prefetch all user data in one request
  const userIds = items.map(item => item.userId);
  const users = useUsers(userIds); // Single batched API call
  
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={80}
      width="100%"
    >
      {({ index, style }) => (
        <FeedItem 
          key={items[index].id}
          item={items[index]}
          user={users[items[index].userId]}
          style={style}
        />
      )}
    </FixedSizeList>
  );
}
```

**Result:** ActivityFeed render time dropped from 980ms to 120ms. Only 5-7 items rendered at once instead of 20.

## Step 4: The Image Problem I Didn't Know I Had

Our LCP was still at 3.8s. Chrome DevTools showed the culprit: our hero image was 2.4MB.

I checked our image pipeline. We were serving the same high-res PNG to everyone - mobile, desktop, retina, non-retina. A 2.4MB image for a 375px mobile screen.

### The Fix: Modern Image Optimization

```tsx
// Before: One image to rule them all
<img src="/hero.png" alt="Hero" />
```

```tsx
// After: Responsive images with Next.js Image
import Image from 'next/image';

<Image
  src="/hero.png"
  alt="Hero"
  width={1200}
  height={600}
  priority // Preload LCP image
  placeholder="blur"
  blurDataURL={blurDataURL}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

I also converted all PNGs to WebP with fallbacks:

```bash
# Build-time image optimization
find ./public/images -name "*.png" -exec sh -c 'cwebp -q 80 "$1" -o "${1%.png}.webp"' _ {} \;
```

**Result:** 
* Hero image: 2.4MB → 180KB (92% reduction)
* LCP: 3.8s → 1.2s

## Step 5: The Cumulative Layout Shift That Was Invisible

Our CLS score of 0.18 seemed okay, but users were complaining about "jumpiness." I recorded a video of our page loading in slow motion:

1. Text appears (0.5s)
2. Images load, pushing text down (1.2s)
3. Ads inject, pushing everything down again (2.8s)
4. Font loads, text reflows (3.1s)

Users were trying to click buttons that kept moving. Infuriating.

### The Fix: Reserve Space for Everything

```css
/* Before: No dimensions, pray for the best */
img {
  max-width: 100%;
  height: auto;
}
```

```tsx
// After: Explicit dimensions, aspect ratio preservation
<Image
  src="/hero.png"
  alt="Hero"
  width={1200}
  height={600}
  style={{ width: '100%', height: 'auto' }}
/>
```

For fonts, I added `font-display: swap` and preloaded critical fonts:

```html
<link
  rel="preload"
  href="/fonts/inter-var.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
```

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-display: swap; /* Show fallback immediately */
}
```

**Result:** CLS: 0.18 → 0.02

## Step 6: The Bundle Analysis I Should Have Done First

I finally ran `webpack-bundle-analyzer` and saw this monstrosity:

```
Your Bundle Breakdown:
├─ chart.js
│  └─ 188KB minified (52KB gzipped)
├─ moment
│  ├─ 72KB minified (18KB gzipped)
│  └─ locales/ (53KB) ← We only used en-US
├─ lodash
│  ├─ Full library: 72KB minified (24KB gzipped)
│  └─ We only used 5 functions! (~5KB total if imported individually)
├─ core-js
│  └─ 89KB minified ← Polyfills for features we didn't use
```

**Understanding the numbers:**
* **Unpacked size** (what you see on npm): How much disk space it takes in `node_modules`
* **Minified size**: What webpack bundles (this is what the browser must parse/execute)
* **Gzipped size**: What actually gets downloaded over the network

Lodash's npm page shows 1.41MB unpacked, but that's all the source files. When bundled, the full library is 72KB minified (24KB gzipped). The problem? We only needed 5 functions, which would be ~5KB total if imported individually.

The real cost isn't just download time—it's parse and execution time. That 72KB minified lodash costs ~150ms of parse time on mobile devices, even though we only use 5 functions.

### The Surgical Removals

```bash
# Replace moment with date-fns (tree-shakeable)
npm uninstall moment
npm install date-fns

# Use individual lodash functions
npm uninstall lodash
npm install lodash.debounce lodash.throttle lodash.merge

# Configure babel to only include needed polyfills
# .babelrc
{
  "presets": [
    ["@babel/preset-env", {
      "useBuiltIns": "usage",
      "corejs": 3
    }]
  ]
}
```

```tsx
// Before
import moment from 'moment';
import _ from 'lodash';

const formatted = moment(date).format('MMM DD, YYYY');
const debounced = _.debounce(fn, 300);
```

```tsx
// After
import { format } from 'date-fns';
import debounce from 'lodash.debounce';

const formatted = format(date, 'MMM dd, yyyy');
const debounced = debounce(fn, 300);
```

**Result:** 
* Bundle size: 380KB minified → 223KB minified (142KB gzipped → 78KB gzipped)
* Parse time reduced by ~400ms on mobile devices
* 75% reduction in total download size from original (312KB → 78KB gzipped)

## The Results: Numbers That Actually Mattered

**After (Mobile 3G):**
* First Contentful Paint: 2.1s → 0.6s
* Largest Contentful Paint: 3.8s → 1.2s
* Time to Interactive: 3.2s → 0.8s
* Total Blocking Time: 890ms → 180ms
* Cumulative Layout Shift: 0.18 → 0.02
* Bundle Size: 847KB minified (312KB gzipped) → 223KB minified (78KB gzipped)

**Lighthouse Score:** 67 → 94

**Business Impact:**
* Mobile bounce rate: -23% → -8%
* Time to first interaction: 3.2s → 0.8s
* Pages per session: +31%
* Mobile conversion rate: +18%

## What I Learned (That Nobody Tells You)

**Performance optimization isn't a one-time thing.** I set up bundle size budgets in CI:

```json
// package.json
{
  "bundlesize": [
    {
      "path": "./dist/main.*.js",
      "maxSize": "85KB",
      "compression": "gzip"
    }
  ]
}
```

Now our CI fails if anyone adds a heavy library without code splitting it. We track both minified and gzipped sizes.

**Lighthouse scores don't tell the full story.** We had a "okay" score but terrible real-user metrics. I started tracking Real User Monitoring (RUM) with web-vitals:

```tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics({ name, delta, id }) {
  analytics.track('Web Vital', {
    metric: name,
    value: delta,
    id: id,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

**The biggest wins came from removing code, not optimizing it.** We spent weeks optimizing our chart rendering. Removing Chart.js entirely and using a lighter library (Recharts) gave us 10x better results in one afternoon.

**Users on slow connections are your best teachers.** I started testing on a real Moto G4 with throttled 3G. Our app that felt "fine" on my MacBook was unusable on a real device.

## The Workflow I Wish I'd Had From Day One

Here's my current performance optimization workflow:

1. **Measure real users first** - RUM data > Lighthouse
2. **Find the slowest thing** - DevTools Performance tab
3. **Binary search through imports** - Find heavy dependencies
4. **Code split ruthlessly** - Lazy load everything below the fold
5. **Optimize images** - WebP, responsive sizes, lazy loading
6. **Eliminate layout shifts** - Reserve space for everything
7. **Set up budgets** - Fail CI if bundle grows
8. **Monitor continuously** - Track web vitals in production

## Tools That Actually Helped

* **webpack-bundle-analyzer** - Visualize your bundle
* **Chrome DevTools Performance** - Find slow renders
* **Lighthouse CI** - Catch regressions
* **web-vitals** - Track real user metrics
* **React DevTools Profiler** - Find slow components
* **bundlesize** - Enforce bundle budgets

## In Closing

Performance optimization isn't about making your Lighthouse score green. It's about understanding why users are leaving and fixing the actual problems they experience.

Our 23% mobile bounce rate wasn't acceptable, but we didn't know it was a problem until we measured it. Start with real user data, find the biggest bottleneck, fix it, and measure again.

What performance bottlenecks are you dealing with? I'd love to hear what you're struggling with.
