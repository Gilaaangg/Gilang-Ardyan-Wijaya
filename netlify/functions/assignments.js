import { db } from './_data.js';

export async function handler(event, context) {
  const method = event.httpMethod;

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
    // GET /api/assignments
    if (method === 'GET') {
      const studentId = event.queryStringParameters && event.queryStringParameters.studentId;
      const assignmentId = event.queryStringParameters && event.queryStringParameters.assignmentId;

      let submissions = db.submissions;
      if (studentId) {
        submissions = submissions.filter((s) => s.studentId === studentId);
      }
      if (assignmentId) {
        submissions = submissions.filter((s) => s.assignmentId === assignmentId);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          assignments: db.assignments,
          submissions: submissions,
        }),
      };
    }

    // POST /api/assignments (Submit assignment or Grade assignment)
    if (method === 'POST') {
      let body = {};
      try {
        body = JSON.parse(event.body || '{}');
      } catch (e) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Format JSON tidak valid' }) };
      }

      const { action } = body;

      // Mahasiswa submit tugas
      if (action === 'submit' || !action) {
        const { assignmentId, studentId, studentName, fileName, notes } = body;

        if (!assignmentId || !studentId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'assignmentId dan studentId wajib diisi.' }),
          };
        }

        // Cek jika sudah pernah submit, perbarui
        const existingIndex = db.submissions.findIndex(
          (s) => s.assignmentId === assignmentId && s.studentId === studentId
        );

        const submissionData = {
          id: existingIndex !== -1 ? db.submissions[existingIndex].id : `SUB-${Date.now()}`,
          assignmentId,
          studentId,
          studentName: studentName || 'Mahasiswa Fiktif',
          fileName: fileName || 'tugas_mahasiswa_fiktif.pdf',
          notes: notes || '',
          submittedAt: new Date().toISOString(),
          grade: existingIndex !== -1 ? db.submissions[existingIndex].grade : null,
          feedback: existingIndex !== -1 ? db.submissions[existingIndex].feedback : '',
        };

        if (existingIndex !== -1) {
          db.submissions[existingIndex] = submissionData;
        } else {
          db.submissions.push(submissionData);
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Tugas berhasil diunggah / dikirim.', submission: submissionData }),
        };
      }

      // Dosen memberi nilai tugas
      if (action === 'grade') {
        const { submissionId, grade, feedback } = body;
        const targetSub = db.submissions.find((s) => s.id === submissionId);
        if (!targetSub) {
          return { statusCode: 404, headers, body: JSON.stringify({ error: 'Pengumpulan tugas tidak ditemukan.' }) };
        }

        targetSub.grade = Number(grade);
        targetSub.feedback = feedback || '';

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Nilai tugas berhasil disimpan.', submission: targetSub }),
        };
      }
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
