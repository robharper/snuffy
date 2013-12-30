module.exports = {
  name: 'jquery ui',
  onContext: function() {
    return window.jQuery && window.jQuery.ui && window.jQuery.ui.version;
  }
};