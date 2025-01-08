let accessToken = null;

// Fonction pour rediriger vers Spotify pour se connecter
function redirectToSpotify() {
  const clientId = "c3b94a096f0e4ca392978b6ee67d002c";
  const redirectUri = "https://maaar31.github.io/spotify-music-visualizer/";
  const scopes = "user-read-playback-state";
  const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
  window.location.href = url;
}

// Fonction pour gérer le token de Spotify après redirection
function handleSpotifyRedirect() {
  const hash = window.location.hash;
  if (hash) {
    const token = new URLSearchParams(hash.substring(1)).get("access_token");
    if (token) {
      accessToken = token;
      document.getElementById("status").innerText = "Connecté à Spotify !";
      document.getElementById("connect-btn").style.display = "none";
      document.getElementById("refresh-btn").style.display = "inline-block";
      fetchCurrentlyPlaying();
    }
  }
}

// Fonction pour récupérer la musique en cours de lecture
async function fetchCurrentlyPlaying() {
  if (!accessToken) return;

  try {
    const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (response.status === 200) {
      const data = await response.json();
      const trackName = data.item.name;
      const artistName = data.item.artists.map(artist => artist.name).join(", ");
      const albumArt = data.item.album.images[0].url;

      document.getElementById("track-name").innerText = trackName;
      document.getElementById("artist-name").innerText = artistName;
      document.getElementById("album-art").src = albumArt;
      document.getElementById("playback-info").innerText = data.is_playing ? "En cours" : "En pause";
      document.getElementById("playback-status").style.display = "block";
    } else {
      document.getElementById("status").innerText = "Aucune musique en cours.";
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la lecture :", error);
  }
}

// Fonction pour gérer l'expiration du token
function handleTokenExpiration() {
  alert("Reconnectez-vous à Spotify !");
  redirectToSpotify();
}

// Basculer l'état du vinyle (animation)
function toggleVinyl() {
  const albumContainer = document.querySelector('.album-container');
  albumContainer.classList.toggle('active');
}

// Appel initial pour vérifier le token
handleSpotifyRedirect();
