(function () {
  var toggle = document.querySelector('.menu-toggle');
  var panel = document.querySelector('.mobile-panel');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var current = 0;

  function setSlide(index) {
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

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      setSlide(Number(dot.getAttribute('data-slide')) || 0);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      setSlide(current + 1);
    }, 5200);
  }

  var localInput = document.querySelector('.local-filter');
  var yearButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-year]'));
  var activeYear = 'all';

  function applyLocalFilter() {
    var keyword = localInput ? localInput.value.trim().toLowerCase() : '';
    var cards = Array.prototype.slice.call(document.querySelectorAll('.filter-scope .movie-card'));
    cards.forEach(function (card) {
      var text = [
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-genre')
      ].join(' ').toLowerCase();
      var year = card.getAttribute('data-year');
      var hitKeyword = !keyword || text.indexOf(keyword) !== -1;
      var hitYear = activeYear === 'all' || year === activeYear;
      card.classList.toggle('hidden-card', !(hitKeyword && hitYear));
    });
  }

  if (localInput) {
    localInput.addEventListener('input', applyLocalFilter);
  }

  yearButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeYear = button.getAttribute('data-filter-year') || 'all';
      yearButtons.forEach(function (item) {
        item.classList.toggle('active', item === button);
      });
      applyLocalFilter();
    });
  });

  var dataNode = document.getElementById('search-data');
  var resultsNode = document.querySelector('.search-results');
  var titleNode = document.querySelector('.search-title');
  if (dataNode && resultsNode) {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim().toLowerCase();
    if (query) {
      var data = [];
      try {
        data = JSON.parse(dataNode.textContent);
      } catch (error) {
        data = [];
      }
      var hits = data.filter(function (item) {
        return [item.title, item.year, item.region, item.genre, item.tags].join(' ').toLowerCase().indexOf(query) !== -1;
      }).slice(0, 120);
      if (titleNode) {
        titleNode.textContent = '“' + query + '” 的搜索结果';
      }
      resultsNode.innerHTML = hits.map(function (item) {
        return '<article class="movie-card">' +
          '<a class="poster-link" href="' + item.url + '">' +
          '<img src="./' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
          '<span class="score-badge">' + item.score + '</span>' +
          '</a>' +
          '<div class="card-body">' +
          '<a class="card-title" href="' + item.url + '">' + escapeHtml(item.title) + '</a>' +
          '<div class="meta-line">' + escapeHtml(item.year + ' · ' + item.region + ' · ' + item.genre) + '</div>' +
          '<p>' + escapeHtml(item.oneLine) + '</p>' +
          '</div>' +
          '</article>';
      }).join('') || '<p class="empty-result">暂无匹配影片</p>';
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, function (char) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      })[char];
    });
  }
}());
