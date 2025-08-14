// Map API endpoint+method → one or more GUI paths
export const apiToGuiMap: Record<string, string[]> = {
  // VM APIs
  'POST /api/vm': ['/core-systems/vm-creation'],
  'GET /api/vm': ['/core-systems/vm-update', '/home'],
  'GET /api/vm/:id': ['/core-systems/vm-update'],
  'PATCH /api/vm/:id': ['/core-systems/vm-update'],
  'DELETE /api/vm/:id': ['/core-systems/vm-update'],

  // AMC APIs
  'POST /api/amc': ['/core-systems/amc-creation'],
  'GET /api/amc': ['/core-systems/amc-update'],
  'GET /api/amc/:id': ['/core-systems/amc-update'],
  'PATCH /api/amc/:id': ['/core-systems/amc-update'],
  'DELETE /api/amc/:id': ['/core-systems/amc-update'],

  // APPLICATION APIs
  'POST /api/application': ['/core-systems/application-server-creation'],
  'GET /api/application': ['/core-systems/application-server-update'],
  'GET /api/application/:id': ['/core-systems/application-server-update'],
  'PATCH /api/application/:id': ['/core-systems/application-server-update'],
  'DELETE /api/application/:id': ['/core-systems/application-server-update'],

  // AUTOMATION APIs
  'POST /api/automation': ['/core-systems/automatic-server-creation'],
  'GET /api/automation': ['/core-systems/automatic-server-update'],
  'GET /api/automation/:id': ['/core-systems/automatic-server-update'],
  'PATCH /api/automation/:id': ['/core-systems/automatic-server-update'],
  'DELETE /api/automation/:id': ['/core-systems/automatic-server-update'],
  'POST /api/automation/upload-parse': [
    '/core-systems/automatic-server-creation',
    '/core-systems/automatic-server-update',
  ],

  // CLUSTER APIs
  'POST /api/cluster': ['/core-systems/cluster-creation'],
  'GET /api/cluster': ['/core-systems/cluster-update'],
  'GET /api/cluster/:id': ['/core-systems/cluster-update'],
  'PATCH /api/cluster/:id': ['/core-systems/cluster-update'],
  'DELETE /api/cluster/:id': ['/core-systems/cluster-update'],
  'GET /api/cluster/names': [
    '/core-systems/physical-host-update',
    '/core-systems/physical-host-creation',
  ],

  // DATABASE APIs
  'POST /api/database': ['/core-systems/database-server-creation'],
  'GET /api/database': ['/core-systems/database-server-update'],
  'GET /api/database/:id': ['/core-systems/database-server-update'],
  'PATCH /api/database/:id': ['/core-systems/database-server-update'],
  'DELETE /api/database/:id': ['/core-systems/database-server-update'],

  // PHYSICAL APIs
  'POST /api/physical': ['/core-systems/physical-server-creation'],
  'GET /api/physical': ['/core-systems/physical-server-update'],
  'GET /api/physical/:id': ['/core-systems/physical-server-update'],
  'PATCH /api/physical/:id': ['/core-systems/physical-server-update'],
  'DELETE /api/physical/:id': ['/core-systems/physical-server-update'],

  // ROLES APIs
  'GET /api/roles': ['/admin-settings/role-creation'],
  'POST /api/roles': ['/admin-settings/role-creation'],
  'PUT /api/roles': ['/admin-settings/role-update'],
  'GET /api/roles/names': ['/admin-settings/role-creation'],
  'GET /api/roles/gui': ['/admin-settings/role-creation'],
  'GET /api/roles/gui/:roleName': ['/admin-settings/role-creation'],
  'PUT /api/roles/:id': ['/admin-settings/role-update'],
  'DELETE /api/roles/:id': ['/admin-settings/role-update'],
  'DELETE /api/roles/name/:roleName': ['/admin-settings/role-update'],

  // USER APIs
  'GET /api/user/:id': ['/admin-settings/user-update'],
  'PATCH /api/user/:id': ['/admin-settings/user-update'],
  'DELETE /api/user/:id': ['/admin-settings/user-update'],
  'GET /api/user': ['/admin-settings/user-creation'],
  'PATCH /api/user/pin/:pin': ['/admin-settings/user-update'],
  'GET /api/user/pin/:pin': ['/admin-settings/user-creation'],
  'PATCH /api/user/change-password/:pin': ['/admin-settings/user-update'],

  // PHYSICAL HOST APIs
  'POST /api/physical-hosts': ['/core-systems/physical-host-creation'],
  'GET /api/physical-hosts': ['/core-systems/physical-host-update'],
  'GET /api/physical-hosts/:id': ['/core-systems/physical-host-update'],
  'GET /api/physical-hosts/summary': ['/core-systems/physical-host-update'],
  'PATCH /api/physical-hosts/:id': ['/core-systems/physical-host-update'],
  'DELETE /api/physical-hosts/:id': ['/core-systems/physical-host-update'],
};

// Helper: get ALL GUI paths mapped to this API request
export function getGuiPathsFromRequest(request: any): string[] {
  const method = request.method.toUpperCase();
  // Standardize path. If you use route param, like :id, this keeps it consistent
  let path = request.route?.path || request.url;
  path = path.replace(/\d+/g, ':id'); // replaces numeric IDs with :id
  const apiKey = `${method} ${path}`;
  return apiToGuiMap[apiKey] || [];
}
