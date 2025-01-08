let accessToken = null;

// Fonction pour rediriger vers Spotify pour se connecter
function redirectToSpotify() {
  const clientId = "c3b94a096f0e4ca392978b6ee67d002c";
  const redirectUri = "https://maaar31.github.io/spotify-music-visualizer/";
  const scopes = "user-read-playback-state";
  const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
  window.location.href = url;
}

// Fonction pour gérer le token après la redirection
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
    } else {
      console.error("Erreur : le token d'accès est introuvable.");
      document.getElementById("status").innerText = "Erreur de connexion. Veuillez réessayer.";
    }
  }
}

// Fonction pour récupérer la musique en cours de lecture
async function fetchCurrentlyPlaying() {
  if (!accessToken) {
    console.error("Erreur : aucun token d'accès disponible.");
    document.getElementById("status").innerText = "Erreur : non connecté à Spotify.";
    return;
  }

  try {
    const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200) {
      const data = await response.json();

      // Récupération des informations du morceau
      const trackName = data.item.name;
      const artistName = data.item.artists.map(artist => artist.name).join(", ");
      const albumArt = data.item.album.images[0].url;

      // Mise à jour de l'interface utilisateur
      document.getElementById("track-name").innerText = trackName;
      document.getElementById("artist-name").innerText = artistName;
      document.getElementById("album-art").src = albumArt;
      document.getElementById("playback-info").innerText = data.is_playing ? "En cours" : "En pause";
      document.getElementById("playback-status").style.display = "block";
    } else if (response.status === 204) {
      // Aucun contenu : aucune musique en cours
      document.getElementById("status").innerText = "Aucune musique en cours.";
      document.getElementById("track-name").innerText = "Aucune musique en cours";
      document.getElementById("artist-name").innerText = "Artiste inconnu";
    } else {
      console.error("Erreur de l'API Spotify :", response.status);
      document.getElementById("status").innerText = "Erreur lors de la récupération des informations.";
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la lecture :", error);
    document.getElementById("status").innerText = "Erreur réseau. Veuillez réessayer.";
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
