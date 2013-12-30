var Encryptr = (function (window, console, undefined) {
  "use strict";
  console       = console || {};
  console.log   = console.log || function() {};
  var Backbone  = window.Backbone,
      _         = window._,
      $         = window.Zepto;

  var Encryptr = function () {
    this.online = true; // assume a hopeful default
  };

  Encryptr.prototype.init = function() {
    window.document.addEventListener("deviceready", this.onDeviceReady, false);
    window.document.addEventListener("resume", this.onResume, false);
    window.document.addEventListener("pause", this.onPause, false);
    window.document.addEventListener("offline", this.setOffline, false);
    window.document.addEventListener("online", this.setOnline, false);

    // Set the hostname for the Crypton server
    // window.crypton.host = "192.168.1.12";
    window.crypton.host = "localhost";
    // Render the login view (and bind its events)
    this.loginView = new this.LoginView().render();
    // Hax for Android 2.x not groking :active
    $(document).on("touchstart", "a", function(event) {
      var $this = $(this);
      $this.addClass("active");
    });
    $(document).on("touchend", "a", function(event) {
      var $this = $(this);
      $this.removeClass("active");
    });
    $(document).on("touchmove", "a", function(event) {
      var $this = $(this);
      $this.removeClass("active");
    });

    window.FastClick.attach(document.body);
  };

  Encryptr.prototype.onDeviceReady = function(event) {
    if (window.device && window.device.platform === "iOS" && parseFloat(window.device.version) >= 7.0) {
      window.document.querySelectorAll(".app")[0].style.top = "20px"; // status bar hax
    }
    // Backstack effects
    if (window.device && window.device.platform === "iOS") {
      Encryptr.prototype.noEffect = new window.BackStack.NoEffect();
      Encryptr.prototype.fadeEffect = new window.BackStack.FadeEffect();
      Encryptr.prototype.defaultEffect = new Encryptr.prototype.FastSlideEffect();
      Encryptr.prototype.defaultPopEffect = new Encryptr.prototype.FastSlideEffect({
        direction: "right"
      });
    } else {
      Encryptr.prototype.noEffect = new window.BackStack.NoEffect();
      Encryptr.prototype.fadeEffect = new window.BackStack.FadeEffect();
      Encryptr.prototype.defaultEffect = new window.BackStack.NoEffect();
      Encryptr.prototype.defaultPopEffect = new window.BackStack.NoEffect();
    }
    window.document.addEventListener("backbutton", Encryptr.prototype.onBackButton, false);
    window.document.addEventListener("menubutton", Encryptr.prototype.onMenuButton, false);
  };

  Encryptr.prototype.setOffline = function(event) {
    this.online = false;
  };

  Encryptr.prototype.setOnline = function(event) {
    this.online = true;
  };

  Encryptr.prototype.onResume = function(event) {
    // Throw up the login screen
    window.app.loginView.show();
    window.setTimeout(function() {
      window.app.session = undefined;
      window.app.navigator.popAll(window.app.noEffect);
      window.app.mainView.menuView.close();
    },100);
  };

  Encryptr.prototype.onPause = function(event) {
    // ...
  };

  Encryptr.prototype.onBackButton = function(event) {
    if ($(".menu").is(":visible")) {
      window.app.mainView.menuView.dismiss();
      return;
    }
    if ($(".addMenu").is(":visible")) {
      window.app.mainView.addMenuView.dismiss();
      return;
    }
    if ($(".back-btn").is(":visible")) {
      window.app.navigator.popView(window.app.defaultPopEffect);
      return;
    }
    navigator.app.exitApp();
  };

  Encryptr.prototype.onMenuButton = function(event) {
    // ...
  };

  return Encryptr;

})(this, this.console);
