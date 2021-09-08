(async () => {
  const { loadLocale, saveLocale } = window.y9JTVCMg;

  const $locale = /** @type {HTMLSelectElement} */ (document.getElementById('locale'));
  const $save = document.getElementById('save');
  const $saved = document.getElementById('saved');
  if ($locale == null || $save == null || $saved == null) {
    console.warn('Failed to get $locale, $save or $saved', $locale, $save, $saved);
    return;
  }

  $locale.value = await loadLocale();

  $locale.addEventListener('change', () => {
    $saved.textContent = '';
  });

  $save.addEventListener('click', async () => {
    const locale = $locale.value;
    if (locale !== 'en' && locale !== 'ja') {
      console.warn('Failed to get locale', locale);
    } else {
      await saveLocale(locale);
      $saved.textContent = 'Saved!';
    }
  });
})();
