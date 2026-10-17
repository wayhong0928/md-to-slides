'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const fixturesDir = path.join(__dirname, 'fixtures');

function mkTmp(prefix = 'md-to-slides-test-') {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDirSync(from, to);
    else fs.copyFileSync(from, to);
  }
}

// Run `node <script> ...args` in the repo root without a shell and collect output.
function runNode(script, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(repoRoot, script), ...args], {
      cwd: options.cwd || repoRoot,
      env: { ...process.env, ...(options.env || {}) },
      shell: false,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('error', reject);
    child.on('close', (code) => resolve({ code, stdout, stderr, output: stdout + stderr }));
  });
}

const runBuild = (args, options) => runNode('src/cli/build-cli.js', args, options);
const runCheck = (args, options) => runNode('src/cli/check-cli.js', args, options);

function leftoverTempFiles(dir) {
  return fs.readdirSync(dir).filter((name) => name.startsWith('.md-to-slides-'));
}

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, '\n');
}

module.exports = {
  repoRoot,
  fixturesDir,
  mkTmp,
  copyDirSync,
  runNode,
  runBuild,
  runCheck,
  leftoverTempFiles,
  normalizeNewlines,
};
