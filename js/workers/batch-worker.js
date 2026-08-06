/**
 * Multithreaded Background Batch Worker
 * Performs heavy array processing, text analysis, and image buffer manipulations off the main thread.
 */

self.onmessage = function(e) {
  const { task, data, id } = e.data || {};

  try {
    if (task === 'analyzeText') {
      const text = data || '';
      const words = text.trim().split(/\s+/).filter(Boolean);
      const chars = text.length;
      const lines = text.split('\n').length;
      const readingTime = Math.ceil(words.length / 200);

      self.postMessage({
        id,
        result: { words: words.length, chars, lines, readingTime }
      });
    } else if (task === 'processMatrix') {
      const matrix = data || [];
      const rows = matrix.length;
      const cols = matrix[0] ? matrix[0].length : 0;
      let sum = 0;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          sum += (matrix[r][c] || 0);
        }
      }

      self.postMessage({ id, result: { rows, cols, sum } });
    } else {
      self.postMessage({ id, result: { status: 'completed' } });
    }
  } catch (err) {
    self.postMessage({ id, error: err.message });
  }
};
