import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, "../public/og-image.png");

const W = 1200;
const H = 630;

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background gradient -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>

    <!-- Glow orb top-left -->
    <radialGradient id="glow1" cx="20%" cy="30%" r="45%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
    </radialGradient>

    <!-- Glow orb bottom-right -->
    <radialGradient id="glow2" cx="85%" cy="75%" r="40%">
      <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0"/>
    </radialGradient>

    <!-- Accent glow behind card -->
    <radialGradient id="glow3" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
    </radialGradient>

    <!-- Card gradient -->
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.98"/>
    </linearGradient>

    <!-- Chart bar gradient -->
    <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#4f46e5" stop-opacity="0.6"/>
    </linearGradient>

    <!-- Chart bar teal -->
    <linearGradient id="barGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0.6"/>
    </linearGradient>

    <!-- Sparkline gradient fill -->
    <linearGradient id="sparkFill" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
    </linearGradient>

    <!-- Border gradient -->
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.4"/>
      <stop offset="50%" stop-color="#0ea5e9" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.3"/>
    </linearGradient>

    <!-- Dot grid pattern -->
    <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="0.85" fill="#334155" fill-opacity="0.5"/>
    </pattern>

    <!-- Blur filter for glow behind dashboard card -->
    <filter id="cardGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="18" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <!-- Clip for rounded dashboard card -->
    <clipPath id="cardClip">
      <rect x="620" y="90" width="530" height="450" rx="16"/>
    </clipPath>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Dot grid overlay -->
  <rect width="${W}" height="${H}" fill="url(#dots)"/>

  <!-- Glow orbs -->
  <rect width="${W}" height="${H}" fill="url(#glow1)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <!-- Subtle horizontal rule accent at top -->
  <line x1="50" y1="0" x2="${W - 50}" y2="0" stroke="url(#borderGrad)" stroke-width="1.5" stroke-opacity="0.6"/>

  <!-- ── LEFT CONTENT PANEL ─────────────────────────────────────── -->

  <!-- Brand badge -->
  <rect x="56" y="68" width="86" height="26" rx="13" fill="#1e293b" stroke="#334155" stroke-width="1"/>
  <circle cx="73" cy="81" r="5" fill="#6366f1"/>
  <text x="83" y="86" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#94a3b8" letter-spacing="0.5">FINOVA</text>

  <!-- Main headline -->
  <text x="56" y="162" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="800" fill="#f8fafc" letter-spacing="-1.5">Finova</text>
  <text x="56" y="222" font-family="system-ui, -apple-system, sans-serif" font-size="38" font-weight="700" fill="#e2e8f0" letter-spacing="-0.8">Fintech</text>
  <text x="56" y="272" font-family="system-ui, -apple-system, sans-serif" font-size="38" font-weight="700" fill="#e2e8f0" letter-spacing="-0.8">Dashboard</text>

  <!-- Accent underline under "Finova" -->
  <rect x="56" y="170" width="130" height="3" rx="2" fill="url(#borderGrad)"/>

  <!-- Subtitle -->
  <text x="56" y="318" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="400" fill="#94a3b8" letter-spacing="0.1">AI-assisted expense tracking and</text>
  <text x="56" y="340" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="400" fill="#94a3b8" letter-spacing="0.1">financial analytics</text>

  <!-- Feature pills -->
  <rect x="56" y="370" width="108" height="28" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1"/>
  <text x="110" y="388" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" font-weight="500" fill="#6366f1">📊 Analytics</text>

  <rect x="174" y="370" width="118" height="28" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1"/>
  <text x="233" y="388" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" font-weight="500" fill="#0ea5e9">💳 Expenses</text>

  <rect x="302" y="370" width="104" height="28" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1"/>
  <text x="354" y="388" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" font-weight="500" fill="#10b981">📈 Insights</text>

  <!-- Stack badges -->
  <text x="56" y="444" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="500" fill="#475569" letter-spacing="0.3">Built with</text>
  <rect x="56" y="454" width="66" height="22" rx="5" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
  <text x="89" y="469" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="600" fill="#64748b">Next.js</text>
  <rect x="130" y="454" width="72" height="22" rx="5" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
  <text x="166" y="469" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="600" fill="#64748b">Supabase</text>
  <rect x="210" y="454" width="76" height="22" rx="5" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
  <text x="248" y="469" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="600" fill="#64748b">Tailwind</text>
  <rect x="294" y="454" width="72" height="22" rx="5" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
  <text x="330" y="469" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="10.5" font-weight="600" fill="#64748b">Recharts</text>

  <!-- Bottom URL -->
  <text x="56" y="566" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="400" fill="#334155">fintech-demo-arjun.vercel.app</text>

  <!-- ── RIGHT: DASHBOARD PREVIEW CARD ──────────────────────────── -->

  <!-- Card glow halo -->
  <rect x="600" y="70" width="570" height="490" rx="20" fill="#6366f1" fill-opacity="0.06" filter="url(#cardGlow)"/>

  <!-- Card body -->
  <rect x="620" y="90" width="530" height="450" rx="16" fill="url(#cardBg)" stroke="url(#borderGrad)" stroke-width="1.2"/>

  <!-- Card top bar / header -->
  <rect x="620" y="90" width="530" height="44" rx="0" fill="#1e293b" fill-opacity="0.7"/>
  <rect x="620" y="90" width="530" height="44" rx="16" fill="none"/>
  <!-- fix top corners -->
  <rect x="620" y="110" width="530" height="24" fill="#1e293b" fill-opacity="0.7"/>

  <!-- Traffic light dots -->
  <circle cx="648" cy="112" r="5.5" fill="#ef4444" fill-opacity="0.7"/>
  <circle cx="666" cy="112" r="5.5" fill="#f59e0b" fill-opacity="0.7"/>
  <circle cx="684" cy="112" r="5.5" fill="#10b981" fill-opacity="0.7"/>

  <!-- Header title -->
  <text x="710" y="117" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="500" fill="#64748b">Finova Dashboard  ·  Overview</text>

  <!-- Card content area starts at y=134 -->

  <!-- STAT CARDS ROW -->
  <!-- Card 1: Total Balance -->
  <rect x="636" y="148" width="148" height="76" rx="10" fill="#0f172a" fill-opacity="0.8" stroke="#1e293b" stroke-width="1"/>
  <text x="650" y="168" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="500" fill="#64748b" letter-spacing="0.3">TOTAL BALANCE</text>
  <text x="650" y="192" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="700" fill="#f8fafc">$48,290</text>
  <text x="650" y="210" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="500" fill="#10b981">▲ 12.4%  this month</text>

  <!-- Card 2: Expenses -->
  <rect x="796" y="148" width="148" height="76" rx="10" fill="#0f172a" fill-opacity="0.8" stroke="#1e293b" stroke-width="1"/>
  <text x="810" y="168" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="500" fill="#64748b" letter-spacing="0.3">MONTHLY SPEND</text>
  <text x="810" y="192" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="700" fill="#f8fafc">$6,814</text>
  <text x="810" y="210" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="500" fill="#ef4444">▼ 3.1%  vs last month</text>

  <!-- Card 3: Savings -->
  <rect x="956" y="148" width="178" height="76" rx="10" fill="#0f172a" fill-opacity="0.8" stroke="#1e293b" stroke-width="1"/>
  <text x="970" y="168" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="500" fill="#64748b" letter-spacing="0.3">SAVINGS RATE</text>
  <text x="970" y="192" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="700" fill="#f8fafc">34.2%</text>
  <text x="970" y="210" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="500" fill="#10b981">▲ On track  · target 30%</text>

  <!-- CHART AREA -->
  <rect x="636" y="238" width="340" height="164" rx="10" fill="#0f172a" fill-opacity="0.7" stroke="#1e293b" stroke-width="1"/>
  <text x="650" y="256" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="600" fill="#94a3b8">Spending Overview</text>
  <text x="900" y="256" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="9" fill="#475569">Last 6 months</text>

  <!-- Bar chart bars (6 months) -->
  <!-- Month labels -->
  <text x="660" y="392" font-family="system-ui, -apple-system, sans-serif" font-size="8" fill="#475569">Aug</text>
  <text x="707" y="392" font-family="system-ui, -apple-system, sans-serif" font-size="8" fill="#475569">Sep</text>
  <text x="754" y="392" font-family="system-ui, -apple-system, sans-serif" font-size="8" fill="#475569">Oct</text>
  <text x="801" y="392" font-family="system-ui, -apple-system, sans-serif" font-size="8" fill="#475569">Nov</text>
  <text x="848" y="392" font-family="system-ui, -apple-system, sans-serif" font-size="8" fill="#475569">Dec</text>
  <text x="895" y="392" font-family="system-ui, -apple-system, sans-serif" font-size="8" fill="#6366f1" font-weight="600">Jan</text>

  <!-- Bars - Income (taller, back) -->
  <rect x="655" y="298" width="18" height="76" rx="3" fill="url(#barGrad2)" fill-opacity="0.5"/>
  <rect x="702" y="282" width="18" height="92" rx="3" fill="url(#barGrad2)" fill-opacity="0.5"/>
  <rect x="749" y="290" width="18" height="84" rx="3" fill="url(#barGrad2)" fill-opacity="0.5"/>
  <rect x="796" y="275" width="18" height="99" rx="3" fill="url(#barGrad2)" fill-opacity="0.5"/>
  <rect x="843" y="285" width="18" height="89" rx="3" fill="url(#barGrad2)" fill-opacity="0.5"/>
  <rect x="890" y="270" width="18" height="104" rx="3" fill="url(#barGrad2)" fill-opacity="0.7"/>

  <!-- Bars - Expense (shorter, front) -->
  <rect x="660" y="320" width="14" height="54" rx="3" fill="url(#barGrad)"/>
  <rect x="707" y="306" width="14" height="68" rx="3" fill="url(#barGrad)"/>
  <rect x="754" y="312" width="14" height="62" rx="3" fill="url(#barGrad)"/>
  <rect x="801" y="300" width="14" height="74" rx="3" fill="url(#barGrad)"/>
  <rect x="848" y="308" width="14" height="66" rx="3" fill="url(#barGrad)"/>
  <rect x="895" y="292" width="14" height="82" rx="3" fill="url(#barGrad)" fill-opacity="0.9"/>

  <!-- Chart legend -->
  <rect x="650" y="397" width="8" height="8" rx="2" fill="#0ea5e9" fill-opacity="0.7"/>
  <text x="662" y="405" font-family="system-ui, -apple-system, sans-serif" font-size="8" fill="#475569">Income</text>
  <rect x="700" y="397" width="8" height="8" rx="2" fill="#6366f1"/>
  <text x="712" y="405" font-family="system-ui, -apple-system, sans-serif" font-size="8" fill="#475569">Expenses</text>

  <!-- RIGHT MINI PANEL: Top Categories -->
  <rect x="988" y="238" width="146" height="164" rx="10" fill="#0f172a" fill-opacity="0.7" stroke="#1e293b" stroke-width="1"/>
  <text x="1001" y="256" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="600" fill="#94a3b8">Categories</text>

  <!-- Category rows -->
  <!-- Housing -->
  <text x="1001" y="278" font-family="system-ui, -apple-system, sans-serif" font-size="9" fill="#cbd5e1">Housing</text>
  <rect x="1001" y="281" width="120" height="5" rx="2.5" fill="#1e293b"/>
  <rect x="1001" y="281" width="80" height="5" rx="2.5" fill="#6366f1"/>
  <text x="1123" y="287" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="8" fill="#64748b">$2,100</text>

  <!-- Food -->
  <text x="1001" y="305" font-family="system-ui, -apple-system, sans-serif" font-size="9" fill="#cbd5e1">Food</text>
  <rect x="1001" y="308" width="120" height="5" rx="2.5" fill="#1e293b"/>
  <rect x="1001" y="308" width="55" height="5" rx="2.5" fill="#0ea5e9"/>
  <text x="1123" y="314" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="8" fill="#64748b">$980</text>

  <!-- Transport -->
  <text x="1001" y="332" font-family="system-ui, -apple-system, sans-serif" font-size="9" fill="#cbd5e1">Transport</text>
  <rect x="1001" y="335" width="120" height="5" rx="2.5" fill="#1e293b"/>
  <rect x="1001" y="335" width="38" height="5" rx="2.5" fill="#10b981"/>
  <text x="1123" y="341" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="8" fill="#64748b">$460</text>

  <!-- Entertainment -->
  <text x="1001" y="359" font-family="system-ui, -apple-system, sans-serif" font-size="9" fill="#cbd5e1">Entertainment</text>
  <rect x="1001" y="362" width="120" height="5" rx="2.5" fill="#1e293b"/>
  <rect x="1001" y="362" width="28" height="5" rx="2.5" fill="#f59e0b"/>
  <text x="1123" y="368" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="8" fill="#64748b">$334</text>

  <!-- Other -->
  <text x="1001" y="386" font-family="system-ui, -apple-system, sans-serif" font-size="9" fill="#cbd5e1">Other</text>
  <rect x="1001" y="389" width="120" height="5" rx="2.5" fill="#1e293b"/>
  <rect x="1001" y="389" width="20" height="5" rx="2.5" fill="#8b5cf6"/>
  <text x="1123" y="395" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="8" fill="#64748b">$240</text>

  <!-- SPARKLINE ROW -->
  <rect x="636" y="416" width="498" height="108" rx="10" fill="#0f172a" fill-opacity="0.7" stroke="#1e293b" stroke-width="1"/>
  <text x="650" y="434" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="600" fill="#94a3b8">Net Worth Trend</text>
  <text x="1028" y="434" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="9" fill="#10b981" font-weight="600">+$8,420  ↑</text>

  <!-- Sparkline path -->
  <path d="M 650 490 L 680 482 L 710 478 L 740 470 L 770 474 L 800 462 L 830 455 L 860 448 L 890 440 L 920 436 L 950 428 L 980 420 L 1010 415 L 1028 410"
        fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Sparkline fill area -->
  <path d="M 650 490 L 680 482 L 710 478 L 740 470 L 770 474 L 800 462 L 830 455 L 860 448 L 890 440 L 920 436 L 950 428 L 980 420 L 1010 415 L 1028 410 L 1028 510 L 650 510 Z"
        fill="url(#sparkFill)"/>

  <!-- Dot on latest point -->
  <circle cx="1028" cy="410" r="3.5" fill="#6366f1"/>
  <circle cx="1028" cy="410" r="6" fill="#6366f1" fill-opacity="0.2"/>

  <!-- ── BOTTOM ACCENT LINE ──────────────────────────────────────── -->
  <line x1="50" y1="${H}" x2="${W - 50}" y2="${H}" stroke="url(#borderGrad)" stroke-width="1.5" stroke-opacity="0.4"/>
</svg>
`.trim();

const svgBuffer = Buffer.from(svg);

sharp(svgBuffer)
  .png({ quality: 95, compressionLevel: 8 })
  .toFile(OUTPUT)
  .then(() => console.log(`✓  OG image written to ${OUTPUT}`))
  .catch((err) => { console.error("Error:", err); process.exit(1); });
