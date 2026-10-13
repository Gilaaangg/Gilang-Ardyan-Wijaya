import { db } from './_data.js';

export async function handler(event, context) {
  const method = event.httpMethod;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  };

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // GET /api/users - Admin melihat semua pengguna
    if (method === 'GET') {
      const sanitizedUsers = db.users.map(({ password, ...u }) => u);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ users: sanitizedUsers }),
      };
    }

    // POST /api/users - Admin membuat akun sintetis baru
    if (method === 'POST') {
      let body = {};
      try {
        body = JSON.parse(event.body || '{}');
      } catch (e) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Format JSON tidak valid' }) };
      }

      const { username, password, name, role, nim, nip, program, email } = body;
      if (!username || !password || !name || !role) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Username, password, nama, dan role wajib diisi.' }),
        };
      }

      const exists = db.users.some((u) => u.username === username);
      if (exists) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Username sudah digunakan.' }) };
      }

      const newId = role === 'mahasiswa' ? `STU00${db.users.length + 1}` : `USR00${db.users.length + 1}`;
      const newUser = {
        id: newId,
        username,
        password,
        name: `${name} (Fiktif)`,
        nim: nim || `2024010${db.users.length + 1}`,
        nip: nip || null,
        email: email || `${username}@cyberia.ac.id`,
        role,
        program: program || 'S1 Informatika',
        semester: 5,
        ipk: 3.5,
        status: 'Aktif',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      };

      db.users.push(newUser);
      const { password: _, ...safeUser } = newUser;

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ message: 'Pengguna sintetis baru berhasil ditambahkan.', user: safeUser }),
      };
    }

    // PATCH /api/users - Toggle status aktif / non-aktif
    if (method === 'PATCH') {
      let body = {};
      try {
        body = JSON.parse(event.body || '{}');
      } catch (e) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Format JSON tidak valid' }) };
      }

      const { userId, status } = body;
      const user = db.users.find((u) => u.id === userId);
      if (!user) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Pengguna tidak ditemukan.' }) };
      }

      user.status = status || (user.status === 'Aktif' ? 'Non-Aktif' : 'Aktif');

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: `Status pengguna diubah menjadi ${user.status}.`, user }),
      };
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
