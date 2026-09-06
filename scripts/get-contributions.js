const https = require("https");
const fs = require("fs");
const path = require("path");

const username = "prences-may-salve-baldeconza";
const url = `https://github.com/users/${username}/contributions`;

https.get(
  url,
  {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  },
  (response) => {

    let html = "";

    response.on("data", (chunk) => {
      html += chunk;
    });

    response.on("end", () => {

      console.log(`GitHub response: HTTP ${response.statusCode}`);
      console.log(`Downloaded HTML: ${html.length} characters`);

      if (response.statusCode !== 200) {
        console.error("GitHub did not return the contribution page.");
        return;
      }

      /*
       * GitHub contribution cells contain:
       *
       * data-date="YYYY-MM-DD"
       * data-level="0-4"
       *
       * We inspect EVERY HTML tag individually so that
       * we don't accidentally capture only the first day
       * of each week.
       */

      const tagRegex = /<[^>]+>/g;

      const contributions = [];

      let match;

      while ((match = tagRegex.exec(html)) !== null) {

        const tag = match[0];

        if (
          tag.includes("data-date=") &&
          tag.includes("data-level=")
        ) {

          const dateMatch =
            tag.match(/data-date="([^"]+)"/);

          const levelMatch =
            tag.match(/data-level="([^"]+)"/);

          if (dateMatch && levelMatch) {

            contributions.push({
              date: dateMatch[1],
              level: Number(levelMatch[1])
            });

          }
        }
      }

      /*
       * Remove duplicate dates.
       */

      const unique = new Map();

      for (const contribution of contributions) {
        unique.set(
          contribution.date,
          contribution
        );
      }

      /*
       * Sort chronologically.
       */

      const cleaned = Array.from(
        unique.values()
      ).sort((a, b) =>
        a.date.localeCompare(b.date)
      );

      console.log(
        `Found ${cleaned.length} unique contribution days.`
      );

      /*
       * Safety check.
       *
       * A normal GitHub contribution calendar should
       * contain roughly one year of daily cells.
       */

      if (cleaned.length < 300) {

        console.error("");
        console.error(
          "ERROR: GitHub contribution data was not parsed correctly."
        );

        console.error(
          "Only " +
          cleaned.length +
          " days were detected."
        );

        console.error("");
        console.error(
          "The SVG will NOT be generated yet."
        );

        return;
      }

      /*
       * Check whether dates are actually daily.
       */

      let consecutivePairs = 0;

      for (let i = 1; i < cleaned.length; i++) {

        const previous =
          new Date(cleaned[i - 1].date);

        const current =
          new Date(cleaned[i].date);

        const difference =
          (current - previous) /
          (1000 * 60 * 60 * 24);

        if (difference === 1) {
          consecutivePairs++;
        }
      }

      console.log(
        `Consecutive daily pairs: ${consecutivePairs}`
      );

      /*
       * Save the data.
       */

      const output = {
        username,
        updated: new Date().toISOString(),
        contributions: cleaned
      };

      const outputPath = path.join(
        __dirname,
        "..",
        "data",
        "contributions.json"
      );

      fs.writeFileSync(
        outputPath,
        JSON.stringify(output, null, 2)
      );

      console.log("");
      console.log("SUCCESS");
      console.log(
        `Saved ${cleaned.length} contribution days.`
      );

      console.log(
        `Saved to: ${outputPath}`
      );

      console.log("");
      console.log("First 10 days:");

      console.log(
        cleaned.slice(0, 10)
      );

      console.log("");
      console.log("Last 10 days:");

      console.log(
        cleaned.slice(-10)
      );
    });

  }
).on("error", (error) => {

  console.error(
    "Unable to connect to GitHub:"
  );

  console.error(
    error.message
  );

});
