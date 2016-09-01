'use strict';

window.addEventListener('WebComponentsReady', function () {

  // We use Page.js for routing. This is a Micro
  // client-side router inspired by the Express router
  // More info: https://visionmedia.github.io/page.js/

  // Removes end / from app.baseUrl which page.base requires for production
  if (window.location.port === '') {
    // if production
    page.base(app.baseUrl.replace(/\/$/, ''));
  }

  // Middleware
  function scrollToTop(ctx, next) {
    app.scrollPageToTop();
    next();
  }

  function closeDrawer(ctx, next) {
    app.closeDrawer();
    next();
  }

  function setFocus(selected) {
    var header = document.querySelector('section[data-route="' + selected + '"] .page-title');
    if (header) {
      header.focus();
    }
  }

  // Routes
  page('*', scrollToTop, closeDrawer, function (ctx, next) {
    next();
  });

  page('/', function () {
    app.route = 'home';
    setFocus(app.route);
  });

  page(app.baseUrl, function () {
    app.route = 'home';
    setFocus(app.route);
  });

  page('/projects', function () {
    app.route = 'projects';
    setFocus(app.route);
  });

  page('/contact', function () {
    app.route = 'contact';
    setFocus(app.route);
  });

  // 404
  page('*', function () {
    app.$.toast.text = 'Can\'t find: ' + window.location.href + '. Redirected you to Home Page';
    app.$.toast.show();
    page.redirect(app.baseUrl);
  });

  // add #! before urls
  page({
    hashbang: true
  });
});