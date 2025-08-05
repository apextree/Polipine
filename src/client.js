import { createClient } from '@supabase/supabase-js'

const URL = 'https://hozksvzijjqmesbhyamk.supabase.co'
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvemtzdnppampxbWVzYmh5YW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNjE4NzEsImV4cCI6MjA2OTkzNzg3MX0.ha0CZWIr_8cuyf3Ll5kNIjMK_om4VAIsfBduoDXR2m0'

export const supabase = createClient(URL, API_KEY)
