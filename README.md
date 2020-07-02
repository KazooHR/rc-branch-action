# Release Candidate Branch Automation

A GitHub Action to facilitate continuous integration of release candidates for web projects

## Usage

Given a branch (or branches), this action will create a tag with the branch name and an incrementing build number suffix.

At Kazoo, we follow the pattern of naming release candidate branches with the prefix `RC-` followed by the date in `YYYY-MM-DD` format. For example: `RC-2018-08-27`.

If no prior tag exists, the action will create a tag with the `-001` suffix. Subsequent tags will increment the build number by querying the repository for prior tags.

Below is a sample workflow that would achieve what is described while the repository containing the action is private. Each time a push is made to a branch matching the Kazoo pattern above, the action will create and push a new tag.

```yaml
name: Release candidate branch maintenance

on:
  push:
    branches:
      - "RC-[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]" # RC-YYYY-MM-DD

jobs:
  release-candidate-tags:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v2
      - name: Checkout GitHub Action Repo
        uses: actions/checkout@v2
        with:
          repository: kazoohr/rc-branch-action
          ref: action-artifacts
          token: ${{ secrets.GH_PAT }} # a personal access token stored in GitHub secrets
          path: .github/actions/rc-branch-action
      - name: run the action
        uses: ./.github/actions/rc-branch-action
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

If this repository is made public, the workflow can be simplified:

```yaml
on:
  push:
    branches:
      - "RC-[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]" # RC-YYYY-MM-DD

jobs:
  release-candidate-tags:
    runs-on: ubuntu-latest
    steps:
      - name:
        id: run-rc-branch-action
        uses: kazoohr/rc-branch-action@main
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

See [action.yml](action.yml).

This approach can work well in conjuntion with an additional workflow that automatically creates release candidate branches.

```yaml
on:
  schedule:
    - cron: "45 4 * * 5" # Every Friday at 4:45 am

jobs:
  nightly-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          ref: "master"
      - run: |
          git config --local user.email "github@kazoohr.com"
          git config --local user.name "KazooHR GitHub Actions"
      - id: todays-date
        run: echo "::set-output name=date::$(date +'%Y-%m-%d')"
      - run: |
          git checkout -b RC-${{ steps.todays-date.outputs.date }}
          git push --set-upstream origin \
            RC-${{ steps.todays-date.outputs.date }}
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
