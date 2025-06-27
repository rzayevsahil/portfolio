# Modern Portfolio Website

Modern ve profesyonel bir portföy websitesi. React, Framer Motion ve Tailwind CSS kullanılarak geliştirilmiştir.

## 🚀 Özellikler

- **Modern Tasarım**: Dark mode ile modern ve şık tasarım
- **Responsive**: Tüm cihazlarda mükemmel görünüm
- **Animasyonlar**: Framer Motion ile akıcı animasyonlar
- **Performans**: Optimize edilmiş performans
- **SEO Dostu**: Arama motorları için optimize edilmiş
- **İletişim Formu**: Çalışan iletişim formu
- **Proje Galerisi**: Filtrelenebilir proje galerisi
- **Yetenek Gösterimi**: İnteraktif yetenek barları

## 🛠️ Teknolojiler

- **React 18** - Modern React hooks ve functional components
- **Framer Motion** - Akıcı animasyonlar
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - İkon kütüphanesi
- **PostCSS** - CSS işlemcisi

## 📦 Kurulum

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd portfolio
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm start
```

4. Tarayıcınızda `http://localhost:3000` adresini açın.

## 🏗️ Proje Yapısı

```
src/
├── components/          # React bileşenleri
│   ├── Header.js       # Navigasyon menüsü
│   ├── Hero.js         # Ana sayfa hero bölümü
│   ├── About.js        # Hakkımda bölümü
│   ├── Skills.js       # Yetenekler bölümü
│   ├── Projects.js     # Projeler bölümü
│   ├── Contact.js      # İletişim bölümü
│   └── Footer.js       # Alt bilgi
├── App.js              # Ana uygulama bileşeni
├── index.js            # Uygulama giriş noktası
└── index.css           # Global stiller
```

## 🎨 Özelleştirme

### Renkler
Ana renkleri `src/index.css` dosyasında değiştirebilirsiniz:
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
}
```

### İçerik
Her bileşenin içeriğini kendi bilgilerinizle güncelleyin:
- `Hero.js` - Ana sayfa metinleri
- `About.js` - Kişisel bilgiler ve deneyim
- `Skills.js` - Yetenekler ve seviyeler
- `Projects.js` - Proje bilgileri
- `Contact.js` - İletişim bilgileri

### Görseller
Proje görsellerini `Projects.js` dosyasında güncelleyin:
```javascript
{
  image: 'your-image-url.jpg',
  // ...
}
```

## 📱 Responsive Tasarım

Website tüm cihazlarda mükemmel görünür:
- **Desktop**: 1200px ve üzeri
- **Tablet**: 768px - 1199px
- **Mobile**: 767px ve altı

## 🚀 Deployment

### Netlify
1. Netlify hesabınızda yeni site oluşturun
2. GitHub repository'nizi bağlayın
3. Build komutunu `npm run build` olarak ayarlayın
4. Publish directory'yi `build` olarak ayarlayın

### Vercel
1. Vercel hesabınızda yeni proje oluşturun
2. GitHub repository'nizi bağlayın
3. Otomatik olarak deploy edilecektir

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Herhangi bir sorunuz varsa:
- Email: info@example.com
- GitHub: [GitHub Profilim](https://github.com/yourusername)

## 🙏 Teşekkürler

Bu projeyi geliştirirken kullanılan açık kaynak kütüphanelere teşekkürler:
- [React](https://reactjs.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/) 