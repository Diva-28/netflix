const API_URL = '/api';

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const token = localStorage.getItem('netflix_token');
    
    // Inject Modal HTML for Login/Register
    const modalHTML = `
        <div id="authModal" style="display:none; position:fixed; z-index:100; left:0; top:0; width:100%; height:100%; background-color:rgba(0,0,0,0.8);">
            <div style="background-color:#000; color:#fff; margin:15% auto; padding:40px; border:1px solid #333; width:400px; text-align:left; border-radius:5px;">
                <span id="closeModal" style="color:#aaa; float:right; font-size:28px; font-weight:bold; cursor:pointer;">&times;</span>
                <h2 id="modalTitle" style="margin-bottom: 20px;">Sign In</h2>
                <input type="email" id="authEmail" placeholder="Email" style="width:100%; padding:10px; margin:10px 0; background:#333; color:white; border:none; border-radius:4px; box-sizing: border-box;">
                <input type="password" id="authPassword" placeholder="Password" style="width:100%; padding:10px; margin:10px 0; background:#333; color:white; border:none; border-radius:4px; box-sizing: border-box;">
                <button id="authSubmitBtn" style="width:100%; padding:12px; background:#e50914; color:white; border:none; font-weight:bold; cursor:pointer; margin-top:15px; border-radius:4px;">Sign In</button>
                <p style="margin-top:20px; color:#737373;">
                    <span id="toggleAuthText">New to Netflix?</span> 
                    <a href="#" id="toggleAuthMode" style="color:#fff;">Sign up now.</a>
                </p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const authModal = document.getElementById('authModal');
    const signInBtn = document.querySelector('.showcase-top .btn');
    const closeModal = document.getElementById('closeModal');
    const toggleAuthMode = document.getElementById('toggleAuthMode');
    const modalTitle = document.getElementById('modalTitle');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const toggleAuthText = document.getElementById('toggleAuthText');
    const emailInput = document.getElementById('authEmail');
    const passwordInput = document.getElementById('authPassword');
    
    let isLoginMode = true;

    // Show modal on Sign In click
    if(signInBtn) {
        signInBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if(localStorage.getItem('netflix_token')) {
                // Already logged in, logout logic
                localStorage.removeItem('netflix_token');
                alert('Logged out successfully');
                window.location.reload();
            } else {
                authModal.style.display = 'block';
            }
        });
        
        if (token) {
            signInBtn.innerText = "Sign Out";
        }
    }

    // Close Modal
    closeModal.onclick = () => { authModal.style.display = 'none'; }
    window.onclick = (e) => { if(e.target == authModal) authModal.style.display = 'none'; }

    // Toggle Login / Register
    toggleAuthMode.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        if(isLoginMode) {
            modalTitle.innerText = "Sign In";
            authSubmitBtn.innerText = "Sign In";
            toggleAuthText.innerText = "New to Netflix?";
            toggleAuthMode.innerText = "Sign up now.";
        } else {
            modalTitle.innerText = "Sign Up";
            authSubmitBtn.innerText = "Sign Up";
            toggleAuthText.innerText = "Already have an account?";
            toggleAuthMode.innerText = "Sign in now.";
        }
    });

    // Handle Submit
    authSubmitBtn.addEventListener('click', async () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        const endpoint = isLoginMode ? '/auth/login' : '/auth/register';

        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if(res.ok) {
                localStorage.setItem('netflix_token', data.token);
                alert(data.message);
                authModal.style.display = 'none';
                window.location.reload();
            } else {
                alert(data.error || 'Authentication failed');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Server error, make sure the backend is running.');
        }
    });

    // If logged in, fetch and show movies
    if(token) {
        fetchMovies();
    }
});

let fetchedMovies = [];

async function fetchMovies() {
    try {
        const res = await fetch(`${API_URL}/movies/all`);
        const data = await res.json();
        
        // Flatten into fetchedMovies for the player modal
        fetchedMovies = [...data.trending, ...data.originals, ...data.action];
        
        // Render movies
        const showcase = document.querySelector('.showcase-content');
        if(showcase) {
            let html = '';
            
            const renderRow = (title, movies) => {
                return `
                    <h2 style="margin-top:20px; text-align:left; width:100%; padding-left:50px; font-size:1.5rem;">${title}</h2>
                    <div style="display:flex; gap:15px; overflow-x:auto; padding:20px 50px; width:100%; box-sizing:border-box;">
                        ${movies.map((movie) => {
                            // Find global index
                            const globalIndex = fetchedMovies.findIndex(m => m.id === movie.id);
                            return `<img src="${movie.poster_path}" alt="${movie.title}" onclick="playMovie(${globalIndex})" style="height:250px; width:auto; border-radius:5px; transition: transform 0.3s; cursor:pointer;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">`;
                        }).join('')}
                    </div>
                `;
            };

            html += `<h1 style="margin-top:-50px; text-align:left; width:100%; padding-left:50px; font-size:3rem; margin-bottom: 20px;">Browse</h1>`;
            html += renderRow('Trending Now', data.trending);
            html += renderRow('Netflix Originals', data.originals);
            html += renderRow('Action Movies', data.action);

            showcase.innerHTML = html;
        }
        
        // Hide other marketing sections
        document.querySelector('.style-cards').style.display = 'none';
        document.querySelector('.lastsec').style.display = 'none';
        
    } catch (err) {
        console.error('Failed to fetch movies', err);
    }
}

// Attach a player modal to the body
document.addEventListener('DOMContentLoaded', () => {
    const playerHTML = `
        <div id="playerModal" style="display:none; position:fixed; z-index:1000; left:0; top:0; width:100%; height:100%; background-color:rgba(0,0,0,0.9);">
            <div style="position:relative; width:80%; max-width:900px; margin:5% auto; background:#141414; padding:20px; border-radius:10px; color:white; box-shadow:0 0 20px rgba(0,0,0,0.5);">
                <span id="closePlayer" style="position:absolute; right:20px; top:10px; color:#aaa; font-size:35px; cursor:pointer;">&times;</span>
                <h2 id="playerTitle" style="margin-bottom:10px;">Movie Title</h2>
                <p id="playerDesc" style="margin-bottom:20px; color:#ccc; font-weight:normal; font-size:16px;">Description goes here.</p>
                <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden;">
                    <iframe id="playerVideo" src="" style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;" allowfullscreen></iframe>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', playerHTML);
    
    document.getElementById('closePlayer').onclick = () => {
        const playerModal = document.getElementById('playerModal');
        const playerVideo = document.getElementById('playerVideo');
        playerModal.style.display = 'none';
        playerVideo.src = ""; // Stop video playback
    };
});

window.playMovie = function(index) {
    const movie = fetchedMovies[index];
    if(movie) {
        document.getElementById('playerTitle').innerText = movie.title;
        document.getElementById('playerDesc').innerText = movie.description;
        document.getElementById('playerVideo').src = movie.video_url + "?autoplay=1";
        document.getElementById('playerModal').style.display = 'block';
    }
}
