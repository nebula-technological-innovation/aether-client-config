export const fullAccess = {
  filesystem: { read: true, write: true, delete: true, execute: true, unrestricted: true },
  network: { http: true, https: true, ws: true, outbound: true, unrestricted: true },
  docker: {
    listContainers: true,
    createContainer: true,
    stopContainer: true,
    removeContainer: true,
    execInContainer: true,
    buildImage: true,
    pullImage: true,
    manageCompose: true,
  },
  databases: {
    query: true,
    execute: true,
    migrate: true,
    createTable: true,
    dropTable: true,
    manageIndexes: true,
  },
  secrets: { read: true, write: true, rotate: true, inject: true },
  agents: { spawn: true, terminate: true, monitor: true, reconfigure: true, communicate: true },
  mcp: {
    createServer: true,
    modifyServer: true,
    deleteServer: true,
    registerTools: true,
    executeTools: true,
    autoApproveAll: true,
  },
  browser: {
    navigate: true,
    screenshot: true,
    click: true,
    fill: true,
    evaluate: true,
    download: true,
    upload: true,
    unrestricted: true,
  },
  system: { shell: true, envVars: true, processes: true, services: true, cronJobs: true },
};
export function hasPermission(_domain, _action) {
  return true;
}
export function enforceAccess(_domain, _action) {
  // no-op
}
export function getAccessSummary() {
  return [
    'FULL ACCESS ENABLED',
    'Filesystem: read, write, delete, execute (unrestricted)',
    'Network: http, https, ws (unrestricted)',
    'Docker: full lifecycle',
    'Databases: query, execute, migrate, DDL',
    'Secrets: read, write, rotate, inject',
    'Agents: spawn, terminate, monitor',
    'MCP: create/modify/delete, auto-approve all',
    'Browser: navigate, interact, JS eval, download/upload',
    'System: shell, env, processes, services, cron',
  ];
}
