import path from "node:path";
import { runJsonProcess } from "../../skills/fhir-validation/scripts/lib/process-runner.mjs";

export function createFixtureJsonRunner({ cwd, failures, relativeTo = cwd }) {
  return function runJson(script, args, input = null) {
    const result = runJsonProcess(process.execPath, [script, ...args], {
      cwd,
      input,
    });
    const label = path.relative(relativeTo, script);
    if (result.status !== 0) {
      failures.push(`${label} failed: ${result.stderr || result.stdout}`);
      return null;
    }
    if (result.parsed === null) {
      failures.push(`${label} output was not JSON.`);
      return null;
    }
    return result.parsed;
  };
}
