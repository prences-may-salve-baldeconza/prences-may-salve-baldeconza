const fs = require("fs");
const path = require("path");

/*
 * =========================================================
 * FILES
 * =========================================================
 */

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
 * =========================================================
 * CANVAS
 * =========================================================
 */

const WIDTH = 1584;
const HEIGHT = 396;


/*
 * =========================================================
 * GITHUB-STYLE GRID
 * =========================================================
 */

const LEFT = 150;
const TOP = 116;

const CELL = 12;
const GAP = 4;
const STEP = CELL + GAP;

const ROWS = 7;
const WEEKS = 53;

const GRID_WIDTH =
  WEEKS * STEP - GAP;

const GRID_HEIGHT =
  ROWS * STEP - GAP;


/*
 * =========================================================
 * COLORS
 *
 * Level 0 = almost white
 * Level 1 = light gray
 * Level 2 = medium gray
 * Level 3 = dark charcoal
 * Level 4 = restrained red
 *
 * MORE CONTRIBUTIONS = DARKER
 * Level 4 = RED SIGNAL
 * =========================================================
 */

const LEVELS = [
  "#F0F0F0",
  "#D2D2D2",
  "#929292",
  "#3F3F3F",
  "#C62828"
];


/*
 * =========================================================
 * CONTRIBUTION MAP
 * =========================================================
 */

const contributionMap = new Map();

for (const item of contributions) {
  contributionMap.set(
    item.date,
    item.level
  );
}


/*
 * =========================================================
 * DATE HELPERS
 * =========================================================
 */

function parseDate(dateString) {

  const [year, month, day] =
    dateString.split("-").map(Number);

  return new Date(
    Date.UTC(
      year,
      month - 1,
      day
    )
  );
}


function dateKey(date) {

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

  return `${year}-${month}-${day}`;
}


function monthName(date) {

  return date.toLocaleString(
    "en-US",
    {
      month: "short",
      timeZone: "UTC"
    }
  );
}


/*
 * =========================================================
 * DATE RANGE
 * =========================================================
 */

const firstDate =
  parseDate(contributions[0].date);

const lastDate =
  parseDate(
    contributions[
      contributions.length - 1
    ].date
  );


/*
 * Move backward to Sunday.
 *
 * GitHub's contribution calendar is organized
 * vertically by weekday and horizontally by week.
 */

const calendarStart =
  new Date(firstDate);

calendarStart.setUTCDate(
  calendarStart.getUTCDate() -
  calendarStart.getUTCDay()
);


/*
 * =========================================================
 * SVG START
 * =========================================================
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

        font-size: 20px;
        font-weight: 600;

        fill: #111111;
      }

      .count {
        font-family:
          "Space Grotesk",
          "Segoe UI",
          Arial,
          sans-serif;

        font-size: 13px;

        fill: #666666;
      }

      .month {
        font-family:
          "Space Grotesk",
          "Segoe UI",
          Arial,
          sans-serif;

        font-size: 11px;

        fill: #666666;
      }

      .weekday {
        font-family:
          "Space Grotesk",
          "Segoe UI",
          Arial,
          sans-serif;

        font-size: 10px;

        fill: #777777;
      }

      .year {
        font-family:
          "Space Grotesk",
          "Segoe UI",
          Arial,
          sans-serif;

        font-size: 12px;
        font-weight: 600;
      }

      .legend {
        font-family:
          "Space Grotesk",
          "Segoe UI",
          Arial,
          sans-serif;

        font-size: 10px;

        fill: #777777;
      }

      .cell {
        shape-rendering:
          geometricPrecision;
      }

    </style>

  </defs>


  <!-- =====================================================
       BACKGROUND
  ====================================================== -->

  <rect
    width="${WIDTH}"
    height="${HEIGHT}"
    fill="#FFFFFF"
  />


  <!-- =====================================================
       HEADER
  ====================================================== -->

  <text
    x="${LEFT}"
    y="38"
    class="title"
  >
    Contributions
  </text>


  <text
    x="${LEFT + 165}"
    y="38"
    class="count"
  >
    ${contributions.length} contributions in the last year
  </text>


  <!-- =====================================================
       YEAR SELECTOR
  ====================================================== -->

  <g transform="translate(${WIDTH - 270}, 18)">

    <!-- 2025 -->

    <rect
      x="0"
      y="0"
      width="72"
      height="30"
      rx="6"
      fill="#F3F3F3"
      stroke="#D8D8D8"
    />

    <text
      x="36"
      y="19"
      text-anchor="middle"
      class="year"
      fill="#666666"
    >
      2025
    </text>


    <!-- 2026 ACTIVE -->

    <rect
      x="78"
      y="0"
      width="72"
      height="30"
      rx="6"
      fill="#111111"
    />

    <text
      x="114"
      y="19"
      text-anchor="middle"
      class="year"
      fill="#FFFFFF"
    >
      2026
    </text>

  </g>


  <!-- =====================================================
       WEEKDAY LABELS
  ====================================================== -->

  <text
    x="${LEFT - 42}"
    y="${TOP + STEP + 9}"
    class="weekday"
  >
    Mon
  </text>

  <text
    x="${LEFT - 42}"
    y="${TOP + STEP * 3 + 9}"
    class="weekday"
  >
    Wed
  </text>

  <text
    x="${LEFT - 42}"
    y="${TOP + STEP * 5 + 9}"
    class="weekday"
  >
    Fri
  </text>
`;


/*
 * =========================================================
 * MONTH LABELS
 *
 * Only show a month when a new month begins inside
 * a new calendar column.
 * =========================================================
 */

