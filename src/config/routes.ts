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
    createBundle: '/api/create-bundle',
    getBundle: '/api/get-bundle',
    setBundle: '/api/set-bundle',
    submitBundle: '/api/submit-bundle',
    getBundleList: '/api/get-bundle-list',
    getTableData: '/api/get-table-data',
    loadSettings: '/api/load-settings',
    saveSettings: '/api/save-settings',
  },
  front: {
    home: '/',
    bundleView: '/bundle-view',
    bundleList: '/bundle-list',
    pathsView: '/paths-view',
    readFile: '/read-file',
    tableData: '/tableData',
    networkDown: '/network-down',
  },
};

export type FrontRoute = keyof typeof routes.front;
export type BackRoute = keyof typeof routes.back;
