(async () => {
  const { loadSetting, saveSetting } = window.y9JTVCMg;

  /** @type {Array<keyof Setting>} */
  const keys = [
    'locale',
    'isAdvancedSearchEnabled',
    'isMessageTimestampTooltipEnabled',
    'isMessageLinkCopyButtonEnabled',
    'isMessagePinEnabled',
    'isRecentlyUsedReactionEnabled',
  ];

  /**
   * @type {{ [key: string]: HTMLInputElement & HTMLSelectElement }}
   */
  const fields = {};
  for (const key of keys) {
    const $element = /** @type {HTMLInputElement &  HTMLSelectElement} */ (document.getElementById(key));
    if ($element == null) {
      console.warn('Failed to get $element', key, $element);
      return;
    }
    fields[key] = $element;
  }
  const $save = document.getElementById('save');
  const $saved = document.getElementById('saved');
  if ($save == null || $saved == null) {
    console.warn('Failed to get  $save or $saved', $save, $saved);
    return;
  }

  const setting = await loadSetting();
  for (const key of keys) {
    const $element = fields[key];
    if ($element != null) {
      const value = setting[key];
      if (typeof value === 'boolean') {
        $element.checked = value;
      } else {
        $element.value = value;
      }
      $element.addEventListener('change', () => {
        $saved.textContent = '';
      });
    }
  }

  $save.addEventListener('click', async () => {
    /** @type {Partial<Setting>} */
    const setting = {};
    for (const key of keys) {
      const $element = fields[key];
      if ($element != null) {
        if (key === 'locale') {
          const locale = $element.value;
          if (locale !== 'en' && locale !== 'ja') {
            console.warn('Failed to get locale', locale);
          } else {
            setting.locale = locale;
          }
        } else {
          setting[key] = $element.checked;
        }
      }
    }
    await saveSetting(setting);
    $saved.textContent = 'Saved!';
  });
})();
