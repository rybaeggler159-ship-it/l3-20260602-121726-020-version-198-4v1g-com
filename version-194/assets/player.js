function initMoviePlayer(videoId, overlayId, streamUrl) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    var playerReady = false;

    if (!video || !overlay || !streamUrl) {
        return;
    }

    function preparePlayer() {
        if (playerReady) {
            return;
        }

        playerReady = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
        } else {
            video.src = streamUrl;
        }
    }

    function startPlayback() {
        preparePlayer();
        overlay.classList.add("is-hidden");
        var playback = video.play();

        if (playback && typeof playback.catch === "function") {
            playback.catch(function () {
                overlay.classList.remove("is-hidden");
            });
        }
    }

    overlay.addEventListener("click", startPlayback);
    video.addEventListener("play", function () {
        overlay.classList.add("is-hidden");
    });
    video.addEventListener("pause", function () {
        if (video.currentTime === 0 || video.ended) {
            overlay.classList.remove("is-hidden");
        }
    });
}
