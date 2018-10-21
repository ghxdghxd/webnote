jQuery(document).ready(function ($) {
  var cols = {},
    messageIsOpen = false;

  cols.showOverlay = function () {
    $('body').addClass('show-main-overlay');
  };
  cols.hideOverlay = function () {
    $('body').removeClass('show-main-overlay');
  };

  cols.showMessage = function (url) {
    $('body').addClass('show-message');
    messageIsOpen = true;
    $('#message').load(url);
  };
  cols.hideMessage = function () {
    if ($(window).width() < 1360) {
      $('body').removeClass('show-message');
    }
    $('#main .message-list li').removeClass('active');
    messageIsOpen = false;
  };

  cols.showSidebar = function () {
    $('body').addClass('show-sidebar');
  };
  cols.hideSidebar = function () {
    $('body').removeClass('show-sidebar');
  };

  // Show sidebar when trigger is clicked

  // $('.trigger-toggle-sidebar').on('click', function () {
  //   cols.showSidebar();
  //   cols.showOverlay();
  // });

  // $('.trigger-message-close').on('click', function () {
  //   cols.hideMessage();
  //   cols.hideOverlay();
  // });

  // show solar-syst
  if ($(window).width() > 1360) {
    cols.showMessage("./solar_system.html");
  } else {
    $('body').removeClass('show-message');
  }

  // When you click on a message, show it

  // $('#main .message-list li').on('click', function (e) { //algolia 会失效，改用下面的
  $('body').on('click', '#main .message-list li', function (e) {
    e.preventDefault();
    var item = $(this),
      url = this.querySelector("a").getAttribute("href");
    // target = $(e.target);
    // console.log(this.querySelector("a").getAttribute("href"));
    // if (target.is('label')) {
    //   item.toggleClass('selected');
    // } else {
    //   if (messageIsOpen && item.is('.active')) {
    //     cols.hideMessage();
    //     cols.hideOverlay();
    //   } else {
    if (messageIsOpen) {
      cols.hideMessage();
      item.addClass('active');
      setTimeout(function () {
        cols.showMessage(url);
      }, 300);
    } else {
      item.addClass('active');
      cols.showMessage(url);
    }
    cols.showOverlay();
    // }
    // }
  });

  $('body').on('click', '#message a', function (e) {
    e.preventDefault();
    var url = this.getAttribute("href");
    if (messageIsOpen) {
      cols.hideMessage();
      setTimeout(function () {
        cols.showMessage(url);
      }, 300);
    } else {
      cols.showMessage(url);
    }
    cols.showOverlay();
  });

  // This will prevent click from triggering twice when clicking checkbox/label

  $('input[type=checkbox]').on('click', function (e) {
    e.stopImmediatePropagation();
  });

  // When you click the overlay, close everything

  $('#main > .overlay').on('click', function () {
    cols.hideOverlay();
    cols.hideMessage();
    cols.hideSidebar();
  });

  // Enable sexy scrollbars
  $('.nano').overlayScrollbars({
    scrollbars: {
      autoHide: "leave",
    }
  });

  // Disable links

  $('a').on('click', function (e) {
    e.preventDefault();
  });

  // Search box responsive stuff

  // $('.search-box input').on('focus', function () {
  //   if ($(window).width() <= 1360) {
  //     cols.hideMessage();
  //   }
  // });

  // slideout.js

  var slideout = new Slideout({
    'panel': document.getElementById('main'),
    'menu': document.getElementById('sidebar'),
    'padding': 300,
    'tolerance': 70
  });

  document.querySelector('.trigger-toggle-sidebar').addEventListener('click', function () {
    slideout.toggle();
  })

  function close(eve) {
    eve.preventDefault();
    slideout.close();
  }

  slideout
    .on('beforeopen', function () {
      cols.showOverlay();
    })
    .on('open', function () {
      this.panel.addEventListener('click', close);
    })
    .on('beforeclose', function () {
      cols.hideOverlay();
      this.panel.removeEventListener('click', close);
    });

});

