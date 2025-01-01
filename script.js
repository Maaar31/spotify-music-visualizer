// Remplacer avec ton propre access token
const access_token = 'AQCVm5E-wIgq-1sVl7IHfTCE2ntyTHERLPNH78bJ8Nq19K2IT273lrNH1bu9ucNIkhr8SRgUDbvvnzegEVmAIcCzPbxHJ6kSuJBcaKEjuTwgHsR3_MnDOi1oFIzg9Z--7VGxwpjl6RbQpEvugPy0CE9nfrdIKrY2VD4fdRoiPFw0vUEMFGm6chUzbohi9UBRJ2ARob5_WWwEhXMpAQZHRTvwlIz9W6HxbzTxbqr607Pa1184WmNoYhAcltERZ6VcPG8P8401-zt72cyw';

// Récupérer la musique en cours de lecture
fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => {
    console.log(data); // Affiche les données pour débogage

    if (data && data.item) {
        const albumCover = data.item.album.images[0].url;
        const albumTitle = data.item.name;
        
        // Afficher l'album et le titre
        document.getElementById('album-cover').src = albumCover;
        document.getElementById('album-title').textContent = albumTitle;
    }
})
.catch(error => {
    console.error('Erreur:', error);
});
