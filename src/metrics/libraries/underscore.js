module.exports = {
  name: 'underscore',
  onContext: function() {
    return window._ && (typeof window._.filter === 'function') && window._.VERSION;
  }
};
