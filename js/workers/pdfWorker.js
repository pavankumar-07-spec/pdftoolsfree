// pdfWorker.js - scaffold worker for PDF/image processing
let currentInterval = null;
let isCancelled = false;

self.addEventListener('message', function (e) {
  const { cmd, id, payload } = e.data || {};
  if (cmd === 'process') {
    isCancelled = false;
    // Simulate chunked processing to keep event loop responsive
    let progress = 0;
    function step() {
      if (isCancelled) {
        self.postMessage({ id, type: 'failed', message: 'cancelled' });
        return;
      }
      progress += Math.floor(Math.random() * 12) + 6; // random chunk
      if (progress > 100) progress = 100;
      self.postMessage({ id, type: 'progress', progress });
      if (progress >= 100) {
        // fake result — real heavy work goes here
        self.postMessage({ id, type: 'done', result: { message: 'processed', payloadSummary: { bytes: payload && payload.size } } });
      } else {
        // schedule next chunk
        setTimeout(step, 60);
      }
    }
    // begin
    setTimeout(step, 80);
  } else if (cmd === 'cancel') {
    isCancelled = true;
  }
});
