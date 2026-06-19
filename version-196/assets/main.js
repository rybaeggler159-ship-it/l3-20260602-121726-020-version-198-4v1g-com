(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        function startHero() {
            stopHero();
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }

        function stopHero() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(index - 1);
                startHero();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(index + 1);
                startHero();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                startHero();
            });
        });

        hero.addEventListener('mouseenter', stopHero);
        hero.addEventListener('mouseleave', startHero);
        showSlide(0);
        startHero();
    }

    var localFilter = document.querySelector('[data-local-filter]');

    if (localFilter) {
        var localCards = Array.prototype.slice.call(document.querySelectorAll('[data-local-list] .movie-card'));

        localFilter.addEventListener('input', function () {
            var keyword = localFilter.value.trim().toLowerCase();

            localCards.forEach(function (card) {
                var text = card.textContent.toLowerCase();
                card.hidden = keyword && text.indexOf(keyword) === -1;
            });
        });
    }

    var searchPage = document.querySelector('[data-search-page]');

    if (searchPage) {
        var params = new URLSearchParams(window.location.search);
        var input = searchPage.querySelector('[data-search-input]');
        var region = searchPage.querySelector('[data-region-filter]');
        var type = searchPage.querySelector('[data-type-filter]');
        var year = searchPage.querySelector('[data-year-filter]');
        var resultCount = searchPage.querySelector('[data-result-count]');
        var cards = Array.prototype.slice.call(searchPage.querySelectorAll('[data-search-card]'));

        if (input) {
            input.value = params.get('q') || '';
        }

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function includes(card, keyword) {
            if (!keyword) {
                return true;
            }

            var joined = [
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-type'),
                card.getAttribute('data-year'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-tags'),
                card.textContent
            ].join(' ').toLowerCase();

            return joined.indexOf(keyword) !== -1;
        }

        function filterCards() {
            var keyword = normalize(input && input.value);
            var regionValue = normalize(region && region.value);
            var typeValue = normalize(type && type.value);
            var yearValue = normalize(year && year.value);
            var visible = 0;

            cards.forEach(function (card) {
                var ok = includes(card, keyword);
                ok = ok && (!regionValue || normalize(card.getAttribute('data-region')) === regionValue);
                ok = ok && (!typeValue || normalize(card.getAttribute('data-type')) === typeValue);
                ok = ok && (!yearValue || normalize(card.getAttribute('data-year')) === yearValue);
                card.hidden = !ok;

                if (ok) {
                    visible += 1;
                }
            });

            if (resultCount) {
                resultCount.textContent = visible + ' 部影片';
            }
        }

        [input, region, type, year].forEach(function (control) {
            if (control) {
                control.addEventListener('input', filterCards);
                control.addEventListener('change', filterCards);
            }
        });

        filterCards();
    }

    var backTop = document.querySelector('[data-back-top]');

    if (backTop) {
        window.addEventListener('scroll', function () {
            backTop.classList.toggle('show', window.scrollY > 520);
        }, { passive: true });

        backTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
})();
