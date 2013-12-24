module.exports = {
  name: 'moment.js',
  onContext: function() {
    return window.moment && window.moment.version;
  }
};