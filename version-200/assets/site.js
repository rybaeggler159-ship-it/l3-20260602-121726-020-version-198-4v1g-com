document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('.hero-dot'));
    let current = 0;

    function showSlide(next) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = next;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide((current + 1) % slides.length);
      }, 5200);
    }
  }

  const filterInput = document.querySelector('.card-filter');
  const yearFilter = document.querySelector('.year-filter');
  const filterTarget = document.querySelector('.filter-target');

  if (filterTarget) {
    const cards = Array.from(filterTarget.querySelectorAll('.movie-card'));
    const years = Array.from(new Set(cards.map(function (card) {
      return card.getAttribute('data-year') || '';
    }).filter(Boolean))).sort().reverse();

    if (yearFilter) {
      years.forEach(function (year) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
      });
    }

    function applyFilter() {
      const keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
      const yearValue = yearFilter ? yearFilter.value : '';
      cards.forEach(function (card) {
        const text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre')
        ].join(' ').toLowerCase();
        const matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        const matchYear = !yearValue || card.getAttribute('data-year') === yearValue;
        card.style.display = matchKeyword && matchYear ? '' : 'none';
      });
    }

    if (filterInput) {
      filterInput.addEventListener('input', applyFilter);
    }
    if (yearFilter) {
      yearFilter.addEventListener('change', applyFilter);
    }
  }

  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  if (searchInput && searchResults && window.MOVIE_SEARCH_DATA) {
    const params = new URLSearchParams(window.location.search);
    const initial = params.get('q') || '';
    searchInput.value = initial;

    function renderSearch() {
      const keyword = searchInput.value.trim().toLowerCase();
      const list = keyword
        ? window.MOVIE_SEARCH_DATA.filter(function (item) {
            return item.search.indexOf(keyword) !== -1;
          }).slice(0, 120)
        : window.MOVIE_SEARCH_DATA.slice(0, 60);

      searchResults.innerHTML = list.map(function (item) {
        return [
          '<article class="movie-card">',
          '  <a class="poster-link" href="' + item.href + '">',
          '    <img src="' + item.cover + '" alt="' + item.title + '" loading="lazy">',
          '  </a>',
          '  <div class="card-body">',
          '    <div class="card-meta">',
          '      <span>' + item.year + '</span>',
          '      <span>' + item.region + '</span>',
          '      <span>' + item.type + '</span>',
          '    </div>',
          '    <h3><a href="' + item.href + '">' + item.title + '</a></h3>',
          '    <p>' + item.oneLine + '</p>',
          '    <div class="tag-row"><span>' + item.genre + '</span></div>',
          '  </div>',
          '</article>'
        ].join('');
      }).join('');
    }

    searchInput.addEventListener('input', renderSearch);
    renderSearch();
  }
});
