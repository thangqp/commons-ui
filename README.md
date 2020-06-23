# commons-ui

Library for sharing GridSuite apps commons components

###For developpers
If you want to test the library usage in a consumer application my-app
change the dependency from `@gridsuite/commons-ui:'^x.x.x'` to  `@gridsuite/commons-ui:'file:../path/to/the/commons-ui'` 
then build the commons-ui `npm install` `npm run build`
then in the root folder of my-app `npm install` `npm start`.

**Note** : be sure that peer dependencies are not installed in the library node-modules to avoid problem such as duplicated react instances
