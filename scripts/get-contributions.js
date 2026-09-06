const https = require("https");
const fs = require("fs");
const path = require("path");

const username = "prences-may-salve-baldeconza";

const url = `https://github.com/users/${username}/contributions`;

https.get(url, {
  headers: {
    "User-Agent": "Mozilla/5.0"
  }
}, (response) => {

  let html = "";

  response.on("data", (chunk) => {
    html += chunk;
  });

  response.on("end", () => {

    if (response.statusCode !== 200) {
      console.error(
        `GitHub returned HTTP ${response.statusCode}`
      );
      return;
    }

    /*
     * GitHub contribution cells contain:
     *
     * data-date="YYYY-MM-DD"
     * data-level="0-4"
     *
     * We specifically look for elements containing
     * BOTH attributes, rather than assuming they are
     * on a <td> in a particular order.
     */

    const regex =
      /<[^>]*data-date="([^"]+)"[^>]*data-level="([^"]+)"[^>]*>/g;

    const contributions = [];

    let match;

    while ((match = regex.exec(html)) !== null) {

      contributions.push({
        date: match[1],
        level: Number(match[2])
      });

    }

    /*
     * Remove accidental duplicate dates.
     */

    const unique = new Map();

    for (const contribution of contributions) {
      unique.set(
        contribution.date,
        contribution
      );
    }

    const cleaned = Array.from(
      unique.values()
    ).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    /*
     * Validate the result.
     */

    console.log(
      `Found ${cleaned.length} unique contribution days.`
    );

    if (cleaned.length < 300) {

      console.error(
        "WARNING: Fewer than 300 days were found."
      );

      console.error(
        "The GitHub page structure may have changed."
      );

      return;
    }

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

    console.log(
      `Saved ${cleaned.length} days to:`
    );

    console.log(
      outputPath
    );

  });

}).on("error", (error) => {

  console.error(
    "Unable to connect to GitHub:"
  );

  console.error(
    error.message
  );

});
