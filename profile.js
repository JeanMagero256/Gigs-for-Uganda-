// profile.js
// This script handles user profile management

const profileForm = document.getElementById('profileForm');

// Load user profile when page loads
document.addEventListener('DOMContentLoaded', async function() {
    await loadUserProfile();
});

async function loadUserProfile() {
    const profileInfoDiv = document.getElementById('profileInfo');
    
    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        profileInfoDiv.innerHTML = '<p>Please <a href="login.html">log in</a> to view your profile.</p>';
        return;
    }

    // 2. Get user's profile from our database
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (error) {
        profileInfoDiv.innerHTML = '<p>Error loading profile.</p>';
        console.error(error);
        return;
    }

    // 3. Display profile info
    profileInfoDiv.innerHTML = `
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Name:</strong> ${profile.full_name || 'Not set'}</p>
        <p><strong>Role:</strong> ${profile.user_type || 'Not set'}</p>
        <p><strong>Skills:</strong> ${profile.skills || 'Not set'}</p>
    `;

    // 4. Pre-fill the form with existing data
    if (profileForm) {
        document.getElementById('fullName').value = profile.full_name || '';
        document.getElementById('userType').value = profile.user_type || '';
        document.getElementById('skills').value = profile.skills || '';
        document.getElementById('bio').value = profile.bio || '';
    }
}

// Update profile when form is submitted
if (profileForm) {
    profileForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // 1. Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            alert('Please log in to update your profile.');
            return;
        }

        // 2. Get form data
        const fullName = document.getElementById('fullName').value;
        const userType = document.getElementById('userType').value;
        const skills = document.getElementById('skills').value;
        const bio = document.getElementById('bio').value;

        // 3. Update profile in database
        const { data, error } = await supabase
            .from('profiles')
            .update({
                full_name: fullName,
                user_type: userType,
                skills: skills,
                bio: bio
            })
            .eq('user_id', user.id);

        if (error) {
            alert('Error updating profile: ' + error.message);
            console.error(error);
            return;
        }

        // 4. SUCCESS!
        alert('Profile updated successfully!');
        await loadUserProfile(); // Reload the profile display
    });
}
