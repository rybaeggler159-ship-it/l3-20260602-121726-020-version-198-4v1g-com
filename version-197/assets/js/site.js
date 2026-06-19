(function () {
    var menuButton = document.querySelector(".js-menu-button");
    var mobilePanel = document.querySelector(".js-mobile-panel");

    if (menuButton && mobilePanel) {
        menuButton.addEventListener("click", function () {
            mobilePanel.classList.toggle("open");
        });
    }

    var hero = document.querySelector(".js-hero");

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll(".js-hero-dot"));
        var current = 0;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }
    }

    var inputs = Array.prototype.slice.call(document.querySelectorAll(".js-search-input"));
    var yearFilter = document.querySelector(".js-year-filter");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".js-movie-card"));
    var empty = document.querySelector(".js-empty-state");

    function applyFilters() {
        var query = inputs.map(function (input) {
            return input.value.trim().toLowerCase();
        }).filter(Boolean).pop() || "";
        var year = yearFilter ? yearFilter.value : "";
        var visible = 0;

        cards.forEach(function (card) {
            var text = [
                card.getAttribute("data-title") || "",
                card.getAttribute("data-year") || "",
                card.getAttribute("data-region") || "",
                card.getAttribute("data-genre") || ""
            ].join(" ").toLowerCase();
            var matchedQuery = !query || text.indexOf(query) > -1;
            var matchedYear = !year || card.getAttribute("data-year") === year;
            var matched = matchedQuery && matchedYear;
            card.classList.toggle("is-hidden", !matched);
            if (matched) {
                visible += 1;
            }
        });

        if (empty) {
            empty.classList.toggle("show", visible === 0 && cards.length > 0);
        }
    }

    inputs.forEach(function (input) {
        input.addEventListener("input", function () {
            inputs.forEach(function (target) {
                if (target !== input) {
                    target.value = input.value;
                }
            });
            applyFilters();
        });
    });

    if (yearFilter) {
        yearFilter.addEventListener("change", applyFilters);
    }

    Array.prototype.slice.call(document.querySelectorAll(".js-search-form")).forEach(function (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            applyFilters();
            var first = document.querySelector(".js-movie-card:not(.is-hidden) a");
            if (first) {
                first.focus();
            }
        });
    });
}());
