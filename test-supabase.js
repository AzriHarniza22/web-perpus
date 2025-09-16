const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing env vars');
  process.exit(1);
}

console.log('Creating client...');
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRooms() {
  console.log('Testing rooms query...');
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    console.log('Rooms result:', data ? data.length : 0, 'rooms');
    console.log('Sample room:', data ? data[0] : null);
  } catch (err) {
    console.error('Rooms error:', err.message);
  }
}

async function testGetUser() {
  console.log('Testing getUser...');
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    console.log('getUser result:', data.user ? { id: data.user.id, email: data.user.email } : 'null');
  } catch (err) {
    console.error('getUser error:', err.message);
  }
}

Promise.all([testRooms(), testGetUser()]).then(() => {
  console.log('Tests complete');
}).catch(err => {
  console.error('Test failed:', err);
});