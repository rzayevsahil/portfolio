// Ortak hata mesajı çeviri fonksiyonu
export function getTranslatedErrorMessage(error, t, i18n, translationKey) {
  const trMsg = t(translationKey, { lng: 'tr' });
  const enMsg = t(translationKey, { lng: 'en' });

  if (
    error === trMsg &&
    (i18n.language === 'en' || (window.i18n && window.i18n.language === 'en'))
  ) {
    return enMsg;
  }
  if (
    error === enMsg &&
    (i18n.language === 'tr' || (window.i18n && window.i18n.language === 'tr'))
  ) {
    return trMsg;
  }
  return error;
} 