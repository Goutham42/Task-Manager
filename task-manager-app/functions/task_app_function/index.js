'use strict';
const catalyst = require('zcatalyst-sdk-node');

function send(res, code, data) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

async function getBody(req) {
  return new Promise(resolve => {
    let body = '';
    req.on('data', c => (body += c));
    req.on('end', () => resolve(body ? JSON.parse(body) : {}));
  });
}

module.exports = async (req, res) => {
  try {
    const app = catalyst.initialize(req);
    const path = req.url;

    const user = await app.userManagement().getCurrentUser();
    if (!user || !user.user_id) {
      return send(res, 401, { message: 'Unauthorized' });
    }

    const userId = String(user.user_id);
    const table = app.datastore().table('Tasks');

    // GET
    if (req.method === 'GET' && path === '/tasks') {
      const rows = await table.getAllRows();
      return send(res, 200, rows.filter(r => String(r.user_id) === userId));
    }

    // POST
    // POST
    if (req.method === 'POST' && path === '/tasks') {
      const body = await getBody(req);

      if (!body.title || !body.title.trim()) {
        return send(res, 400, { message: 'Title required' });
      }

      const row = await table.insertRow({
        title: body.title.trim(),
        description: body.description?.trim() || "", // ✅ FIX
        status: 'pending',
        user_id: userId
      });

      return send(res, 201, row);
    }

    // PUT ✅ FIXED LOCATION
    if (req.method === 'PUT' && path.startsWith('/tasks/')) {
      const rowId = path.split('/')[2];
      const body = await getBody(req);

      const row = await table.getRow(rowId);
      if (!row || String(row.CREATORID) !== userId) {
        return send(res, 403, { message: 'Forbidden' });
      }

      await table.updateRow({
        ROWID: rowId,
        status: body.status ?? row.status,
        title: body.title ?? row.title,
        description: body.description ?? row.description
      });

      return send(res, 200, { success: true });
    }

    // DELETE
    if (req.method === 'DELETE' && path.startsWith('/tasks/')) {
      const rowId = path.split('/')[2];

      const row = await table.getRow(rowId);
      if (!row || String(row.CREATORID) !== userId) {
        return send(res, 403, { message: 'Forbidden' });
      }

      await table.deleteRows([rowId]);
      return send(res, 200, { success: true });
    }

    return send(res, 404, { message: 'Route not found' });

  } catch (err) {
    console.error('🔥 Function error:', err);
    return send(res, 500, { error: err.message });
  }
};