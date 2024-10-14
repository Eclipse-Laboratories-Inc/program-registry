import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');



const owner = process.env.REPO_OWNER;
const repo = process.env.REPO_NAME;
const pull_number = process.env.PR_NUMBER;

const requiredKeys = [
  'name',
  'description',
  'repo',
  'icon',
  'framework',
  'program_address',
  'categories'
];

async function validateAndMerge() {
  const { Octokit } = await import('@octokit/rest');
  const fetch = await import("node-fetch");

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
    request: {
      fetch: fetch,
    },
  });
  try {
    const { data: pr } = await octokit.pulls.get({
      owner,
      repo,
      pull_number,
    });

    const { data: files } = await octokit.pulls.listFiles({
      owner,
      repo,
      pull_number,
    });

    const jsonFile = files.find(file => file.filename === 'programs.json');
    if (!jsonFile || files.length > 1) {
      console.log('PR does not modify only the target JSON file');
      return;
    }

    const { data: fileContent } = await octokit.repos.getContent({
      owner,
      repo,
      path: jsonFile.filename,
      ref: pr.head.ref,
    });

    const content = Buffer.from(fileContent.content, 'base64').toString('utf-8');
    const jsonContent = JSON.parse(content);

    if (!Array.isArray(jsonContent)) {
      console.log('JSON content is not an array');
      return;
    }

    const { data: diff } = await octokit.pulls.get({
      owner,
      repo,
      pull_number,
      mediaType: { format: 'diff' }
    });

    const addedLines = diff.split('\n')
      .filter(line => line.startsWith('+') && !line.startsWith('+++'))
      .map(line => line.slice(1).trim());

    const addedContent = JSON.parse(addedLines.join(''));

    const isValid = requiredKeys.every(key => key in addedContent);

    if (!isValid) {
      console.log('Added object does not contain all required keys');
      return;
    }

    if (!Array.isArray(addedContent.categories) || addedContent.categories.length === 0) {
      console.log('Categories must be a non-empty array');
      return;
    }

    await octokit.pulls.merge({
      owner,
      repo,
      pull_number,
      merge_method: 'squash',
    });

    console.log('PR automatically merged');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

validateAndMerge();