(() => {
  'use strict';

  const { i18n, isNotEmpty, h, i } = window.y9JTVCMg;

  const closeIcon = `<path d="M0 0h24v24H0V0z" fill="none"></path><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>`;

  function text() {
    return h('input');
  }

  function numeric() {
    return h('input', { type: 'number', min: '1' });
  }

  function date() {
    return h('input', { type: 'date' });
  }

  /**
   * @param {string} initial
   * @param {[string, string][]} options
   */
  function select(initial, options) {
    return h(
      'select',
      options.map(([value, label]) => h('option', value === initial ? { value, selected: 'true' } : { value }, label))
    );
  }

  /**
   * @typedef {{
   *   normal: Element,
   *   plus: Element,
   *   minus: Element,
   *   from: Element,
   *   at: Element,
   *   before: Element,
   *   after: Element,
   *   olderValue: Element,
   *   olderUnit: Element,
   *   newerValue: Element,
   *   newerUnit: Element,
   *   tz: Element,
   *   has: Element,
   *   is: Element }} Form
   */

  function createForm() {
    return {
      normal: text(),
      plus: text(),
      minus: text(),
      from: text(),
      at: text(),
      before: date(),
      after: date(),
      olderValue: numeric(),
      olderUnit: select('d', [
        ['d', i18n('searchOptionPeriodOptionDay')],
        ['m', i18n('searchOptionPeriodOptionMonth')],
        ['y', i18n('searchOptionPeriodOptionYear')],
      ]),
      newerValue: numeric(),
      newerUnit: select('d', [
        ['d', i18n('searchOptionPeriodOptionDay')],
        ['m', i18n('searchOptionPeriodOptionMonth')],
        ['y', i18n('searchOptionPeriodOptionYear')],
      ]),
      tz: select('', [
        ['', '+00:00'],
        ['GMT+09:00', '+09:00'],
      ]),
      has: select('', [
        ['', ''],
        ['file', i18n('searchOptionHasOptionFile')],
        ['doc', i18n('searchOptionHasOptionDoc')],
        ['sheet', i18n('searchOptionHasOptionSheet')],
        ['slide', i18n('searchOptionHasOptionSlide')],
        ['url', i18n('searchOptionHasOptionUrl')],
        ['video', i18n('searchOptionHasOptionVideo')],
        ['pdf', i18n('searchOptionHasOptionPdf')],
        ['image', i18n('searchOptionHasOptionImage')],
      ]),
      is: select('', [
        ['', ''],
        ['dm', i18n('searchOptionIsOptionDm')],
        ['room', i18n('searchOptionIsOptionRoom')],
        ['threadedroom', i18n('searchOptionIsOptionThreadedroom')],
        ['flatroom', i18n('searchOptionIsOptionFlatroom')],
      ]),
    };
  }

  /**
   * @param {string} label
   * @param {string | null | undefined} example
   * @param  {...Element} $inputList
   */
  function formControl(label, example, ...$inputList) {
    return h('div', { class: `yqwh-form-control` }, [
      h('label', label),
      h('div', $inputList),
      example != null ? h('span', { class: `yqwh-hint` }, example) : undefined,
    ]);
  }

  /**
   * @param {Form} form
   * @param {Element} $dialogCloseButton
   * @param {Element} $dialogSearchButton
   */
  function createDialog(form, $dialogCloseButton, $dialogSearchButton) {
    return h('div', { class: `yqwh-dialog` }, [
      h('div', { class: `yqwh-dialog-header` }, [
        h('div', i18n('advancedSearch')),
        h('div', { class: `yqwh-pull-right` }, [$dialogCloseButton]),
      ]),
      h('div', { class: `yqwh-dialog-body` }, [
        formControl(i18n('searchOptionNormalLabel'), i18n('searchOptionNormalHint'), form.normal),
        formControl(i18n('searchOptionPlusLabel'), i18n('searchOptionPlusHint'), form.plus),
        formControl(i18n('searchOptionMinusLabel'), i18n('searchOptionMinusHint'), form.minus),
        formControl(i18n('searchOptionFromLabel'), i18n('searchOptionFromHint'), form.from),
        formControl(i18n('searchOptionAtLabel'), i18n('searchOptionAtHint'), form.at),
        formControl(i18n('searchOptionBeforeLabel'), null, form.before),
        formControl(i18n('searchOptionAfterLabel'), null, form.after),
        formControl(i18n('searchOptionOlderThanLabel'), null, form.olderValue, form.olderUnit),
        formControl(i18n('searchOptionNewerThanLabel'), null, form.newerValue, form.newerUnit),
        formControl(i18n('searchOptionTzLabel'), null, form.tz),
        formControl(i18n('searchOptionHasLabel'), null, form.has),
        formControl(i18n('searchOptionIsLabel'), null, form.is),
      ]),
      h('div', { class: `yqwh-dialog-footer` }, [h('div', { class: `yqwh-pull-right` }, [$dialogSearchButton])]),
    ]);
  }

  function run() {
    const $form = document.querySelector('form');
    if ($form == null) {
      return;
    }
    const $formContainer = $form.parentElement;
    if ($formContainer == null || $formContainer.querySelector('.yqwh-button') != null) {
      return;
    }
    const $button = $form.querySelector('button[role="button"]');
    const $input = $form.querySelector('input');
    if (!($button instanceof HTMLButtonElement) || $input == null) {
      return;
    }

    const form = createForm();

    const $searchButton = h('div', { class: `yqwh-button` }, i18n('advancedSearch'));
    const $dialogCloseButton = h('div', { class: `yqwh-icon-button` }, [i(closeIcon)]);
    const $dialogSearchButton = h('div', { class: `yqwh-button` }, i18n('search'));
    const $dialog = createDialog(form, $dialogCloseButton, $dialogSearchButton);
    const $dialogBackground = h('div', { class: `yqwh-dialog-background`, style: 'display: none' }, [
      h('div', { class: `yqwh-dialog-container` }, [$dialog]),
    ]);

    $formContainer.appendChild(h('div', { class: 'yqwh-button-container' }, [$searchButton]));
    document.querySelector('.gb_Jd.gb_3d.gb_Sd')?.appendChild(h('div', [$dialogBackground]));

    $formContainer.style.display = 'flex';
    $form.style.flexGrow = '1';

    $searchButton.addEventListener('click', () => {
      $dialogBackground.style.display = '';
    });
    $dialogBackground.addEventListener('click', (event) => {
      if (event.target instanceof Node && !$dialog.contains(event.target)) {
        $dialogBackground.style.display = 'none';
      }
    });
    $dialogCloseButton.addEventListener('click', () => {
      $dialogBackground.style.display = 'none';
    });
    $dialogSearchButton.addEventListener('click', () => {
      const conditions = [];
      if (isNotEmpty(form.normal.value)) {
        conditions.push(form.normal.value);
      }
      if (isNotEmpty(form.plus.value)) {
        conditions.push(
          form.plus.value
            .split(' ')
            .map((s) => '+' + s)
            .join(' ')
        );
      }
      if (isNotEmpty(form.minus.value)) {
        conditions.push(
          form.minus.value
            .split(' ')
            .map((s) => '-' + s)
            .join(' ')
        );
      }
      if (isNotEmpty(form.from.value)) {
        conditions.push(
          form.from.value
            .split(' ')
            .map((s) => 'from:' + s)
            .join(' ')
        );
      }
      if (isNotEmpty(form.at.value)) {
        conditions.push(
          form.at.value
            .split(' ')
            .map((s) => 'at:' + s)
            .join(' ')
        );
      }
      if (isNotEmpty(form.before.value)) {
        conditions.push('before:' + form.before.value);
      }
      if (isNotEmpty(form.after.value)) {
        conditions.push('after:' + form.after.value);
      }
      if (isNotEmpty(form.olderValue.value)) {
        conditions.push('older_than:' + form.olderValue.value + form.olderUnit.value);
      }
      if (isNotEmpty(form.newerValue.value)) {
        conditions.push('newer_than:' + form.newerValue.value + form.newerUnit.value);
      }
      if (isNotEmpty(form.tz.value)) {
        conditions.push('tz:' + form.tz.value);
      }
      if (isNotEmpty(form.has.value)) {
        conditions.push('has:' + form.has.value);
      }
      if (isNotEmpty(form.is.value)) {
        conditions.push('is:' + form.is.value);
      }
      if (conditions.length > 0) {
        $input.value = conditions.join(' ');
        $button.click();
      }
      $dialogBackground.style.display = 'none';
    });
  }

  (() => {
    run();
    const observer = new MutationObserver(() => run());
    observer.observe(document.body, { childList: true, subtree: true });
  })();
})();
