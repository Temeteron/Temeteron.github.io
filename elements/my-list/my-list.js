'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'my-list',

    properties: {
      items: {
        type: Array,
        notify: true
      }
    },

    ready: function ready() {
      var x = function x() {};

      this.items = ['Computer Software', 'Web technologies', 'Artificial Intelligence', 'Mobile technologies (android, ios)', 'Track and Fields', 'Traditional Dances', 'Musical Instruments', 'Space travel'];
    }
  });
})();