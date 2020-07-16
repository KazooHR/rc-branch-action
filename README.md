# Release Candidate Branch Automation

A GitHub Action to facilitate continuous integration of release candidates for web projects

## Usage

Given a branch (or branches), this action will create a tag with the branch name and an incrementing build number suffix.

At Kazoo, we follow the pattern of naming release candidate branches with the prefix `RC-` followed by the date in `YYYY-MM-DD` format. For example: `RC-2018-82-27`.

If no prior tag exists, the action will create a tag with the `-001` suffix. Subsequent tags will increment the build number by querying the repository for prior tags.

Below is a sample workflow that would achieve what is described:

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

This approach can work well in conjuntion with an additional workflow that automatically creates release candidate branches. No external code is required for this workflow.

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
          git config --local user.email "github@organization.com"
          git config --local user.name "GitHub Actions"
      - id: todays-date
        run: echo "::set-output name=date::$(date +'%Y-%m-%d')"
      - run: |
          git checkout -b RC-${{ steps.todays-date.outputs.date }}
          git push --set-upstream origin \
            RC-${{ steps.todays-date.outputs.date }}
```

## Contributing

Bug reports and pull requests are welcome on GitHub at [https://github.com/kazoohr/rc-branch-action](). Please read [CONTRIBUTING.md]() and [CLA.md]() for details on our code of conduct and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags](https://github.com/kazoohr/rc-branch-action/tags) on this repository.

## Authors

- [Jeff Israel](https://github.com/stripethree) - Kazoo

See also the list of [contributors](https://github.com/kazoohr/rc-branch-action/graphs/contributors) who participated in this project.

## License

Copyright 2020 Kazoo

Licensed under the [MIT License](LICENSE) (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at [https://mit-license.org/]()

## Acknowledgements

This project is maintained by the Engineering team at [Kazoo](http://kazoohr.com) headquartered in Austin, TX.
