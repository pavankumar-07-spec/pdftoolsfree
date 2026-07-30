/**
 * Background worker for heavy image processing tasks.
 * Has no access to the DOM or main thread UI.
 */
self.onmessage = function(e) {
    const { action, imageData, params } = e.data;

    if (!imageData || !imageData.data) {
        self.postMessage({ status: 'error', message: 'No valid image data provided.' });
        return;
    }

    try {
        if (action === 'shadow_highlight') {
            const pixels = imageData.data;
            const shadowAdj = params.shadows || 0;       // Range: -100 to 100
            const highlightAdj = params.highlights || 0; // Range: -100 to 100

            // Scale adjustments to max 45 units (standard offset max)
            const dS = (shadowAdj / 100) * 45;
            const dH = (highlightAdj / 100) * 45;

            for (let i = 0; i < pixels.length; i += 4) {
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];

                // Calculate relative luminance to isolate shadows vs. highlights
                const y = 0.299 * r + 0.587 * g + 0.114 * b;

                // Shadow weight: peaks at 0, declines to 0 at luminance 128
                const wS = Math.max(0, 1 - y / 128);
                // Highlight weight: 0 up to 128, peaks at 255
                const wH = Math.max(0, (y - 128) / 128);

                const offset = dS * wS + dH * wH;

                pixels[i]     = Math.min(255, Math.max(0, r + offset));
                pixels[i + 1] = Math.min(255, Math.max(0, g + offset));
                pixels[i + 2] = Math.min(255, Math.max(0, b + offset));
            }

            self.postMessage({ status: 'success', processedData: imageData });
        }
        
        else if (action === 'grayscale') {
            const pixels = imageData.data;
            for (let i = 0; i < pixels.length; i += 4) {
                const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
                pixels[i] = avg;     // R
                pixels[i + 1] = avg; // G
                pixels[i + 2] = avg; // B
            }
            self.postMessage({ status: 'success', processedData: imageData });
        }
    } catch (error) {
        self.postMessage({ status: 'error', message: error.message });
    }
};