let previousMonth = "";

for (
  let week = 0;
  week < WEEKS;
  week++
) {

  const weekDate =
    new Date(calendarStart);

  weekDate.setUTCDate(
    weekDate.getUTCDate() +
    week * 7
  );

  const month =
    monthName(weekDate);

  if (month !== previousMonth) {

    svg += `
      <text
        x="${LEFT + week * STEP}"
        y="${TOP - 16}"
        class="month"
      >
        ${month}
      </text>
    `;

    previousMonth = month;
  }
}


/*
 * =========================================================
 * CONTRIBUTION GRID
 * =========================================================
 */

for (
  let week = 0;
  week < WEEKS;
  week++
) {

  for (
    let row = 0;
    row < ROWS;
    row++
  ) {

    const date =
      new Date(calendarStart);

    date.setUTCDate(
      date.getUTCDate() +
      week * 7 +
      row
    );

    const key =
      dateKey(date);

    /*
     * Only render dates that actually belong
     * to our 365-day dataset.
     */

    const exists =
      contributionMap.has(key);

    const level =
      exists
        ? contributionMap.get(key)
        : 0;

    const x =
      LEFT +
      week * STEP;

    const y =
      TOP +
      row * STEP;

    /*
     * Dates outside the real dataset remain invisible.
     */

    if (!exists) {

      svg += `
        <rect
          class="cell"
          x="${x}"
          y="${y}"
          width="${CELL}"
          height="${CELL}"
          rx="2"
          fill="transparent"
        />
      `;

      continue;
    }


    svg += `
      <rect
        class="cell"
        x="${x}"
        y="${y}"
        width="${CELL}"
        height="${CELL}"
        rx="2"
        fill="${LEVELS[level]}"
      >
        <title>
          ${key} — contribution level ${level}
        </title>
      </rect>
    `;
  }
}


/*
 * =========================================================
 * LEGEND
 * =========================================================
 */

const legendY =
  TOP + GRID_HEIGHT + 32;

const legendX =
  WIDTH - 300;


svg += `

  <text
    x="${legendX}"
    y="${legendY}"
    class="legend"
  >
    Less
  </text>

`;


for (
  let level = 0;
  level <= 4;
  level++
) {

  const x =
    legendX +
    34 +
    level * 20;

  svg += `
    <rect
      x="${x}"
      y="${legendY - 10}"
      width="${CELL}"
      height="${CELL}"
      rx="2"
      fill="${LEVELS[level]}"
    />
  `;
}


svg += `

  <text
    x="${legendX + 34 + 5 * 20}"
    y="${legendY}"
    class="legend"
  >
    More
  </text>

`;


/*
 * =========================================================
 * FOOTER LABEL
 * =========================================================
 */

svg += `

  <text
    x="${LEFT}"
    y="${legendY}"
    class="legend"
  >
    ${data.username}
  </text>

`;


/*
 * =========================================================
 * END SVG
 * =========================================================
 */

svg += `
</svg>
`;


/*
 * =========================================================
 * WRITE FILE
 * =========================================================
 */

fs.writeFileSync(
  outputPath,
  svg.trim()
);

console.log(
  `Contribution SVG generated: ${outputPath}`
);
