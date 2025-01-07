// Redirection vers Spotify pour la connexion
function redirectToSpotify() {
  const clientId = 'c3b94a096f0e4ca392978b6ee67d002c'; // Remplace par ton client_id
  const redirectUri = 'https://maaar31.github.io/spotify-music-visualizer/'; // Ton URI de redirection
  const scope = 'user-read-playback-state';
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

  window.location.href = authUrl;
}

// Récupérer le token de l'URL
function getAccessTokenFromUrl() {
  const hash = window.location.hash;
  if (!hash) return null;

  const params = new URLSearchParams(hash.substring(1));
  return params.get('access_token');
}

// Vérifier si l'utilisateur est connecté
function checkConnection() {
  const token = localStorage.getItem('spotifyAccessToken');
  if (token) {
    document.getElementById('status').innerText = "Connecté à Spotify";
    getPlaybackState(); // Charger les infos de lecture
  } else {
    document.getElementById('status').innerText = "Non connecté. Veuillez vous connecter à Spotify.";
  }
}

// Stocker le token après redirection
const token = getAccessTokenFromUrl();
if (token) {
  localStorage.setItem('spotifyAccessToken', token);
  console.log('Access token récupéré et stocké:', token);
  window.location.hash = ''; // Nettoyer l'URL
}

// Obtenir l'état de lecture actuel
async function getPlaybackState() {
  const token = localStorage.getItem('spotifyAccessToken');
  if (!token) {
    console.error("Aucun token disponible !");
    return;
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/me/player', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Données de lecture :', data);

      const albumArt = data.item.album.images[0].url;
      const trackName = data.item.name;
      const artistName = data.item.artists.map(artist => artist.name).join(', ');

      document.getElementById('album-art').src = albumArt;
      document.getElementById('track-name').innerText = trackName;
      document.getElementById('artist-name').innerText = artistName;
    } else if (response.status === 401) {
      handleTokenExpiration(); // Gérer l'expiration du token
    }
  } catch (error) {
    console.error("Erreur lors de l'obtention de l'état de lecture :", error);
  }
}

// Gérer l'expiration du token
function handleTokenExpiration() {
  console.warn('Token expiré ou invalide. Redirection vers Spotify.');
  localStorage.removeItem('spotifyAccessToken');
  redirectToSpotify();
}

// Vérifier la connexion lors du chargement de la page
checkConnection();
