# Modern Portfolio & Blog Platform

Modern, profesyonel portföy ve blog platformu.  
Frontend: **React, Framer Motion, Tailwind CSS**  
Backend: **ASP.NET Core Web API, Entity Framework Core, SQLite**

---

## 🚀 Özellikler

### Frontend (React)
- **Modern Tasarım**: Dark mode, responsive ve animasyonlu arayüz
- **Blog & Makaleler**: Blog yazıları, detay sayfası, yorumlar
- **Yönetim Paneli**: Makale, profil, iletişim ve çalışma saatleri yönetimi
- **Çoklu Dil Desteği**: Türkçe & İngilizce
- **İletişim Formu**: Backend ile entegre çalışan iletişim formu
- **Yetenek & Proje Galerisi**: Filtrelenebilir, animasyonlu bölümler

### Backend (ASP.NET Core Web API)
- **Makale CRUD**: Blog/makale ekle, güncelle, sil, listele
- **Yorum Sistemi**: Makalelere yorum ekleme ve listeleme
- **Profil Yönetimi**: Profil bilgileri ve fotoğraf güncelleme
- **Çalışma Saatleri & İletişim**: Yönetilebilir API endpoint'leri
- **JWT ile Kimlik Doğrulama**: Admin işlemleri için güvenli giriş
- **Dosya Yükleme**: Makale ve profil fotoğrafı yükleme
- **Çeviri Servisi**: Basit metin çeviri API'si (Argos Translate)
- **Swagger/OpenAPI**: Otomatik API dokümantasyonu

---

## 🛠️ Kurulum

### 1. Backend (API)
```bash
cd BlogApi
dotnet restore
dotnet ef database update
dotnet run
```
- API varsayılan olarak `https://localhost:7001` adresinde çalışır.
- Swagger dokümantasyonu: `https://localhost:7001/swagger`

### 2. Frontend (React)
```bash
npm install
npm start
```
- Uygulama: `http://localhost:3000`

---

## 🏗️ Proje Yapısı

```
portfolio/
├── BlogApi/           # ASP.NET Core Web API (backend)
│   ├── Controllers/   # API controller'ları
│   ├── Models/        # Veri modelleri
│   ├── Migrations/    # EF Core migration dosyaları
│   └── wwwroot/       # Yüklenen dosyalar (görseller)
├── src/               # React frontend
│   ├── components/    # Ana React bileşenleri
│   ├── pages/admin/   # Admin paneli sayfaları
│   ├── api/           # API istekleri
│   └── context/       # Context API dosyaları
└── public/            # Statik dosyalar
```

---

## 🌐 API Endpoint'leri (Özet)

### Makaleler
- `GET    /api/makaleler`           : Tüm makaleleri getir
- `GET    /api/makaleler/{id}`      : Tek makale getir
- `POST   /api/makaleler`           : Makale ekle
- `PUT    /api/makaleler/{id}`      : Makale güncelle
- `DELETE /api/makaleler/{id}`      : Makale sil

### Yorumlar
- `POST   /api/yorumlar`            : Yorum ekle
- `GET    /api/yorumlar/makale/{id}`: Makalenin yorumlarını getir

### Profil
- `GET    /api/profile`             : Profil bilgisi getir
- `PUT    /api/profile`             : Profil güncelle (JWT gerekli)
- `POST   /api/profile/photo`       : Profil fotoğrafı yükle (JWT gerekli)
- `POST   /api/profile/login`       : Profil ile giriş (JWT döner)

### Auth
- `POST   /api/auth/login`          : Giriş (JWT döner)

### İletişim & Çalışma Saatleri
- `GET/PUT /api/contact`            : İletişim bilgisi getir/güncelle
- `GET/PUT /api/workinghours`       : Çalışma saatleri getir/güncelle

### Dosya Yükleme
- `POST   /api/upload`              : Makale görseli yükle

### Çeviri
- `POST   /api/translate`           : Metin çevirisi (tr→en)

---

## 🎨 Özelleştirme

- Renkler ve içerik: `src/index.css` ve ilgili bileşen dosyalarında
- Çoklu dil: `src/locales/` klasöründe
- Admin paneli: `/admin` route'u ile erişilebilir

---

## 📄 Lisans

MIT

---

## 📞 İletişim

Her türlü soru ve katkı için:  
- Email: info@example.com  
- GitHub: [GitHub Profilim](https://github.com/yourusername)

---

## 🙏 Teşekkürler

Bu projeyi geliştirirken kullanılan açık kaynak kütüphanelere teşekkürler:
- [React](https://reactjs.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/) 