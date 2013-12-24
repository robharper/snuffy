module.exports = {
  name: 'jquery',
  onContext: function() {
    return window.jQuery && window.jQuery.fn.jquery;
  }
};