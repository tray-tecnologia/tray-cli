import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

// Functions

const readJson = (path) => {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

const getLocalPackagesVersion = () => {
  const rootDir = resolve(process.cwd(), '../..');
  const rootPackage = readJson(resolve(rootDir, 'package.json'));
  const workspaces = rootPackage.workspaces ?? [];

  const localVersionMap = {};

  for (const pattern of workspaces) {
    const workspaceDirectory = resolve(rootDir, pattern.replace('/*', ''));
    for (const entry of readdirSync(workspaceDirectory)) {
      try {
        const workspacePackage = readJson(resolve(workspaceDirectory, entry, 'package.json'));
        if (workspacePackage.name) localVersionMap[workspacePackage.name] = workspacePackage.version;
      } catch { /* Errors are explicity ignored  */ }
    }
  }

  return localVersionMap;
}

const filterInternalDependencies = (dependencies, devDependencies) => {
  return Object.entries({ ...dependencies, ...devDependencies })
    .filter(([dep]) => dep.startsWith('@tray-tecnologia/'));
}

const isExactVersion = (version) => {
  return /^\d+\.\d+\.\d+/.test(version) && !(/^[~^*]|^\s*[><]/.test(version));
};

const verifyInternalDependencies = (internalDependencies, localVersionMap) => {
  let invalid = false;

  for (const [dependency, dependencyVersion] of internalDependencies) {
    if (!isExactVersion(dependencyVersion)) {
      console.error(`✗ ${dependency}@${dependencyVersion} — internal dep must use exact version, not a range`);
      invalid = true;
      continue;
    }

    const localVersion = localVersionMap[dependency];
    if (localVersion && localVersion !== dependencyVersion) {
      console.error(`✗ ${dependency}@${dependencyVersion} — outdated, local version is ${localVersion}`);
      invalid = true;
      continue;
    }

    console.info(`✓ ${dependency}@${dependencyVersion}`);
  }

  return invalid;
}

const verifyCurrentPackageVersion = (name, version) => {
  let invalid = false;
  
  try {
    const published = execSync(`npm view ${name} version 2>/dev/null`, { encoding: 'utf-8' }).trim();

    if (published === version) {
      console.error(`✗ ${name}@${version} — same as published, bump required`);
      invalid = true;
    }

    console.info(`✓ ${name}: ${published} → ${version}`);
  } catch {
    console.info(`✓ ${name}@${version} — not yet published`);
  }

  return invalid;
}

// Variables

const {name, version, dependencies = {}, devDependencies = {}} = readJson(resolve(process.cwd(), 'package.json'));
const localVersionMap = getLocalPackagesVersion();
const internalDependencies = filterInternalDependencies(dependencies, devDependencies);

// Validation 

const isValidInternalDependencies = verifyInternalDependencies(internalDependencies, localVersionMap);
const isValidCurrentPackageVersion = verifyCurrentPackageVersion(name, version);

if (isValidInternalDependencies || isValidCurrentPackageVersion) process.exit(1);
