const BUTTON_SELECTOR = 'button[aria-label]';

function isRaiseHandButton(button) {
  const label = (button.getAttribute('aria-label') || '').toLowerCase();
  return label.startsWith('raise hand');
}

function decorateButton(button) {
  button.classList.add('gmnh-button');

  const symbols = button.querySelectorAll('i.google-symbols');
  if (symbols.length === 0) {
    return;
  }

  symbols.forEach((icon) => {
    if (icon.textContent.trim() !== 'emoji_people') {
      icon.textContent = 'emoji_people';
    }
    icon.classList.add('gmnh-symbol');
  });
}

function scanAndDecorate() {
  document.querySelectorAll(BUTTON_SELECTOR).forEach((button) => {
    if (isRaiseHandButton(button)) {
      decorateButton(button);
    }
  });
}

let rafId = null;
function scheduleScan() {
  if (rafId !== null) {
    return;
  }

  rafId = window.requestAnimationFrame(() => {
    rafId = null;
    scanAndDecorate();
  });
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList' || mutation.type === 'attributes') {
      scheduleScan();
      return;
    }
  }
});

observer.observe(document.documentElement, {
  subtree: true,
  childList: true,
  attributes: true,
  attributeFilter: ['aria-label']
});

scanAndDecorate();
