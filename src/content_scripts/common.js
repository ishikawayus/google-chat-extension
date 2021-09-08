(() => {
  'use strict';

  /** @type {{ [key: string]: { en: string; ja: string } }} */
  const textByLocaleByKey = {
    advancedSearch: {
      en: 'Advanced Search',
      ja: '高度な検索',
    },
    search: {
      en: 'Search',
      ja: '検索',
    },
    searchOptionNormalLabel: {
      en: 'Contains the following keywords',
      ja: '次のキーワードを含む',
    },
    searchOptionNormalHint: {
      en: 'Example: foo bar: Contains both "foo" and "bar"',
      ja: '例: foo bar: 「foo」と「bar」の両方を含む',
    },
    searchOptionPlusLabel: {
      en: 'Contains the following keywords as words',
      ja: '次のキーワードを単語として含む',
    },
    searchOptionPlusHint: {
      en: 'Example: foo bar: Contains both "foo" and "bar". Does not contain "Food" and "barring"',
      ja: '例: foo bar: 「foo」と「bar」の両方を含む。「food」や「barring」は対象にならない',
    },
    searchOptionMinusLabel: {
      en: 'Does not contain the following keywords',
      ja: '次のキーワードを含まない',
    },
    searchOptionMinusHint: {
      en: 'Example: foo bar: Does not contain "foo" and "bar"',
      ja: '例: foo bar: 「foo」と「bar」を含まない',
    },
    searchOptionFromLabel: {
      en: 'Sent from the following account',
      ja: '次のアカウントが送信',
    },
    searchOptionFromHint: {
      en: 'Example: foo@bar.com: Sent from foo@bar.com',
      ja: '例: foo@bar.com: foo@bar.comが送信した',
    },
    searchOptionAtLabel: {
      en: 'Sent at the following account',
      ja: '次のアカウントへ送信',
    },
    searchOptionAtHint: {
      en: 'Example: foo@bar.com: Sent at foo@bar.com',
      ja: '例: foo@bar.com: foo@bar.comへ送信した',
    },
    searchOptionBeforeLabel: {
      en: 'Before the following date',
      ja: '次の日付以前',
    },
    searchOptionAfterLabel: {
      en: 'After the following date',
      ja: '次の日付以降',
    },
    searchOptionOlderThanLabel: {
      en: 'Before the following period',
      ja: '次の期間以前',
    },
    searchOptionNewerThanLabel: {
      en: 'After the following period',
      ja: '次の期間以降',
    },
    searchOptionPeriodOptionDay: {
      en: 'Days',
      ja: '日',
    },
    searchOptionPeriodOptionMonth: {
      en: 'Months',
      ja: 'か月',
    },
    searchOptionPeriodOptionYear: {
      en: 'Years',
      ja: '年',
    },
    searchOptionTzLabel: {
      en: 'Specify the time zone of the date',
      ja: '日付のタイムゾーンを指定',
    },
    searchOptionHasLabel: {
      en: 'Contains the following content',
      ja: '次のコンテンツを含む',
    },
    searchOptionHasOptionFile: {
      en: 'File',
      ja: 'ファイル',
    },
    searchOptionHasOptionDoc: {
      en: 'Doc',
      ja: 'ドキュメント',
    },
    searchOptionHasOptionSheet: {
      en: 'Sheet',
      ja: 'シート',
    },
    searchOptionHasOptionSlide: {
      en: 'Slide',
      ja: 'スライド',
    },
    searchOptionHasOptionUrl: {
      en: 'URL',
      ja: 'URL',
    },
    searchOptionHasOptionVideo: {
      en: 'Video',
      ja: '動画',
    },
    searchOptionHasOptionPdf: {
      en: 'PDF',
      ja: 'PDF',
    },
    searchOptionHasOptionImage: {
      en: 'Image',
      ja: '画像',
    },
    searchOptionIsLabel: {
      en: 'Search for the following messages',
      ja: '次のメッセージを検索対象にする',
    },
    searchOptionIsOptionDm: {
      en: 'DM',
      ja: 'DM',
    },
    searchOptionIsOptionRoom: {
      en: 'Chat room messages',
      ja: 'チャットルームのメッセージ',
    },
    searchOptionIsOptionThreadedroom: {
      en: 'Conversational message',
      ja: '会話のメッセージ',
    },
    searchOptionIsOptionFlatroom: {
      en: 'Non-threaded chat room messages',
      ja: '非スレッド形式のチャットルームのメッセージ',
    },
    pinnedCount: {
      en: '%d Pinned',
      ja: '%d ピン留め',
    },
    noPinned: {
      en: 'No Pinned',
      ja: 'ピン留めなし',
    },
    remove: {
      en: 'Remove',
      ja: '削除',
    },
    copyLink: {
      en: 'Copy Link',
      ja: 'リンクをコピー',
    },
    changePinned: {
      en: 'Change Pinned',
      ja: 'ピン留めを変更',
    },
    saveRelatedPage: {
      en: 'Save Related Page',
      ja: '関連ページを保存',
    },
    title: {
      en: 'Title',
      ja: 'タイトル',
    },
    url: {
      en: 'URL',
      ja: 'URL',
    },
    save: {
      en: 'Save',
      ja: '保存',
    },
  };

  /**
   * @type {'en' | 'ja'}
   */
  let locale = 'en';

  /**
   * @param {string} key
   * @param  {...unknown} args
   */
  function i18n(key, ...args) {
    const textByLocale = textByLocaleByKey[key];
    if (textByLocale == null) {
      return key;
    }
    let index = 0;
    return textByLocale[locale].replace(/%./g, () => args[index++] + '');
  }

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
   * @returns {Promise<'en' | 'ja'>}
   */
  async function loadLocale() {
    return (await loadObject('locale')) ?? 'en';
  }

  /**
   * @param {'en' | 'ja'} locale
   */
  function saveLocale(locale) {
    return saveObject('locale', locale);
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
    i18n,
    isEmpty,
    isNotEmpty,
    formatDate,
    h,
    i,
    loadLocale,
    saveLocale,
    loadPins,
    savePins,
    loadBookmarks,
    saveBookmarks,
    loadRecentlyUsedReactions,
    saveRecentlyUsedReactions,
  };

  (async () => {
    locale = await loadLocale();
  })();
})();
