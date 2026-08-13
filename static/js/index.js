window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}

function initializeSectionNavigation() {
  var nav = document.querySelector('.section-nav');
  if (!nav) return;

  var links = Array.from(nav.querySelectorAll('a[data-section-link]'));
  var sections = links
    .map(function(link) {
      return document.getElementById(link.getAttribute('href').slice(1));
    })
    .filter(Boolean);
  var ticking = false;

  function updateActiveSection() {
    var readingLine = window.scrollY + window.innerHeight * 0.3;
    var activeSection = null;

    sections.forEach(function(section) {
      if (section.offsetTop <= readingLine) {
        activeSection = section;
      }
    });

    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      activeSection = sections[sections.length - 1];
    }

    links.forEach(function(link) {
      var isActive = activeSection && link.getAttribute('href') === '#' + activeSection.id;
      link.classList.toggle('is-active', Boolean(isActive));
      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    ticking = false;
  }

  function requestNavigationUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateActiveSection);
  }

  window.addEventListener('scroll', requestNavigationUpdate, { passive: true });
  window.addEventListener('resize', requestNavigationUpdate);
  window.addEventListener('load', requestNavigationUpdate);
  updateActiveSection();
}

function initializeMobileNavbar() {
  var navbar = document.querySelector('.navbar');
  var abstract = document.getElementById('abstract');
  if (!navbar || !abstract) return;

  var ticking = false;

  function updateMobileNavbar() {
    var pastAbstract = abstract.getBoundingClientRect().bottom <= navbar.offsetHeight;
    navbar.classList.toggle('is-scrolled-past-abstract', pastAbstract);
    ticking = false;
  }

  function requestMobileNavbarUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateMobileNavbar);
  }

  window.addEventListener('scroll', requestMobileNavbarUpdate, { passive: true });
  window.addEventListener('resize', requestMobileNavbarUpdate);
  window.addEventListener('load', requestMobileNavbarUpdate);
  updateMobileNavbar();
}


$(document).ready(function() {
    initializeSectionNavigation();
    initializeMobileNavbar();

    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      var isActive = $(this).toggleClass("is-active").hasClass("is-active");
      $(this).attr("aria-expanded", String(isActive));
      $(".navbar-menu").toggleClass("is-active");

    });

    $(".mobile-section-nav a, .mobile-navbar-back-to-top").click(function() {
      $(".navbar-burger").removeClass("is-active").attr("aria-expanded", "false");
      $(".navbar-menu").removeClass("is-active");
    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

})
