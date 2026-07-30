/**
 * public/js/shared/calculator-enhancer.js
 * Shared utility module to enhance FreeToolsPDF calculators.
 * 
 * Provides:
 * 1. Bidirectional sync between numeric inputs and dynamically generated range sliders.
 * 2. High-confidence bounds inference based on placeholders, labels, and helper text.
 * 3. High-DPI, CSS-variable-aware Canvas 2D charts (Bar / Donut).
 * 4. Automatic DOM observation to render charts for matched results semantically.
 * 5. Automatic reset button injection and handling.
 */

const CalculatorEnhancer = (() => {
  'use strict';

  // ----------------------------------------------------
  // Chart Semantics Mapping
  // ----------------------------------------------------
  const CHART_SEMANTICS = [
    {
      keys: ['principal', 'interest'],
      labels: ['Principal', 'Interest'],
      colors: ['var(--accent)', 'var(--success)'],
      type: 'donut'
    },
    {
      keys: ['net price', 'gst amount'],
      labels: ['Net Price', 'GST Amount'],
      colors: ['var(--accent)', 'var(--success)'],
      type: 'donut'
    },
    {
      keys: ['bill amount', 'tip amount'],
      labels: ['Bill Amount', 'Tip'],
      colors: ['var(--accent)', 'var(--success)'],
      type: 'donut'
    },
    {
      keys: ['original price', 'savings'],
      labels: ['Sale Price', 'Discount Savings'],
      colors: ['var(--accent)', 'var(--success)'],
      type: 'donut'
    },
    {
      keys: ['discounted price', 'discount amount'],
      labels: ['Discounted Price', 'Savings'],
      colors: ['var(--accent)', 'var(--success)'],
      type: 'donut'
    },
    {
      keys: ['attended', 'bunk'],
      labels: ['Attended', 'Missed / Bunked'],
      colors: ['var(--success)', 'var(--error)'],
      type: 'donut'
    },
    {
      keys: ['attended', 'missed'],
      labels: ['Attended', 'Missed'],
      colors: ['var(--success)', 'var(--error)'],
      type: 'donut'
    },
    {
      keys: ['down payment', 'principal loan balance'],
      labels: ['Down Payment', 'Loan Balance'],
      colors: ['var(--accent)', 'var(--success)'],
      type: 'donut'
    }
  ];

  // ----------------------------------------------------
  // Part 1: Bounds Inference
  // ----------------------------------------------------
  function inferBounds(inputEl) {
    const id = (inputEl.id || '').toLowerCase();
    const group = inputEl.closest('.form-group') || inputEl.parentElement;
    const labelEl = group ? (group.querySelector('.form-label') || group.querySelector('label')) : null;
    const labelText = labelEl ? labelEl.textContent.toLowerCase() : '';
    const placeholder = inputEl.placeholder || '';
    
    // Default fallback
    let min = 0;
    let max = 100;
    let step = 1;
    let confidence = 0; // 0 = low, 1 = medium, 2 = high

    // Match HTML attributes first (highest confidence)
    if (inputEl.min !== '') { min = parseFloat(inputEl.min); confidence = 2; }
    if (inputEl.max !== '') { max = parseFloat(inputEl.max); confidence = 2; }
    if (inputEl.step !== '') { step = parseFloat(inputEl.step); confidence = 2; }
    if (confidence === 2) {
      return { min, max, step, confidence };
    }

    // 1. Percentage semantic check (Rate, percentage, tax, discount, markup)
    if (labelText.includes('%') || labelText.includes('percent') || labelText.includes('rate') || labelText.includes('discount') || labelText.includes('tax') || id.includes('pct') || id.includes('tax') || id.includes('interest')) {
      min = 0;
      max = 100;
      step = 1;
      confidence = 2;
      return { min, max, step, confidence };
    }

    // 2. Time units (Days, weeks, months, years)
    if (labelText.includes('day') || labelText.includes('week') || labelText.includes('month') || labelText.includes('year') || labelText.includes('hour') || labelText.includes('minute') || labelText.includes('second') || id.includes('day') || id.includes('month') || id.includes('year') || id.includes('duration') || id.includes('period')) {
      min = 1;
      max = 30; // default for years/terms
      if (labelText.includes('month') || id.includes('month')) max = 12;
      if (labelText.includes('day') || id.includes('day')) max = 31;
      if (labelText.includes('hour') || id.includes('hour')) { min = 0; max = 24; }
      if (labelText.includes('minute') || labelText.includes('second') || id.includes('minute')) { min = 0; max = 60; }
      step = 1;
      confidence = 2;
      return { min, max, step, confidence };
    }

    // 3. Physical body units (Height, weight, age)
    if (labelText.includes('height') || id.includes('height')) {
      min = 30;
      max = 250;
      step = 1;
      confidence = 2;
      return { min, max, step, confidence };
    }
    if (labelText.includes('weight') || id.includes('weight') || id.includes('mass')) {
      min = 10;
      max = 200;
      step = 0.5;
      confidence = 2;
      return { min, max, step, confidence };
    }
    if (labelText.includes('age') || id.includes('age')) {
      min = 0;
      max = 120;
      step = 1;
      confidence = 2;
      return { min, max, step, confidence };
    }

    // 4. Currency fields (Price, salary, budget, cost, principal)
    const isCurrency = labelText.includes('price') || labelText.includes('salary') || labelText.includes('cost') || labelText.includes('amount') || labelText.includes('budget') || labelText.includes('principal') || labelText.includes('wage') || id.includes('price') || id.includes('salary') || id.includes('cost') || id.includes('amount') || id.includes('principal') || labelText.includes('loan') || id.includes('loan');
    
    // Infer from placeholder/defaultValue if currency or general field
    const cleanedPlaceholder = placeholder.replace(/,/g, '');
    const placeholderMatch = cleanedPlaceholder.match(/\d+(?:\.\d+)?/);
    const placeholderNum = placeholderMatch ? parseFloat(placeholderMatch[0]) : NaN;
    const defaultValNum = parseFloat(inputEl.value || '');
    const referenceValue = !isNaN(placeholderNum) ? placeholderNum : (!isNaN(defaultValNum) ? defaultValNum : null);
    
    if (referenceValue !== null && referenceValue > 0) {
      min = 0;
      max = referenceValue * 5; // 5x reference
      
      // Smart steps based on range size
      if (max > 100000) { step = 1000; }
      else if (max > 10000) { step = 100; }
      else if (max > 1000) { step = 50; }
      else if (max > 100) { step = 10; }
      else if (max > 10) { step = 1; }
      else { step = 0.1; }
      
      confidence = isCurrency ? 2 : 1; // High confidence if currency, medium otherwise
      return { min, max, step, confidence };
    }

    // 5. Default generic numeric bounds
    return { min: 0, max: 100, step: 1, confidence: 0 };
  }

  // ----------------------------------------------------
  // Part 2: Sliders Binding & Recalculation
  // ----------------------------------------------------
  function initSliders(formEl) {
    if (!formEl) return { autoIntegrated: 0, needsReview: [] };

    const numericInputs = formEl.querySelectorAll('input[type="number"]');
    let autoIntegrated = 0;
    const needsReview = [];

    numericInputs.forEach(numInput => {
      const bounds = inferBounds(numInput);
      
      if (bounds.confidence === 0) {
        needsReview.push({
          input: numInput.id || numInput.name,
          label: numInput.closest('.form-group')?.querySelector('.form-label')?.textContent || 'Numeric Input',
          reason: 'No clear bounds semantic detected'
        });
        return;
      }

      // Check if range input already exists
      const group = numInput.closest('.form-group') || numInput.parentElement;
      if (group.querySelector('input[type="range"]')) return;

      // Create range slider wrapper
      const sliderWrap = document.createElement('div');
      sliderWrap.className = 'range-wrap';
      sliderWrap.style.marginTop = 'var(--space-2)';

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.className = 'form-range';
      slider.min = bounds.min;
      slider.max = bounds.max;
      slider.step = bounds.step;
      slider.value = numInput.value || bounds.min;
      
      // Style helper row
      const rangeRow = document.createElement('div');
      rangeRow.className = 'range-row';
      rangeRow.style.display = 'flex';
      rangeRow.style.justify = 'space-between';
      rangeRow.style.fontSize = '0.75rem';
      rangeRow.style.color = 'var(--text-muted)';
      rangeRow.style.marginTop = '4px';

      const minLabel = document.createElement('span');
      minLabel.textContent = bounds.min;
      const maxLabel = document.createElement('span');
      maxLabel.textContent = bounds.max;

      rangeRow.appendChild(minLabel);
      rangeRow.appendChild(maxLabel);

      sliderWrap.appendChild(slider);
      sliderWrap.appendChild(rangeRow);

      const inputWrap = group.querySelector('.input-wrap') || numInput.parentElement;
      inputWrap.appendChild(sliderWrap);

      // Bidirectional sync
      slider.addEventListener('input', () => {
        numInput.value = slider.value;
        numInput.dispatchEvent(new Event('input', { bubbles: true }));
        numInput.dispatchEvent(new Event('change', { bubbles: true }));
        triggerCalculation(formEl);
      });

      numInput.addEventListener('input', () => {
        const val = parseFloat(numInput.value);
        if (!isNaN(val)) {
          slider.value = val;
        }
      });

      autoIntegrated++;
    });

    // Automatically setup DOM observer for chart results
    setupDOMChartObserver();

    // Automatically setup Reset button
    setupResetButton(formEl);

    return { autoIntegrated, needsReview };
  }

  function triggerCalculation(formEl) {
    const submitBtn = formEl.querySelector('[type="submit"]') || 
                      document.getElementById('calc-btn') || 
                      document.getElementById('calculate-btn') ||
                      formEl.querySelector('button');
    if (submitBtn) {
      submitBtn.click();
    } else {
      formEl.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  }

  // ----------------------------------------------------
  // Part 3: Reset Button Injection
  // ----------------------------------------------------
  function setupResetButton(formEl) {
    // Check if reset button already exists on the page
    const existingReset = document.getElementById('reset-btn') || 
                          document.getElementById('reset-sgpa') || 
                          document.getElementById('reset-tt') || 
                          formEl.querySelector('button[type="reset"]');
    if (existingReset) return;

    // Find the primary button (Calculate button) to append the reset button next to it
    const calcBtn = formEl.querySelector('[type="submit"]') || 
                    document.getElementById('calc-btn') || 
                    document.getElementById('calculate-btn') ||
                    formEl.querySelector('button.btn-primary');
    if (!calcBtn) return;

    // Create the reset button using UI framework variables
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'btn btn-primary pulse-hover btn-secondary';
    resetBtn.id = 'reset-btn';
    resetBtn.textContent = '🔄 Reset';
    resetBtn.style.marginLeft = 'var(--space-3)';

    // Append next to calc button
    calcBtn.parentNode.insertBefore(resetBtn, calcBtn.nextSibling);

    // Bind event
    resetBtn.addEventListener('click', () => {
      // 1. Reset standard forms
      formEl.reset();

      // 2. Clear values on inputs and sync range sliders
      const inputs = formEl.querySelectorAll('input');
      inputs.forEach(input => {
        if (input.type === 'number') {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (input.type === 'range') {
          input.value = input.min;
        }
      });

      // 3. Hide outputs
      const resultSec = document.getElementById('result-section') || 
                        document.getElementById('result-card') || 
                        document.getElementById('result-area') || 
                        document.getElementById('calc-results-card');
      if (resultSec) {
        resultSec.style.display = 'none';
        
        // Clean up canvas
        const canvas = resultSec.querySelector('#result-chart');
        if (canvas) canvas.remove();
      }
    });
  }

  // ----------------------------------------------------
  // Part 4: DOM Chart Observer
  // ----------------------------------------------------
  let observer = null;

  function setupDOMChartObserver() {
    if (observer) return;

    const resultSec = document.getElementById('result-section') || 
                      document.getElementById('result-card') || 
                      document.getElementById('result-area') || 
                      document.getElementById('calc-results-card');
    if (!resultSec) return;

    const handleMutation = () => {
      // Temporarily disconnect to avoid infinite loop on canvas insertion
      observer.disconnect();

      try {
        const text = (resultSec.innerText || '').toLowerCase();
        let matchedSemantic = null;
        const matchedValues = {};

        // Find a matching semantic chart rule
        for (const semantic of CHART_SEMANTICS) {
          let allKeysFound = true;
          for (const key of semantic.keys) {
            // Find lines containing the key name and capture the value
            const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            // Matches: key: $1,234.56 or key = 123
            const regex = new RegExp(`${escapedKey}[^:\\n=]*[:=]\\s*[^0-9.-]*([0-9,.-]+)`, 'i');
            const match = text.match(regex);
            if (match) {
              matchedValues[key] = parseFloat(match[1].replace(/,/g, ''));
            } else {
              allKeysFound = false;
              break;
            }
          }

          if (allKeysFound) {
            matchedSemantic = semantic;
            break;
          }
        }

        if (matchedSemantic) {
          // Check if canvas already exists
          let canvas = resultSec.querySelector('#result-chart');
          if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'result-chart';
            canvas.style.marginTop = 'var(--space-6)';
            canvas.style.width = '100%';
            canvas.style.height = '200px';
            canvas.style.display = 'block';
            
            // Insert canvas before download button or at the end of the card content
            const btnWrap = resultSec.querySelector('div[style*="flex"], #export-container');
            if (btnWrap) {
              resultSec.insertBefore(canvas, btnWrap);
            } else {
              resultSec.appendChild(canvas);
            }
          }

          const chartData = matchedSemantic.keys.map((key, idx) => ({
            label: matchedSemantic.labels[idx],
            value: matchedValues[key],
            color: getComputedStyle(document.body).getPropertyValue(matchedSemantic.colors[idx].replace('var(', '').replace(')', '')).trim() || '#3452FF'
          }));

          renderResultChart(canvas, chartData, matchedSemantic.type);
        } else {
          // If results changed and no semantic matched, remove canvas
          const canvas = resultSec.querySelector('#result-chart');
          if (canvas) canvas.remove();
        }
      } catch (err) {
        console.error('[CalculatorEnhancer] Chart error:', err);
      }

      // Reconnect observer
      observer.observe(resultSec, { childList: true, subtree: true, characterData: true });
    };

    observer = new MutationObserver(handleMutation);
    observer.observe(resultSec, { childList: true, subtree: true, characterData: true });
  }

  // ----------------------------------------------------
  // Part 5: Responsive, DPI-scaled Canvas Chart
  // ----------------------------------------------------
  function renderResultChart(canvasEl, chartData, type = 'donut') {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;

    const style = getComputedStyle(document.body);
    const primaryColor = style.getPropertyValue('--accent').trim() || '#3452FF';
    const successColor = style.getPropertyValue('--success').trim() || '#0E9F86';
    const textColor = style.getPropertyValue('--ink').trim() || '#1B2430';
    const textSoftColor = style.getPropertyValue('--ink-soft').trim() || '#5B6472';
    const borderColor = style.getPropertyValue('--border').trim() || '#E4E6EA';
    const cardBgColor = style.getPropertyValue('--surface').trim() || '#FFFFFF';

    let dataset = [];
    if (Array.isArray(chartData)) {
      dataset = chartData;
    } else if (chartData && chartData.labels && chartData.values) {
      dataset = chartData.labels.map((lbl, idx) => ({
        label: lbl,
        value: chartData.values[idx],
        color: chartData.colors ? chartData.colors[idx] : (idx === 0 ? primaryColor : (idx === 1 ? successColor : '#9AA2AE'))
      }));
    }

    if (!dataset.length) return;

    const devicePixelRatio = window.devicePixelRatio || 1;
    const width = canvasEl.clientWidth || 300;
    const height = canvasEl.clientHeight || 200;
    
    canvasEl.width = width * devicePixelRatio;
    canvasEl.height = height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    ctx.clearRect(0, 0, width, height);

    if (type === 'donut') {
      drawDonutChart(ctx, dataset, width, height, textColor, textSoftColor, cardBgColor);
    } else {
      drawBarChart(ctx, dataset, width, height, textColor, textSoftColor, borderColor);
    }
  }

  function drawDonutChart(ctx, dataset, width, height, textColor, textSoftColor, cardBgColor) {
    const total = dataset.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return;

    const centerX = width * 0.35;
    const centerY = height * 0.5;
    const radius = Math.min(centerX, centerY) * 0.8;

    let startAngle = -Math.PI / 2;

    dataset.forEach(item => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, radius * 0.55, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      startAngle += sliceAngle;
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.53, 0, 2 * Math.PI);
    ctx.fillStyle = cardBgColor;
    ctx.fill();

    if (dataset.length === 2) {
      const mainPercentage = ((dataset[0].value / total) * 100).toFixed(0) + '%';
      ctx.font = 'bold 1.25rem Inter, system-ui';
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(mainPercentage, centerX, centerY);
    }

    const legendX = width * 0.72;
    let legendY = height * 0.5 - (dataset.length * 12);

    dataset.forEach(item => {
      const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) + '%' : '0%';
      
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX, legendY, 10, 10);

      ctx.font = '500 0.8125rem Inter, system-ui';
      ctx.fillStyle = textColor;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${item.label} (${percentage})`, legendX + 16, legendY + 5);

      legendY += 24;
    });
  }

  function drawBarChart(ctx, dataset, width, height, textColor, textSoftColor, borderColor) {
    const chartWidth = width * 0.85;
    const chartHeight = height * 0.7;
    const originX = width * 0.1;
    const originY = height * 0.8;

    const maxVal = Math.max(...dataset.map(item => item.value)) * 1.15 || 10;

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX, originY - chartHeight);
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX + chartWidth, originY);
    ctx.stroke();

    ctx.strokeStyle = borderColor + '4D';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(originX, originY - chartHeight * 0.5);
    ctx.lineTo(originX + chartWidth, originY - chartHeight * 0.5);
    ctx.moveTo(originX, originY - chartHeight);
    ctx.lineTo(originX + chartWidth, originY - chartHeight);
    ctx.stroke();

    const barCount = dataset.length;
    const gapRatio = 0.4;
    const barWidth = chartWidth / (barCount + (barCount + 1) * gapRatio);
    const gapWidth = barWidth * gapRatio;

    dataset.forEach((item, idx) => {
      const barHeight = (item.value / maxVal) * chartHeight;
      const x = originX + gapWidth + idx * (barWidth + gapWidth);
      const y = originY - barHeight;

      ctx.fillStyle = item.color;
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.font = '500 0.75rem Inter, system-ui';
      ctx.fillStyle = textSoftColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      
      let label = item.label;
      if (label.length > 8) label = label.slice(0, 7) + '..';
      ctx.fillText(label, x + barWidth / 2, originY + 6);

      ctx.font = 'bold 0.8125rem Inter, system-ui';
      ctx.fillStyle = textColor;
      ctx.fillText(item.value.toLocaleString(undefined, { maximumFractionDigits: 1 }), x + barWidth / 2, y - 10);
    });
  }

  return {
    initSliders,
    renderResultChart,
    inferBounds
  };
})();

window.CalculatorEnhancer = CalculatorEnhancer;
