
import { H as Hls } from './hls-dru42stk.js';

export function initPlayer(source) {
  var video = document.getElementById('movie-player');
  var cover = document.getElementById('player-cover');
  var hls = null;
  var prepared = false;

  if (!video || !cover || !source) {
    return;
  }

  function prepare() {
    if (prepared) {
      return;
    }
    prepared = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }
    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      return;
    }
    video.src = source;
  }

  function play() {
    prepare();
    cover.classList.add('is-hidden');
    video.setAttribute('controls', 'controls');
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        video.setAttribute('controls', 'controls');
      });
    }
  }

  cover.addEventListener('click', play);
  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });
  window.addEventListener('pagehide', function () {
    if (hls && typeof hls.destroy === 'function') {
      hls.destroy();
    }
  });
}
