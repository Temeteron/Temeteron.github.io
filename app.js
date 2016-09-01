(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('localforage')) :
	typeof define === 'function' && define.amd ? define(['localforage'], factory) :
	(global.app = factory(global.localforage));
}(this, function (localforage) { 'use strict';

	localforage = 'default' in localforage ? localforage['default'] : localforage;

	var classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	var createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

	var Event = function () {
		function Event(name) {
			classCallCheck(this, Event);

			this.id = guidGenerator();
			this.name = name || '';
			this.counters = [];
			this.createDate = new Date();
		}

		createClass(Event, [{
			key: 'save',
			value: function save() {
				localforage.setItem('event-' + this.id, this);
			}
		}]);
		return Event;
	}();

	function guidGenerator() {
		var S4 = function S4() {
			return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
		};
		return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
	}

	function main() {

	  app.events = [];

	  app.selectedEvent = null;

	  // Toggle toast to delete event loaded
	  app.dialogToggle = function () {
	    if (app.selectedEvent != null) {
	      document.querySelector('#dialog').toggle();
	    } else {
	      document.querySelector('#noCurrentEvent').toggle();
	    }
	  };

	  // Create new event and counters
	  app.newEventCreate = function () {
	    var newEvent = new Event(document.getElementById("newEventName").value);
	    var numberOfCounters = +document.getElementById("newCounterNum").value;

	    for (var i = 0; i < numberOfCounters; i++) {
	      newEvent.counters.push({
	        name: 'Counter ' + (i + 1),
	        value: 0
	      });
	    }

	    app.push('events', newEvent);
	    app.set('selectedEvent', newEvent);

	    app.lForageSaveEvent(newEvent);
	  };

	  // Reload page
	  app.myReload = function () {
	    location.reload();
	  };

	  // ################# LocalForage Functions ################# //

	  // Save one event
	  app.lForageSaveEvent = function (event) {

	    // set as key the id of each event
	    localforage.setItem(event.id, event).then(function (value) {
	      console.log(value, ' saved!!!');
	    });
	  };

	  // Load one event, arg to lF: the id of the event
	  app.lForageLoadEvent = function (event) {

	    localforage.getItem(event.id).then(function (value) {
	      console.log(value);
	    });
	  };

	  // Remove one event
	  app.lForageRemoveEvent = function (event) {

	    localforage.removeItem(event.id).then(function (value) {
	      console.log('Key is cleared!');

	      if (app.selectedEvent == event) {
	        app.selectedEvent = null;
	      }

	      var pos = app.events.indexOf(event);
	      app.splice('events', pos, 1);
	      page.redirect('/oldEvents');
	    });
	  };

	  // Save all events locally (LF)
	  app.buttonSave = function (events) {
	    document.querySelector('#position').toggle();
	    var x;

	    for (x in app.events) {
	      app.lForageSaveEvent(app.events[x]);
	    }
	  };

	  // Save all events, from a given list of events as arg
	  app.lForageSaveAll = function (events) {
	    var x;

	    for (x in app.events) {
	      app.lForageSaveEvent(app.events[x]);
	    }
	  };

	  // Load to the list: app,events, all the events
	  app.lForageLoadAll = function () {

	    localforage.iterate(function (value, key, iterationNumber) {
	      // Resulting key/value pair -- this callback
	      // will be executed for every item in the
	      // database.
	      if (value != 'testPromiseValue') {
	        app.push('events', value);
	      }
	      console.log(value);
	    }).then(function () {
	      console.log('Iteration has completed');
	    });
	  };

	  // Remove all events from localForage
	  app.lForageRemoveAll = function () {

	    // alert("All events deleted");

	    app.events = [];

	    app.selectedEvent = null;

	    localforage.clear(function (err) {
	      // Run this code once the database has been entirely deleted.
	      console.log('Database is now empty.');
	    });
	  };
	}

	// Grab a reference to our auto-binding template
	// and give it some initial binding values
	// Learn more about auto-binding templates at http://goo.gl/Dx1u2g
	var app = document.querySelector('#app');
	// Sets app default base URL
	app.baseUrl = '/';
	app.displayInstalledToast = function () {
	  // Check to make sure caching is actually enabled—it won't be in the dev environment.
	  if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
	    Polymer.dom(document).querySelector('#caching-complete').show();
	  }
	};

	// Listen for template bound event to know when bindings
	// have resolved and content has been stamped to the page
	app.addEventListener('dom-change', function () {
	  console.log('Our app is ready to rock!');
	});

	// See https://github.com/Polymer/polymer/issues/1381
	window.addEventListener('WebComponentsReady', function () {
	  // imports are loaded and elements have been registered
	});

	// Main area's paper-scroll-header-panel custom condensing transformation of
	// the appName in the middle-container and the bottom title in the bottom-container.
	// The appName is moved to top and shrunk on condensing. The bottom sub title
	// is shrunk to nothing on condensing.
	window.addEventListener('paper-header-transform', function (e) {
	  var appName = Polymer.dom(document).querySelector('#mainToolbar .app-name');
	  var middleContainer = Polymer.dom(document).querySelector('#mainToolbar .middle-container');
	  var bottomContainer = Polymer.dom(document).querySelector('#mainToolbar .bottom-container');
	  var detail = e.detail;
	  var heightDiff = detail.height - detail.condensedHeight;
	  var yRatio = Math.min(1, detail.y / heightDiff);
	  // appName max size when condensed. The smaller the number the smaller the condensed size.
	  var maxMiddleScale = 0.50;
	  var auxHeight = heightDiff - detail.y;
	  var auxScale = heightDiff / (1 - maxMiddleScale);
	  var scaleMiddle = Math.max(maxMiddleScale, auxHeight / auxScale + maxMiddleScale);
	  var scaleBottom = 1 - yRatio;

	  // Move/translate middleContainer
	  Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

	  // Scale bottomContainer and bottom sub title to nothing and back
	  Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

	  // Scale middleContainer appName
	  Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
	});

	// Scroll page to top and expand header
	app.scrollPageToTop = function () {
	  app.$.headerPanelMain.scrollToTop(true);
	};

	app.closeDrawer = function () {
	  app.$.paperDrawerPanel.closeDrawer();
	};

	main();

	return app;

}));
//# sourceMappingURL=app.js.map
