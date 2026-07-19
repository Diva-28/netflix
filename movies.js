const express = require('express');
const router = express.Router();

// Mock data to simulate TMDB API response
// Mock data to simulate TMDB API response with full details
const mockMovies = [
    { id: 1, title: 'Stranger Things', poster_path: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8OS2j312Z.jpg', description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.', video_url: 'https://www.youtube.com/embed/b9EkMc79ZSU', category: 'trending' },
    { id: 2, title: 'The Witcher', poster_path: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg', description: 'Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.', video_url: 'https://www.youtube.com/embed/ndl1W4ltcmg', category: 'originals' },
    { id: 3, title: 'Money Heist', poster_path: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg', description: 'To carry out the biggest heist in history, a mysterious man called The Professor recruits a band of eight robbers who have a single characteristic: none of them has anything to lose.', video_url: 'https://www.youtube.com/embed/_InqQJRqGW4', category: 'trending' },
    { id: 4, title: 'Breaking Bad', poster_path: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizXCJo.jpg', description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.', video_url: 'https://www.youtube.com/embed/HhesaQXLuRY', category: 'trending' },
    { id: 5, title: 'Squid Game', poster_path: 'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg', description: 'Hundreds of cash-strapped players accept a strange invitation to compete in children\'s games. Inside, a tempting prize awaits with deadly high stakes.', video_url: 'https://www.youtube.com/embed/oqxAJKy0ii4', category: 'originals' },
    { id: 6, title: 'Avengers: Endgame', poster_path: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', description: 'After the devastating events of Infinity War, the universe is in ruins. The Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.', video_url: 'https://www.youtube.com/embed/TcMBFSGVi1c', category: 'action' },
    { id: 7, title: 'Interstellar', poster_path: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', video_url: 'https://www.youtube.com/embed/zSWdZVtXT7E', category: 'trending' },
    { id: 8, title: 'The Dark Knight', poster_path: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', video_url: 'https://www.youtube.com/embed/EXeTwQWrcwY', category: 'action' },
    { id: 9, title: 'Inception', poster_path: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', video_url: 'https://www.youtube.com/embed/YoHD9XEInc0', category: 'trending' },
    { id: 10, title: 'The Matrix', poster_path: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', video_url: 'https://www.youtube.com/embed/m8e-FF8MsqU', category: 'action' },
    { id: 11, title: 'Narcos', poster_path: 'https://image.tmdb.org/t/p/w500/rTmal9fDbwh5F0eaCQhqQwTD9Aq.jpg', description: 'A chronicled look at the criminal exploits of Colombian drug lord Pablo Escobar, as well as the many other drug kingpins who plagued the country through the years.', video_url: 'https://www.youtube.com/embed/U7elNhHwgBU', category: 'originals' },
    { id: 12, title: 'Dark', poster_path: 'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg', description: 'A family saga with a supernatural twist, set in a German town, where the disappearance of two young children exposes the relationships among four families.', video_url: 'https://www.youtube.com/embed/rrwycJ08PSA', category: 'originals' },
    { id: 13, title: 'Gladiator', poster_path: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg', description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.', video_url: 'https://www.youtube.com/embed/owK1qxDselE', category: 'action' },
    { id: 14, title: 'Peaky Blinders', poster_path: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LcUAYBlERzH3gOkae7F.jpg', description: 'A gangster family epic set in 1919 Birmingham, England; centered on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby.', video_url: 'https://www.youtube.com/embed/oVzVdvGIC7U', category: 'originals' }
];

// In a real application with a TMDB API key, you would use axios/fetch:
// const fetch = require('node-fetch');
// const TMDB_API_KEY = 'YOUR_API_KEY_HERE';

// Get movies grouped by category
router.get('/all', (req, res) => {
    // Simulated delay
    setTimeout(() => {
        const categories = {
            trending: mockMovies.filter(m => m.category === 'trending'),
            originals: mockMovies.filter(m => m.category === 'originals'),
            action: mockMovies.filter(m => m.category === 'action')
        };
        res.json(categories);
    }, 500);
});

// Provide backward compatibility just in case
router.get('/trending', (req, res) => {
    res.json({ results: mockMovies.filter(m => m.category === 'trending') });
});

module.exports = router;
