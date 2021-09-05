(() => {
  'use strict';

  /**
   * @param {string | null | undefined} s
   */
  function isEmpty(s) {
    return !isNotEmpty(s);
  }

  /**
   * @param {string | null | undefined} s
   * @returns {s is string}
   */
  function isNotEmpty(s) {
    return s != null && s !== '';
  }

  /**
   * @param {number} n
   * @param {number} maxLength
   */
  function padNumber(n, maxLength) {
    return (n + '').padStart(maxLength, '0');
  }

  /**
   * @param {Date} date
   */
  function formatDate(date) {
    const yyyy = padNumber(date.getFullYear(), 4);
    const MM = padNumber(date.getMonth() + 1, 2);
    const dd = padNumber(date.getDate(), 2);
    const HH = padNumber(date.getHours(), 2);
    const mm = padNumber(date.getMinutes(), 2);
    return `${yyyy}/${MM}/${dd} ${HH}:${mm}`;
  }

  /**
   * @param {string} tagName
   * @param {{ [attributeName: string]: string } | (Element | undefined)[] | string} [arg1]
   * @param {(Element | undefined)[] | string} [arg2]
   */
  function h(tagName, arg1, arg2) {
    const attributeByName = (Array.isArray(arg1) || typeof arg1 === 'string' ? {} : arg1) ?? {};
    const children = arg2 ?? (Array.isArray(arg1) || typeof arg1 === 'string' ? arg1 : []);

    const $element = document.createElement(tagName);
    for (const [attributeName, attribute] of Object.entries(attributeByName)) {
      $element.setAttribute(attributeName, attribute);
    }
    if (typeof children === 'string') {
      $element.textContent = children;
    } else {
      for (const child of children) {
        if (child != null) {
          if (child instanceof Element) {
            $element.appendChild(child);
          }
        }
      }
    }
    return $element;
  }

  /**
   * @param {string} icon
   */
  function i(icon) {
    const $svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    $svg.setAttribute('fill', '#5f6368');
    $svg.setAttribute('height', '24px');
    $svg.setAttribute('width', '24px');
    $svg.setAttribute('viewBox', '0 0 24 24');
    $svg.innerHTML = icon;
    return $svg;
  }

  /**
   * @param {string} key
   * @returns {Promise<any>}
   */
  function loadObject(key) {
    return new Promise((resolve, reject) => {
      window.chrome.storage.local.get(key, (items) => {
        if (window.chrome.runtime.lastError) {
          reject(window.chrome.runtime.lastError);
        } else {
          resolve(items[key]);
        }
      });
    });
  }

  /**
   * @param {string} key
   * @param {any} obj
   * @returns {Promise<void>}
   */
  function saveObject(key, obj) {
    return new Promise((resolve, reject) => {
      const items = { [key]: obj };
      window.chrome.storage.local.set(items, () => {
        if (window.chrome.runtime.lastError) {
          reject(window.chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * @returns {Promise<Record<string, Pin[]>>}
   */
  async function loadPins() {
    return (await loadObject('pins')) ?? {};
  }

  /**
   * @param {Record<string, Pin[]>} pins
   */
  function savePins(pins) {
    return saveObject('pins', pins);
  }

  /**
   * @returns {Promise<Record<string, Bookmark[]>>}
   */
  async function loadBookmarks() {
    return (await loadObject('bookmarks')) ?? {};
  }

  /**
   * @param {Record<string, Bookmark[]>} bookmarks
   */
  function saveBookmarks(bookmarks) {
    return saveObject('bookmarks', bookmarks);
  }

  /**
   * @returns {Promise<Reaction[]>}
   */
  async function loadRecentlyUsedReactions() {
    return (await loadObject('recentlyUsedReactions')) ?? [];
  }

  /**
   * @param {Reaction[]} reactions
   */
  function saveRecentlyUsedReactions(reactions) {
    return saveObject('recentlyUsedReactions', reactions);
  }

  window.y9JTVCMg = {
    isEmpty,
    isNotEmpty,
    formatDate,
    h,
    i,
    loadPins,
    savePins,
    loadBookmarks,
    saveBookmarks,
    loadRecentlyUsedReactions,
    saveRecentlyUsedReactions,
  };
})();
