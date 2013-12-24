module.exports = [
  {
    name: 'imageCount',
    onResource: function(response, memo) {
      memo = memo || 0;
      if (response.stage === 'end' && response.contentType && response.contentType.indexOf('image/') === 0) {
        memo += 1;
      }
      return memo;
    }
  },
  {
    name: 'scriptCount',
    onResource: function(response, memo) {
      memo = memo || 0;
      if (response.stage === 'end' && response.contentType && response.contentType.indexOf('javascript') > 0) {
        memo += 1;
      }
      return memo;
    }
  },
  {
    // Note: due to phantomjs bug, this value is misreported
    name: 'totalResourceSize',
    onResource: function(response, memo) {
      memo = memo || 0;
      if (response.stage == 'start' && response.bodySize) {
        memo += response.bodySize;
      }
      return memo;
    }
  }
];