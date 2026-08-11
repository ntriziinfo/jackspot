import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const guideDir = path.join(root, "assets", "guide");
fs.mkdirSync(guideDir, { recursive: true });

const settings = [1, 2, 3, 4, 5, 6];
const bonus = {
  1:{big:354.112628, reg:570.311235, total:218.465163, payout:90.0},
  2:{big:335.340933, reg:496.870459, total:200.214759, payout:93.0},
  3:{big:318.675842, reg:391.096799, total:175.595810, payout:96.0},
  4:{big:295.728558, reg:359.759320, total:162.308272, payout:101.0},
  5:{big:288.226978, reg:283.780845, total:142.993316, payout:104.0},
  6:{big:276.519476, reg:276.524590, total:138.261016, payout:108.0}
};
const grape = {1:6.592194,2:6.554256,3:6.455407,4:6.248231,5:6.120643,6:5.897360};
const replay = {1:7.464630,2:7.482946,3:7.452119,4:7.301746,5:7.250883,6:7.245667};
const bell = {1:128.0,2:192.0,3:124.0,4:184.0,5:120.0,6:176.0};
const pierrot = {1:360.0,2:160.0,3:340.0,4:145.0,5:320.0,6:130.0};
const bigDetail = {
  1:{solo:507.333036, cherry:1172.513751},
  2:{solo:482.421007, cherry:1099.914526},
  3:{solo:457.230556, cherry:1051.630277},
  4:{solo:421.313106, cherry:992.115025},
  5:{solo:411.523999, cherry:962.004741},
  6:{solo:394.808291, cherry:922.929037}
};
const regDetail = {
  1:{solo:817.078260, cherry:1888.375933},
  2:{solo:714.797163, cherry:1629.729574},
  3:{solo:561.138886, cherry:1290.619438},
  4:{solo:512.535272, cherry:1206.926476},
  5:{solo:405.175910, cherry:947.165041},
  6:{solo:394.815591, cherry:922.946104}
};

const pbbRateOnBig = 0.03;
const payouts = {
  big:252,
  reg:96,
  premium:500,
  premiumTotal:1000,
  grape:8,
  bell:10,
  replay:3,
  pierrot:14,
  cherry:"1pt/2pt"
};

const settingVoiceInfo = [
  {hint:"2以上示唆", voice:"宗ちゃんまって", file:"setting_voice_2plus.wav", path:"assets/media/jackspot/setting_voice_2plus.wav", condition:"設定2以上", rate:"5.0%"},
  {hint:"4以上示唆", voice:"ふむふむ。いい感じだよ！", file:"setting_voice_4plus.wav", path:"assets/media/jackspot/setting_voice_4plus.wav", condition:"設定4以上", rate:"2.0%"},
  {hint:"5以上示唆", voice:"サイコーじゃん！", file:"setting_voice_5plus.wav", path:"assets/media/jackspot/setting_voice_5plus.wav", condition:"設定5以上", rate:"2.0%"},
  {hint:"6確定", voice:"好きだよ。", file:"setting_voice_6plus.wav", path:"assets/media/jackspot/setting_voice_6plus.wav", condition:"設定6", rate:"1.0%"}
];

const S = {
  SEVEN:"7",
  BAR:"BAR",
  REPLAY:"REPLAY",
  GRAPE:"🍇",
  CHERRY:"🍒",
  PIERROT:"🤡",
  BELL:"🔔"
};

const reelStrips = [
  [S.BELL,S.SEVEN,S.REPLAY,S.GRAPE,S.REPLAY,S.GRAPE,S.BAR,S.CHERRY,S.GRAPE,S.REPLAY,S.GRAPE,S.SEVEN,S.PIERROT,S.GRAPE,S.REPLAY,S.GRAPE,S.CHERRY,S.BAR,S.GRAPE,S.REPLAY,S.GRAPE],
  [S.REPLAY,S.SEVEN,S.GRAPE,S.CHERRY,S.REPLAY,S.BELL,S.GRAPE,S.CHERRY,S.REPLAY,S.BAR,S.GRAPE,S.CHERRY,S.REPLAY,S.BELL,S.GRAPE,S.CHERRY,S.REPLAY,S.BAR,S.GRAPE,S.CHERRY,S.PIERROT],
  [S.GRAPE,S.SEVEN,S.BAR,S.BELL,S.REPLAY,S.GRAPE,S.PIERROT,S.BELL,S.REPLAY,S.BAR,S.PIERROT,S.BELL,S.REPLAY,S.GRAPE,S.PIERROT,S.BELL,S.REPLAY,S.GRAPE,S.PIERROT,S.BELL,S.REPLAY]
];

