const fs = require("fs");
const path = require("path");

const dataPath = path.join(
  __dirname,
  "..",
  "data",
  "contributions.json"
);

const outputPath = path.join(
  __dirname,
  "..",
  "assets",
  "contributions.svg"
);

const data = JSON.parse(
  fs.readFileSync(dataPath, "utf8")
);

const contributions = data.contributions;

/*
 * ---------------------------------------------------------
 * CONFIGURATION
 * ---------------------------------------------------------
 */

const WIDTH = 1584;
const HEIGHT = 520;

const LEFT = 90;
const TOP = 100;

const CELL = 14;
const GAP = 4;

const STEP = CELL + GAP;

const ROWS = 7;
const WEEKS = 53;

const GRID_WIDTH =
  WEEKS * STEP - GAP;

const GRID_HEIGHT =
  ROWS * STEP - GAP;

/*
 * GitHub-style contribution levels.
 *
 * Mostly monochrome, with restrained red accents.
 */

const LEVELS = [
  "#161616",
  "#343434",
  "#666666",
  "#A6A6A6",
  "#E63946"
];

/*
 * ---------------------------------------------------------
 * BUILD DATE MAP
 * ---------------------------------------------------------
 */

const contributionMap = new Map();

for (const item of contributions) {
  contributionMap.set(
    item.date,
    item.level
  );
}

/*
 * ---------------------------------------------------------
 * DATE HELPERS
 * ---------------------------------------------------------
 */

function parseDate(dateString) {
  const [year, month, day] =
    dateString.split("-").map(Number);

  return new Date(
    Date.UTC(year, month - 1, day)
  );
}

function formatMonth(date) {
  return date.toLocaleString(
    "en-US",
    {
      month: "short",
      timeZone: "UTC"
    }
  );
}

/*
 * ---------------------------------------------------------
 * DETERMINE FIRST SUNDAY
 * ---------------------------------------------------------
 */

const firstDate =
  parseDate(contributions[0].date);

const firstSunday =
  new Date(firstDate);

firstSunday.setUTCDate(
  firstSunday.getUTCDate() -
  firstSunday.getUTCDay()
);

/*
 * ---------------------------------------------------------
 * SVG
 * ---------------------------------------------------------
 */

let svg = `
<svg
  width="${WIDTH}"
  height="${HEIGHT}"
  viewBox="0 0 ${WIDTH} ${HEIGHT}"
  xmlns="http://www.w3.org/2000/svg"
>

  <defs>

    <style>

      .title {
        font-family:
          "Space Grotesk",
          "Segoe UI",
          Arial,
          sans-serif;

        font-size: 22px;
        font-weight: 600;
        letter-spacing: 0.4px;

        fill: #111111;
      }

      .subtitle {
        font-family:
          "Space Grotesk",
          "Segoe UI",
          Arial,
          sans-serif;

        font-size: 12px;
        letter-spacing: 0.8px;

        fill: #777777;
      }

      .month {
        font-family:
          "Space Grotesk",
          "Segoe UI",
          Arial,
          sans-serif;

        font-size: 11px;
        fill: #777777;
      }

      .weekday {
        font-family:
          "Space Grotesk",
          "Segoe UI",
          Arial,
          sans-serif;

        font-size: 10px;
        fill: #888888;
      }

      .cell {
        shape-rendering: geometricPrecision;
      }

    </style>

  </defs>

  <!-- Background -->
  <rect
    x="0"
    y="0"
    width="${WIDTH}"
    height="${HEIGHT}"
    fill="#FFFFFF"
  />

  <!-- Header -->

  <text
    x="${LEFT}"
    y="45"
    class="title"
  >
    GitHub Contributions
  </text>

  <text
    x="${LEFT}"
    y="68"
    class="subtitle"
  >
    ${data.username.toUpperCase()} · LAST 365 DAYS
  </text>

`;

/*
 * ---------------------------------------------------------
 * WEEKDAY LABELS
 * ---------------------------------------------------------
 */

const weekdayLabels = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat"
];

for (let row = 0; row < ROWS; row++) {

  /*
   * Only show every other weekday label,
   * similar to GitHub's compact presentation.
   */

  if (
    row === 1 ||
    row === 3 ||
    row === 5
  ) {

    svg += `
      <text
        x="${LEFT - 38}"
        y="${TOP + row * STEP + 11}"
        class="weekday"
      >
        ${weekdayLabels[row]}
      </text>
    `;
  }
}

/*
 * ---------------------------------------------------------
 * MONTH LABELS
 * ---------------------------------------------------------
 */

let previousMonth = "";

for (let week = 0; week < WEEKS; week++) {

  const date = new Date(firstSunday);

  date.setUTCDate(
    date.getUTCDate() + week * 7
  );

  const month =
    formatMonth(date);

  /*
   * Only draw a label when the month changes.
   */

  if (month !== previousMonth) {

    svg += `
      <text
        x="${LEFT + week * STEP}"
        y="${TOP - 18}"
        class="month"
      >
        ${month}
      </text>
    `;

    previousMonth = month;
  }
}

/*
 * ---------------------------------------------------------
 * CONTRIBUTION CELLS
 * ---------------------------------------------------------
 */

for (let week = 0; week < WEEKS; week++) {

  for (let row = 0; row < ROWS; row++) {

    const date = new Date(firstSunday);

    date.setUTCDate(
      date.getUTCDate() +
      week * 7 +
      row
    );

    const year =
      date.getUTCFullYear();

    const month =
      String(
        date.getUTCMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        date.getUTCDate()
      ).padStart(2, "0");

    const dateString =
      `${year}-${month}-${day}`;

    /*
     * Ignore cells outside our 365-day dataset.
     */

    const level =
      contributionMap.has(dateString)
        ? contributionMap.get(dateString)
        : 0;

    const x =
      LEFT + week * STEP;

    const y =
      TOP + row * STEP;

    svg += `
      <rect
        class="cell"
        x="${x}"
        y="${y}"
        width="${CELL}"
        height="${CELL}"
        rx="3"
        fill="${LEVELS[level]}"
      >
        <title>
          ${dateString}: contribution level ${level}
        </title>
      </rect>
    `;
  }
}

/*
 * ---------------------------------------------------------
 * LEGEND
 * ---------------------------------------------------------
 */

const legendY =
  TOP + GRID_HEIGHT + 38;

svg += `
  <text
    x="${LEFT}"
    y="${legendY}"
    class="subtitle"
  >
    LESS
  </text>
`;

for (let level = 0; level <= 4; level++) {

  const x =
    LEFT +
    42 +
    level * 21;

  svg += `
    <rect
      x="${x}"
      y="${legendY - 10}"
      width="14"
      height="14"
      rx="3"
      fill="${LEVELS[level]}"
    />
  `;
}

svg += `
  <text
    x="${LEFT + 42 + 5 * 21 + 5}"
    y="${legendY}"
    class="subtitle"
  >
    MORE
  </text>
`;

/*
 * ---------------------------------------------------------
 * FOOTER
 * ---------------------------------------------------------
 */

svg += `
  <text
    x="${WIDTH - 90}"
    y="${legendY}"
    text-anchor="end"
    class="subtitle"
  >
    ${contributions.length} DAYS
  </text>
`;

svg += `
</svg>
`;

/*
 * ---------------------------------------------------------
 * SAVE
 * ---------------------------------------------------------
 */

fs.writeFileSync(
  outputPath,
  svg.trim()
);

console.log(
  `Contribution SVG generated: ${outputPath}`
);
