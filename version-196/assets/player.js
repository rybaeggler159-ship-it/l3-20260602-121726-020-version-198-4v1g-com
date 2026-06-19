(function () {
    function setupPlayer(player) {
        var video = player.querySelector('video[data-video-source]');
        var button = player.querySelector('[data-play-button]');
        var source = video ? video.getAttribute('data-video-source') : '';
        var ready = false;
        var hls = null;

        if (!video || !button || !source) {
            return;
        }

        function loadSource() {
            if (ready) {
                return;
            }

            ready = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    capLevelToPlayerSize: true,
                    startLevel: -1
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
                return;
            }

            video.src = source;
        }

        function startPlayback() {
            loadSource();
            player.classList.add('is-playing');
            video.setAttribute('controls', 'controls');
            video.play().catch(function () {});
        }

        button.addEventListener('click', startPlayback);

        player.addEventListener('click', function (event) {
            if (event.target === player) {
                startPlayback();
            }
        });

        video.addEventListener('play', function () {
            player.classList.add('is-playing');
        });

        window.addEventListener('pagehide', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
})();
