// display-gigs.js
// This script loads and displays all gigs on the homepage

async function loadGigs() {
    // 1. Get the container where gigs will be displayed
    const gigsContainer = document.getElementById('gigsContainer');
    
    // Show a loading message
    gigsContainer.innerHTML = '<p>Loading available gigs...</p>';

    // 2. Fetch all ACTIVE gigs from the 'gigs' table
    const { data: gigs, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('is_active', true) // Only show active gigs
        .order('created_at', { ascending: false }); // Newest gigs first

    if (error) {
        gigsContainer.innerHTML = '<p>Error loading gigs. Please refresh the page.</p>';
        console.error('Error loading gigs:', error);
        return;
    }

    // 3. Check if there are any gigs
    if (gigs.length === 0) {
        gigsContainer.innerHTML = '<p>No gigs available right now. Check back later!</p>';
        return;
    }

    // 4. Clear the loading message and display the gigs
    gigsContainer.innerHTML = ''; // Clear the container

    gigs.forEach(gig => {
        const gigCard = document.createElement('div');
        gigCard.className = 'gig-card';
        gigCard.innerHTML = `
            <h3>${gig.title}</h3>
            <p><strong>Description:</strong> ${gig.description}</p>
            <p><strong>Skills Needed:</strong> ${gig.required_skills}</p>
            <p><strong>Pay:</strong> ${gig.pay_amount} UGX</p>
            <p><strong>Location:</strong> ${gig.location}</p>
            <p><strong>Duration:</strong> ${gig.estimated_duration}</p>
            <button onclick="applyForGig('${gig.id}')">Apply for this Gig</button>
        `;
        gigsContainer.appendChild(gigCard);
    });
}

// Function to apply for a gig (we will build this later)
// display-gigs.js
// This script loads and displays all gigs on the homepage and handles applications

async function loadGigs() {
    const gigsContainer = document.getElementById('gigsContainer');
    gigsContainer.innerHTML = '<p>Loading available gigs...</p>';

    const { data: gigs, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) {
        gigsContainer.innerHTML = '<p>Error loading gigs. Please refresh the page.</p>';
        console.error('Error loading gigs:', error);
        return;
    }

    if (gigs.length === 0) {
        gigsContainer.innerHTML = '<p>No gigs available right now. Check back later!</p>';
        return;
    }

    gigsContainer.innerHTML = '';

    gigs.forEach(gig => {
        const gigCard = document.createElement('div');
        gigCard.className = 'gig-card';
        gigCard.innerHTML = `
            <h3>${gig.title}</h3>
            <p><strong>Description:</strong> ${gig.description}</p>
            <p><strong>Skills Needed:</strong> ${gig.required_skills}</p>
            <p><strong>Pay:</strong> ${gig.pay_amount} UGX</p>
            <p><strong>Location:</strong> ${gig.location}</p>
            <p><strong>Duration:</strong> ${gig.estimated_duration}</p>
            <button onclick="applyForGig('${gig.id}')">Apply for this Gig</button>
        `;
        gigsContainer.appendChild(gigCard);
    });
}

// --- REAL Application Function ---
async function applyForGig(gigId) {
    // 1. Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        alert('Please log in to apply for gigs.');
        window.location.href = 'login.html';
        return;
    }

    // 2. Check if user has a gig_seeker profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('user_id', user.id)
        .single();

    if (profileError || profile?.user_type !== 'gig_seeker') {
        alert('Only Gig Seekers can apply for gigs. Please update your profile.');
        window.location.href = 'profile.html';
        return;
    }

    // 3. Check if user already applied for this gig
    const { data: existingApplication, error: checkError } = await supabase
        .from('applications')
        .select('id')
        .eq('gig_id', gigId)
        .eq('applicant_id', user.id)
        .maybeSingle(); // Use maybeSingle() instead of single() to avoid throwing error if no record exists

    if (existingApplication) {
        alert('You have already applied for this gig!');
        return;
    }

    // 4. Create the application
    const { data, error } = await supabase
        .from('applications')
        .insert([
            {
                gig_id: gigId,
                applicant_id: user.id,
                status: 'pending'
            }
        ]);

    if (error) {
        alert('Error applying for gig: ' + error.message);
        console.error('Application error:', error);
        return;
    }

    // 5. SUCCESS!
    alert('Application submitted successfully! The gig owner will contact you.');
    console.log('Application created for gig:', gigId);
}

// Load gigs when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadGigs();
});
