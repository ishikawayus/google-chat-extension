(() => {
  'use strict';

  const {
    isEmpty,
    formatDate,
    h,
    i,
    loadPins,
    savePins,
    loadBookmarks,
    saveBookmarks,
    loadRecentlyUsedReactions,
    saveRecentlyUsedReactions,
  } = window.y9JTVCMg;

  const accountCircleIcon = `<path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11z"/>`;
  const addIcon = `<path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>`;
  const closeIcon = `<path d="M0 0h24v24H0V0z" fill="none"></path><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>`;
  const linkIcon = `<path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z"/>`;
  const pushPinIcon = `<g><rect fill="none" height="24" width="24"/></g><g><path d="M14,4v5c0,1.12,0.37,2.16,1,3H9c0.65-0.86,1-1.9,1-3V4H14 M17,2H7C6.45,2,6,2.45,6,3c0,0.55,0.45,1,1,1c0,0,0,0,0,0l1,0v5 c0,1.66-1.34,3-3,3v2h5.97v7l1,1l1-1v-7H19v-2c0,0,0,0,0,0c-1.66,0-3-1.34-3-3V4l1,0c0,0,0,0,0,0c0.55,0,1-0.45,1-1 C18,2.45,17.55,2,17,2L17,2z"/></g>`;

  /** @type {Pin[] | undefined} */
  let pins;

  /** @type {Bookmark[] | undefined} */
  let bookmarks;

  /** @type {Reaction[] | undefined} */
  let reactions;

  function uuid() {
    const format = 'RRRRRRRR-RRRR-4RRR-rRRR-RRRRRRRRRRRR';
    let ret = '';
    for (const s of format) {
      switch (s) {
        case 'R':
          ret += Math.floor(Math.random() * 16).toString(16);
          break;
        case 'r':
          ret += (Math.floor(Math.random() * 4) + 8).toString(16);
          break;
        default:
          ret += s;
          break;
      }
    }
    return ret;
  }

  /**
   *
   * @param {Element} $element
   * @param {string} attribute
   */
  function findAttribute($element, attribute) {
    return $element.querySelector(`[${attribute}]`)?.getAttribute(attribute);
  }

  /**
   * @param {string} groupId
   * @param {string} messageId
   * @param {Element} $message
   */
  async function updatePin(groupId, messageId, $message) {
    const pinsByGroupId = { ...(await loadPins()) };
    if (pinsByGroupId[groupId]?.find((pin) => pin.messageId === messageId) == null) {
      const timestamp = findAttribute($message, 'data-absolute-timestamp');
      const userId = $message.getAttribute('data-user-id');
      const user = findAttribute($message, 'data-name');
      const body = $message.querySelector('[jsname="bgckF"]')?.textContent;
      const links = /** @type {{ title: string, url: string }[]} */ ([]);
      for (const $a of $message.querySelectorAll('[jsname="KUOBaf"] a')) {
        const title = $a.getAttribute('title');
        const url = $a.getAttribute('href');
        if (title == null || url == null) {
          console.log('Failed to get message link', messageId, title, url);
        } else {
          links.push({ title, url });
        }
      }
      if (timestamp == null || userId == null || user == null || body == null) {
        console.log('Failed to get message', messageId, timestamp, userId, user, body);
      } else {
        const pin = { messageId, timestamp, userId, user, body, links };
        pins = [...(pinsByGroupId[groupId] ?? []), pin];
        pinsByGroupId[groupId] = pins;
        await savePins(pinsByGroupId);
      }
    } else {
      pins = [...(pinsByGroupId[groupId] ?? [])].filter((pin) => pin.messageId !== messageId);
      pinsByGroupId[groupId] = pins;
      await savePins(pinsByGroupId);
    }
    updatePinMessage(messageId);
    updatePinButton();
  }

  /**
   * @param {string} messageId
   */
  async function removePin(messageId) {
    const groupId = findAttribute(document.body, 'data-group-id');
    if (groupId == null) {
      console.log('Failed to get groupId', groupId);
      return;
    }
    const pinsByGroupId = { ...(await loadPins()) };
    pins = [...(pinsByGroupId[groupId] ?? [])].filter((pin) => pin.messageId !== messageId);
    pinsByGroupId[groupId] = pins;
    await savePins(pinsByGroupId);
    updatePinMessage(messageId);
    updatePinButton();
  }

  /**
   * @param {string} messageId
   */
  function updatePinMessage(messageId) {
    const $message = document.querySelector(`[jsname="Ne3sFf"][data-id="${messageId}"]`);
    if ($message == null) {
      console.log('Failed to get $message', messageId);
      return;
    }
    if (pins?.find((pin) => pin.messageId === messageId) != null) {
      $message.classList.add('dyab-pinned');
    } else {
      $message.classList.remove('dyab-pinned');
    }
  }

  function updatePinButton() {
    const $buttonSpan = document.querySelector('.dyab-bookmarks-button span');
    if ($buttonSpan != null) {
      $buttonSpan.textContent = (pins?.length ?? '?') + 'ピン留め';
    }
    const $popoverInner = document.querySelector('.dyab-bookmarks-button-popover-inner');
    if ($popoverInner != null && pins != null) {
      $popoverInner.innerHTML = '';
      for (const pin of pins) {
        const $user = h('span', { class: 'dyab-pin-head-user' }, pin.user);
        const $closeButton = h('span', { class: `dyab-icon-button small` }, [i(closeIcon)]);
        const $div = h('div', { class: 'dyab-pin' }, [
          h('div', { class: 'dyab-pin-head' }, [
            i(accountCircleIcon),
            $user,
            h('span', { class: 'dyab-pin-head-timestamp' }, formatDate(new Date(parseInt(pin.timestamp, 10)))),
            $closeButton,
          ]),
          h('div', { class: 'dyab-pin-body' }, pin.body),
          h(
            'div',
            { class: 'dyab-pin-links' },
            pin.links.map((link) => {
              const $button = h('span', { class: `dyab-icon-button small`, title: link.title + '\n' + link.url }, [
                i(linkIcon),
              ]);
              $button.addEventListener('click', (event) => {
                event.stopPropagation();
                window.open(link.url, '_blank');
              });
              return $button;
            })
          ),
        ]);
        $popoverInner.appendChild($div);
        $user.addEventListener('click', (event) => {
          event.stopPropagation();
          window.open(`https://contacts.google.com/person/${pin.userId}`, '_blank');
        });
        $closeButton.addEventListener('click', (event) => {
          event.stopPropagation();
          removePin(pin.messageId);
        });
        $div.addEventListener('click', () => {
          const groupId = findAttribute(document.body, 'data-group-id');
          if (groupId == null) {
            return;
          }
          window.open(`https://mail.google.com/chat/#chat/${groupId}/${pin.messageId}`, '_blank');
        });
      }
      if (pins.length === 0) {
        $popoverInner.appendChild(h('div', { class: 'dyab-pin-nodata' }, 'ピン留めなし'));
      }
    }
  }

  /**
   * @param {string} groupId
   */
  async function saveBookmark(groupId) {
    const $title = document.querySelector('.dyab-bookmark-dialog-title');
    const $url = document.querySelector('.dyab-bookmark-dialog-url');
    if ($title instanceof HTMLInputElement && $url instanceof HTMLInputElement) {
      const bookmarksByGroupId = { ...(await loadBookmarks()) };
      const bookmark = { id: uuid(), title: $title.value, url: $url.value };
      bookmarks = [...(bookmarksByGroupId[groupId] ?? []), bookmark];
      bookmarksByGroupId[groupId] = bookmarks;
      await saveBookmarks(bookmarksByGroupId);
      updateBookmarks();
    }
  }

  /**
   * @param {string} bookmarkId
   */
  async function removeBookmark(bookmarkId) {
    const groupId = findAttribute(document.body, 'data-group-id');
    if (groupId == null) {
      return;
    }
    const bookmarksByGroupId = { ...(await loadBookmarks()) };
    bookmarks = (bookmarksByGroupId[groupId] ?? []).filter((bookmark) => bookmark.id !== bookmarkId);
    bookmarksByGroupId[groupId] = bookmarks;
    await saveBookmarks(bookmarksByGroupId);
    updateBookmarks();
  }

  function updateBookmarks() {
    const $container = document.querySelector('.dyab-bookmarks-container');
    if ($container != null && bookmarks != null) {
      $container.innerHTML = '';
      for (const bookmark of bookmarks) {
        const $button = h('div', { class: 'dyab-bookmarks-button', title: bookmark.title + '\n' + bookmark.url }, [
          i(linkIcon),
          h('span', bookmark.title),
        ]);
        $button.addEventListener('click', () => {
          window.open(bookmark.url, '_blank');
        });
        $button.addEventListener('contextmenu', (event) => {
          event.preventDefault();
          removeBookmark(bookmark.id);
        });
        $container.appendChild($button);
      }
    }
  }

  /**
   * @param {Reaction} reaction
   */
  async function saveReactions(reaction) {
    reactions = (await loadRecentlyUsedReactions()).filter((r) => r.label !== reaction.label);
    reactions.push(reaction);
    await saveRecentlyUsedReactions(reactions);
    updateReactionsForAllMessages();
  }

  function updateReactionsForAllMessages() {
    if (reactions == null || reactions.length === 0) {
      return;
    }
    for (const $reactionContainer of document.querySelectorAll('[jsname="OPTywb"] [jsname="me23c"]')) {
      $reactionContainer.removeAttribute('data-m6zx');
      updateReactions($reactionContainer);
    }
  }

  /**
   * @param {Reaction} reaction
   */
  function createReaction(reaction) {
    return h('div', { class: 'Bx60Yc' }, [
      h(
        'div',
        {
          role: 'menuitem',
          class: 'U26fgb mUbCce fKz7Od dtPjgd M9Bg4d',
          jscontroller: 'RCdJKe',
          jsaction:
            'click:cOuCgd; mousedown:UX7yZ; mouseup:lbsD7e; mouseenter:tfO1Yc; mouseleave:JywGue; focus:AHmuwe; blur:O22p3e; contextmenu:mg9Pef;touchstart:p6p2H; touchmove:FwuNnf; touchend:yfqBxc(preventMouseEvents=true|preventDefault=true); touchcancel:JMtRjd;',
          jsshadow: '',
          jsname: 'vnVdbf',
          'aria-label': reaction.label,
          'aria-disabled': 'false',
          tabindex: '-1',
          'data-emoji': reaction.label,
        },
        [
          h('div', { class: 'VTBa7b MbhUzd', jsname: 'ksKsZd' }),
          h('span', { jsslot: '', class: 'xjKiLb' }, [
            h('span', { class: 'Ce1Y1c', style: 'top: -12px' }, [
              h('img', {
                'data-emoji': reaction.label,
                class: 'iiJ4W',
                alt: reaction.label,
                'aria-label': reaction.label,
                src: reaction.src,
              }),
            ]),
          ]),
        ]
      ),
    ]);
  }

  /**
   * @param {Element} $reactionContainer
   */
  function updateReactions($reactionContainer) {
    if (reactions == null || reactions.length === 0) {
      return;
    }
    if ($reactionContainer.getAttribute('data-m6zx') != null) {
      return;
    }
    const $childNodes = [...$reactionContainer.childNodes];
    if ($childNodes.length === 0) {
      return;
    }
    $reactionContainer.setAttribute('data-m6zx', '1');
    for (let i = 0; i < $childNodes.length; i++) {
      if (i >= reactions.length) {
        break;
      }
      const $reaction = $childNodes[i];
      const reaction = reactions[reactions.length - i - 1];
      if (!($reaction instanceof Element) || reaction == null) {
        console.log('Failed to get $reaction or reaction', $reaction, reaction, i);
        break;
      }
      $reactionContainer.insertBefore(createReaction(reaction), $reaction);
      $reaction.remove();
    }
  }

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

  /**
   * @param {string} groupId
   * @param {string} messageId
   * @param {Element} $hoverButton
   */
  function addLinkCopyButton(groupId, messageId, $hoverButton) {
    if ($hoverButton == null || $hoverButton.parentElement == null) {
      return;
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
  }

  /**
   * @param {string} groupId
   * @param {string} messageId
   * @param {Element} $message
   * @param {Element} $hoverButton
   */
  function addPinButton(groupId, messageId, $message, $hoverButton) {
    if ($hoverButton == null || $hoverButton.parentElement == null) {
      return;
    }
    const $newHoverButton = cloneHoverButton($hoverButton, pushPinIcon, 'ピン留めを変更');
    $hoverButton.parentElement.appendChild($newHoverButton);
    $newHoverButton.addEventListener('click', () => {
      updatePin(groupId, messageId, $message);
    });
  }

  /**
   *
   * @param {string} timestamp
   * @param {Element} $timestamp
   * @returns
   */
  function addTimestampTooltip(timestamp, $timestamp) {
    if ($timestamp.parentElement == null) {
      return;
    }
    const date = new Date(parseInt(timestamp, 10));
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

  async function run() {
    const groupId = findAttribute(document.body, 'data-group-id');
    if (groupId == null || isEmpty(groupId)) {
      return;
    }
    if (pins == null) {
      pins = (await loadPins())?.[groupId] ?? [];
    }
    if (bookmarks == null) {
      bookmarks = (await loadBookmarks())?.[groupId] ?? [];
    }
    if (reactions == null) {
      reactions = (await loadRecentlyUsedReactions()) ?? [];
    }
    for (const $message of document.querySelectorAll('[jsname="Ne3sFf"]')) {
      const messageId = $message.getAttribute('data-id');
      if (messageId == null || isEmpty(messageId) || $message.querySelector('[data-zvhq]') != null) {
        continue;
      }
      const $hoverButton = $message.querySelector('[jsname="MLuah"]');
      const $timestamp = $message.querySelector('[data-absolute-timestamp]');
      const timestamp = $timestamp?.getAttribute('data-absolute-timestamp');
      if ($hoverButton == null || $timestamp == null || timestamp == null) {
        continue;
      }
      addLinkCopyButton(groupId, messageId, $hoverButton);
      addPinButton(groupId, messageId, $message, $hoverButton);
      addTimestampTooltip(timestamp, $timestamp);
      updatePinMessage(messageId);
    }
    for (const $reactionContainer of document.querySelectorAll('[jsname="OPTywb"] [jsname="me23c"]')) {
      updateReactions($reactionContainer);
    }
    for (const $reaction of document.querySelectorAll('[jsname="vnVdbf"]')) {
      if ($reaction.getAttribute('data-u4br') == null) {
        $reaction.setAttribute('data-u4br', '1');
        $reaction.addEventListener('click', () => {
          const $reactionImg = $reaction.querySelector('img');
          const label = $reactionImg?.getAttribute('aria-label');
          const src = $reactionImg?.getAttribute('src');
          if (label != null && src != null) {
            saveReactions({ label, src });
          }
        });
      }
    }
    const $tabContainer = document.querySelector('.UDyRYe');
    if (
      $tabContainer != null &&
      $tabContainer.parentElement != null &&
      $tabContainer.parentElement.querySelector('[data-dyab]') == null
    ) {
      const $pinButton = h('div', { class: 'dyab-bookmarks-button' }, [i(pushPinIcon), h('span')]);
      const $pinPopover = h('div', { class: 'dyab-bookmarks-button-popover', style: 'display: none' }, [
        h('div', { class: 'dyab-bookmarks-button-popover-scroll' }, [
          h('div', { class: 'dyab-bookmarks-button-popover-inner' }),
        ]),
      ]);
      const $addButton = h('div', { class: 'dyab-bookmarks-button' }, [i(addIcon), h('span', '関連ページを追加')]);
      const $bookmarkContainer = h('div', { class: 'dyab-bookmarks', 'data-dyab': 'true' }, [
        h('div', { class: 'dyab-bookmarks-button-container' }, [$pinButton, $pinPopover]),
        h('div', { class: 'dyab-bookmarks-container' }),
        h('div', { class: 'dyab-bookmarks-button-container' }, [$addButton]),
      ]);
      $tabContainer.parentElement.insertBefore($bookmarkContainer, $tabContainer.nextElementSibling);
      $pinButton.addEventListener('click', () => {
        $pinPopover.style.display = $pinPopover.style.display === 'none' ? '' : 'none';
      });
      updatePinButton();

      const $bookmarkDialogTitle = h('input', { class: 'dyab-bookmark-dialog-title' });
      const $bookmarkDialogUrl = h('input', { class: 'dyab-bookmark-dialog-url' });
      const $bookmarkDialogCloseButton = h('div', { class: `dyab-icon-button` }, [i(closeIcon)]);
      const $bookmarkDialogSaveButton = h('div', { class: `dyab-button` }, '保存');

      const $bookmarkDialog = h('div', { class: 'dyab-dialog' }, [
        h('div', { class: 'dyab-dialog-header' }, [
          h('div', '関連ページを保存'),
          h('div', { class: 'dyab-pull-right' }, [$bookmarkDialogCloseButton]),
        ]),
        h('div', { class: 'dyab-dialog-body' }, [
          h('div', { class: 'dyab-form-control' }, [h('label', 'タイトル'), h('div', [$bookmarkDialogTitle])]),
          h('div', { class: 'dyab-form-control' }, [h('label', 'URL'), h('div', [$bookmarkDialogUrl])]),
        ]),
        h('div', { class: 'dyab-dialog-footer' }, [
          h('div', { class: 'dyab-pull-right' }, [$bookmarkDialogSaveButton]),
        ]),
      ]);
      const $bookmarkDialogBackground = h('div', { class: `dyab-dialog-background`, style: 'display: none' }, [
        h('div', { class: `dyab-dialog-container` }, [$bookmarkDialog]),
      ]);
      document.body.appendChild(h('div', [$bookmarkDialogBackground]));
      $addButton.addEventListener('click', () => {
        $bookmarkDialogTitle.value = '';
        $bookmarkDialogUrl.value = '';
        $bookmarkDialogBackground.style.display = '';
      });
      $bookmarkDialogBackground.addEventListener('click', (event) => {
        if (event.target instanceof Node && !$bookmarkDialog.contains(event.target)) {
          $bookmarkDialogBackground.style.display = 'none';
        }
      });
      $bookmarkDialogCloseButton.addEventListener('click', () => {
        $bookmarkDialogBackground.style.display = 'none';
      });
      $bookmarkDialogSaveButton.addEventListener('click', () => {
        saveBookmark(groupId);
        $bookmarkDialogBackground.style.display = 'none';
      });

      updateBookmarks();
    }
  }

  (() => {
    run();
    const observer = new MutationObserver(() => run());
    observer.observe(document.body, { childList: true, subtree: true });
  })();
})();
