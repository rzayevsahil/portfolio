// Bu script, HTML içindeki Türkçe metinleri otomatik olarak İngilizce'ye çevirir.
// Kullanım:
// 1. Bu dosyayı translateHtml.js olarak kaydedin.
// 2. Terminalde: npm install cheerio axios
// 3. Terminalde: node translateHtml.js
// 4. Kendi HTML'inizi çevirmek için turkishHtml değişkenini değiştirin.

const cheerio = require('cheerio');
const axios = require('axios');

async function translateText(text) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=tr|en`;
  const res = await axios.get(url);
  return res.data.responseData.translatedText;
}

async function translateHtmlContent(html) {
  const $ = cheerio.load(html);
  const textNodes = [];
  $('*').contents().each(function () {
    if (this.type === 'text' && this.data.trim()) {
      textNodes.push(this);
    }
  });

  for (const node of textNodes) {
    node.data = await translateText(node.data);
  }

  return $.html();
}

// Örnek kullanım:
// Aşağıdaki turkishHtml değişkenine kendi HTML içeriğini yazabilirsin.
(async () => {
  const turkishHtml = `<p><s><u>Selam</u></s></p><h1><strong><em>Naber</em></strong></h1>`;
  const englishHtml = await translateHtmlContent(turkishHtml);
  console.log('\nÇevrilmiş İngilizce HTML:');
  console.log(englishHtml);
})();

// Konsolda sonucu göreceksin. Kendi HTML'ini çevirmek için turkishHtml değişkenini değiştirmen yeterli. 