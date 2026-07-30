/**
 * Anagram Generator & Solver Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  // Let's enhance inputs if needed or just use text-input
  const inputEl = document.getElementById('text-input');
  if (inputEl) {
    inputEl.placeholder = "e.g., silent or listen or a set of letters like 'aet'";
    inputEl.value = "silent";
  }

  // Common english words to match against for a basic solver
  const commonWords = [
    "the", "of", "and", "a", "to", "in", "is", "you", "that", "it", "he", "was", "for", "on", "are", "as", "with", "his", "they", "i",
    "at", "be", "this", "have", "from", "or", "one", "had", "by", "word", "but", "not", "what", "all", "were", "we", "when", "your", "can", "said",
    "there", "use", "an", "each", "which", "she", "do", "how", "their", "if", "will", "up", "other", "about", "out", "many", "then", "them", "these", "so",
    "some", "her", "would", "make", "like", "him", "into", "time", "has", "look", "two", "more", "write", "go", "see", "number", "no", "way", "could", "people",
    "my", "than", "first", "water", "been", "called", "who", "am", "its", "now", "find", "long", "down", "day", "did", "get", "come", "made", "may", "part",
    "silent", "listen", "enlist", "tinsel", "inlets", "earth", "heart", "hater", "rathe", "react", "cater", "crate", "trace", "stare", "tears", "rates", "aster",
    "taser", "beard", "bread", "debar", "bared", "dares", "reads", "dear", "dare", "read", "bare", "bear", "cater", "least", "slate", "stale", "tales", "steal",
    "acts", "cats", "cast", "lime", "mile", "elms", "limes", "miles", "slime", "smile", "melts", "night", "thing", "pears", "spear", "spare", "reaps", "parse",
    "team", "meat", "tame", "mate", "range", "anger", "regna", "post", "stop", "pots", "tops", "opts", "spot", "flow", "wolf", "blow", "bowl", "loop", "pool"
  ];

  function getPermutations(str) {
    if (str.length <= 1) return [str];
    const perms = new Set();
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const remaining = str.slice(0, i) + str.slice(i + 1);
      const subPerms = getPermutations(remaining);
      for (const sub of subPerms) {
        perms.add(char + sub);
      }
    }
    return Array.from(perms);
  }

  function calculate() {
    const raw = (document.getElementById('text-input')?.value || '').trim().toLowerCase();
    if (!raw) {
      if (out) out.value = '';
      return;
    }

    // Strip non-alphabetic chars for processing
    const cleanStr = raw.replace(/[^a-z]/g, '');
    if (!cleanStr) {
      if (out) out.value = 'Please enter text containing alphabetic characters.';
      return;
    }

    let result = '';
    result += `Input Word/Letters: "${cleanStr}"n`;
    result += `Sorted Key: "${cleanStr.split('').sort().join('')}"nn`;

    // 1. Find matched valid anagrams from our list of words
    const sortedTarget = cleanStr.split('').sort().join('');
    const matchedWords = commonWords.filter(w => {
      if (w === cleanStr) return false; // don't count itself as anagram
      return w.length === cleanStr.length && w.split('').sort().join('') === sortedTarget;
    });

    if (matchedWords.length > 0) {
      result += `✨ Found Valid Dictionary Anagrams:n`;
      matchedWords.forEach(w => {
        result += ` - ${w}n`;
      });
      result += `n`;
    } else {
      result += `ℹ️ No valid dictionary anagrams found in our database for "${cleanStr}".nn`;
    }

    // 2. Generate rearrangements
    if (cleanStr.length <= 7) {
      const allPerms = getPermutations(cleanStr).filter(p => p !== cleanStr);
      result += `🔄 All Possible Letter Permutations (${allPerms.length}):n`;
      result += allPerms.join(', ') + 'n';
    } else {
      result += `🔄 Input is too long for complete permutations. Here are some random letter shuffles:n`;
      const shuffles = new Set();
      while (shuffles.size < 15) {
        const arr = cleanStr.split('');
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        const candidate = arr.join('');
        if (candidate !== cleanStr) {
          shuffles.add(candidate);
        }
      }
      result += Array.from(shuffles).join(', ') + 'n';
    }

    if (out) out.value = result;
    if (window.showToast) window.showToast('Anagrams generated!', 'success');
  }

  const activeBtn = document.getElementById('calc-ag-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});
