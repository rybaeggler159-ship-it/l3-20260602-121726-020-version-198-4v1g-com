(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    document.querySelectorAll(".cover-image").forEach(function (image) {
      image.addEventListener("error", function () {
        image.classList.add("image-missing");
      });
    });

    var navToggle = document.querySelector("[data-nav-toggle]");
    var navMenu = document.querySelector("[data-nav-menu]");
    if (navToggle && navMenu) {
      navToggle.addEventListener("click", function () {
        navMenu.classList.toggle("is-open");
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var active = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === active);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === active);
        });
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          show(active + 1);
        }, 5200);
      }

      if (prev) {
        prev.addEventListener("click", function () {
          show(active - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(active + 1);
          restart();
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
          restart();
        });
      });

      show(0);
      restart();
    }

    document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
      var input = panel.querySelector("[data-filter-input]");
      var region = panel.querySelector("[data-filter-region]");
      var type = panel.querySelector("[data-filter-type]");
      var year = panel.querySelector("[data-filter-year]");
      var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));

      function value(control) {
        return control ? control.value.trim().toLowerCase() : "";
      }

      function apply() {
        var keyword = value(input);
        var regionValue = value(region);
        var typeValue = value(type);
        var yearValue = value(year);

        cards.forEach(function (card) {
          var text = [
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-year"),
            card.getAttribute("data-genre"),
            card.textContent
          ].join(" ").toLowerCase();

          var matched = true;
          if (keyword && text.indexOf(keyword) === -1) {
            matched = false;
          }
          if (regionValue && valueFrom(card, "region") !== regionValue) {
            matched = false;
          }
          if (typeValue && valueFrom(card, "type") !== typeValue) {
            matched = false;
          }
          if (yearValue && valueFrom(card, "year") !== yearValue) {
            matched = false;
          }
          card.classList.toggle("is-hidden", !matched);
        });
      }

      function valueFrom(card, name) {
        return (card.getAttribute("data-" + name) || "").trim().toLowerCase();
      }

      [input, region, type, year].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });
    });

    document.querySelectorAll(".js-player").forEach(function (frame) {
      var video = frame.querySelector("video");
      var button = frame.querySelector(".play-overlay");
      var mediaUrl = frame.getAttribute("data-url") || "";
      var initialized = false;
      var hlsInstance = null;

      function initPlayer() {
        if (!video || !mediaUrl || initialized) {
          return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = mediaUrl;
          initialized = true;
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: false,
            backBufferLength: 90
          });
          hlsInstance.loadSource(mediaUrl);
          hlsInstance.attachMedia(video);
          initialized = true;
        }
      }

      function startPlayer() {
        initPlayer();
        if (button) {
          button.classList.add("is-hidden");
        }
        if (video) {
          var promise = video.play();
          if (promise && typeof promise.catch === "function") {
            promise.catch(function () {});
          }
        }
      }

      if (button) {
        button.addEventListener("click", startPlayer);
      }

      if (video) {
        video.addEventListener("click", function () {
          if (!initialized) {
            startPlayer();
          }
        });
      }

      window.addEventListener("pagehide", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  });
})();
