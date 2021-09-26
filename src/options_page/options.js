(async () => {
  const { loadSetting, saveSetting, loadRawObject, saveRawObject } = window.y9JTVCMg;

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

  document.getElementById('exportData')?.addEventListener('click', async () => {
    const data = await loadRawObject(null);
    console.log('exportData', data);
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const $a = document.createElement('a');
    $a.href = url;
    $a.download = 'data.json';
    $a.click();
  });

  document.getElementById('importData')?.addEventListener('click', async () => {
    const $file = /** @type {HTMLInputElement} */ (document.getElementById('importDataFile'));
    const file = $file?.files?.[0];
    if (file == null) {
      console.warn('Failed to get file');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result;
      console.log('importData', data);
      if (data == null || typeof data !== 'string') {
        console.warn('Failed to read file');
        return;
      }
      saveRawObject(JSON.parse(data));
    };
    reader.readAsText(file);
  });
})();
