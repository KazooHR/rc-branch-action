# Release Candidate Branch Automation

A GitHub Action to facilitate continuous integration of release candidates for web projects

## Usage

Given a branch (or branches), this action will create a tag with the branch name and an incrementing build number suffix.

At Kazoo, we follow the pattern of naming release candidate branches with the prefix `RC-` followed by the date in `YYYY-MM-DD` format. For example: `RC-2018-82-27`.

If no prior tag exists, the action will create a tag with the `-001` suffix. Subsequent tags will increment the build number by querying the repository for prior tags.

Below is a sample workflow that would achieve what is described. Each time a push is made to a branch matching the Kazoo pattern above, the action will create and push a new tag.

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
        id: clean-up-old-package-versions
        uses: kazoohr/rc-branch-action@main
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

See [action.yml](action.yml)

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
