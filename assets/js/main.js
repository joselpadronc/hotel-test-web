/**
 * Template: main JS
 */
(function () {
  "use strict";

  /**
   * Gsap animations
   */
  gsap.registerPlugin(ScrollTrigger); // register ScrollTrigger

  /**
   * Custom functions
   */
  window.scrollTo(0, 0);

  // sliders
  window.addEventListener("load", () => {
    const interleaveOffset = 0.75;
    const windowWidth = window.innerWidth;

    function preventDefault(e) {
      e.preventDefault();
    }

    function debounce(func, wait) {
      let timeout;
      return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
      };
    }

    function disableScroll(scrollTop) {
      window.addEventListener("DOMMouseScroll", preventDefault, false);
      window.addEventListener("wheel", preventDefault, { passive: false });
      window.addEventListener("mousewheel", preventDefault, false);
      // Re-ubica el scroll en la slider para que el usuario no se salte esta seccion
      window.scrollTo(document.documentElement.scrollLeft, scrollTop);
    }

    function enableScroll() {
      window.removeEventListener("DOMMouseScroll", preventDefault, false);
      window.removeEventListener("wheel", preventDefault, { passive: false });
      window.removeEventListener("mousewheel", preventDefault, false);
      window.onscroll = function () {};
    }

    // Motivi Slider
    const motiviSlideElement = document.querySelector(".motivi-slideshow");
    if (windowWidth > 1023) {
      const motiviSlider = new Swiper(motiviSlideElement, {
        direction: "vertical",
        speed: 1000, // velocidad de transición
        loop: false,
        preventInteractionOnTransition: true, // prevent interaction on transition
        watchSlidesProgress: true, // watch slides progress
        pagination: {
          el: ".swiper-pagination",
          clickable: false,
          type: "bullets",
        },
        on: {
          // efecto de transición para los slides
          progress: function () {
            let swiper = this;
            for (let i = 0; i < swiper.slides.length; i++) {
              let slideProgress = swiper.slides[i].progress;
              let innerOffset = swiper.height * interleaveOffset;
              let innerTranslate = slideProgress * innerOffset;

              // utilizo gsap para animar el slider y el contenido
              gsap.set(swiper.slides[i].querySelector(".motivi-inner"), {
                y: innerTranslate,
              });
            }
          },
          setTransition: function (slider, speed) {
            let swiper = this;
            for (let i = 0; i < swiper.slides.length; i++) {
              swiper.slides[i].style.transition = speed + "ms";
              swiper.slides[i].querySelector(".motivi-inner").style.transition =
                speed + "ms";
            }
          },
          // END efecto de transición para los slides
        },
      });

      // Motivi slider arrow navigation
      const arrowMotiviSvg = document.querySelector(".arrow-motivi-svg");
      const verticalSliderSection = document.querySelector(
        "#verticalSliderSection"
      );

      arrowMotiviSvg.addEventListener("click", () => {
        motiviSlider.slideNext();
      });

      const sliderObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const sectionTop =
                entry.target.getBoundingClientRect().top + window.scrollY;
              const offset = window.innerHeight - entry.target.clientHeight;
              const scrollToPosition = sectionTop - offset;
              gsap.to(window, {
                scrollTo: {
                  y: scrollToPosition,
                  autoKill: false,
                },
                duration: 1,
                ease: "power2.out",
              });
              disableScroll(scrollToPosition);

              setTimeout(() => {
                motiviSlider.enable();
                window.addEventListener("wheel", function (event) {
                  if (event.deltaY < 0) {
                    motiviSlider.slidePrev();
                  } else {
                    motiviSlider.slideNext();
                  }
                });
              }, 800);
            } else {
              motiviSlider.disable();
              window.addEventListener("wheel", function () {});
            }
          });
        },
        {
          root: null,
          threshold: 1,
        }
      );
      sliderObserver.observe(verticalSliderSection);

      motiviSlider.on("slideChange", function () {
        if (
          motiviSlider.activeIndex === motiviSlider.slides.length - 1 ||
          motiviSlider.activeIndex === 0
        ) {
          setTimeout(() => {
            motiviSlider.disable();
            enableScroll();
          }, 1000);
        }
      });
    }

    // Initialize Motivi slider
    // if (motiviSlideElement) {
    //   // Si es mobile desactivo el slider
    //   window.addEventListener("resize", () => {
    //     if (window.innerWidth <= 1023 && motiviSlider) {
    //       motiviSlider.destroy(true, true); // destroy slider
    //     }
    //   });
    // }
  });
})();
