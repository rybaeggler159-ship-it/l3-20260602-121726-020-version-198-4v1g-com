document.addEventListener("DOMContentLoaded", function () {
    setupMobileNavigation();
    setupHeroSlider();
    setupCardFilter();
    setupImageFallbacks();
});

function setupMobileNavigation() {
    const toggle = document.querySelector(".menu-toggle");
    const mobileNav = document.querySelector(".mobile-nav");

    if (!toggle || !mobileNav) {
        return;
    }

    toggle.addEventListener("click", function () {
        mobileNav.classList.toggle("is-open");
    });
}

function setupHeroSlider() {
    const slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(document.querySelectorAll("[data-hero-dot]"));

    if (slides.length === 0) {
        return;
    }

    let activeIndex = 0;

    function showSlide(index) {
        activeIndex = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("is-active", slideIndex === activeIndex);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("is-active", dotIndex === activeIndex);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showSlide(index);
        });
    });

    window.setInterval(function () {
        showSlide(activeIndex + 1);
    }, 5200);
}

function setupCardFilter() {
    const input = document.querySelector("[data-card-filter]");
    const cards = Array.from(document.querySelectorAll(".movie-card"));
    const count = document.querySelector("[data-filter-count]");

    if (!input || cards.length === 0) {
        return;
    }

    if (input.hasAttribute("data-read-query")) {
        const params = new URLSearchParams(window.location.search);
        const query = params.get("q");
        if (query) {
            input.value = query;
        }
    }

    function filterCards() {
        const keyword = input.value.trim().toLowerCase();
        let visibleCount = 0;

        cards.forEach(function (card) {
            const haystack = [
                card.dataset.title,
                card.dataset.year,
                card.dataset.region,
                card.dataset.type,
                card.dataset.category,
                card.textContent
            ].join(" ").toLowerCase();

            const matched = keyword === "" || haystack.includes(keyword);
            card.classList.toggle("is-hidden-by-filter", !matched);

            if (matched) {
                visibleCount += 1;
            }
        });

        if (count) {
            count.textContent = "当前显示 " + visibleCount + " 部影片";
        }
    }

    input.addEventListener("input", filterCards);
    filterCards();
}

function setupImageFallbacks() {
    const images = Array.from(document.querySelectorAll("img"));

    images.forEach(function (image) {
        image.addEventListener("error", function () {
            image.style.opacity = "0";
            image.style.visibility = "hidden";
        }, { once: true });
    });
}
