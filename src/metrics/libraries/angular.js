module.exports = {
  name: 'angular.js',
  onContext: function() {
    return window.angular && window.angular.version;
  }
};