// auth.js
// This script handles the Sign Up and Log In form submissions

// --- Sign Up Functionality ---
const signUpForm = document.getElementById('signupForm');

if (signUpForm) {
  signUpForm.addEventListener('submit', async (event) => {
    // Prevent the form from refreshing the page
    event.preventDefault();

    // 1. Get the data from the form fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const fullName = document.getElementById('fullName').value;
    const userType = document.querySelector('input[name="userType"]:checked').value;

    // 2. Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (authError) {
      alert('Error creating account: ' + authError.message);
      console.error(authError);
      return;
    }

    // 3. If Auth was successful, add the user's profile to our 'profiles' table
    const user = authData.user;

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        { 
          user_id: user.id, 
          full_name: fullName, 
          user_type: userType 
        }
      ]);

    if (profileError) {
      alert('Account created, but could not save profile: ' + profileError.message);
      console.error(profileError);
      return;
    }

    // 4. SUCCESS!
    alert('Account created successfully! Please check your email for verification.');
    console.log('User and profile created:', user, profileData);
    
    // 5. Redirect the user to the login page
    window.location.href = 'login.html';
  });
}

// --- Login Functionality ---
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Sign in the user with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert('Error logging in: ' + error.message);
      console.error(error);
      return;
    }

    // SUCCESS!
    alert('Login successful! Welcome back.');
    console.log('User logged in:', data.user);
    
    // Redirect the user to the homepage
    window.location.href = 'index.html';
  });
}

// --- Simple Logout Function ---
async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
  } else {
    alert('You have been logged out.');
    window.location.href = 'index.html';
  }
                             }
