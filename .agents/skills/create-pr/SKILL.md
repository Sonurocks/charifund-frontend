---
name: create-pr
description: >-
  Use this skill whenever the user asks you to create a Pull Request (PR) or Draft PR for the frontend.
  It automatically runs build checks locally before opening the PR via the GitHub CLI.
---

# Frontend PR Creation Strategy

Whenever the user asks you to create a PR in the frontend repository, you MUST follow this workflow to ensure code stability.

## Phase 1: Local Checks
Before creating the PR, you MUST verify that the frontend builds successfully to save CI minutes.
Run these commands in the terminal:
```bash
npm install
npm run build
```
- If the build fails, STOP and fix the code before opening the PR.

## Phase 2: Create the Draft PR
Once local checks pass, ensure the branch is pushed to origin (`git push -u origin <branch>`).
Then, use the `gh pr create` command to create a Draft PR.

```bash
gh pr create \
  --draft \
  --title "<branch-name-or-commit-title>" \
  --body "## Overview
Brief summary of the frontend changes.

## Changes
- What files or components were modified.

## Verification
- [x] Local \`npm run build\` passed successfully."
```

## Phase 3: Check CI Status
After creating the PR, run `gh pr checks` to monitor the GitHub Actions. If the GitHub Action fails, fetch the logs and fix the issue.