const reachMeGridPatterns = [
  [[S.GRAPE,S.REPLAY,S.PIERROT],[S.BAR,S.BAR,S.SEVEN],[S.REPLAY,S.GRAPE,S.PIERROT]],
  [[S.GRAPE,S.REPLAY,S.PIERROT],[S.SEVEN,S.BAR,S.SEVEN],[S.REPLAY,S.GRAPE,S.PIERROT]],
  [[S.GRAPE,S.REPLAY,S.PIERROT],[S.SEVEN,S.BAR,S.BAR],[S.REPLAY,S.GRAPE,S.PIERROT]],
  [[S.GRAPE,S.REPLAY,S.PIERROT],[S.BAR,S.SEVEN,S.SEVEN],[S.REPLAY,S.GRAPE,S.PIERROT]],
  [[S.GRAPE,S.REPLAY,S.PIERROT],[S.BAR,S.SEVEN,S.BAR],[S.REPLAY,S.GRAPE,S.PIERROT]],
  [[S.GRAPE,S.REPLAY,S.CHERRY],[S.PIERROT,S.SEVEN,S.PIERROT],[S.REPLAY,S.GRAPE,S.BAR]],
  [[S.GRAPE,S.REPLAY,S.CHERRY],[S.PIERROT,S.BAR,S.PIERROT],[S.REPLAY,S.GRAPE,S.SEVEN]],
  [[S.GRAPE,S.REPLAY,S.PIERROT],[S.CHERRY,S.GRAPE,S.SEVEN],[S.REPLAY,S.PIERROT,S.GRAPE]],
  [[S.CHERRY,S.GRAPE,S.SEVEN],[S.REPLAY,S.PIERROT,S.GRAPE],[S.GRAPE,S.REPLAY,S.PIERROT]],
  [[S.GRAPE,S.REPLAY,S.PIERROT],[S.REPLAY,S.PIERROT,S.GRAPE],[S.CHERRY,S.GRAPE,S.BAR]]
];

const symbolAssets = {
  [S.SEVEN]:"guideSymSeven",
  [S.BAR]:"guideSymBar",
  [S.REPLAY]:"guideSymReplay",
  [S.GRAPE]:"guideSymGrape",
  [S.BELL]:"guideSymBell",
  [S.CHERRY]:"guideSymCherry",
  [S.PIERROT]:"guideSymPiero"
};

const symbolAssetFiles = {
  guideSymSeven:"assets/symbols/sym_seven.png",
  guideSymBar:"assets/symbols/sym_bar.png",
  guideSymReplay:"assets/symbols/sym_replay.png",
  guideSymGrape:"assets/symbols/sym_grape.png",
  guideSymBell:"assets/symbols/sym_bell.png",
  guideSymCherry:"assets/symbols/sym_cherry.png",
  guideSymPiero:"assets/cabinet/edit_parts/piero.png"
};

const cabinetAssets = {
  top:"assets/cabinet/parts/rising_part_top.png",
  reelBack:"assets/cabinet/parts/rising_part_reel_back_roles.png",
  reelBands:"assets/cabinet/parts/rising_part_reel_center_bands.png",
  reelFront:"assets/cabinet/parts/rising_part_reel_front_roles.png",
  lower:"assets/cabinet/parts/rising_part_lower.png",
  controls:"assets/cabinet/parts/rising_part_controls.png"
};

const dataUriCache = new Map();
const dimensionCache = new Map();

