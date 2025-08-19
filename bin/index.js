#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const program = new Command();

program
  .name("create-universal-app")
  .description("Universal CLI for creating apps in React, Next.js, Vue, React Native, Angular, etc.")
  .version("1.0.0");

program.action(async () => {
  console.log("🚀 Welcome to Create Universal App!\n");

  const { projectName, framework } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "What’s your project name?",
      default: "my-app",
    },
    {
      type: "list",
      name: "framework",
      message: "Choose your framework:",
      choices: ["React + Vite", "Next.js", "Vue", "React Native", "Angular"],
    },
  ]);

  console.log(`\n✨ Creating ${framework} project: ${projectName}...\n`);

  // Pick install command based on framework
  const frameworkCommands = {
    "React + Vite": `npm create vite@latest ${projectName} -- --template react`,
    "Next.js": `npx create-next-app@latest ${projectName}`,
    "Vue": `npm create vue@latest ${projectName}`,
    "React Native": `npx @react-native-community/cli init ${projectName}`,
    "Angular": `npx -p @angular/cli ng new ${projectName}`,
  };

  try {
    execSync(frameworkCommands[framework], { stdio: "inherit" });

    // Ask about optional production folders
    const { extraFolders } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "extraFolders",
        message: "Select extra production-ready folders to add:",
        choices: [
          { name: "components", checked: true },
          { name: "hooks" },
          { name: "utils" },
          { name: "services" },
          { name: "context" },
          { name: "types" },
          { name: "constants" },
          { name: "tests" },
        ],
      },
    ]);

    // Create extra folders inside project
    extraFolders.forEach((folder) => {
      const folderPath = path.join(process.cwd(), projectName, "src", folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`📂 Created: src/${folder}`);
      }
    });

    console.log("\n✅ Project setup complete!");
    console.log("\n✅ Happy Hacking!");
  } catch (error) {
    console.error("❌ Something went wrong:", error.message);
  }
});

program.parse(process.argv);
