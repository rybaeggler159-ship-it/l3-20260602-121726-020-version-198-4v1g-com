(function () {
    var mobileButton = document.querySelector("[data-mobile-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (mobileButton && mobileNav) {
        mobileButton.addEventListener("click", function () {
            mobileNav.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
        var current = 0;

        function showSlide(next) {
            slides[current].classList.remove("is-active");
            dots[current].classList.remove("is-active");
            current = next;
            slides[current].classList.add("is-active");
            dots[current].classList.add("is-active");
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide((current + 1) % slides.length);
            }, 5200);
        }
    }

    var searchPage = document.querySelector("[data-search-page]");

    if (searchPage) {
        var params = new URLSearchParams(window.location.search);
        var queryInput = searchPage.querySelector("[data-search-input]");
        var typeFilter = searchPage.querySelector("[data-type-filter]");
        var yearFilter = searchPage.querySelector("[data-year-filter]");
        var categoryFilter = searchPage.querySelector("[data-category-filter]");
        var form = searchPage.querySelector("[data-filter-form]");
        var cards = Array.prototype.slice.call(searchPage.querySelectorAll(".movie-card"));

        if (queryInput) {
            queryInput.value = params.get("q") || "";
        }

        function normalize(value) {
            return (value || "").toString().trim().toLowerCase();
        }

        function applyFilters() {
            var q = normalize(queryInput && queryInput.value);
            var type = normalize(typeFilter && typeFilter.value);
            var year = normalize(yearFilter && yearFilter.value);
            var category = normalize(categoryFilter && categoryFilter.value);

            cards.forEach(function (card) {
                var text = normalize(card.innerText + " " + card.dataset.title + " " + card.dataset.region);
                var matchesText = !q || text.indexOf(q) !== -1;
                var matchesType = !type || normalize(card.dataset.type) === type;
                var matchesYear = !year || normalize(card.dataset.year).indexOf(year) !== -1;
                var matchesCategory = !category || normalize(card.dataset.category) === category;
                card.hidden = !(matchesText && matchesType && matchesYear && matchesCategory);
            });
        }

        [queryInput, typeFilter, yearFilter, categoryFilter].forEach(function (control) {
            if (control) {
                control.addEventListener("input", applyFilters);
                control.addEventListener("change", applyFilters);
            }
        });

        if (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                applyFilters();
            });
        }

        applyFilters();
    }
})();