function mimeFor(file){
  const ext = path.extname(file).toLowerCase();
  if(ext === ".png") return "image/png";
  if(ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if(ext === ".webp") return "image/webp";
  if(ext === ".svg") return "image/svg+xml";
  return "application/octet-stream";
}

function dataUri(file){
  if(dataUriCache.has(file)) return dataUriCache.get(file);
  const abs = path.join(root, file);
  const uri = `data:${mimeFor(file)};base64,${fs.readFileSync(abs).toString("base64")}`;
  dataUriCache.set(file, uri);
  return uri;
}

function pngDimensions(file){
  if(dimensionCache.has(file)) return dimensionCache.get(file);
  const buffer = fs.readFileSync(path.join(root, file));
  const isPng = buffer.length > 24 && buffer.toString("ascii", 1, 4) === "PNG";
  const size = isPng
    ? {width:buffer.readUInt32BE(16), height:buffer.readUInt32BE(20)}
    : {width:100, height:100};
  dimensionCache.set(file, size);
  return size;
}

function embeddedSymbolDefs(){
  return Object.entries(symbolAssetFiles).map(([id, file]) => {
    const {width, height} = pngDimensions(file);
    return `<symbol id="${id}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet"><image href="${dataUri(file)}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"/></symbol>`;
  }).join("\n    ");
}

function cabinetImage(name, x, y, w, h, opacity = 1, fit = "xMidYMid meet"){
  return `<image href="${dataUri(cabinetAssets[name])}" x="${x}" y="${y}" width="${w}" height="${h}" opacity="${opacity}" preserveAspectRatio="${fit}"/>`;
}

function odds(value, digits = 1){
  return `1/${Number(value).toFixed(digits)}`;
}

function esc(value){
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function symbolSvg(symbol, x, y, w, h, options = {}){
  const asset = symbolAssets[symbol];
  const pad = options.pad ?? 4;
  if(asset){
    return `<use href="#${asset}" x="${x + pad}" y="${y + pad}" width="${w - pad * 2}" height="${h - pad * 2}"/>`;
  }
  return `<text x="${x + w / 2}" y="${y + h * 0.64}" text-anchor="middle" class="symbolText">${esc(symbol)}</text>`;
}

function rowLabel(row){
  const linePatterns = [
    [S.BAR,S.BAR,S.SEVEN],
    [S.SEVEN,S.BAR,S.SEVEN],
    [S.SEVEN,S.BAR,S.BAR],
    [S.BAR,S.SEVEN,S.SEVEN],
    [S.BAR,S.SEVEN,S.BAR],
    [S.PIERROT,S.SEVEN,S.PIERROT],
    [S.PIERROT,S.BAR,S.PIERROT]
  ];
  const hit = linePatterns.find(line => line.every((v, i) => v === row[i]));
  return hit ? hit.map(v => v === S.PIERROT ? "ピエロ" : v).join("-") : "";
}

function gridPaylineRows(grid){
  return [
    [grid[0]?.[0], grid[0]?.[1], grid[0]?.[2]],
    [grid[1]?.[0], grid[1]?.[1], grid[1]?.[2]],
    [grid[2]?.[0], grid[2]?.[1], grid[2]?.[2]],
    [grid[0]?.[0], grid[1]?.[1], grid[2]?.[2]],
    [grid[2]?.[0], grid[1]?.[1], grid[0]?.[2]]
  ];
}

function reachLabel(grid){
  for(const row of gridPaylineRows(grid)){
    const label = rowLabel(row);
    if(label) return label;
  }
  if(grid[1]?.[0] === S.CHERRY) return "中段チェリー";
  if(grid[0]?.[0] === S.CHERRY && grid[0]?.[1] !== S.CHERRY) return "上段チェリー・中チェリーなし";
  if(grid[2]?.[0] === S.CHERRY && grid[2]?.[1] !== S.CHERRY) return "下段チェリー・中チェリーなし";
  return "小役ハズレ型";
}

function write(file, content){
  fs.writeFileSync(path.join(root, file), content, "utf8");
}

function svgShell(width, height, body, options = {}){
  const showCabinet = options.showCabinet !== false;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#10121b"/>
      <stop offset="0.52" stop-color="#1e1420"/>
      <stop offset="1" stop-color="#2b230f"/>
    </linearGradient>
    <linearGradient id="cell" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fffdf4"/>
      <stop offset="1" stop-color="#e8edf8"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000" flood-opacity="0.28"/>
    </filter>
    ${embeddedSymbolDefs()}
    <style>
      .title{font:900 30px system-ui,'Yu Gothic',sans-serif;fill:#fff6cf}
      .sub{font:700 14px system-ui,'Yu Gothic',sans-serif;fill:#d7dcef}
      .head{font:900 15px system-ui,'Yu Gothic',sans-serif;fill:#ffe38a}
      .label{font:800 14px system-ui,'Yu Gothic',sans-serif;fill:#fff}
      .small{font:700 12px system-ui,'Yu Gothic',sans-serif;fill:#dbe2f6}
      .darkSmall{font:700 12px system-ui,'Yu Gothic',sans-serif;fill:#273247}
      .cellText{font:900 15px system-ui,'Yu Gothic',sans-serif;fill:#182035}
      .symbolText{font:900 24px system-ui,'Yu Gothic',sans-serif;fill:#182035}
      .note{font:700 12px system-ui,'Yu Gothic',sans-serif;fill:#f4d47e}
    </style>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  ${showCabinet ? cabinetImage("top", width - 360, 4, 330, 190, 0.22) : ""}
  ${showCabinet ? cabinetImage("lower", 18, height - 170, 300, 150, 0.13) : ""}
  ${showCabinet ? cabinetImage("controls", width - 300, height - 160, 270, 140, 0.15) : ""}
  ${body}
</svg>`;
}

function generateRoleSummary(){
  const width = 1180;
  const height = 500;
  const cards = [
    {name:"BB", line:[S.SEVEN,S.SEVEN,S.SEVEN], payout:`${payouts.big}pt`, note:"通常BIG"},
    {name:"RB", line:[S.SEVEN,S.SEVEN,S.BAR], payout:`${payouts.reg}pt`, note:"REG"},
    {name:"PBB", line:[S.BAR,S.BAR,S.BAR], payout:`${payouts.premiumTotal}pt`, note:"BIG当選時の3%。初回+1G連の2回1セット"},
    {name:"ブドウ", line:[S.GRAPE,S.GRAPE,S.GRAPE], payout:`${payouts.grape}pt`, note:"高設定ほど優遇"},
    {name:"リプレイ", line:[S.REPLAY,S.REPLAY,S.REPLAY], payout:`${payouts.replay}pt`, note:"通常小役"},
    {name:"ベル", line:[S.BELL,S.BELL,S.BELL], payout:`${payouts.bell}pt`, note:"奇数設定寄り"},
    {name:"ピエロ", line:[S.PIERROT,S.PIERROT,S.PIERROT], payout:`${payouts.pierrot}pt`, note:"偶数設定寄り"},
    {name:"チェリー", line:[S.CHERRY,"ANY","ANY"], payout:`${payouts.cherry}`, note:"同時当選あり"}
  ];
  const cardW = 260;
  const cardH = 148;
  const gapX = 22;
  const gapY = 22;
  const body = [
    `<text x="36" y="52" class="title">役構成</text>`,
    `<text x="36" y="78" class="sub">PBBはBIG当選時の3%。初回BAR揃い後に1G連の2回目PBBが付属。2回目からの連鎖はなし。</text>`
  ];
  cards.forEach((card, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = 36 + col * (cardW + gapX);
    const y = 112 + row * (cardH + gapY);
    body.push(`<g filter="url(#shadow)">`);
    body.push(`<rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="14" fill="#f8f3df" stroke="#c9a83f" stroke-width="2"/>`);
    body.push(`<text x="${x + 22}" y="${y + 36}" class="cellText">${esc(card.name)}</text>`);
    body.push(`<text x="${x + cardW - 22}" y="${y + 36}" text-anchor="end" class="cellText">${esc(card.payout)}</text>`);
    card.line.forEach((sym, idx) => {
      const cx = x + 22 + idx * 76;
      const cy = y + 56;
      body.push(`<rect x="${cx}" y="${cy}" width="64" height="64" rx="10" fill="url(#cell)" stroke="#9aa8c2"/>`);
      body.push(symbolSvg(sym, cx + 5, cy + 5, 54, 54, { pad: 0 }));
    });
    body.push(`<text x="${x + 22}" y="${y + 130}" class="darkSmall">${esc(card.note)}</text>`);
    body.push(`</g>`);
  });
  write("assets/guide/jackspot_role_summary.svg", svgShell(width, height, body.join("\n")));
}

function generateReelLayout(){
  const rowH = 42;
  const headerH = 96;
  const cellW = 98;
  const cellH = 36;
  const gap = 14;
  const x0 = 96;
  const width = 480;
  const height = headerH + 21 * rowH + 56;
  const body = [
    `<text x="34" y="48" class="title">リール配置図</text>`,
    `<text x="34" y="74" class="sub">左・中・右リール / 21コマ。上から21番、下が1番。</text>`,
    `<text x="${x0 + cellW / 2}" y="106" text-anchor="middle" class="head">左</text>`,
    `<text x="${x0 + cellW + gap + cellW / 2}" y="106" text-anchor="middle" class="head">中</text>`,
    `<text x="${x0 + (cellW + gap) * 2 + cellW / 2}" y="106" text-anchor="middle" class="head">右</text>`
  ];
  for(let i = 0; i < 21; i++){
    const y = headerH + i * rowH + 22;
    body.push(`<text x="58" y="${y + 25}" text-anchor="middle" class="small">${21 - i}</text>`);
    for(let r = 0; r < 3; r++){
      const x = x0 + r * (cellW + gap);
      body.push(`<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" rx="7" fill="url(#cell)" stroke="#aeb7ca"/>`);
      body.push(symbolSvg(reelStrips[r][i], x + 7, y + 3, cellW - 14, cellH - 6, { pad: 0 }));
    }
  }
  write("assets/guide/jackspot_reel_layout.svg", svgShell(width, height, body.join("\n"), { showCabinet:false }));
}

function generateChancePatterns(){
  const cardW = 312;
  const cardH = 218;
  const gapX = 24;
  const gapY = 22;
  const width = 36 * 2 + cardW * 2 + gapX;
  const height = 112 + cardH * 5 + gapY * 4 + 42;
  const body = [
    `<text x="36" y="50" class="title">チャンス目・リーチ目例</text>`,
    `<text x="36" y="78" class="sub">以下の形はボーナス濃厚パターンとして扱う図柄例。</text>`
  ];
  reachMeGridPatterns.forEach((grid, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 36 + col * (cardW + gapX);
    const y = 112 + row * (cardH + gapY);
    body.push(`<g filter="url(#shadow)">`);
    body.push(`<rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="14" fill="#f7f1df" stroke="#caa947" stroke-width="2"/>`);
    body.push(`<text x="${x + 16}" y="${y + 30}" class="cellText">No.${i + 1}</text>`);
    body.push(`<text x="${x + cardW - 16}" y="${y + 30}" text-anchor="end" class="cellText">${esc(reachLabel(grid))}</text>`);
    const slotW = 78;
    const slotH = 42;
    const reelGapX = 8;
    const reelGapY = 7;
    const gridW = slotW * 3 + reelGapX * 2;
    const gridH = slotH * 3 + reelGapY * 2;
    const gx = x + (cardW - gridW) / 2;
    const gy = y + 56;
    body.push(`<rect x="${gx - 10}" y="${gy - 10}" width="${gridW + 20}" height="${gridH + 20}" rx="10" fill="#111723" stroke="#2d3850" stroke-width="2"/>`);
    body.push(`<line x1="${gx + slotW + reelGapX / 2}" y1="${gy - 7}" x2="${gx + slotW + reelGapX / 2}" y2="${gy + gridH + 7}" stroke="#506078" stroke-width="2" stroke-opacity=".55"/>`);
    body.push(`<line x1="${gx + slotW * 2 + reelGapX * 1.5}" y1="${gy - 7}" x2="${gx + slotW * 2 + reelGapX * 1.5}" y2="${gy + gridH + 7}" stroke="#506078" stroke-width="2" stroke-opacity=".55"/>`);
    grid.forEach((line, rr) => {
      line.forEach((sym, cc) => {
        const sx = gx + cc * (slotW + reelGapX);
        const sy = gy + rr * (slotH + reelGapY);
        body.push(`<rect x="${sx}" y="${sy}" width="${slotW}" height="${slotH}" rx="8" fill="url(#cell)" stroke="#98a4bc"/>`);
        body.push(symbolSvg(sym, sx + 8, sy + 3, slotW - 16, slotH - 6, { pad: 0 }));
      });
    });
    body.push(`</g>`);
  });
  write("assets/guide/jackspot_chance_patterns.svg", svgShell(width, height, body.join("\n")));
}

function heatColor(value, values){
  const min = Math.min(...values);
  const max = Math.max(...values);
  const t = max === min ? 0.5 : (max - value) / (max - min);
  const r = Math.round(58 + t * 178);
  const g = Math.round(82 + t * 112);
  const b = Math.round(118 - t * 66);
  return `rgb(${r},${g},${b})`;
}

function generateSettingChart(){
  const rows = [
    {label:"BB", values:settings.map(s => bonus[s].big), digits:1},
    {label:"RB", values:settings.map(s => bonus[s].reg), digits:1},
    {label:"合算", values:settings.map(s => bonus[s].total), digits:1},
    {label:"ブドウ", values:settings.map(s => grape[s]), digits:2},
    {label:"ピエロ", values:settings.map(s => pierrot[s]), digits:0},
    {label:"ベル", values:settings.map(s => bell[s]), digits:0}
  ];
  const width = 980;
  const height = 560;
  const x0 = 170;
  const y0 = 118;
  const cellW = 120;
  const cellH = 58;
  const body = [
    `<text x="36" y="52" class="title">設定差ヒートマップ</text>`,
    `<text x="36" y="80" class="sub">色が明るいほど出現率が高い。ベルは奇数、ピエロは偶数が強い。</text>`
  ];
  settings.forEach((s, i) => {
    body.push(`<text x="${x0 + i * cellW + cellW / 2}" y="${y0 - 22}" text-anchor="middle" class="head">設定${s}</text>`);
  });
  rows.forEach((row, ri) => {
    const y = y0 + ri * cellH;
    body.push(`<text x="58" y="${y + 36}" class="label">${esc(row.label)}</text>`);
    row.values.forEach((value, ci) => {
      const x = x0 + ci * cellW;
      body.push(`<rect x="${x}" y="${y}" width="${cellW - 6}" height="${cellH - 8}" rx="8" fill="${heatColor(value, row.values)}" stroke="#f3d47a" stroke-opacity=".38"/>`);
      body.push(`<text x="${x + (cellW - 6) / 2}" y="${y + 33}" text-anchor="middle" class="label">${odds(value, row.digits)}</text>`);
    });
  });
  body.push(`<rect x="52" y="${height - 92}" width="${width - 104}" height="52" rx="12" fill="#141a25" stroke="#caa947"/>`);
  body.push(`<text x="72" y="${height - 60}" class="note">判別の軸: RB・合算で大枠、ブドウで高設定期待、ピエロで偶数寄り、ベルで奇数寄りを補強。</text>`);
  write("assets/guide/jackspot_setting_chart.svg", svgShell(width, height, body.join("\n")));
}

function generateJudgeSheet(){
  const width = 1180;
  const height = 740;
  const cardW = 342;
  const cardH = 132;
  const gapX = 28;
  const gapY = 22;
  const items = [
    {no:"1", title:"合算・RB", lines:["まずは大当たり合算とRBを確認。", "設定が上がるほど素直に軽くなる。"]},
    {no:"2", title:"ブドウ", lines:["高設定ほど出現率が良化。", "長時間ほど信頼度が上がる。"]},
    {no:"3", title:"ピエロ", lines:["偶数設定ほど出やすい。", "2/4/6寄りの補強材料。"]},
    {no:"4", title:"ベル", lines:["奇数設定ほど出やすい。", "1/3/5寄りの補強材料。"]},
    {no:"5", title:"チェリー同時", lines:["BIG/RB両方に同時当選あり。", "当選時は第三停止告知。"]},
    {no:"6", title:"設定示唆ボイス", lines:["ボーナス終了後に抽選。", "次GレバーONで再生。"]}
  ];
  const body = [
    `<text x="36" y="52" class="title">設定判別要素</text>`,
    `<text x="36" y="80" class="sub">数字で追う判別軸と、ボーナス後1G目に確認する設定示唆ボイス。</text>`
  ];
  items.forEach((item, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 36 + col * (cardW + gapX);
    const y = 112 + row * (cardH + gapY);
    body.push(`<g filter="url(#shadow)">`);
    body.push(`<rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="14" fill="#f7f1df" stroke="#caa947" stroke-width="2"/>`);
    body.push(`<circle cx="${x + 34}" cy="${y + 36}" r="20" fill="#172033" stroke="#d6b65a" stroke-width="2"/>`);
    body.push(`<text x="${x + 34}" y="${y + 43}" text-anchor="middle" class="head">${item.no}</text>`);
    body.push(`<text x="${x + 68}" y="${y + 38}" class="cellText">${esc(item.title)}</text>`);
    item.lines.forEach((line, li) => {
      body.push(`<text x="${x + 24}" y="${y + 76 + li * 24}" class="darkSmall">${esc(line)}</text>`);
    });
    body.push(`</g>`);
  });
  const vx = 70;
  const vy = 450;
  const rowH = 42;
  const widths = [130, 380, 190, 120, 180];
  const headers = ["示唆", "ボイス内容", "対象", "出現率", "再生"];
  body.push(`<text x="${vx}" y="${vy - 34}" class="title">設定示唆ボイス</text>`);
  body.push(`<rect x="${vx}" y="${vy - 16}" width="${width - vx * 2}" height="${rowH * 5 + 20}" rx="14" fill="#111723" stroke="#caa947" stroke-width="2"/>`);
  let x = vx + 18;
  headers.forEach((header, i) => {
    body.push(`<text x="${x}" y="${vy + 12}" class="head">${esc(header)}</text>`);
    x += widths[i];
  });
  settingVoiceInfo.forEach((voice, ri) => {
    const y = vy + 28 + ri * rowH;
    body.push(`<line x1="${vx + 14}" y1="${y - 8}" x2="${width - vx - 14}" y2="${y - 8}" stroke="#36425d" stroke-width="1"/>`);
    let cx = vx + 18;
    const values = [voice.hint, `「${voice.voice}」`, voice.condition, voice.rate, "次GレバーON"];
    values.forEach((value, ci) => {
      body.push(`<text x="${cx}" y="${y + 18}" class="small">${esc(value)}</text>`);
      cx += widths[ci];
    });
  });
  body.push(`<text x="${vx + 18}" y="${height - 38}" class="note">複数の示唆に同時当選した場合は、いちばん強い示唆ボイスを優先。</text>`);
  write("assets/guide/rising_judge_sheet.svg", svgShell(width, height, body.join("\n")));
}

function tableRowsForOdds(){
  return settings.map(s => `<tr>
    <th>設定${s}</th>
    <td>${odds(bonus[s].big, 1)}</td>
    <td>${odds(bonus[s].reg, 1)}</td>
    <td>${odds(bonus[s].total, 1)}</td>
    <td>${odds(bonus[s].big / pbbRateOnBig, 1)}</td>
    <td>${bonus[s].payout.toFixed(1)}%</td>
  </tr>`).join("\n");
}

function tableRowsForRoles(){
  return settings.map(s => `<tr>
    <th>設定${s}</th>
    <td>${odds(grape[s], 2)}</td>
    <td>${odds(replay[s], 2)}</td>
    <td>${odds(bell[s], 0)}</td>
    <td>${odds(pierrot[s], 0)}</td>
    <td>${odds(1 / (1 / bigDetail[s].cherry + 1 / regDetail[s].cherry), 1)}</td>
  </tr>`).join("\n");
}

function tableRowsForReg(){
  return settings.map(s => `<tr>
    <th>設定${s}</th>
    <td>${odds(bigDetail[s].solo, 1)}</td>
    <td>${odds(bigDetail[s].cherry, 1)}</td>
    <td>${odds(regDetail[s].solo, 1)}</td>
    <td>${odds(regDetail[s].cherry, 1)}</td>
  </tr>`).join("\n");
}

function tableRowsForSettingVoices(){
  return settingVoiceInfo.map(voice => `<tr>
    <th>${esc(voice.hint)}</th>
    <td>「${esc(voice.voice)}」</td>
    <td>${esc(voice.condition)}</td>
    <td>${esc(voice.rate)}</td>
    <td>ボーナス後1G目レバーON</td>
  </tr>`).join("\n");
}

function generateHtml(){
  const html = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>RISING! 攻略本</title>
  <style>
    :root{
      color-scheme:dark;
      --bg:#0d1018;
      --paper:#f7f0df;
      --ink:#141823;
      --muted:#647083;
      --gold:#d4aa41;
      --red:#b82837;
      --blue:#1e6fba;
      --green:#287a56;
    }
    *{box-sizing:border-box}
    body{margin:0;background:var(--bg);color:#f8f3df;font-family:"Yu Gothic",system-ui,sans-serif;line-height:1.65}
    .cover{
      min-height:72vh;
      padding:42px clamp(20px,5vw,70px);
      display:grid;
      align-content:end;
      background:
        linear-gradient(180deg,rgba(13,16,24,.15),rgba(13,16,24,.82)),
        url("assets/backgrounds/bg_rising_jackspot.png") center/cover no-repeat;
      border-bottom:5px solid var(--gold);
    }
    .logo{width:min(360px,72vw);filter:drop-shadow(0 12px 24px rgba(0,0,0,.45))}
    h1{font-size:clamp(38px,8vw,88px);line-height:1;margin:.2em 0 .12em;color:#fff5c7;text-shadow:0 5px 22px rgba(0,0,0,.55)}
    .lead{max-width:780px;font-weight:800;color:#f3e7c2}
    nav{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
    nav a{color:#111827;background:#f5d56e;text-decoration:none;font-weight:900;padding:9px 14px;border-radius:999px}
    main{max-width:1180px;margin:0 auto;padding:34px clamp(16px,3vw,34px) 80px}
    section{background:var(--paper);color:var(--ink);padding:26px;margin:0 0 28px;border:2px solid #d0b15b;box-shadow:0 14px 40px rgba(0,0,0,.28)}
    h2{font-size:clamp(24px,4vw,38px);line-height:1.2;margin:0 0 16px;color:#121722}
    h3{margin:24px 0 10px;color:#273247}
    p{margin:0 0 14px}
    .note{color:#5b6474;font-weight:700}
    .art{display:block;width:100%;height:auto;margin:16px 0 20px;border:1px solid #c8ad59;background:#111827}
    .wide{overflow:auto}
    table{width:100%;border-collapse:collapse;background:#fffaf0;margin:12px 0 20px}
    th,td{border:1px solid #d6c38a;padding:9px 10px;text-align:center;font-weight:800;white-space:nowrap}
    th{background:#242b3a;color:#fff2ba}
    td{color:#172033}
    .cols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
    .point{background:#111827;color:#f5ecd0;border-left:8px solid var(--gold);padding:16px}
    .point b{color:#ffe07c}
    .rank{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-top:12px}
    .rank div{background:#162033;color:#fff7d5;padding:12px;border-top:4px solid var(--gold);font-weight:900}
    .roleIcons{display:flex;gap:10px;align-items:center;justify-content:center}
    .roleIcons img{width:32px;height:32px;object-fit:contain}
    @media (max-width:760px){
      .cover{min-height:62vh}
      section{padding:18px}
      .cols,.rank{grid-template-columns:1fr}
      th,td{font-size:13px;padding:7px}
    }
    @media print{
      body{background:white;color:black}
      .cover{min-height:auto;color:black;break-after:page}
      section{box-shadow:none;break-inside:avoid}
      nav{display:none}
    }
  </style>
</head>
<body>
  <header class="cover">
    <img class="logo" src="assets/logo/rising_logo.svg" alt="RISING!">
    <h1>RISING! 攻略本</h1>
    <p class="lead">子役・大当たり確率、設定差、リール配列、チャンス目、設定判別要素を現行データから整理した実戦用ガイド。</p>
    <nav>
      <a href="#odds">確率</a>
      <a href="#setting">設定差</a>
      <a href="#reel">リール配置</a>
      <a href="#chance">チャンス目</a>
      <a href="#judge">設定判別</a>
    </nav>
  </header>
  <main>
    <section id="odds">
      <h2>① 子役・大当たり確率</h2>
      <img class="art" src="assets/guide/jackspot_role_summary.svg" alt="役構成">
      <div class="wide">
        <table>
          <thead><tr><th>設定</th><th>BB</th><th>RB</th><th>合算</th><th>PBB初当たり</th><th>機械割</th></tr></thead>
          <tbody>${tableRowsForOdds()}</tbody>
        </table>
      </div>
      <div class="wide">
        <table>
          <thead><tr><th>設定</th><th>ブドウ</th><th>リプレイ</th><th>ベル</th><th>ピエロ</th><th>チェリー同時ボーナス</th></tr></thead>
          <tbody>${tableRowsForRoles()}</tbody>
        </table>
      </div>
      <p class="note">払い出し: BB ${payouts.big}pt / RB ${payouts.reg}pt / PBBはBIG当選時の${Math.round(pbbRateOnBig * 100)}%。初回${payouts.premium}pt + 1G連${payouts.premium}pt。ブドウ${payouts.grape}pt、ベル${payouts.bell}pt、ピエロ${payouts.pierrot}pt、リプレイ${payouts.replay}pt、チェリー${payouts.cherry}。</p>
    </section>

    <section id="setting">
      <h2>② 設定差</h2>
      <img class="art" src="assets/guide/jackspot_setting_chart.svg" alt="設定差ヒートマップ">
      <div class="cols">
        <div class="point"><b>RB・合算</b><br>設定が上がるほど明確に軽くなる。特に設定1と6のRB差は大きい。</div>
        <div class="point"><b>ブドウ</b><br>高設定ほど良化。長く打つほど判別軸として効いてくる。</div>
        <div class="point"><b>ピエロ</b><br>偶数設定ほど出やすい。2/4/6の補強材料。</div>
        <div class="point"><b>ベル</b><br>奇数設定ほど出やすい。1/3/5寄りの材料。</div>
      </div>
      <h3>ボーナス内訳</h3>
      <div class="wide">
        <table>
          <thead><tr><th>設定</th><th>単独BIG</th><th>チェリーBIG</th><th>単独RB</th><th>チェリーRB</th></tr></thead>
          <tbody>${tableRowsForReg()}</tbody>
        </table>
      </div>
    </section>

    <section id="reel">
      <h2>③ リール配置図</h2>
      <p class="note">7/BAR/ブドウ/ベル/チェリー/リプレイはゲーム内図柄素材、ピエロは提供素材を使用。</p>
      <img class="art" src="assets/guide/jackspot_reel_layout.svg" alt="RISING!リール配置図">
    </section>

    <section id="chance">
      <h2>④ チャンス目図</h2>
      <p>BAR絡み・ピエロ挟み・チェリー特殊形をチャンス目例として掲載。出現時はボーナス濃厚の見せ方に使える。</p>
      <img class="art" src="assets/guide/jackspot_chance_patterns.svg" alt="RISING!チャンス目図">
    </section>

    <section id="judge">
      <h2>⑤ 設定判別要素</h2>
      <img class="art" src="assets/guide/rising_judge_sheet.svg" alt="RISING!設定判別要素">
      <div class="rank">
        <div>1. 合算とRBを最優先</div>
        <div>2. ブドウで高設定期待を補強</div>
        <div>3. ピエロ多発は偶数寄り</div>
        <div>4. ベル多発は奇数寄り</div>
        <div>5. 設定示唆ボイスを確認</div>
      </div>
      <h3>実戦メモ</h3>
      <p>設定5と6はRBがかなり近いので、BB確率・ブドウ・ピエロ・機械割の伸びを合わせて見る。設定4以上は合算が一段軽くなるため、短期ではRB、長期ではブドウと合算を重視。</p>
      <p>チェリー同時当選はBIG/RBどちらにも振り分けがあり、当選時は第三停止でランプが光る。チェリー契機のボーナスが見えたら、単独当選と分けてメモすると判別材料が増える。</p>
      <h3>設定示唆ボイス</h3>
      <p>ボーナス終了時に内部抽選し、当選した場合は次ゲームのレバーONで再生。複数の示唆に同時当選した場合は最上位のボイスを優先する。</p>
      <div class="wide">
        <table>
          <thead><tr><th>示唆</th><th>ボイス内容</th><th>対象設定</th><th>出現率</th><th>再生タイミング</th></tr></thead>
          <tbody>${tableRowsForSettingVoices()}</tbody>
        </table>
      </div>
      <p class="note">本攻略本は ${new Date().toLocaleDateString("ja-JP", { timeZone:"Asia/Tokyo" })} 時点のローカル実装データから生成。</p>
    </section>
  </main>
</body>
</html>`;
  write("jackspot_guide.html", html);
}

generateRoleSummary();
generateReelLayout();
generateChancePatterns();
generateSettingChart();
generateJudgeSheet();
generateHtml();

console.log("Generated jackspot_guide.html and assets/guide/*.svg");
