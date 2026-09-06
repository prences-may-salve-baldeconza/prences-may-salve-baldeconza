const https = require("https");
const fs = require("fs");
const path = require("path");

const username = "prences-may-salve-baldeconza";

const url =
  `https://github.com/users/${username}/contributions`;

https.get(url, (response) => {
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
     * GitHub's contribution calendar contains elements
     * with data-date and data-level attributes.
     */

    const regex =
      /<td[^>]*data-date="([^"]+)"[^>]*data-level="([^"]+)"[^>]*>/g;

    const contributions = [];

    let match;

    while ((match = regex.exec(html)) !== null) {
      contributions.push({
        date: match[1],
        level: Number(match[2])
      });
    }

    if (contributions.length === 0) {
      console.error(
        "No contribution data was found."
      );
      console.error(
        "GitHub may have changed its contribution-page HTML."
      );
      return;
    }

    const output = {
      username,
      updated: new Date().toISOString(),
      contributions
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
      `Successfully retrieved ${contributions.length} contribution days.`
    );

    console.log(
      `Saved to: ${outputPath}`
    );
  });

}).on("error", (error) => {
  console.error(
    "Unable to connect to GitHub:"
  );

  console.error(error.message);
});
