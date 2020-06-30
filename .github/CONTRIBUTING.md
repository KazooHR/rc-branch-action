# Contributing

## Code Quality Guidelines

- [GraphQL Style Guide](https://projectnewco.atlassian.net/wiki/spaces/EN/pages/162857314/GraphQL+Style+Guide)
- [TypeScript Style Guide](https://projectnewco.atlassian.net/wiki/spaces/EN/pages/171376788/TypeScript+Style+Guide)
- [KazooWeb Style Guide](https://projectnewco.atlassian.net/wiki/spaces/EN/pages/171475116/Kazoo-Web+Implementation+Guide)

## Code Review Process

### Creating a PR

- Open your PR as a draft so you can fix it up before your reviewers get called.
  - Create an on-demand deploy so people can test your work.
    - Test it yourself first.
- Review your own PR before asking others.
  - Explain yourself in PR comments and expect to copy some of these as code comments. e.g. `// We fall back to reading from a bearer token for legacy support.`
  - Try to read the code as a reviewer might.
    - If you do this, you may discover changes you wish to make before review.
- Keep in mind you are trying to dig a "pit of success" for your reviewer.
  - You want an approval, do make it easy for them to do that.
  - In your PR body, explain what you are doing and why. The reviewer has less context of your ticket than you do. Explain yourself.
  - Fill in the PR template.
    - This tells your reviewer that you thought about the question e.g. `account for various device widths for all new designs?` and made a conscious decision to answer yes or decided it didn't apply.
  - Explain how to test.
    - Screenshots are great for helping your reviewer understand what they are looking at.
- Do not use `mergify` prior to approval.
  - It fires as soon as your PR is eligible, so if a reviewer says "approved, pending a fix to this typo", you don't get a chance to fix it.
  - Put it on once you and your reviewers are in agreement that it is time to merge.
- Feel free to ask for review prior to a PR being "ready"
  - Open it as a draft with the title RFC: (Request For Comment)
  - You will need to explicitly ask for review on drafts.

### Choosing a reviewer

- Who?
  - At least one of the relevant [CODEOWNERS](https://github.com/KazooHR/kazoo-beta/blob/master/.github/CODEOWNERS)
  - At least one of your direct teammates
  - A subject matter expert if needed.

### What are reviewers looking for?

- All PRs must pass all required automation and checks.
  - eslint, jest, and coverage must all pass
- Test coverage should be 100%
  - Explicit decisions on what code not to cover. e.g. `//istanbul ignore next - early return`
    - Contributors should expect challenges and/or offers of help for these decisions.
      - e.g. `//istanbul ignore next - I don't know how to test this` will probably be challenged, and ideally provoke a pairing session on how to test this.
- Todo items should be tied to JIRA tickets e.g. `//TODO: refactor to a single function KAZ-99920`
  - We need to increase the visibility of technical debt.
    - JIRA is our tool for maintinaing visibility of work.
    - Even if you intend to do that work literally _today_, stuff happens. You may not be back at this code for six months.
- The code should be comprehensible to an outsider not steeped in your project.
  - Avoid acroyms in variable names even in tests.
    - `URL` is fine since it is a common term, but `filterRule` is better than `fr`
  - Be kind to the future maintenance programmer, it may be you.
- Reviewers are looking for common KW patterns
  - Many of these patterns are emergent and less than well documented.
    - This is admittedly a challenge for developers and a source of frustration.
      - We're moving fast so code review is one of the tools we have to spread emergent patterns and detect where many people are struggling at solving similar problems.

### What to do once your PR is approved

- Squash and merge your own code to master — [do not wait for QA](https://github.com/KazooHR/kazoo-beta/blob/master/README.md#continuous-delivery)
- [Copy the PR summary](https://github.com/KazooHR/grid-access/pull/79) as the squash commit message
- Example: https://github.com/KazooHR/kazoo-beta/commit/d59fb6a3c4d7d5531230353bfde0740ae83b2525
- [Spinnaker](https://spinnaker.kazoohr.io/#/projects/Kazoo%20Shared%20Services/applications/kazoo-beta/clusters) will automatically deploy it to [non-production](https://[subdomain].develop.non-prod.kazoohr.io/)
- Automation should delete your branch, but please verify.
