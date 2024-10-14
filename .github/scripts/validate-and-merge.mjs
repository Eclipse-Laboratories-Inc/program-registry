import { createRequire } from 'module';
import fetch from 'node-fetch';
import yaml from 'js-yaml';

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

    const { data: files } = await octokit.pulls.listFiles({
      owner,
      repo,
      pull_number,
    });

    const yamlFile = files.find(file => file.filename.endsWith('.yaml') || file.filename.endsWith('.yml'));
    
    if (!yamlFile) {
      console.log('No YAML file found in the PR');
      return;
    }

    const { data: fileContent } = await octokit.repos.getContent({
      owner,
      repo,
      path: yamlFile.filename,
      ref: pr.head.ref,
    });

    const content = Buffer.from(fileContent.content, 'base64').toString('utf-8');
    
    // Parse all YAML documents in the file
    const yamlDocuments = yaml.loadAll(content);

    for (const document of yamlDocuments) {
      const isValid = requiredKeys.every(key => key in document);

      if (!isValid) {
        console.log(JSON.stringify(document) + ' is missing required keys');
        return;
      }

      if (!Array.isArray(document.categories) || document.categories.length === 0) {
        console.log('Categories must be a non-empty array');
        return;
      }
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