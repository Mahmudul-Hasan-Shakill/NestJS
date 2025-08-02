// Map API endpoint+method → one or more GUI paths
export const apiToGuiMap: Record<string, string[]> = {
  // VM APIs
  'POST /api/vm': ['/core-systems/vm-creation'], // ← Multiple GUIs for one API!
  'GET /api/vm': ['/core-systems/vm-update'],
  'GET /api/vm/:id': ['/core-systems/vm-update'],
  'PATCH /api/vm/:id': ['/core-systems/vm-update'],
  'DELETE /api/vm/:id': ['/core-systems/vm-update'],

  // Add other APIs as needed...
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
