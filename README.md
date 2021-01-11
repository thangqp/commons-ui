# commons-ui

Library for sharing GridSuite apps commons components

#### For developers

The commons-ui library have a demo app in which you can call your components to test them.
The `npm start` command install the library's dependencies then launches the demo app.

If you want to test your library integration with a consumer application my-app you have first
to build commons-ui via `npm run build` then change the commons-ui dependency in my-app's package.json from `@gridsuite/commons-ui:'^x.x.x'`
to `@gridsuite/commons-ui:'file:../path/to/the/commons-ui'` then type `npm install` `npm start`.

#### For integrators

If you want to deploy a new version of commons-ui in the [NPM package registry](https://www.npmjs.com/package/@gridsuite/commons-ui),
you need to follow the steps below:

-   Update to the new version in [package.json](https://github.com/gridsuite/commons-ui/blob/master/package.json) (example `0.6.0`)
-   Build it: `npm install`
-   Commit the package.json and package-lock.json files, push to a branch, make a PR, have it reviewed and merged to master.
-   Pull and checkout master on your last commit.
-   [Tag your last commit](https://semver.org/) : `git tag <tag>` (example: `v0.6.0`)
-   Push tag : `git push origin <tag>`
-   Checkout the tag in a fresh repo copy : `cd $(mktemp -d) && git clone commons-ui` then `cd commons-ui && git checkout <tag>`
-   [Test your package](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages#testing-your-package): `npm install`
-   [Login on the command line to the npm registry](https://docs.npmjs.com/logging-in-to-an-npm-enterprise-registry-from-the-command-line): `npm login`
-   [Publish the package](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages#publishing-scoped-public-packages): `npm publish`
