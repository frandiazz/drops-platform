// Script de prueba - requiere variables de entorno
// Ejecutar: node -r dotenv/config scripts/test-api.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const projectRef = supabaseUrl ? new URL(supabaseUrl).hostname.split('.')[0] : '';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en el entorno');
  process.exit(1);
}

async function tryMgmtAPI() {
  const sql = `SELECT 1 AS test`;
  try {
    const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: sql })
    });
    const data = await res.text();
    console.log('Mgmt API status:', res.status);
    console.log('Mgmt API response:', data.substring(0, 500));
  } catch (e: any) {
    console.log('Mgmt API error:', e.message);
  }
}

async function tryRPC() {
  const supabase = createClient(supabaseUrl!, serviceRoleKey!);
  const { data, error } = await supabase.rpc('exec_sql', { sql: 'SELECT 1 AS test' });
  console.log('RPC result:', data);
  console.log('RPC error:', error);
}

(async () => {
  await tryMgmtAPI();
  console.log('---');
  await tryRPC();
})();
