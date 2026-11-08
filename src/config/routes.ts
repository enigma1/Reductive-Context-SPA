/* File: src/config/routes.ts
  All route definitions for front and back-ends
*/
type Endpoint = Record<string, string>;

export type AllRoutes = {
  back: Endpoint;
  front: Endpoint;
};

export const routes: AllRoutes = {
  back: {
    checkSession: '/api/check-session',
    abort: '/api/abort',
    delayed: '/api/delayed',
    invalid: '/api/invalid',
    getPaths: '/api/get-paths',
    readFile: '/api/read-file',
    writeFile: '/api/write-file',

    // Bundles API
    createBundle: '/api/create-bundle',
    getBundle: '/api/get-bundle',
    setBundle: '/api/set-bundle',
    submitBundle: '/api/submit-bundle',
    resumeBundle: '/api/resume-bundle',
    getBundleList: '/api/get-bundle-list',
    deleteBundles: '/api/delete-bundles',

    // Roles API
    createRole: 'api/create-role',
    getRoleList: '/api/get-roles',
    getRole: '/api/get-role',
    setRole: '/api/set-role',
    activateRole: '/api/activate-role',
    deleteRoles: '/api/delete-roles',

    // MCP Api
    createMcp: 'api/create-mcp',
    getMcpList: '/api/get-mcps',
    getMcp: '/api/get-mcp',
    setMcp: '/api/set-mcp',
    deleteMcps: '/api/delete-mcps',

    // Workflows API
    getFlow: '/api/get-flow',
    setFlow: '/api/set-flow',
    getFlowList: '/api/get-flow-list',
    createFlow: '/api/create-flow',
    deleteFlows: '/api/delete-flows',

    getTableData: '/api/get-table-data',
    getLanguages: '/api/get-languages',
    getOpenRouterModels: '/api/get-open-router-models',
    loadSettings: '/api/load-settings',
    saveSettings: '/api/save-settings',
    exportDatabase: '/db/export-database',
  },
  front: {
    home: '/',
    bundleView: '/bundle-view',
    bundleList: '/bundle-list',
    bundleAnswer: '/bundle-answer',
    pathsView: '/paths-view',
    roleView: '/role-view',
    roleList: '/role-list',
    mcpView: '/mcp-view',
    mcpList: '/mcp-list',
    readFile: '/read-file',
    flowView: '/flow-view',
    flowList: '/flow-list',
    tableData: '/tableData',
    networkDown: '/network-down',
    openRouterModelsView: '/open-router-models-view',
  },
};

export type FrontRoute = keyof typeof routes.front;
export type BackRoute = keyof typeof routes.back;
