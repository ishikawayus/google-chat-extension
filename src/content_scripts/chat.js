(() => {
  'use strict';

  const linkIcon = `<path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z"/>`;

  function isEmpty(s) {
    return s == null || s.length === 0;
  }

  /**
   * @param {Element} $button
   * @param {string} icon
   * @param {string} label
   */
  function cloneHoverButton($button, icon, label) {
    const $newHoverButton = $button.cloneNode(true);
    $newHoverButton.removeAttribute('jsname');
    $newHoverButton.removeAttribute('jslog');
    $newHoverButton.removeAttribute('data-id');
    $newHoverButton.setAttribute('aria-label', label);
    $newHoverButton.setAttribute('data-tooltip', label);
    $newHoverButton.querySelector('svg').innerHTML = icon;
    return $newHoverButton;
  }

  function run() {
    const groupId = document.querySelector('[data-group-id]')?.getAttribute('data-group-id');
    if (isEmpty(groupId)) {
      return;
    }
    for (const $message of document.querySelectorAll('[jsname="Ne3sFf"]')) {
      const messageId = $message.getAttribute('data-id');
      if (isEmpty(messageId)) {
        continue;
      }
      const $lastHoverButton = $message.querySelector('[jsname="MLuah"]');
      if ($lastHoverButton == null || $lastHoverButton.nextElementSibling != null) {
        continue;
      }
      const $newHoverButton = cloneHoverButton($lastHoverButton, linkIcon, 'リンクをコピー');
      $lastHoverButton.parentElement.appendChild($newHoverButton);
      $newHoverButton.addEventListener('click', () => {
        const $input = document.createElement('input');
        $input.value = `https://mail.google.com/chat/#chat/${groupId}/${messageId}`;
        $input.setAttribute('style', 'position: fixed; right: 200%');
        document.body.appendChild($input);
        $input.select();
        document.execCommand('copy');
        $input.remove();
      });
    }
  }

  (() => {
    run();
    const observer = new MutationObserver(() => run());
    observer.observe(document.body, { childList: true, subtree: true });
  })();
})();
