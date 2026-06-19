(function () {
    function createMoviePlayer(options) {
        if (!options || !options.video || !options.source) {
            return;
        }

        var video = options.video;
        var cover = options.cover;
        var playButton = options.playButton;
        var mediaSource = options.source;
        var started = false;

        function bindSource() {
            if (started) {
                return;
            }
            started = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = mediaSource;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(mediaSource);
                hls.attachMedia(video);
            } else {
                video.src = mediaSource;
            }
        }

        function start() {
            bindSource();
            if (cover) {
                cover.classList.add("is-hidden");
            }
            video.play().catch(function () {
                video.controls = true;
            });
        }

        if (cover) {
            cover.addEventListener("click", start);
        }
        if (playButton) {
            playButton.addEventListener("click", function (event) {
                event.stopPropagation();
                start();
            });
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });
    }

    window.createMoviePlayer = createMoviePlayer;
}());
