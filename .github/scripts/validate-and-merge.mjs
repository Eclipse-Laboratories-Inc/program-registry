import { createRequire } from 'module';
import fetch from 'node-fetch';
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