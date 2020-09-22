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

-   [Test you package](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages#testing-your-package): `npm install`
-   [Login on the command line to the npm registry](https://docs.npmjs.com/logging-in-to-an-npm-enterprise-registry-from-the-command-line): `npm login`
-   [Update and commit the new version in the package.json file](https://github.com/gridsuite/commons-ui/blob/master/package.json)
-   [Publish the modified package](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages#publishing-scoped-public-packages): `npm publish`
