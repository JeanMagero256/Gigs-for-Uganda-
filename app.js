// app.js
// This code creates the connection between your website and Supabase
// and manages the UI based on user login status

// 1. Create the Supabase client using your project's URL and API Key
// REPLACE THESE VALUES WITH YOUR OWN FROM YOUR SUPABASE PROJECT SETTINGS > API
const SUPABASE_URL = 'https://aqyaybshzmddszbsbhpl.supabase.co'; // <-- REPLACE THIS
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxeWF5YnNoem1kZHN6YnNiaHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMDYxMjIsImV4cCI6MjA3MTc4MjEyMn0.OqXvqQsBc41UhS5DA4uzVuZCGK626cL3Qn1RyeFfg9k'; // <-- REPLACE THIS

// Create the Supabase client object for all database operations
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Log to console to check if Supabase is loaded (for debugging)
console.log("Supabase initialized: ", supabase);
console.log("Let's build Uganda Gigs!");

// --- Function to update the UI based on auth state ---
function updateAuthUI(user) {
  const authLinksDiv = document.getElementById('authLinks');
  const userMenuDiv = document.getElementById('userMenu');

  if (user) {
    // User is logged in - show user menu, hide auth links
    if (authLinksDiv) authLinksDiv.style.display = 'none';
    if (userMenuDiv) userMenuDiv.style.display = 'flex';
  } else {
    // User is logged out - show auth links, hide user menu
    if (authLinksDiv) authLinksDiv.style.display = 'block';
    if (userMenuDiv) userMenuDiv.style.display = 'none';
  }
}

// --- Check user auth state when the page loads ---
supabase.auth.getSession().then(({ data: { session } }) => {
  updateAuthUI(session?.user);
});

// --- Listen for auth changes (login/logout) in real-time ---
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
  updateAuthUI(session?.user);
});
