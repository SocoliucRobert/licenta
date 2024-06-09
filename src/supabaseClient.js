// supabaseClient.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://knqwydabuhbuhyalanms.supabase.co";
const supabaseKey  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtucXd5ZGFidWhidWh5YWxhbm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyNzA5OTUsImV4cCI6MjAzMDg0Njk5NX0.h7BW8CH60MLMl0lCMRLeawV22IcN0_vCyfr0h-FEiNA'; // Change this to your Supabase project anon key

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
