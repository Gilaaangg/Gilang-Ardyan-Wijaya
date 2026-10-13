import { db } from './_data.js';

export async function handler(event, context) {
  const method = event.httpMethod;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  };

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // GET /api/discussions - Mengambil daftar postingan diskusi
    if (method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ discussions: db.discussions }),
      };
    }

    // =========================================================================
    // INTENTIONAL VULNERABILITY - STORED XSS FOR SECURITY LAB
    // Endpoint ini menerima judul dan konten postingan forum dari pengguna.
    // SECARA SENGAJA INPUT INI TIDAK DISANITASI, TIDAK DILAKUKAN HTML ESCAPING,
    // DAN DISIMPAN PERSIS SEBAGAIMANA DIKIRIM (RAW STRING).
    //
    // Ketika konten ini nantinya dirender di browser pengguna lain secara tidak aman,
    // payload HTML/JavaScript (seperti <img src=x onerror="alert('XSS LAB')">)
    // akan dieksekusi langsung di konteks browser.
    // =========================================================================
    if (method === 'POST') {
      let body = {};
      try {
        body = JSON.parse(event.body || '{}');
      } catch (e) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Format JSON tidak valid' }) };
      }

      const { title, content, authorId, authorName, authorRole, category } = body;

      if (!title || !content) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Judul dan isi postingan wajib diisi.' }),
        };
      }

      // INTENTIONAL VULNERABILITY - STORED XSS FOR SECURITY LAB
      // Disimpan mentah-mentah ke database tanpa validasi/sanitasi:
      const newPost = {
        id: `DSC-${Date.now()}`,
        title: title, // Mentah tanpa sanitasi
        content: content, // Mentah tanpa sanitasi (Stored XSS sink)
        authorId: authorId || 'STU001',
        authorName: authorName || 'Mahasiswa Fiktif',
        authorRole: authorRole || 'mahasiswa',
        createdAt: new Date().toISOString(),
        category: category || 'Diskusi Kampus',
        _securityNotice: 'INTENTIONAL VULNERABILITY - STORED XSS FOR SECURITY LAB',
      };

      db.discussions.unshift(newPost);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          message: 'Postingan berhasil disimpan tanpa sanitasi (Stored XSS Demo).',
          post: newPost,
        }),
      };
    }

    // DELETE /api/discussions?id=... (Untuk mempermudah pembersihan postingan saat lab)
    if (method === 'DELETE') {
      const postId = event.queryStringParameters && event.queryStringParameters.id;
      if (!postId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Parameter id wajib disertakan.' }) };
      }

      const index = db.discussions.findIndex((p) => p.id === postId);
      if (index !== -1) {
        db.discussions.splice(index, 1);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Postingan berhasil dihapus.' }),
        };
      }
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Postingan tidak ditemukan.' }) };
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
