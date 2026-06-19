(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var navPanel = document.querySelector('.nav-panel');

  if (menuButton && navPanel) {
    menuButton.addEventListener('click', function () {
      navPanel.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === current);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener('click', function () {
      showSlide(dotIndex);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var input = document.getElementById('siteSearch');
  var resultCount = document.getElementById('resultCount');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.searchable-card'));

  function updateSearch() {
    if (!input || !cards.length) {
      return;
    }

    var query = input.value.trim().toLowerCase();
    var visible = 0;

    cards.forEach(function (card) {
      var target = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
      var match = query === '' || target.indexOf(query) !== -1;
      card.classList.toggle('is-filtered-out', !match);

      if (match) {
        visible += 1;
      }
    });

    if (resultCount) {
      resultCount.textContent = visible + ' 条结果';
    }
  }

  if (input) {
    input.addEventListener('input', updateSearch);
    updateSearch();
  }
})();

function initStreamPlayer(source, videoId, coverId, buttonId) {
  var video = document.getElementById(videoId);
  var cover = document.getElementById(coverId);
  var button = document.getElementById(buttonId);
  var loaded = false;
  var hls = null;

  if (!video || !source) {
    return;
  }

  function attachSource() {
    if (loaded) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls();
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }

    loaded = true;
  }

  function playVideo() {
    attachSource();

    if (cover) {
      cover.classList.add('is-hidden');
    }

    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  if (cover) {
    cover.addEventListener('click', playVideo);
  }

  if (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      playVideo();
    });
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      playVideo();
    }
  });

  video.addEventListener('play', function () {
    if (cover) {
      cover.classList.add('is-hidden');
    }
  });

  video.addEventListener('ended', function () {
    if (hls && typeof hls.destroy === 'function') {
      hls.destroy();
      hls = null;
      loaded = false;
    }
  });
}
