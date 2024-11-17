# Git & Github

## Branches

There are 2 main branches: `master` and `development`. Don't commit directly to master, only merge pull requests from `development` to `master`.

### Features

You can create feature branches for specific feature (name: `feature/<feature-name>`).

### Hotfixes

If you find bug in `master` branch create hotfix. For hotfix create separate branch (name: `hotfix/<hotfix-name>`) and then merge directly to `master` branch.

### Bugfixes

If you find bug in `development` branch create bugfix. For bugfix create separate branch (name: `bugfix/<bugfix-name>`) and then merge to `development` branch.

## Pull requests

Do not merge pull requests until everyone has reviewed it.

## Merging strategy

rebase
