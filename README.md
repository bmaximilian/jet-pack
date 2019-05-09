# jet-pack

> [GitHub (Source Code)](https://github.com/bmaximilian/jet-pack)

> [GitLab (CI/CD)](https://gitlab.com/bmaximilian/jet-pack)

> [Jira (Issue Tracking)](https://maximilianbeck.atlassian.net/browse/JP)

## Release process
1. Make sure you have a clean working tree
1. Make sure you are on the master branch
1. Make sure the latest [CI-Pipeline](https://gitlab.com/bmaximilian/jet-pack/pipelines) of the master branch did not fail
1. Increase the version numbers in the `package.json` files of each module that should be released
1. `git add .`
1. `git commit` - The message should be the version number (prefixed by a "v")
1. `git tag` - The tag should be the version number (prefixed by a "v")
1. `git push --tags`
1. Watch the [CI-Pipeline](https://gitlab.com/bmaximilian/jet-pack/pipelines) testing and publishing your release
