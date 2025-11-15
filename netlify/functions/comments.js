// netlify/functions/comments.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // CORS headers - allow access dari mana saja
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
  'https://sdvadynwnfvxdkcekjsm.supabase.co',      // ← PASTE URL DI SINI
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkdmFkeW53bmZ2eGRrY2VranNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNzE4NTMsImV4cCI6MjA3ODc0Nzg1M30.u_tiMmnlS-6GSeL_RKT7aiW9QIlnbNBOJx-iLJK6vOY' // ← PASTE KEY DI SINI
);

    // GET - Ambil komentar
    if (event.httpMethod === 'GET') {
      const { storyId } = event.queryStringParameters;

      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('story_id', storyId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data || [])
      };
    }

    // POST - Tambah komentar baru
    if (event.httpMethod === 'POST') {
      const { storyId, name, comment } = JSON.parse(event.body);

      // Validasi input
      if (!storyId || !name || !comment) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Data tidak lengkap' })
        };
      }

      const { data, error } = await supabase
        .from('comments')
        .insert(
          [
            {
              story_id: storyId,
              name: name,
              comment: comment
            }
          ]
        )
        .select();

      if (error) {
        throw error;
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(data[0])
      };
    }

    // Method not allowed
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message
      })
    };
  }
};
