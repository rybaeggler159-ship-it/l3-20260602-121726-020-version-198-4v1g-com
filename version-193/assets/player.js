document.addEventListener("DOMContentLoaded", function () {
    const playerCard = document.querySelector(".player-card");
    const video = document.querySelector("#video-player");
    const button = document.querySelector("[data-play-button]");

    if (!playerCard || !video || !button) {
        return;
    }

    const videoUrl = playerCard.dataset.videoUrl;

    button.addEventListener("click", function () {
        startPlayback(playerCard, video, videoUrl);
    });
});

function startPlayback(playerCard, video, videoUrl) {
    if (!videoUrl) {
        return;
    }

    playerCard.classList.add("is-playing");

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl;
        video.play();
        return;
    }

    if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
        });

        hls.loadSource(videoUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play();
        });
        return;
    }

    video.src = videoUrl;
    video.play();
}
