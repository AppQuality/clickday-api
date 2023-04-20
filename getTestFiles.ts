import * as fs from "fs";
import * as glob from "glob";

function parseTestText(testText: string): string[] {
  const lines = testText.split("\n");
  const res: { desc: string; test: string[] }[] = [];
  let lastDescription = "";
  for (const l of lines) {
    if (l.includes("describe(")) {
      const description = l.replace('describe("', "").replace('", () => {', "");
      if (!res.find((r) => r.desc === description)) {
        res.push({ desc: description, test: [] });
        lastDescription = description;
      }
    } else if (l.includes("it(")) {
      const test = l
        .replace('it("', "")
        .replace(/", (async )?\(\) => {/, "")
        .replace("\t", " ")
        .replace(/\s+/g, " ");
      res.find((r) => r.desc === lastDescription)?.test.push(test);
    }
  }
  const tests = res.flat().map((r) => {
    return r.test.map((t) => `${r.desc} -${t}`);
  });
  const result: string[] = [];
  for (const t of tests.flat()) {
    result.push(t);
  }
  return result;
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
