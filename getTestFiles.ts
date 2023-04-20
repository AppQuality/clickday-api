import * as fs from "fs";
import * as glob from "glob";

function parseTestText(testText: string): string[] {
  const lines = testText.split("\n").filter(Boolean);
  const description = lines[0]
    .replace('describe("', "")
    .replace('", () => {', "");
  const tests = lines.slice(1).map((line) =>
    line
      .replace('it("', "")
      .replace(/", (async )?\(\) => {/, "")
      .replace("\t", " ")
      .replace(/\s+/g, " ")
  );
  return tests.map((test) => `${description} -${test}`);
}

function getTests() {
  const testFiles = glob.sync("./src/**/*.spec.ts", { absolute: true });
  const results: string[] = [];
  for (const file of testFiles) {
    const content = fs
      .readFileSync(file, "utf8")
      .split("\n")
      .filter((line) => {
        return line.includes("describe(") || line.includes("it(");
      })
      .join("\n");
    const tests = parseTestText(content);
    results.push(...tests);
  }
  return results.join("\n");
}

console.log(getTests());
