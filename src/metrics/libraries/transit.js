module.exports = {
  name: 'transit',
  onContext: function() {
    return window.jQuery && window.jQuery.transit && window.jQuery.transit.version;
  }
};

