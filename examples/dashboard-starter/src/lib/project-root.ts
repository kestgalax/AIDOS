import path from "node:path";

export function getAidosProjectRoot(): string {
  const configuredRoot = process.env.AIDOS_PROJECT_ROOT;
  if (configuredRoot && configuredRoot.length > 0) {
    return path.resolve(configuredRoot);
  }

  return process.cwd();
}
