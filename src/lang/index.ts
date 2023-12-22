
import { createI18n } from 'vue-i18n'

const requireLang = require.context(
  '@/assets/lang',
  true,
  /\.json$/
);

const messages = {};

for (const file of requireLang.keys()) {
  const path = file.replace(/(\.\/|\.json$)/g, '').split('/');

  path.reduce((o: any, s, i) => {
    if (o[s]) return o[s];
    o[s] = (i + 1 === path.length) ? requireLang(file) : {};
    return o[s];
  }, messages);
}

const i18n = createI18n({
  legacy: false,
  locale: 'en', // 기본 locale
  fallbackLocale: 'en', // locale 설정 실패시 사용할 locale
  messages, // 다국어 메시지
  silentTranslationWarn: true // 메시지 코드가 없을때 나오는 console 경고 off
});

export default i18n;