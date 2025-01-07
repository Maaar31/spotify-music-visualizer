// Variables globales
const playPauseButton = document.getElementById('play-pause');
const vinyl = document.getElementById('vinyl');
const connectSpotifyButton = document.getElementById('connect-spotify');
let isPlaying = false;
let accessToken = null;

// Bouton lecture/pause
playPauseButton.addEventListener('click', () => {
  if (isPlaying) {
    vinyl.style.animationPlayState = 'paused';
    playPauseButton.textContent = '⏯️'; // Bouton Play
    isPlaying = false;
  } else {
    vinyl.style.animationPlayState = 'running';
    playPauseButton.textContent = '⏸️'; // Bouton Pause
    isPlaying = true;
  }
});

// Connexion à Spotify
connectSpotifyButton.addEventListener('click', () => {
  const clientId = 'c3b94a096f0e4ca392978b6ee67d002c'; // Remplace par ton client ID Spotify
  const redirectUri = 'https://maaar31.github.io/spotify-music-visualizer/'; // Lien vers ton site GitHub Pages
  const scope = 'user-read-playback-state';

  // Redirige vers Spotify pour l'authentification
  window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scope}`;
});

// Récupérer le token depuis l'URL (après redirection)
window.onload = () => {
  const hash = window.location.hash;
  if (hash) {
    const params = new URLSearchParams(hash.substring(1));
    accessToken = params.get('access_token');
    if (accessToken) {
      fetchSpotifyData();
    }
  }
};

// Fonction pour récupérer les données Spotify
async function fetchSpotifyData() {
  if (!accessToken) return;

  const response = await fetch('https://api.spotify.com/v1/me/player', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status === 200) {
    const data = await response.json();
    updatePlayer(data.item);
  } else {
    console.error('Erreur lors de la récupération des données Spotify.');
  }
}

// Mise à jour des informations de la musique
function updatePlayer(data) {
  const albumCover = document.getElementById('album-cover');
  const songTitle = document.getElementById('song-title');
  const artistName = document.getElementById('artist-name');

  albumCover.src = data.album.images[0].url; // URL de la pochette
  songTitle.textContent = data.name; // Nom de la chanson
  artistName.textContent = data.artists.map(artist => artist.name).join(', '); // Artistes
}
