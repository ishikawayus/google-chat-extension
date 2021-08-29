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

  window.y9JTVCMg = {
    isEmpty,
    isNotEmpty,
    formatDate,
    h,
    i,
  };
})();
