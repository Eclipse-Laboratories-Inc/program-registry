# Eclipse Solana Program Registry

Welcome to the Eclipse Solana Program Registry! This registry serves as a (not entirely) comprehensive list of programs running on the Eclipse network. Follow the steps below to add your program to the registry.

## Prerequisites

Before you submit your program to the registry, ensure you have:
- A program deployed on the Eclipse blockchain.
- A GitHub repository for your program's code.
- A published IDL onchain

## Submission Process

To submit your program to the Eclipse Solana Program Registry, you need to create a pull request (PR) with the following steps:

### 1. Update `programs.json` File

Add an entry for your program in the `programs.json` file with the following format:

\```json
{
  "name": "<your_program_name>",
  "description": "<description_of_your_program>",
  "repo": "<github_repository_url>",
  "icon": "<url_to_icon_image>",
  "framework": "<development_framework_used>",
  "program_address": "<your_solana_program_address>",
  "categories": [
    "<category1>", "<category2>", ...
  ]
}
\```

Replace the placeholders with your program's details. Here's an example using the Eclipse Canonical Bridge:

\```json
[
  {
    "name": "canonical_bridge",
    "description": "The Eclipse Canonical Bridge facilitates depositing and withdrawing ether from the Eclipse Chain",
    "repo": "https://github.com/Eclipse-Laboratories-Inc/syzygy/tree/main/solana-programs/canonical_bridge",
    "icon": "https://i.imgur.com/y0JEPfQ.png",
    "framework": "Anchor",
    "program_address": "bripkhe8bjXg5PUxub3raVpoqZVRBPjTjPgAC22AHHF",
    "categories": [
        "Bridge"
    ]
  }
]
\```

### 2. Publish Your IDL on Eclipse Network(s)

Publish your Interface Definition Language (IDL) on the Eclipse network. The IDL should be accessible publicly. For guidance on how to publish your IDL, refer to [Anchor documentation](https://www.anchor-lang.com/docs/cli#idl). This what it looks like when its done correctly. [Published IDL](https://solscan.io/account/bripkhe8bjXg5PUxub3raVpoqZVRBPjTjPgAC22AHHF?cluster=custom&customUrl=https%3A%2F%2Ftestnet.dev2.eclipsenetwork.xyz#anchorProgramIDL).

### 3. Create a Pull Request

Once you have added your program details to the `programs.json` file and published your IDL, create a pull request to the Eclipse program registry repository.

## After Submission

After your pull request is created:
- The Eclipse team will review your submission.
- If all criteria are met, your PR will be merged.
- Upon successful merging, your program will be eligible to be featured in the Eclipse Program Explorer.

Thank you for contributing to the Eclipse Program Registry!
