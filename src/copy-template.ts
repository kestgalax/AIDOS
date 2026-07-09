import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

export async function copyTemplateDirectory(
  sourceDirectory: string,
  targetDirectory: string,
  transform?: (relativePath: string, contents: string) => string,
): Promise<string[]> {
  const writtenFiles: string[] = [];

  async function walk(currentSource: string, currentTarget: string, relativeDirectory = ""): Promise<void> {
    const entries = await readdir(currentSource, { withFileTypes: true });

    await Promise.all(
      entries.map(async (entry) => {
        const sourcePath = path.join(currentSource, entry.name);
        const targetPath = path.join(currentTarget, entry.name);
        const relativePath = toPosixPath(path.join(relativeDirectory, entry.name));

        if (entry.isDirectory()) {
          await mkdir(targetPath, { recursive: true });
          await walk(sourcePath, targetPath, relativePath);
          return;
        }

        if (!entry.isFile()) {
          return;
        }

        await mkdir(path.dirname(targetPath), { recursive: true });
        const rawContents = await readFile(sourcePath, "utf8");
        const contents = transform ? transform(relativePath, rawContents) : rawContents;
        await writeFile(targetPath, contents, "utf8");
        writtenFiles.push(relativePath);
      }),
    );
  }

  await mkdir(targetDirectory, { recursive: true });
  await walk(sourceDirectory, targetDirectory);
  return writtenFiles.sort();
}

export async function copyDirectory(
  sourceDirectory: string,
  targetDirectory: string,
  options: { exclude?: string[] } = {},
): Promise<void> {
  const exclude = new Set(options.exclude ?? [".next", "node_modules"]);
  const entries = await readdir(sourceDirectory, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      if (exclude.has(entry.name)) {
        return;
      }

      const sourcePath = path.join(sourceDirectory, entry.name);
      const targetPath = path.join(targetDirectory, entry.name);

      if (entry.isDirectory()) {
        await mkdir(targetPath, { recursive: true });
        await copyDirectory(sourcePath, targetPath, options);
        return;
      }

      if (!entry.isFile()) {
        return;
      }

      await mkdir(path.dirname(targetPath), { recursive: true });
      const contents = await readFile(sourcePath);
      await writeFile(targetPath, contents);
    }),
  );
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    return (await stat(filePath)).isFile();
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

function toPosixPath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}
