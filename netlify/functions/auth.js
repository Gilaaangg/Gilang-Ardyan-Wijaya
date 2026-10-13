import { db, resetDb } from './_data.js';

export async function handler(event, context) {
  const method = event.httpMethod;
  const path = event.path || '';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // POST /api/auth/reset -> resets DB to default synthetic values
    if (path.endsWith('/reset') || (event.queryStringParameters && event.queryStringParameters.action === 'reset')) {
      resetDb();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Database reset to default synthetic state successfully.' }),
      };
    }

    // POST /api/auth (Login)
    if (method === 'POST') {
      let body = {};
      try {
        body = JSON.parse(event.body || '{}');
      } catch (e) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Format JSON request tidak valid.' }) };
      }

      const { username, password } = body;
      if (!username || !password) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Username dan password wajib diisi.' }) };
      }

      const user = db.users.find((u) => u.username === username && u.password === password);
      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Username atau password sintetis salah.' }),
        };
      }

      // Safe user payload (exclude password)
      const { password: _, ...safeUser } = user;
      const fakeToken = `lab-token-${user.id}-${Date.now()}`;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Login berhasil.',
          user: safeUser,
          token: fakeToken,
        }),
      };
    }

    // GET /api/auth/me or check current user
    if (method === 'GET') {
      const userId = event.queryStringParameters && event.queryStringParameters.userId;
      if (!userId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Parameter userId dibutuhkan.' }) };
      }

      const user = db.users.find((u) => u.id === userId);
      if (!user) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Pengguna tidak ditemukan.' }) };
      }

      const { password: _, ...safeUser } = user;
      return { statusCode: 200, headers, body: JSON.stringify({ user: safeUser }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Server error' }),
    };
  }
}
