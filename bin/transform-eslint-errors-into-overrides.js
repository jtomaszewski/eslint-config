const path = require("path");

function readWholeStdin() {
  if (process.stdin.isTTY) {
    return undefined;
  }
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  let buffer = "";
  process.stdin.on("data", (chunk) => {
    buffer += chunk;
  });

  return new Promise((resolve) => {
    process.stdin.on("end", () => {
      resolve(buffer);
    });
  });
}

async function main() {
  const stdin = await readWholeStdin();
  if (!stdin) {
    console.error(
      `Usage: eslint ... -f json | yarn -s transform-eslint-errors-into-overrides`
    );
    process.exit(1);
  }
  const json = JSON.parse(stdin);
  const rulesets = json.reduce((acc, { filePath, messages }) => {
    const ruleIds = [...new Set(messages.map((rule) => rule.ruleId))];
    const slug = ruleIds.sort().join("#");

    acc[slug] = acc[slug] ?? {
      files: [],

      rules: Object.fromEntries(ruleIds.map((ruleId) => [ruleId, "off"])),
    };
    acc[slug].files.push(filePath.replace(__dirname + path.sep, ""));

    return acc;
  }, {});

  const overrides = Object.values(rulesets).filter(
    ({ rules }) => Object.keys(rules).length > 0
  );
  console.log(JSON.stringify(overrides));
}

void main();
