const https = require("https");
const fs = require("fs");
const path = require("path");

const username = "prences-may-salve-baldeconza";

const url =
  `https://github.com/users/${username}/contributions`;

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

      console.log(
        `GitHub response: HTTP ${response.statusCode}`
      );

      console.log(
        `Downloaded HTML: ${html.length} characters`
      );

      if (response.statusCode !== 200) {
        console.error(
          "GitHub did not return the contribution page."
        );
        return;
      }

      /*
       * Look at every HTML tag.
       *
       * We don't assume that contribution cells
       * are <td> elements.
       */

      const tagRegex = /<[^>]+>/g;

      const contributions = [];

      let match;

      while ((match = tagRegex.exec(html)) !== null) {

        const tag = match[0];

        /*
         * Only process tags containing both attributes.
         */

        if (
          tag.includes("data-date=") &&
          tag.includes("data-level=")
        ) {

          const dateMatch =
            tag.match(/data-date="([^"]+)"/);

          const levelMatch =
            tag.match(/data-level="([^"]+)"/);

          if (dateMatch && levelMatch) {

            const date = dateMatch[1];
            const level = Number(levelMatch[1]);

            /*
             * Validate the values before saving them.
             */

            if (
              /^\d{4}-\d{2}-\d{2}$/.test(date) &&
              level >= 0 &&
              level <= 4
            ) {

              contributions.push({
                date,
                level
              });

            }
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

      const cleaned =
        Array.from(unique.values()).sort(
          (a, b) =>
            a.date.localeCompare(b.date)
        );

      console.log(
        `Found ${cleaned.length} unique contribution days.`
      );

      /*
       * Check that we're actually getting daily data.
       */

      let consecutiveDays = 0;

      for (let i = 1; i < cleaned.length; i++) {

        const previous =
          new Date(cleaned[i - 1].date);

        const current =
          new Date(cleaned[i].date);

        const difference =
          Math.round(
            (current - previous) /
            (1000 * 60 * 60 * 24)
          );

        if (difference === 1) {
          consecutiveDays++;
        }
      }

      console.log(
        `Consecutive daily pairs: ${consecutiveDays}`
      );

      /*
       * Safety check.
       *
       * If the parser is still broken, DON'T overwrite
       * the existing JSON with bad data.
       */

      if (
        cleaned.length < 300 ||
        consecutiveDays < 200
      ) {

        console.error("");
        console.error(
          "ERROR: Contribution data does not look like daily data."
        );

        console.error(
          "The JSON file was NOT updated."
        );

        console.error("");

        if (cleaned.length > 0) {
          console.error(
            "First detected dates:"
          );

          console.error(
            cleaned.slice(0, 15)
          );
        }

        return;
      }

      /*
       * Build final JSON.
       */

      const output = {
        username,
        updated: new Date().toISOString(),
        contributions: cleaned
      };

      const outputPath =
        path.join(
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
      console.log(
        "SUCCESS: Real daily contribution data retrieved."
      );

      console.log(
        `Saved ${cleaned.length} days.`
      );

      console.log(
        `Saved to: ${outputPath}`
      );

      console.log("");
      console.log("First 15 days:");

      console.log(
        cleaned.slice(0, 15)
      );

      console.log("");
      console.log("Last 5 days:");

      console.log(
        cleaned.slice(-5)
      );
    });

  }
).on("error", (error) => {

  console.error(
    "Unable to connect to GitHub:"
  );

  console.error(error.message);

});
