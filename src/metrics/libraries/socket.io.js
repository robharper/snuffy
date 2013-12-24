module.exports = {
  name: 'socket.io',
  onContext: function() {
    return window.io && window.io.version;
  }
};