const fs = require("fs");
const path = require("path");

const logosDir = path.join(__dirname, "assets", "logos");
const outputFile = path.join(__dirname, "assets", "tech-stack.svg");

const logos = {
  python: "python.svg",
  java: "java.svg",
  javascript: "javascript.svg",
  typescript: "typescript.svg",
  react: "react.svg",
  flutter: "flutter.svg",
  nodejs: "nodejs.svg",
  mysql: "mysql.svg",
  git: "git.svg",
  github: "github.svg"
};

function loadLogo(filename) {
  const filePath = path.join(logosDir, filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing logo: ${filePath}`);
  }

  let svg = fs.readFileSync(filePath, "utf8");

  // Remove XML declaration
  svg = svg.replace(/<\?xml[\s\S]*?\?>/gi, "");

  // Remove DOCTYPE
  svg = svg.replace(/<!DOCTYPE[\s\S]*?>/gi, "");

  // Extract everything inside <svg>
  const match = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);

  if (!match) {
    throw new Error(`Invalid SVG: ${filename}`);
  }

  return match[1];
}

const embedded = {};

for (const [name, filename] of Object.entries(logos)) {
  embedded[name] = loadLogo(filename);
}

const svg = `<svg
  width="1584"
  height="720"
  viewBox="0 0 1584 720"
  xmlns="http://www.w3.org/2000/svg"
>

  <defs>

    <style>
      .title {
        font-family: "Space Grotesk", "Segoe UI", sans-serif;
        font-weight: 600;
        letter-spacing: 8px;
      }

      .meta {
        font-family: "Space Grotesk", "Segoe UI", sans-serif;
        font-weight: 400;
        letter-spacing: 4px;
      }

      .node-group {
        cursor: pointer;
      }

      .tooltip {
        opacity: 0;
        pointer-events: none;
      }

      .node-group:hover .tooltip {
        opacity: 1;
      }

      .node-group:hover .node-bg {
        stroke: #ffffff;
        stroke-width: 2px;
      }

      .tooltip-bg {
        fill: #1a1a1a;
        stroke: #444444;
        stroke-width: 1px;
      }

      .tooltip-text {
        font-family: "Space Grotesk", "Segoe UI", sans-serif;
        font-size: 11px;
        font-weight: 500;
        fill: #ffffff;
        letter-spacing: 1px;
      }

      .logo {
        pointer-events: none;
      }
    </style>

    <radialGradient id="centerGlow">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.08"/>
      <stop offset="65%" stop-color="#ffffff" stop-opacity="0.015"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

  </defs>


  <!-- BACKGROUND -->

  <rect
    width="1584"
    height="720"
    fill="#0d0d0d"
  />

  <ellipse
    cx="792"
    cy="365"
    rx="470"
    ry="300"
    fill="url(#centerGlow)"
  />


  <!-- HEADER -->

  <text
    x="792"
    y="82"
    text-anchor="middle"
    fill="#ffffff"
    font-size="28"
    class="title">
    TECH STACK
  </text>

  <text
    x="792"
    y="112"
    text-anchor="middle"
    fill="#888888"
    font-size="10"
    class="meta">
    LANGUAGES  /  FRAMEWORKS  /  TOOLS
  </text>

  <line
    x1="570"
    y1="138"
    x2="1014"
    y2="138"
    stroke="#333333"
    stroke-width="1"
  />

  <line
    x1="745"
    y1="138"
    x2="839"
    y2="138"
    stroke="#ffffff"
    stroke-width="2">

    <animate
      attributeName="x1"
      values="745;770;745"
      dur="5s"
      repeatCount="indefinite"
    />

    <animate
      attributeName="x2"
      values="839;814;839"
      dur="5s"
      repeatCount="indefinite"
    />

  </line>


  <!-- CONNECTIONS -->

  <g
    fill="none"
    stroke="#333333"
    stroke-width="1">

    <path d="M792 360 L560 225 L420 270"/>
    <path d="M792 360 L1024 225 L1164 270"/>
    <path d="M792 360 L470 390"/>
    <path d="M792 360 L1114 390"/>
    <path d="M792 360 L590 520 L450 565"/>
    <path d="M792 360 L994 520 L1134 565"/>

  </g>


  <!-- SECONDARY CONNECTIONS -->

  <g
    fill="none"
    stroke="#222222"
    stroke-width="1">

    <path d="M420 270 L300 185"/>
    <path d="M1164 270 L1284 185"/>
    <path d="M450 565 L330 620"/>
    <path d="M1134 565 L1254 620"/>

  </g>


  <!-- ANIMATED PARTICLES -->

  <g fill="#ffffff">

    <circle r="2.5">
      <animateMotion
        path="M792 360 L560 225 L420 270"
        dur="5s"
        repeatCount="indefinite"
      />
    </circle>

    <circle r="2.5">
      <animateMotion
        path="M792 360 L1024 225 L1164 270"
        dur="5.8s"
        repeatCount="indefinite"
      />
    </circle>

    <circle r="2.5">
      <animateMotion
        path="M792 360 L470 390"
        dur="4s"
        repeatCount="indefinite"
      />
    </circle>

    <circle r="2.5">
      <animateMotion
        path="M792 360 L1114 390"
        dur="4.5s"
        repeatCount="indefinite"
      />
    </circle>

    <circle r="2.5">
      <animateMotion
        path="M792 360 L590 520 L450 565"
        dur="6s"
        repeatCount="indefinite"
      />
    </circle>

    <circle r="2.5">
      <animateMotion
        path="M792 360 L994 520 L1134 565"
        dur="6.4s"
        repeatCount="indefinite"
      />
    </circle>

  </g>


  <!-- CENTER -->

  <circle
    cx="792"
    cy="360"
    r="76"
    fill="#141414"
    stroke="#ffffff"
    stroke-width="1"
  />

  <circle
    cx="792"
    cy="360"
    r="66"
    fill="none"
    stroke="#2e2e2e"
    stroke-width="1"
  />

  <circle
    cx="792"
    cy="360"
    r="7"
    fill="#ffffff">

    <animate
      attributeName="r"
      values="5;8;5"
      dur="3s"
      repeatCount="indefinite"
    />

  </circle>

  <text
    x="792"
    y="348"
    text-anchor="middle"
    fill="#ffffff"
    font-size="11"
    class="meta">
    MAY_01
  </text>


  <!-- PYTHON -->

  <g
    transform="translate(390 240)"
    class="node-group">

    <animateTransform
      attributeName="transform"
      type="translate"
      values="390 240;390 234;390 240"
      dur="5s"
      repeatCount="indefinite"
    />

    <circle
      r="34"
      fill="#141414"
      stroke="#333333"
      class="node-bg"
    />

    <svg
      x="-18"
      y="-18"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      class="logo">
      ${embedded.python}
    </svg>

    <g
      class="tooltip"
      transform="translate(0 -48)">

      <rect
        x="-40"
        y="-14"
        width="80"
        height="22"
        class="tooltip-bg"
      />

      <text
        x="0"
        y="1"
        text-anchor="middle"
        class="tooltip-text">
        Python
      </text>

    </g>

  </g>


  <!-- JAVA -->

  <g
    transform="translate(525 190)"
    class="node-group">

    <animateTransform
      attributeName="transform"
      type="translate"
      values="525 190;525 196;525 190"
      dur="6s"
      repeatCount="indefinite"
    />

    <circle
      r="34"
      fill="#141414"
      stroke="#333333"
      class="node-bg"
    />

    <svg
      x="-18"
      y="-18"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      class="logo">
      ${embedded.java}
    </svg>

    <g
      class="tooltip"
      transform="translate(0 -48)">

      <rect
        x="-35"
        y="-14"
        width="70"
        height="22"
        class="tooltip-bg"
      />

      <text
        x="0"
        y="1"
        text-anchor="middle"
        class="tooltip-text">
        Java
      </text>

    </g>

  </g>


  <!-- JAVASCRIPT -->

  <g
    transform="translate(1194 240)"
    class="node-group">

    <animateTransform
      attributeName="transform"
      type="translate"
      values="1194 240;1194 246;1194 240"
      dur="5.5s"
      repeatCount="indefinite"
    />

    <circle
      r="34"
      fill="#141414"
      stroke="#333333"
      class="node-bg"
    />

    <svg
      x="-18"
      y="-18"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      class="logo">
      ${embedded.javascript}
    </svg>

    <g
      class="tooltip"
      transform="translate(0 -48)">

      <rect
        x="-50"
        y="-14"
        width="100"
        height="22"
        class="tooltip-bg"
      />

      <text
        x="0"
        y="1"
        text-anchor="middle"
        class="tooltip-text">
        JavaScript
      </text>

    </g>

  </g>


  <!-- TYPESCRIPT -->

  <g
    transform="translate(1059 190)"
    class="node-group">

    <animateTransform
      attributeName="transform"
      type="translate"
      values="1059 190;1059 184;1059 190"
      dur="6.5s"
      repeatCount="indefinite"
    />

    <circle
      r="34"
      fill="#141414"
      stroke="#333333"
      class="node-bg"
    />

    <svg
      x="-18"
      y="-18"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      class="logo">
      ${embedded.typescript}
    </svg>

    <g
      class="tooltip"
      transform="translate(0 -48)">

      <rect
        x="-50"
        y="-14"
        width="100"
        height="22"
        class="tooltip-bg"
      />

      <text
        x="0"
        y="1"
        text-anchor="middle"
        class="tooltip-text">
        TypeScript
      </text>

    </g>

  </g>


  <!-- REACT -->

  <g
    transform="translate(430 390)"
    class="node-group">

    <circle
      r="34"
      fill="#141414"
      stroke="#333333"
      class="node-bg"
    />

    <svg
      x="-18"
      y="-18"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      class="logo">
      ${embedded.react}
    </svg>

    <g
      class="tooltip"
      transform="translate(0 -48)">

      <rect
        x="-35"
        y="-14"
        width="70"
        height="22"
        class="tooltip-bg"
      />

      <text
        x="0"
        y="1"
        text-anchor="middle"
        class="tooltip-text">
        React
      </text>

    </g>

  </g>


  <!-- FLUTTER -->

  <g
    transform="translate(1154 390)"
    class="node-group">

    <circle
      r="34"
      fill="#141414"
      stroke="#333333"
      class="node-bg"
    />

    <svg
      x="-18"
      y="-18"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      class="logo">
      ${embedded.flutter}
    </svg>

    <g
      class="tooltip"
      transform="translate(0 -48)">

      <rect
        x="-40"
        y="-14"
        width="80"
        height="22"
        class="tooltip-bg"
      />

      <text
        x="0"
        y="1"
        text-anchor="middle"
        class="tooltip-text">
        Flutter
      </text>

    </g>

  </g>


  <!-- NODE.JS -->

  <g
    transform="translate(410 585)"
    class="node-group">

    <circle
      r="34"
      fill="#141414"
      stroke="#333333"
      class="node-bg"
    />

    <svg
      x="-18"
      y="-18"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      class="logo">
      ${embedded.nodejs}
    </svg>

    <g
      class="tooltip"
      transform="translate(0 -48)">

      <rect
        x="-45"
        y="-14"
        width="90"
        height="22"
        class="tooltip-bg"
      />

      <text
        x="0"
        y="1"
        text-anchor="middle"
        class="tooltip-text">
        Node.js
      </text>

    </g>

  </g>


  <!-- MYSQL -->

  <g
    transform="translate(1174 585)"
    class="node-group">

    <circle
      r="34"
      fill="#141414"
      stroke="#333333"
      class="node-bg"
    />

    <svg
      x="-18"
      y="-18"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      class="logo">
      ${embedded.mysql}
    </svg>

    <g
      class="tooltip"
      transform="translate(0 -48)">

      <rect
        x="-40"
        y="-14"
        width="80"
        height="22"
        class="tooltip-bg"
      />

      <text
        x="0"
        y="1"
        text-anchor="middle"
        class="tooltip-text">
        MySQL
      </text>

    </g>

  </g>


  <!-- GIT -->

  <g
    transform="translate(575 515)"
    class="node-group">

    <circle
      r="34"
      fill="#141414"
      stroke="#333333"
      class="node-bg"
    />

    <svg
      x="-18"
      y="-18"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      class="logo">
      ${embedded.git}
    </svg>

    <g
      class="tooltip"
      transform="translate(0 -48)">

      <rect
        x="-30"
        y="-14"
        width="60"
        height="22"
        class="tooltip-bg"
      />

      <text
        x="0"
        y="1"
        text-anchor="middle"
        class="tooltip-text">
        Git
      </text>

    </g>

  </g>


  <!-- GITHUB -->

  <g
    transform="translate(1009 515)"
    class="node-group">

    <circle
      r="34"
      fill="#141414"
      stroke="#333333"
      class="node-bg"
    />

    <svg
      x="-18"
      y="-18"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      class="logo">
      ${embedded.github}
    </svg>

    <g
      class="tooltip"
      transform="translate(0 -48)">

      <rect
        x="-40"
        y="-14"
        width="80"
        height="22"
        class="tooltip-bg"
      />

      <text
        x="0"
        y="1"
        text-anchor="middle"
        class="tooltip-text">
        GitHub
      </text>

    </g>

  </g>


  <!-- OUTER POINTS -->

  <g fill="#ffffff">

    <circle cx="300" cy="185" r="2"/>
    <circle cx="1284" cy="185" r="2"/>
    <circle cx="330" cy="620" r="2"/>
    <circle cx="1254" cy="620" r="2"/>

  </g>


  <!-- FOOTER -->

  <text
    x="80"
    y="665"
    fill="#666666"
    font-size="9"
    class="meta">
    01 — DEVELOPMENT
  </text>

  <text
    x="1504"
    y="665"
    text-anchor="end"
    fill="#666666"
    font-size="9"
    class="meta">
    2026
  </text>

  <line
    x1="80"
    y1="685"
    x2="1504"
    y2="685"
    stroke="#222222"
    stroke-width="1"
  />

</svg>`;

fs.writeFileSync(outputFile, svg, "utf8");

console.log("✓ tech-stack.svg generated successfully!");
console.log(`✓ Output: ${outputFile}`);
