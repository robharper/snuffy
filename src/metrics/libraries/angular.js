module.exports = {
  name: 'Angular.js',
  onContext: function() {
    return window.angular && window.angular.version;
  }
};