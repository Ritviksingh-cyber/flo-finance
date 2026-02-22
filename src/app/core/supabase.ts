import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://vhbjlabvuxzocucnpyfu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoYmpsYWJ2dXh6b2N1Y25weWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3Nzg0NzAsImV4cCI6MjA4NzM1NDQ3MH0.ktie0timeTu7S8Wh_6MGAmaNipJdGxK84rSDjYLdZwU'
);