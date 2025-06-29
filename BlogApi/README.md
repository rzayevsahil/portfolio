# Blog API

Bu proje, blog ve makaleler için ASP.NET Core Web API'dir.

## Özellikler

- Makaleler için CRUD işlemleri (Oluştur, Oku, Güncelle, Sil)
- Yorum ekleme ve listeleme
- Entity Framework Core ile SQLite veritabanı
- Swagger/OpenAPI dokümantasyonu
- CORS desteği (React uygulaması için)

## Kurulum

1. **Projeyi klonlayın:**
```bash
git clone <repository-url>
cd BlogApi
```

2. **Bağımlılıkları yükleyin:**
```bash
dotnet restore
```

3. **Veritabanını oluşturun:**
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

4. **Projeyi çalıştırın:**
```bash
dotnet run
```

## API Endpoint'leri

### Makaleler
- `GET /api/makaleler` - Tüm makaleleri listele
- `GET /api/makaleler/{id}` - Belirli bir makaleyi getir
- `POST /api/makaleler` - Yeni makale ekle
- `PUT /api/makaleler/{id}` - Makale güncelle
- `DELETE /api/makaleler/{id}` - Makale sil

### Yorumlar
- `POST /api/yorumlar` - Yeni yorum ekle
- `GET /api/yorumlar/makale/{makaleId}` - Belirli makalenin yorumlarını getir

## Swagger Dokümantasyonu

Proje çalıştığında, Swagger UI'a şu adresten erişebilirsiniz:
```
https://localhost:7001/swagger
```

## Veritabanı

Proje SQLite veritabanı kullanır. Veritabanı dosyası `blog.db` olarak proje klasöründe oluşturulur.

## Frontend Entegrasyonu

Bu API, React uygulaması ile entegre edilmek üzere tasarlanmıştır. CORS ayarları `http://localhost:3000` adresinden gelen isteklere izin verecek şekilde yapılandırılmıştır. 