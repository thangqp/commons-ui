# commons-ui

Library for sharing GridSuite apps commons components

#### For developers
To start developing : type `npm install` then `npm start` commands.
The commons-ui library  have a demo app in which you can call your components to test them. 
the `npm start` command launches the demo app.

If you want to test your library integration with a consumer application my-app
you have to change the commons-ui dependency in  my-app's package.json from `@gridsuite/commons-ui:'^x.x.x'` to  `@gridsuite/commons-ui:'file:../path/to/the/commons-ui'` 
then build the commons-ui `npm install` `npm run build` then `npm prune --production` then in the root folder of my-app type `npm install` `npm start`.

**Note** : `npm prune --production` ensures that commons-ui's listed peer dependencies are not installed in the library node-modules to avoid problems such as duplicated react instances.
