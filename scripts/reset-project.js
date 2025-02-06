#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const entryFileName = "AppEntry.js";
const entryComponentPath = "./app/App";

// Script content for the entry file
const entryFileContent = `
import { registerRootComponent } from 'expo';
import App from '${entryComponentPath}';

registerRootComponent(App);
`;

const updateAppEntry = async () => {
  try {
    // Write AppEntry.js at the root as the explicit entry point
    const entryFilePath = path.join(root, entryFileName);
    await fs.promises.writeFile(entryFilePath, entryFileContent);
    console.log(`📄 ${entryFileName} created at the project root.`);

    // Update package.json to set the new entry point
    const packageJsonPath = path.join(root, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(
        await fs.promises.readFile(packageJsonPath, "utf-8")
      );
      packageJson.main = entryFileName;
      await fs.promises.writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2)
      );
      console.log(`✅ package.json updated to set the entry point to ${entryFileName}.`);
    }

    console.log("\n✅ Entry point successfully set to app/App.tsx!");
  } catch (error) {
    console.error(`Error during script execution: ${error}`);
  }
};

updateAppEntry();
