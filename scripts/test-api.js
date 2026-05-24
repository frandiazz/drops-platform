const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://njonqnmeyrutnxumxegl.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qb25xbm1leXJ1dG54dW14ZWdsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTIyMzM5MiwiZXhwIjoyMDk0Nzk5MzkyfQ.mFc4DE-zM7uh2wF3dBYFbUj-kTSz_vOqoLh2OEp138Q';
const projectRef = 'njonqnmeyrutnxumxegl';

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
  } catch (e) {
    console.log('Mgmt API error:', e.message);
  }
}

async function tryRPC() {
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data, error } = await supabase.rpc('exec_sql', { sql: 'SELECT 1 AS test' });
  console.log('RPC result:', data);
  console.log('RPC error:', error);
}

(async () => {
  await tryMgmtAPI();
  console.log('---');
  await tryRPC();
})();
