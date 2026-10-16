/* File: src/config/routes.ts
  All routes definitions for front and back-ends
*/
type Endpoint = Record<string, string>;

export type AllRoutes = {
  back: Endpoint;
  front: Endpoint;
};

export const routes: AllRoutes = {
  back: {
    checkSession: '/api/check-session',
    ping: '/api/ping',
    abort: '/api/abort',
    delayed: '/api/delayed',
    invalid: '/api/invalid',
    getPaths: '/api/get-paths',
    readFile: '/api/read-file',
    writeFile: '/api/write-file',
    createBundle: '/api/create-bundle',
    getBundle: '/api/get-bundle',
    setBundle: '/api/set-bundle',
    submitBundle: '/api/submit-bundle',
    getBundleList: '/api/get-bundle-list',
    deleteBundles: '/api/delete-bundles',
    getTableData: '/api/get-table-data',
    getLanguages: '/api/get-languages',
    getOpenRouterModels: '/api/get-open-router-models',
    loadSettings: '/api/load-settings',
    saveSettings: '/api/save-settings',
  },
  front: {
    home: '/',
    bundleView: '/bundle-view',
    bundleList: '/bundle-list',
    bundleAnswer: '/bundle-answer',
    pathsView: '/paths-view',
    readFile: '/read-file',
    tableData: '/tableData',
    networkDown: '/network-down',
    openRouterModelsView: '/open-router-models-view',
  },
};

export type FrontRoute = keyof typeof routes.front;
export type BackRoute = keyof typeof routes.back;
