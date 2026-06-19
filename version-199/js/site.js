(function () {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  document.querySelectorAll('[data-filter-form]').forEach(function (form) {
    var scope = form.closest('.container') || document;
    var keyword = form.querySelector('[data-filter-keyword]');
    var year = form.querySelector('[data-filter-year]');
    var type = form.querySelector('[data-filter-type]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));

    function norm(value) {
      return (value || '').toString().trim().toLowerCase();
    }

    function applyFilter() {
      var q = norm(keyword && keyword.value);
      var y = norm(year && year.value);
      var t = norm(type && type.value);
      cards.forEach(function (card) {
        var hay = norm([
          card.dataset.title,
          card.dataset.year,
          card.dataset.region,
          card.dataset.type,
          card.dataset.tags
        ].join(' '));
        var ok = true;
        if (q && hay.indexOf(q) === -1) {
          ok = false;
        }
        if (y && norm(card.dataset.year) !== y) {
          ok = false;
        }
        if (t && norm(card.dataset.type) !== t) {
          ok = false;
        }
        card.classList.toggle('is-hidden', !ok);
      });
    }

    [keyword, year, type].forEach(function (el) {
      if (el) {
        el.addEventListener('input', applyFilter);
        el.addEventListener('change', applyFilter);
      }
    });
  });
})();

function initPlayer(sourceUrl) {
  var video = document.getElementById('movieVideo');
  var overlay = document.getElementById('playOverlay');
  var box = video ? video.closest('.player-box') : null;
  var message = document.getElementById('playerMessage');
  var hlsInstance = null;

  if (!video || !sourceUrl) {
    return;
  }

  function showMessage(text) {
    if (message) {
      message.textContent = text;
      message.hidden = false;
    }
  }

  function bindSource() {
    if (hlsInstance || video.src) {
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(sourceUrl);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          showMessage('视频暂时无法播放，请稍后重试。');
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hlsInstance.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hlsInstance.recoverMediaError();
          }
        }
      });
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
      return;
    }
    showMessage('视频暂时无法播放，请稍后重试。');
  }

  function startPlay() {
    bindSource();
    var attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function () {
        showMessage('点击视频控件可继续播放。');
      });
    }
  }

  bindSource();

  if (overlay) {
    overlay.addEventListener('click', startPlay);
  }

  video.addEventListener('play', function () {
    if (box) {
      box.classList.add('playing');
    }
  });

  video.addEventListener('pause', function () {
    if (box && video.currentTime === 0) {
      box.classList.remove('playing');
    }
  });
}
