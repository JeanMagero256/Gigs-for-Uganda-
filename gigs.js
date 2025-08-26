// gigs.js
// This script handles the Post Gig form submission

// Function to post a new gig
const postGigForm = document.getElementById('postGigForm');

if (postGigForm) {
    postGigForm.addEventListener('submit', async (event) => {
        // Prevent the form from refreshing the page
        event.preventDefault();

        // 1. Get the current logged-in user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert('You must be logged in to post a gig.');
            window.location.href = 'login.html';
            return;
        }

        // 2. Get the data from the form fields
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const requiredSkills = document.getElementById('requiredSkills').value;
        const payAmount = document.getElementById('payAmount').value;
        const location = document.getElementById('location').value;
        const estimatedDuration = document.getElementById('estimatedDuration').value;

        // 3. Insert the new gig into the 'gigs' table
        const { data, error } = await supabase
            .from('gigs')
            .insert([
                {
                    title: title,
                    description: description,
                    required_skills: requiredSkills,
                    pay_amount: payAmount,
                    location: location,
                    estimated_duration: estimatedDuration,
                    created_by: user.id // This links the gig to the user who posted it
                }
            ])
            .select(); // This returns the inserted data

        if (error) {
            alert('Error posting gig: ' + error.message);
            console.error('Error details:', error);
            return;
        }

        // 4. SUCCESS!
        alert('Gig posted successfully!');
        console.log('Gig posted:', data);
        
        // 5. Redirect the user to the homepage to see their gig
        window.location.href = 'index.html';
    });
}
