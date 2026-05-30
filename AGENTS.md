# Project Working Agreement

## Branches

- Start each new demand from an up-to-date base branch.
- Create a dedicated branch for each demand before editing files.
- Include `hugo` in the branch name and use a short description of the demand.
- Do not merge a demand branch until Hugo explicitly confirms that the demand is complete.

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
