 $('.banner-cat-slider').owlCarousel({      loop: false,      margin: 20,      rtl: true,      autoWidth: true,      nav: true,      dots:false,      responsive: {          600: {              items: 2          }      }  });  $('.item-slider').owlCarousel({      loop: false,      margin: 18,      dots: false,      responsive: {          0: {              items: 1,              nav: true,          },          600: {              items: 3,              nav: true,          },          1280: {              items: 4,              nav: false,          }      }  });  $('.tip-slider').owlCarousel({     loop: false,     margin: 10,     dots: false,     responsive: {         0: {             items: 3,             nav: false,         },         600: {             items: 4,             nav: false,         },         1300: {             items: 5,             nav: false,         }             } });  // bootstrap popover  $(function () {      $('[data-toggle="popover"]').popover({          trigger: "hover",          placement: "bottom"      })  })  // fix navigation on scroll  lastScroll = 0;  $(window).on('scroll', function () {      var scroll = $(window).scrollTop();      if (lastScroll - scroll > 0) {          $("body").addClass("nav-active");      } else {          $("body").removeClass("nav-active");      }      if (scroll >= 150) {          $(".navbar-main").addClass("navbar-scrolled");      } else {          $(".navbar-main").removeClass("navbar-scrolled");      }      lastScroll = scroll;  });  // contrl mini Cart  $(document).ready(function () {      var removeClass = true;      $(".nav-search").click(function () {          $(".searchBar").toggleClass('search-active');          removeClass = false;      });      $(".searchBar").click(function () {          removeClass = false;      });      $("html").click(function () {          if (removeClass) {              $(".searchBar").removeClass('search-active');          }          removeClass = true;      });  });  // searchBar  $(document).ready(function () {      var removeClass = true;      $(".cart-toggle").click(function () {          $(".mini-cart").toggleClass('active');          removeClass = false;      });      $(".mini-cart").click(function () {          removeClass = false;      });      $("html").click(function () {          if (removeClass) {              $(".mini-cart").removeClass('active');          }          removeClass = true;      });  });  // Filter Sidebar  $(document).ready(function () {      var removeClass = true;      $(".filter-toggle").click(function () {          $(".category-sidebar").toggleClass('active');          removeClass = false;      });      $(".category-sidebar").click(function () {          removeClass = false;      });      $("html").click(function () {          if (removeClass) {              $(".category-sidebar").removeClass('active');          }          removeClass = true;      });  });  //  tooltip  $(function () {      $('[data-toggle="tooltip"]').tooltip()  });  // open modal on-page-load  $(window).on('load', function () {      $('.product-list-modal').modal('show');  });  // toggle list view  $('.btn-list-view').click(function () {      $(".category-listing").toggleClass("list-view");  });  $('.btn-grid-view').click(function () {      $(".category-listing").toggleClass("list-view");  });  // sync owl carousel  var sync1 = $('#sync1'),      sync2 = $('#sync2'),      duration = 300,      thumbs = 4;  // Sync nav  sync1.on('click', '.owl-next', function () {      sync2.trigger('next.owl.carousel')  });  sync1.on('click', '.owl-prev', function () {      sync2.trigger('prev.owl.carousel')  });  // Start Carousel  $(document).ready(function () {      var sync1 = $("#sync1");      var sync2 = $("#sync2");      var slidesPerPage = 4;      var syncedSecondary = true;      sync1.owlCarousel({          items: 1,          slideSpeed: 2000,          nav: true,          autoplay: true,          dots: false,          loop: true,          responsiveRefreshRate: 200,      }).on('changed.owl.carousel', syncPosition);      sync2          .on('initialized.owl.carousel', function () {              sync2.find(".owl-item").eq(0).addClass("current");          })          .owlCarousel({              items: slidesPerPage,              dots: false,              nav: false,              smartSpeed: 200,              slideSpeed: 500,              margin: 10,              slideBy: slidesPerPage,              responsiveRefreshRate: 100          }).on('changed.owl.carousel', syncPosition2);      function syncPosition(el) {          var count = el.item.count - 1;          var current = Math.round(el.item.index - (el.item.count / 2) - .5);          if (current < 0) {              current = count;          }          if (current > count) {              current = 0;          }          //end block          sync2              .find(".owl-item")              .removeClass("current")              .eq(current)              .addClass("current");          var onscreen = sync2.find('.owl-item.active').length - 1;          var start = sync2.find('.owl-item.active').first().index();          var end = sync2.find('.owl-item.active').last().index();          if (current > end) {              sync2.data('owl.carousel').to(current, 100, true);          }          if (current < start) {              sync2.data('owl.carousel').to(current - onscreen, 100, true);          }      }      function syncPosition2(el) {          if (syncedSecondary) {              var number = el.item.index;              sync1.data('owl.carousel').to(number, 100, true);          }      }      sync2.on("click", ".owl-item", function (e) {          e.preventDefault();          var number = $(this).index();          sync1.data('owl.carousel').to(number, 300, true);      });  });  //Snackbar - Add Ons  function showSnack() {     // Get the snackbar DIV     var snack = document.getElementById("snackbar-addons");       // Add the "show" class to DIV     snack.className = "show";       // After 3 seconds, remove the show class from DIV     setTimeout(function(){ snack.className = snack.className.replace("show", ""); }, 6000); } //Sidenav function openNav() {     document.getElementById("mySidenav").style.width = "250px"; }   function closeNav() {     document.getElementById("mySidenav").style.width = "0"; } //popover function showOverlayLocation(){     $('.overlay-start').addClass('show');     $('.overlay-start').addClass('animate__fadeIn');     setTimeout(function() {         $('.location-drop').dropdown('show');         $('.location-drop').addClass('animate__fadeInUp');      }, 1300);      setTimeout(function() {         $('.location-drop').removeClass('animate__fadeInUp');         $('.location-drop').addClass('animate__pulse animate__fast');         $('.overlay-start').removeClass('animate__fadeIn');      }, 3000);     setTimeout(function () {         $('.location-drop').removeClass('animate__pulse');         $('.overlay-start').addClass('animate__fadeOut');         $('.location-drop').dropdown('hide');     }, 5000);     setTimeout(function () {         $('.overlay-start').removeClass('show');     }, 5500); } //# sourceMappingURL=app.js.map

