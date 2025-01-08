let isConnected = false; // État de connexion
let isPlaying = false; // État de lecture

// Exemple : simule une connexion à Spotify
function handleToken(token) {
  if (token) {
    isConnected = true; // Utilisateur connecté
    updateUI();
    fetchCurrentTrack(); // Récupère les informations du morceau en cours
  } else {
    isConnected = false;
    updateUI();
  }
}

// Met à jour l'interface utilisateur
function updateUI() {
  // Affiche ou masque les boutons de connexion
  document.getElementById("connect-btn").style.display = isConnected ? "none" : "block";
  document.getElementById("refresh-btn").style.display = isConnected ? "none" : "block";

  // Affiche ou masque la barre de lecture
  document.getElementById("progress-container").style.display = isPlaying ? "block" : "none";
}

// Récupère les informations du morceau en cours
function fetchCurrentTrack() {
  fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data && data.is_playing) {
        isPlaying = true;

        // Mets à jour les informations du morceau
        document.getElementById("track-name").textContent = data.item.name;
        document.getElementById("artist-name").textContent = data.item.artists.map(artist => artist.name).join(", ");
        document.getElementById("album-art").src = data.item.album.images[0].url;

        // Mets à jour la barre de progression
        updateProgressBar(data.progress_ms, data.item.duration_ms);
      } else {
        isPlaying = false;
      }
      updateUI();
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des informations :", error);
    });
}

// Met à jour la barre de progression
function updateProgressBar(current, total) {
  const progressBar = document.getElementById("progress-bar");
  progressBar.value = (current / total) * 100;

  // Mets à jour la progression en temps réel
  setTimeout(() => {
    if (isPlaying) {
      fetchCurrentTrack(); // Actualise les données
    }
  }, 1000); // Actualise toutes les secondes
}

// Redirection vers Spotify pour se connecter
function redirectToSpotify() {
  const clientId = "c3b94a096f0e4ca392978b6ee67d002c";
  const redirectUri = "https://maaar31.github.io/spotify-music-visualizer/";
  const scope = "user-read-playback-state";
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;

  window.location.href = authUrl;
}

// Gestion du token et initialisation
function handleTokenExpiration() {
  const token = localStorage.getItem("access_token");
  handleToken(token); // Vérifie si le token est valide
}

// Initialisation au chargement de la page
window.onload = function () {
  const hash = window.location.hash;
  if (hash) {
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get("access_token");
    if (token) {
      localStorage.setItem("access_token", token);
      handleToken(token);
    }
  } else {
    handleToken(localStorage.getItem("access_token"));
  }
};
