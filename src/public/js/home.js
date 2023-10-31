var videoId = "8RXz6Uru9WY";

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player("video-container", {
    videoId: videoId,
    playerVars: {
      autoplay: 1, // Reproducir automáticamente el video
      controls: 1, // Mostrar controles del reproductor
      modestbranding: 1, // Ocultar el logotipo de YouTube
      showinfo: 0, // Ocultar información del video
      rel: 0, // No mostrar videos relacionados al final
    },
    events: {
      onReady: onPlayerReady,
    },
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
}

