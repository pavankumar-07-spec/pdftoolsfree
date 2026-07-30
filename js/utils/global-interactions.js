document.addEventListener('DOMContentLoaded', () => {
    // Dynamically inject the global processing overlay if not already present
    let overlay = document.querySelector('.processing-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'processing-overlay';
        overlay.innerHTML = `
            <div class="processing-spinner"></div>
            <div class="processing-text">Processing...</div>
        `;
        document.body.appendChild(overlay);
    }

    // 1. Global Error Handler & Button Restoration
    const handleGlobalError = (msg) => {
        if (window.showToast) {
            window.showToast(msg || 'An unexpected error occurred during execution.', 'error');
        }
        if (overlay) {
            overlay.classList.remove('visible');
        }
        // Revert any buttons currently in loading state
        document.querySelectorAll('.is-loading').forEach(btn => {
            btn.style.pointerEvents = 'auto';
            btn.classList.remove('is-loading');
            if (btn.dataset.originalHtml) {
                btn.innerHTML = btn.dataset.originalHtml;
            }
        });
    };

    window.addEventListener('error', (e) => {
        handleGlobalError(e.message);
    });

    window.addEventListener('unhandledrejection', (e) => {
        handleGlobalError(e.reason?.message || e.reason);
    });

    // 2. Global Loading State Injector for processing buttons
    const processButtons = document.querySelectorAll(
        'button#process-btn, button#calculate-btn, button#calc-btn, button#process-image-btn, button#generate-btn, button#decode-btn, button#action-btn, button#add-btn, form button[type="submit"]'
    );
    
    processButtons.forEach(btn => {
        if (btn.dataset.loadingListenerAttached) return;
        btn.dataset.loadingListenerAttached = 'true';

        btn.addEventListener('click', () => {
            // Check if it has a form, and if it's valid
            const form = btn.closest('form');
            if (form && !form.checkValidity()) {
                // Let native validation handle it
                return;
            }

            const originalHTML = btn.innerHTML;
            btn.dataset.originalHtml = originalHTML;
            btn.innerHTML = '<span style="display:inline-block; width:1em; height:1em; border:2px solid rgba(255,255,255,0.3); border-radius:50%; border-top-color:#fff; animation:spin 1s ease-in-out infinite; margin-right:8px; vertical-align:middle;"></span> Processing...';
            btn.style.pointerEvents = 'none';
            btn.classList.add('is-loading');

            // Show full-screen glassmorphic loading backdrop
            if (overlay) {
                overlay.classList.add('visible');
            }

            // Find output area to observe changes
            const outputArea = document.getElementById('calc-results-card') || 
                               document.getElementById('result-area') || 
                               document.getElementById('result-card') ||
                               document.querySelector('.result-area') || 
                               document.body;
            
            let resolved = false;
            const resolveLoading = () => {
                if (resolved) return;
                resolved = true;
                btn.innerHTML = originalHTML;
                btn.style.pointerEvents = 'auto';
                btn.classList.remove('is-loading');
                if (overlay) {
                    overlay.classList.remove('visible');
                }
                
                if (window.showToast) {
                    let actionText = 'Calculation completed!';
                    const btnText = btn.textContent.toLowerCase();
                    const btnId = btn.id.toLowerCase();
                    if (btnId.includes('process') || btnText.includes('process')) {
                        actionText = 'Processed successfully!';
                    } else if (btnId.includes('generate') || btnText.includes('generate')) {
                        actionText = 'Generated successfully!';
                    } else if (btnId.includes('decode') || btnText.includes('decode')) {
                        actionText = 'Decoded successfully!';
                    } else if (btnId.includes('encrypt') || btnText.includes('encrypt') || btnId.includes('decrypt') || btnText.includes('decrypt')) {
                        actionText = 'Operation completed!';
                    }
                    window.showToast(actionText, 'success');
                }
            };

            // Mutation observer for dynamic HTML results card updates
            const observer = new MutationObserver(() => {
                resolveLoading();
                observer.disconnect();
            });

            if (outputArea) {
                observer.observe(outputArea, { childList: true, subtree: true, characterData: true, attributes: true });
            }

            // Fallback resolution for textareas and calculators (their value property changes do not trigger MutationObserver)
            // A brief 350ms delay lets the browser render the spinner and gives satisfying tactile feedback.
            setTimeout(() => {
                resolveLoading();
                observer.disconnect();
            }, 350);
        });
    });

    // 3. Global Copy to Clipboard Toast notification
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button, .btn');
        if (!btn) return;
        const id = btn.id || '';
        const cls = btn.className || '';
        const text = btn.textContent || '';
        const aria = btn.getAttribute('aria-label') || '';
        
        if (id.includes('copy') || cls.includes('copy') || text.toLowerCase().includes('copy') || aria.toLowerCase().includes('copy')) {
            // Wait 100ms for browser copy API actions to complete, then show success toast
            setTimeout(() => {
                if (window.showToast) {
                    window.showToast('Copied to clipboard!', 'success');
                }
            }, 100);
        }
    });

    // Inject the CSS for the spinner
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin { 
            to { transform: rotate(360deg); } 
        }
    `;
    document.head.appendChild(style);
});
