import { db } from './_data.js';

export async function handler(event, context) {
  const method = event.httpMethod;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-id',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  };

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // =========================================================================
    // INTENTIONAL VULNERABILITY - IDOR FOR SECURITY LAB
    // Endpoint ini menerima parameter `studentId` dari query string atau URL.
    // Backend SECARA SENGAJA TIDAK MEMERIKSA apakah pengguna yang sedang login
    // berhak mengakses data nilai milik `studentId` tersebut!
    //
    // Contoh eksploitasi di lab:
    // Mahasiswa login sebagai STU001, namun memanggil:
    // GET /api/grades?studentId=STU002
    // Maka nilai rahasia mahasiswa STU002 (Siti Rahmawati) akan bocor ke STU001.
    // =========================================================================
    if (method === 'GET') {
      const studentId = event.queryStringParameters && event.queryStringParameters.studentId;
      const all = event.queryStringParameters && event.queryStringParameters.all;

      // Jika dosen atau admin meminta seluruh data nilai
      if (all === 'true') {
        const enhancedGrades = db.grades.map((g) => {
          const student = db.users.find((u) => u.id === g.studentId);
          return {
            ...g,
            studentName: student ? student.name : 'Unknown',
            nim: student ? student.nim : '-',
          };
        });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ grades: enhancedGrades }),
        };
      }

      // INTENTIONAL VULNERABILITY - IDOR FOR SECURITY LAB
      // Nilai dikembalikan langsung berdasarkan parameter studentId tanpa validasi sesi auth!
      if (!studentId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: 'Parameter studentId wajib diisi. Contoh: /api/grades?studentId=STU001',
          }),
        };
      }

      const targetStudent = db.users.find((u) => u.id === studentId);
      const studentGrades = db.grades.filter((g) => g.studentId === studentId);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          studentId: studentId,
          studentName: targetStudent ? targetStudent.name : 'Mahasiswa Fiktif',
          nim: targetStudent ? targetStudent.nim : '-',
          program: targetStudent ? targetStudent.program : '-',
          ipk: targetStudent ? targetStudent.ipk : 0.0,
          grades: studentGrades,
          _securityNotice: {
            vulnerability: 'INTENTIONAL VULNERABILITY - IDOR FOR SECURITY LAB',
            description: 'Data ini dikembalikan tanpa memeriksa apakah session pemohon cocok dengan studentId ini.',
          },
        }),
      };
    }

    // POST /api/grades - Dosen memberikan atau memperbarui nilai
    if (method === 'POST') {
      let body = {};
      try {
        body = JSON.parse(event.body || '{}');
      } catch (e) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON body' }) };
      }

      const { studentId, courseId, score } = body;
      if (!studentId || !courseId || score === undefined) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'studentId, courseId, dan score wajib diisi.' }),
        };
      }

      let numScore = Number(score);
      let gradeLetter = 'E';
      if (numScore >= 85) gradeLetter = 'A';
      else if (numScore >= 80) gradeLetter = 'A-';
      else if (numScore >= 75) gradeLetter = 'B+';
      else if (numScore >= 70) gradeLetter = 'B';
      else if (numScore >= 65) gradeLetter = 'C+';
      else if (numScore >= 60) gradeLetter = 'C';
      else if (numScore >= 50) gradeLetter = 'D';

      let existing = db.grades.find((g) => g.studentId === studentId && g.courseId === courseId);
      if (existing) {
        existing.score = numScore;
        existing.grade = gradeLetter;
        existing.status = numScore >= 65 ? 'Lulus' : 'Remedial';
      } else {
        const course = db.courses.find((c) => c.id === courseId);
        const newGrade = {
          id: `GRD-${Date.now()}`,
          studentId,
          courseId,
          courseName: course ? course.name : 'Mata Kuliah',
          sks: course ? course.sks : 3,
          score: numScore,
          grade: gradeLetter,
          status: numScore >= 65 ? 'Lulus' : 'Remedial',
        };
        db.grades.push(newGrade);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Nilai berhasil disimpan.', studentId, courseId, score: numScore, grade: gradeLetter }),
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
