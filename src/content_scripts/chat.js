(() => {
  'use strict';

  const { isEmpty, formatDate, h } = window.y9JTVCMg;

  const linkIcon = `<path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z"/>`;

  /**
   * @param {Element} $button
   * @param {string} icon
   * @param {string} label
   */
  function cloneHoverButton($button, icon, label) {
    const $newHoverButton = $button.cloneNode(true);
    if (!($newHoverButton instanceof Element)) {
      throw new Error('Failed to clone node');
    }
    $newHoverButton.removeAttribute('jsname');
    $newHoverButton.removeAttribute('jslog');
    $newHoverButton.removeAttribute('data-id');
    $newHoverButton.setAttribute('data-zvhq', 'true');
    $newHoverButton.setAttribute('aria-label', label);
    $newHoverButton.setAttribute('data-tooltip', label);
    const $newHoverButtonSvg = $newHoverButton.querySelector('svg');
    if ($newHoverButtonSvg != null) {
      $newHoverButtonSvg.innerHTML = icon;
    }
    return $newHoverButton;
  }

  function run() {
    const groupId = document.querySelector('[data-group-id]')?.getAttribute('data-group-id');
    if (isEmpty(groupId)) {
      return;
    }
    for (const $message of document.querySelectorAll('[jsname="Ne3sFf"]')) {
      const messageId = $message.getAttribute('data-id');
      if (isEmpty(messageId) || $message.querySelector('[data-zvhq]') != null) {
        continue;
      }
      const $hoverButton = $message.querySelector('[jsname="MLuah"]');
      if ($hoverButton == null || $hoverButton.parentElement == null) {
        continue;
      }
      const $newHoverButton = cloneHoverButton($hoverButton, linkIcon, 'リンクをコピー');
      $hoverButton.parentElement.appendChild($newHoverButton);
      $newHoverButton.addEventListener('click', () => {
        const $input = document.createElement('input');
        $input.value = `https://mail.google.com/chat/#chat/${groupId}/${messageId}`;
        $input.setAttribute('style', 'position: fixed; right: 200%');
        document.body.appendChild($input);
        $input.select();
        document.execCommand('copy');
        $input.remove();
      });
      const $timestamp = $message.querySelector('[data-absolute-timestamp]');
      if ($timestamp != null && $timestamp.parentElement != null) {
        const timestamp = $timestamp.getAttribute('data-absolute-timestamp');
        const date = timestamp != null ? new Date(parseInt(timestamp, 10)) : new Date();
        const $timestampTooltip = h('div', { class: 'zvhq-tooltip', style: 'display: none' }, formatDate(date));
        $timestamp.parentElement.style.position = 'relative';
        $timestamp.parentElement.appendChild($timestampTooltip);
        $timestamp.addEventListener('mouseenter', () => {
          $timestampTooltip.style.display = '';
        });
        $timestamp.addEventListener('mouseleave', () => {
          $timestampTooltip.style.display = 'none';
        });
      }
    }
  }

  (() => {
    run();
    const observer = new MutationObserver(() => run());
    observer.observe(document.body, { childList: true, subtree: true });
  })();
})();
