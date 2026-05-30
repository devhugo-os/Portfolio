# Project Working Agreement

## Branches

- At the beginning of each new work chat, start from an up-to-date base branch and create a dedicated branch before editing files.
- Include `hugo` in the branch name and use a short description of the initial demand.
- Keep using the same branch for commits and subsequent demands during the chat.
- Do not create another branch or merge the current branch automatically when a new demand is requested during the same chat.
- Create another branch or merge the current branch only when Hugo explicitly requests it.

## Version Control

- Commit new implementations and bug fixes as the work progresses.
- Keep commits focused and descriptive so the application can be restored to a known working state if necessary.
- Verify the relevant behavior before committing whenever feasible.
- Do not mix unrelated changes in the same commit.
- Do not revert changes made by Hugo unless explicitly requested.

## Demand Completion Report

When finishing a demand, always provide a concise report with these sections:

### Changed Files

- List each changed file.

### Summary

- Explain objectively what changed and why.

### Functional Tests

- Provide a short manual validation protocol written for an application user.
- Use simple step-by-step instructions without specialist terminology.
- State the expected visible result for each test.
