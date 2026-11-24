/**
 * Web Tasarımının Temelleri - Kişisel Web Sitesi
 * Dinamik Veri Deposu (store.js)
 * Tüm sayfalar (TR & EN), projeler, bloglar, galeri, ders programı ve yetenekler için merkezi depolama
 */

const SiteTranslator = {
  dict: {
    // Akademik & Profil
    "web geliştirici & tasarımcı": "Web Developer & Designer",
    "web geliştirici": "Web Developer",
    "yazılım geliştirici": "Software Developer",
    "tasarımcı": "Designer",
    "bilgisayar programcılığı": "Computer Programming",
    "akdeniz üniversitesi": "Akdeniz University",
    "teknik bilimler myo": "Technical Sciences Voc. School",
    "web tasarımının temelleri": "Fundamentals of Web Design",
    "öğr. gör. dr. erokan canbazoğlu": "Lecturer Dr. Erokan Canbazoglu",
    "antalya, türkiye": "Antalya, Turkey",
    
    // Kategoriler
    "web tasarım": "Web Design",
    "grafik tasarım": "Graphic Design",
    "grafik animasyon i": "Graphic & Animation I",
    "animasyon": "Animation",
    "ui/ux tasarım": "UI/UX Design",
    "ön yüz geliştirme": "Frontend Development",
    "vize projesi": "Midterm Project",
    "html5 & seo": "HTML5 & SEO",
    "css3 & rwd": "CSS3 & RWD",
    "web performansı": "Web Performance",
    "it & teknoloji": "IT & Technology",
    "genel": "General",

    // Başlıklar & Bölümler
    "özgeçmiş & mesleki ilgi": "Curriculum Vitae & Professional Focus",
    "kodlama standartlarım & özel notasyonlar": "Coding Standards & Style Notations",
    "dönemlik ders programı & eğitim bilgileri": "Course Schedule & Academic Background",
    "ilgi alanları & öncelikli hefler": "Interests & Priorities",
    "teknik yetenekler (yüzdelik değerlendirme)": "Technical Skills (Percentage Assessment)",
    "sertifikalar ve başarılar": "Certificates & Achievements",
    "iş deneyimi & staj": "Work Experience & Internship",
    "seminerler & etkinlikler": "Seminars & Events",
    "yabancı diller": "Foreign Languages",
    "hobiler & aktiviteler": "Hobbies & Activities",

    // Butonlar ve Arayüz
    "detaylar": "Details",
    "devamını oku": "Read More",
    "sil": "Delete",
    "kapat": "Close",
    "kaydet": "Save",
    "gönder": "Send Message",
    "tüm projeleri incele": "View All Projects",
    "son yayınlanan makaleler": "Recent Articles",
    "galeriden seçmeler": "Featured Gallery",
    "önemli kural:": "Important Rule:",
    "özgeçmiş / hakkımda": "Resume / About Me",
    "projelerim": "Projects",
    "iletişim": "Contact",
    "tüm özgeçmişi ve ders programını gör →": "View Full Resume & Curriculum →",
    "tüm projeleri incele (6 adet) →": "Explore All Projects (6 Total) →",
    "tüm fotoğraf galerisini aç →": "Open Full Gallery →",
    "yeni bölüm / panel ekle": "Add New Panel / Section",
    "yeni proje ekle": "Add New Project",
    "yeni blog yazısı ekle": "Add New Article",
    "yeni fotoğraf ekle": "Add New Photo",
    "yeni yetenek ekle": "Add New Skill",
    "ders programına yeni satır ekle": "Add New Row to Schedule",

    // Günler
    "pazartesi": "Monday",
    "salı": "Tuesday",
    "çarşamba": "Wednesday",
    "perşembe": "Thursday",
    "cuma": "Friday",
    "cumartesi": "Saturday",
    "pazar": "Sunday"
  },

  translate(text, targetLang) {
    if (!text || typeof text !== "string") return text;
    const trimmed = text.trim();
    const lower = trimmed.toLowerCase();

    if (targetLang === "en") {
      if (this.dict[lower]) return this.dict[lower];
      for (const [tr, en] of Object.entries(this.dict)) {
        if (lower.includes(tr)) return trimmed.replace(new RegExp(tr, "gi"), en);
      }
    } else {
      for (const [tr, en] of Object.entries(this.dict)) {
        if (en.toLowerCase() === lower) return tr.charAt(0).toUpperCase() + tr.slice(1);
        if (lower.includes(en.toLowerCase())) return trimmed.replace(new RegExp(en, "gi"), tr.charAt(0).toUpperCase() + tr.slice(1));
      }
    }
    return trimmed;
  }
};

const SiteStore = {
  defaultData: {
    profile: {
      name: "Kevser Çetkin",
      role: "Web Geliştirici & Tasarımcı",
      university: "Akdeniz Üniversitesi",
      school: "Teknik Bilimler MYO",
      department: "Bilgisayar Programcılığı",
      course: "Web Tasarımının Temelleri",
      instructor: "Öğr. Gör. Dr. Erokan Canbazoğlu",
      email: "kevserctkn@gmail.com",
      phone: "+90 552 593 07 98",
      city: "Antalya, Türkiye",
      bioHeadline: "Dijital Dünyada Modern Çözümler ve Estetik Deneyimler Tasarlıyorum.",
      bioText: "Akdeniz Üniversitesi Teknik Bilimler MYO Bilgisayar Programcılığı öğrencisiyim. Modern web standartları, semantik HTML5, CSS3 kutu modelleme ve responsive tasarım üzerine odaklanıyorum. Teknolojiyi ve tasarımı birleştirerek akıcı, erişilebilir ve estetik dijital deneyimler geliştiriyorum.",
      quote: "Bu siteyi yaparken her yeni bölümde biraz daha öğreniyorum.",
      photo: "images/profile_photo.jpg"
    },
    customPanels: [
      {
        id: "panel-1",
        pageKey: "hakkimda",
        title: "Özgeçmiş & Mesleki İlgi",
        type: "text",
        width: "100%",
        content: "Ben Kevser Çetkin. Akdeniz Üniversitesi Teknik Bilimler MYO Bilgisayar Programcılığı öğrencisiyim. Modern web standartları, semantik HTML5, CSS3 kutu modelleme ve responsive tasarım üzerine odaklanıyorum."
      }
    ],
    codingStandardsCode: `/* Kutu Modelleme & CSS Specificity Örneği */
#wrapper {
  max-width: 1140px;
  margin: 0 auto;
  box-sizing: border-box; /* Padding ve border genişliği etkilemez */
}

@media screen and (max-width: 768px) {
  .two-column-layout {
    display: flex;
    flex-direction: column; /* Tablet ve mobil cihaz uyumu */
  }
}`,
    colors: {
      bgPage: "#ffffff",
      textBlack: "#0f172a",
      textMain: "#1e293b",
      wixLavender: "#c4b5fd",
      wixLime: "#d4e339",
      bgSectionAlt: "#f8fafc",
      primaryAccent: "#2563eb"
    },
    skills: [
      { id: 1, name: "HTML5 & Semantik İşaretleme", percent: 95 },
      { id: 2, name: "CSS3 (Kutu Modelleme, RWD, Grid)", percent: 90 },
      { id: 3, name: "JavaScript & DOM Etkileşimi", percent: 80 },
      { id: 4, name: "Adobe Photoshop & Vektörel Tasarım", percent: 75 },
      { id: 5, name: "SEO & Web Performans Optimizasyonu", percent: 85 }
    ],
    schedule: [
      { id: 1, day: "Pazartesi", name: "Web Tasarımının Temelleri", time: "13:30 - 16:20", room: "L23 Lab", teacher: "Öğr. Gör. Dr. Erokan Canbazoğlu" },
      { id: 2, day: "Salı", name: "Grafik ve Animasyon I", time: "09:30 - 12:20", room: "L22 Lab", teacher: "Öğr. Gör. Dr. Erokan Canbazoğlu" },
      { id: 3, day: "Çarşamba", name: "Veritabanı Yönetim Sistemleri", time: "10:30 - 13:20", room: "303 Sınıfı", teacher: "Bölüm Öğretim Elemanı" },
      { id: 4, day: "Perşembe", name: "İleri Programlama (Algoritma)", time: "14:00 - 17:00", room: "L23 Lab", teacher: "Bölüm Öğretim Elemanı" },
      { id: 5, day: "Cuma", name: "Ağ Temelleri & Sunucu Sistemleri", time: "09:00 - 12:00", room: "305 Sınıfı", teacher: "Bölüm Öğretim Elemanı" }
    ],
    projects: [
      {
        id: 1,
        title: "2D Vektörel Karakter Tasarımı",
        category: "Grafik Animasyon I",
        desc: "Grafik ve Animasyon I dersi kapsamında Adobe Photoshop ve Illustrator ile üretilen piksel ve vektör tabanlı illüstrasyon.",
        techs: ["Adobe Photoshop", "Illustrator", "Vektörel Çizim"],
        thumb: "images/project1.svg"
      },
      {
        id: 2,
        title: "Lokum & Yöresel Gıdalar Portalı",
        category: "Web Tasarım",
        desc: "Web Tasarımının Temelleri dersi kapsamında lokum ve yöresel ürünler satan bir işletme için hazırlanan çok sayfalı, ürün filtrelemeli ve SEO uyumlu web arayüzü tasarımı.",
        techs: ["HTML5 Semantik", "CSS3 Grid", "RWD"],
        thumb: "images/project2.svg"
      },
      {
        id: 3,
        title: "CSS3 & SVG İnteraktif Animasyonlar",
        category: "Animasyon",
        desc: "Saf CSS3 animasyon kuralları (@keyframes, transform, perspective) ve SVG vektörleri ile tarayıcıda akıcı 60 FPS mikro etkileşimler ve buton efektleri.",
        techs: ["CSS Keyframes", "SVG Animasyon", "Transform"],
        thumb: "images/project3.svg"
      },
      {
        id: 4,
        title: "Mobil Öğrenci Portalı Arayüzü",
        category: "UI/UX Tasarım",
        desc: "Üniversite öğrencileri için ders takibi, devamsızlık ve not hesaplama özelliklerine sahip mobil kullanıcı deneyimi (UX) araştırması ve arayüz prototipi.",
        techs: ["Figma", "UI/UX", "Prototipleme"],
        thumb: "images/project4.svg"
      },
      {
        id: 5,
        title: "Teknoloji & Bilim Haber Portalı",
        category: "Ön Yüz Geliştirme",
        desc: "CSS Flexbox ve CSS Grid hiyerarşisi kullanılarak tasarlanan, gazete/dergi düzenine sahip modern ve okunabilirliği yüksek responsive haber platformu.",
        techs: ["CSS Flexbox", "CSS Grid", "Typography"],
        thumb: "images/project1.svg"
      },
      {
        id: 6,
        title: "Kişisel Web Sitesi Mimarisi",
        category: "Vize Projesi",
        desc: "Web Tasarımının Temelleri dersi vize şartnamesine %100 uyumlu hazırlanan bu web sitesi. Semantik HTML5, temiz CSS3 değişkenleri ve çift dil desteği içermektedir.",
        techs: ["HTML5", "CSS3", "JavaScript", "RWD"],
        thumb: "images/project2.svg"
      }
    ],
    blogs: [
      {
        id: 1,
        title: "Web Tasarımında Semantik HTML5 ve SEO İlişkisi",
        category: "HTML5 & SEO",
        date: "15 Ekim 2024",
        excerpt: "HTML5 ile gelen &lt;header&gt;, &lt;nav&gt;, &lt;article&gt; ve &lt;footer&gt; gibi etiketler, sayfaları sadece div çorbasından kurtarmakla kalmaz; aynı zamanda Google arama botlarının sayfa hiyerarşisini doğru anlamlandırmasını (SERP başarısını) sağlar. Her sayfada yalnızca tek bir H1 bulunması, semantik yapının temel taşlarındandır.",
        note: "Önemli Kural: &lt;div id='header'&gt; yerine doğrudan &lt;header&gt; kullanmak erişilebilirliği ve sayfa hızını artırır.",
        thumb: "images/blog1.svg",
        fullContent: `
          <p style="font-size:1.05rem; line-height:1.85; margin-bottom:1.2rem;">
            Web sayfalarında anlamsal (semantik) işaretleme, hem kullanıcı erişilebilirliği (Screen Reader cihazları) hem de modern arama motoru optimizasyonu (SEO) için en kritik mimari unsurdur. Geleneksel web sitelerinde karşılaşılan 'div çorbası' (div soup), arama botlarının sayfa ana içeriğini yan başlıklardan veya gezinme menülerinden ayırt etmesini zorlaştırır.
          </p>
          <div style="background:#f8fafc; border-left:4px solid #2563eb; padding:16px 20px; border-radius:8px; margin:20px 0;">
            <strong style="color:#0f172a;">Semantik Hiyerarşi Kuralı:</strong> Her web sayfasında içeriği özetleyen yalnızca <strong>tek bir &lt;h1&gt;</strong> bulunmalı, alt başlıklar sırasıyla &lt;h2&gt; ve &lt;h3&gt; olarak kurgulanmalıdır.
          </div>
          <h3 style="font-size:1.3rem; margin:24px 0 12px; color:#0f172a;">Örnek Semantik Sayfa İskeleti:</h3>
          <pre style="background:#0f172a; color:#f8fafc; padding:16px; border-radius:8px; overflow-x:auto; font-size:0.9rem;"><code>&lt;header class="site-header"&gt;
  &lt;nav class="main-nav"&gt;...&lt;/nav&gt;
&lt;/header&gt;
&lt;main&gt;
  &lt;article&gt;
    &lt;h1&gt;Makale Başlığı (Tek H1)&lt;/h1&gt;
    &lt;section&gt;...&lt;/section&gt;
  &lt;/article&gt;
&lt;/main&gt;
&lt;footer class="site-footer"&gt;...&lt;/footer&gt;</code></pre>
          <p style="font-size:1.05rem; line-height:1.85; margin-top:1.2rem;">
            Bu mimari sayesinde Google botları &lt;main&gt; ve &lt;article&gt; içerisindeki metinleri birincil öncelikle tarayarak dizine ekler ve sitenizin SERP (Arama Motoru Sonuç Sayfası) sıralamasını doğrudan yükseltir.
          </p>
        `
      },
      {
        id: 2,
        title: "Responsive Web Tasarımda Breakpoint ve Kutu Modelleme",
        category: "CSS3 & RWD",
        date: "22 Ekim 2024",
        excerpt: "Kullanıcıların %60'ından fazlası internete cep telefonlarından bağlanmaktadır. Responsive Web Design (RWD), ekran genişliğine göre esneyen akışkan ızgaralar ve CSS3 Media Query kuralları ile mümkün olur. 768px (tablet) ve 480px (mobil) kırılma noktalarında elementlerin yüzde (%) cinsinden tanımlanması bozulmaları önler.",
        note: "Kutu Modelleme Formülü: Toplam Genişlik = Genişlik (width) + Padding + Border + Margin.",
        thumb: "images/blog2.svg",
        fullContent: `
          <p style="font-size:1.05rem; line-height:1.85; margin-bottom:1.2rem;">
            Mobil öncelikli (Mobile-First) tasarım anlayışı, web sayfalarının masaüstü ekranlardan önce mobil cihazlarda kusursuz görüntülenmesini hedefler. CSS3 kutu modelleme (Box Model) prensiplerini doğru kavramak, öğelerin taşmasını ve yatay kaydırma çubuklarının (horizontal scroll) oluşmasını engeller.
          </p>
          <div style="background:#f8fafc; border-left:4px solid #6366f1; padding:16px 20px; border-radius:8px; margin:20px 0;">
            <strong style="color:#0f172a;">Altın Kural:</strong> &lt;code&gt;box-sizing: border-box;&lt;/code&gt; tanımıyla padding ve border değerleri elemanın belirtilen toplam genişliğine dahil edilir.
          </div>
          <h3 style="font-size:1.3rem; margin:24px 0 12px; color:#0f172a;">Medya Sorguları (Media Queries) Standardı:</h3>
          <pre style="background:#0f172a; color:#f8fafc; padding:16px; border-radius:8px; overflow-x:auto; font-size:0.9rem;"><code>/* Tablet Kırılma Noktası (768px) */
@media screen and (max-width: 768px) {
  .container { width: 95%; }
  .grid-2 { flex-direction: column; }
}

/* Mobil Kırılma Noktası (480px) */
@media screen and (max-width: 480px) {
  body { font-size: 15px; }
  .nav-list { display: none; }
}</code></pre>
        `
      },
      {
        id: 3,
        title: "Google PageSpeed ve Lighthouse ile Web Optimizasyonu",
        category: "Web Performansı",
        date: "02 Kasım 2024",
        excerpt: "Yavaş yüklenen bir web sitesi hem ziyaretçileri hem de arama motoru sıralamasını kaybettirir. Görsellerin SVG veya modern WebP formatında optimize edilmesi, CSS ve JS dosyalarının küçültülmesi (minification) ve gereksiz HTTP isteklerinden kaçınılmasıyla PageSpeed skorunu 100/100 seviyesine çıkarmak mümkündür.",
        note: "Optimizasyon İpucu: Ağır JPEG resimler yerine vektörel SVG kullanımı hem dosya boyutunu düşürür hem de retina ekranlarda kristal netlik sağlar.",
        thumb: "images/blog3.svg",
        fullContent: `
          <p style="font-size:1.05rem; line-height:1.85; margin-bottom:1.2rem;">
            Sayfa yüklenme hızındaki her 1 saniyelik gecikme, kullanıcı dönüşümlerinde ortalama %7'lik kayba yol açar. Google Core Web Vitals ölçütleri (LCP, FID, CLS), modern bir web sitesinin sadece görsel değil; hız ve kararlılık yönünden de optimize edilmesini zorunlu kılar.
          </p>
          <div style="background:#f8fafc; border-left:4px solid #10b981; padding:16px 20px; border-radius:8px; margin:20px 0;">
            <strong style="color:#0f172a;">100/100 PageSpeed Tavsiyeleri:</strong> SVG vektörelleri tercih etmek, harici kütüphane bağımlılıklarını sıfırlamak ve saf Vanilla JS kullanmak sayfa ağırlığını 100 KB'ın altına düşürür.
          </div>
          <h3 style="font-size:1.3rem; margin:24px 0 12px; color:#0f172a;">Performans Kontrol Listesi:</h3>
          <ul style="padding-left:20px; line-height:1.85; font-size:1.02rem; color:#1e293b;">
            <li>CSS3 kurallarını tek bir stil dosyasında birleştirmek.</li>
            <li>HTTP istek sayısını minimize etmek.</li>
            <li>Gereksiz DOM derinliklerinden kaçınmak.</li>
          </ul>
        `
      }
    ],
    gallery: [
      { id: 1, title: "Bilgisayar Laboratuvarı", desc: "Teknik Bilimler MYO L23 laboratuvarında web tasarımı ve kodlama dersi esnasından bir kare.", img: "images/gallery1.svg" },
      { id: 2, title: "Çalışma İstasyonum", desc: "Geceleri projelerimi geliştirdiğim, çift ekranlı ve ergonomik kodlama çalışma masam.", img: "images/gallery2.svg" },
      { id: 3, title: "Antalya Teknoloji Zirvesi", desc: "Yapay zeka ve geleceğin web mimarileri konulu sektörel konferanstan bir hatıra.", img: "images/gallery3.svg" },
      { id: 4, title: "Doğa & Fotoğrafçılık", desc: "Kodlama molalarında zihnimi tazelemek için çıktığım Toros Dağları doğa yürüyüşü.", img: "images/gallery4.svg" },
      { id: 5, title: "Kütüphane Araştırma Saati", desc: "Üniversite kütüphanesinde algoritma ve veri yapıları kaynaklarını inceleme anı.", img: "images/gallery5.svg" },
      { id: 6, title: "Takım Çalışması & Beyin Fırtınası", desc: "Sınıf arkadaşlarımla dönem projeleri üzerine fikir alışverişi yaptığımız an.", img: "images/gallery6.svg" }
    ]
  },

  getData() {
    const saved = localStorage.getItem("site_custom_data_v3");
    if (!saved) return JSON.parse(JSON.stringify(this.defaultData));
    try {
      const parsed = JSON.parse(saved);
      const rawPanels = parsed.customPanels || this.defaultData.customPanels || [];
      const cleanPanels = rawPanels.filter(p => p && p.id !== "panel-2" && (!p.title || (!p.title.includes("Ders Dökümanı") && !p.title.includes("Teslim Paketi"))));
      return {
        profile: { ...this.defaultData.profile, ...(parsed.profile || {}) },
        codingStandardsCode: parsed.codingStandardsCode || this.defaultData.codingStandardsCode,
        customPanels: cleanPanels,
        colors: { ...this.defaultData.colors, ...(parsed.colors || {}) },
        skills: parsed.skills || this.defaultData.skills,
        schedule: parsed.schedule || this.defaultData.schedule,
        projects: parsed.projects || this.defaultData.projects,
        blogs: parsed.blogs || this.defaultData.blogs,
        gallery: parsed.gallery || this.defaultData.gallery
      };
    } catch (e) {
      return JSON.parse(JSON.stringify(this.defaultData));
    }
  },

  saveData(data) {
    try {
      localStorage.setItem("site_custom_data_v3", JSON.stringify(data));
      this.applyToPage();
    } catch (error) {
      alert("Kayıt yapılamadı: " + (error.name === "QuotaExceededError" ? "Tarayıcı depolama alanı dolu. Fotoğraflar çok büyük olabilir." : "Tarayıcı bu dosya için depolamaya izin vermiyor.") + "\nYedekleme > Yedeği İndir seçeneğini deneyin.");
      console.error("Site kaydı başarısız:", error);
    }
  },

  resetData() {
    localStorage.removeItem("site_custom_data_v3");
    this.applyToPage();
  },

  computeInitials(name) {
    if (!name) return "KÇ";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "KÇ";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  },

  applyToPage() {
    const data = this.getData();
    const isEn = document.documentElement.lang === "en" || 
                 location.pathname.includes("-en") || 
                 location.pathname.includes("about") || 
                 location.pathname.includes("projects") || 
                 location.pathname.includes("gallery") || 
                 location.pathname.includes("contact");

    // 1. Renkleri CSS Değişkenlerine Yaz
    if (data.colors) {
      const root = document.documentElement;
      if (data.colors.bgPage) root.style.setProperty("--bg-page", data.colors.bgPage);
      if (data.colors.textBlack) root.style.setProperty("--text-black", data.colors.textBlack);
      if (data.colors.textMain) root.style.setProperty("--text-main", data.colors.textMain);
      if (data.colors.wixLavender) root.style.setProperty("--wix-lavender", data.colors.wixLavender);
      if (data.colors.wixLime) root.style.setProperty("--wix-lime", data.colors.wixLime);
      if (data.colors.bgSectionAlt) root.style.setProperty("--bg-section-alt", data.colors.bgSectionAlt);
      if (data.colors.primaryAccent) root.style.setProperty("--primary-accent", data.colors.primaryAccent);
    }

    // 2. Profil ve İsim Alanlarını Güncelle
    if (data.profile) {
      // 2a. Baş Harfleri (İsim Baş Harfleri Otomatik - Örn: Kevser Çetkin -> KÇ)
      const initials = this.computeInitials(data.profile.name);
      document.querySelectorAll(".logo-badge").forEach(el => {
        el.textContent = initials;
      });

      // 2b. Tüm İsim ve Rol Alanları
      document.querySelectorAll(".logo-name, .wix-card-name, .profile-name, .hero-name, [data-field='name']").forEach(el => {
        el.textContent = data.profile.name;
      });
      document.querySelectorAll(".logo-role-tag").forEach(el => {
        el.textContent = `[ ${isEn ? SiteTranslator.translate(data.profile.role, 'en') : data.profile.role} ]`;
      });
      document.querySelectorAll(".wix-card-role, .profile-role, .hero-role, [data-field='role']").forEach(el => {
        el.textContent = isEn ? SiteTranslator.translate(data.profile.role, 'en') : data.profile.role;
      });
      document.querySelectorAll(".footer-title:first-child").forEach(el => {
        el.textContent = data.profile.name;
      });
      document.querySelectorAll(".footer-bottom p").forEach(el => {
        if (isEn) {
          el.innerHTML = `&copy; 2024 ${data.profile.name}. All Rights Reserved. | Fundamentals of Web Design`;
        } else {
          el.innerHTML = `&copy; 2024 ${data.profile.name}. Tüm Hakları Saklıdır. | Web Tasarımının Temelleri`;
        }
      });

      if (data.profile.photo) {
        document.querySelectorAll(".wix-photo-img, .profile-photo, .hero-avatar").forEach(el => {
          el.src = data.profile.photo;
        });
      }
      if (data.profile.bioHeadline) {
        document.querySelectorAll(".wix-headline").forEach(el => {
          el.textContent = isEn ? SiteTranslator.translate(data.profile.bioHeadline, 'en') : data.profile.bioHeadline;
        });
      }
      if (data.profile.bioText) {
        document.querySelectorAll(".wix-description").forEach(el => {
          el.textContent = isEn ? SiteTranslator.translate(data.profile.bioText, 'en') : data.profile.bioText;
        });
      }
      const quoteEl = document.querySelector(".quote-box");
      if (quoteEl && data.profile.quote) {
        quoteEl.innerHTML = `"${isEn ? SiteTranslator.translate(data.profile.quote, 'en') : data.profile.quote}" <cite>— ${data.profile.name}</cite>`;
      }

      // data-field bazlı tüm meta alanlarını doldur (Öğrenci No, Üniversite, vb.)
      for (const [key, val] of Object.entries(data.profile)) {
        document.querySelectorAll(`[data-field="${key}"]`).forEach(el => {
          el.textContent = isEn ? SiteTranslator.translate(val, 'en') : val;
        });
      }
    }

    // 3. Yetenekleri Sayfada Güncelle
    if (data.skills && document.querySelector(".skills-grid")) {
      const skillsContainer = document.querySelector(".skills-grid");
      if (skillsContainer) {
        skillsContainer.innerHTML = "";
        data.skills.forEach((s, idx) => {
          const item = document.createElement("div");
          item.className = "skill-item";
          item.innerHTML = `
            <div class="skill-info">
              <span class="skill-title-text" data-field="skill-name" data-index="${idx}">${isEn ? SiteTranslator.translate(s.name, 'en') : s.name}</span>
              <span class="skill-percentage" data-field="skill-percent" data-index="${idx}">%${s.percent}</span>
            </div>
            <div class="skill-bar-bg">
              <div class="skill-bar-fill" style="width: ${s.percent}%;"></div>
            </div>
          `;
          skillsContainer.appendChild(item);
        });
      }
    }

    // 4. Ders Programı Tablosunu Güncelle (Silme Butonu Desteği ile)
    const tbody = document.querySelector(".custom-table tbody");
    if (tbody && data.schedule && data.schedule.length > 0) {
      tbody.innerHTML = "";
      data.schedule.forEach((row, rIdx) => {
        const tr = document.createElement("tr");
        tr.setAttribute("data-row-index", rIdx);
        tr.innerHTML = `
          <td><strong>${isEn ? SiteTranslator.translate(row.day, 'en') : row.day}</strong></td>
          <td data-editable="true">${isEn ? SiteTranslator.translate(row.name, 'en') : row.name}</td>
          <td data-editable="true">${row.time}</td>
          <td><span class="table-tag" data-editable="true">${row.room}</span></td>
          <td>
            <span data-editable="true">${isEn ? SiteTranslator.translate(row.teacher, 'en') : row.teacher}</span>
            <button type="button" class="row-delete-btn" onclick="deleteScheduleRow(this)" title="${isEn ? 'Delete Row' : 'Satırı Sil'}">🗑️ ${isEn ? 'Delete' : 'Sil'}</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    // 5. Kodlama Standartları Kod Bloğunu Güncelle
    if (data.codingStandardsCode) {
      const codeBlock = document.querySelector(".pre-code-block code");
      if (codeBlock) {
        codeBlock.textContent = data.codingStandardsCode;
      }
    }

    // 6. Evrensel Panelleri (Tüm Sayfalarda Yeni Paneller, Medya & Ekler) Render Et
    const pageFileName = location.pathname.split("/").pop().replace("-en.html", "").replace(".html", "") || "index";
    let universalContainer = document.querySelector(".universal-panels-container");
    if (!universalContainer) {
      const targetParent = document.querySelector(".about-content-box") || document.querySelector("main .container") || document.querySelector("main");
      if (targetParent) {
        universalContainer = document.createElement("div");
        universalContainer.className = "universal-panels-container";
        targetParent.appendChild(universalContainer);
      }
    }

    if (universalContainer && data.customPanels) {
      universalContainer.innerHTML = "";
      const currentPanels = data.customPanels.filter(p => !p.pageKey || p.pageKey === "all" || p.pageKey === pageFileName || (pageFileName === "hakkimda" && p.pageKey === "about") || (pageFileName === "about" && p.pageKey === "hakkimda"));
      currentPanels.forEach((panel, pIdx) => {
        const article = document.createElement("article");
        article.className = "custom-panel-item";
        article.setAttribute("data-id", panel.id || pIdx);
        article.setAttribute("data-width", panel.width || "100%");
        article.style.width = (panel.width === "50%" ? "48%" : (panel.width === "75%" ? "73%" : (panel.width === "33%" ? "31%" : "100%")));
        article.style.flexBasis = article.style.width;

        const titleText = isEn ? SiteTranslator.translate(panel.title, "en") : panel.title;
        const contentText = isEn ? SiteTranslator.translate(panel.content, "en") : panel.content;

        let innerMediaHtml = "";
        if (panel.type === "video") {
          innerMediaHtml = `
            <div class="media-video-box">
              <video controls src="${panel.mediaUrl || 'images/project1.svg'}">
                Tarayıcınız video oynatmayı desteklemiyor.
              </video>
            </div>
          `;
        } else if (panel.type === "audio") {
          innerMediaHtml = `
            <div class="media-audio-box">
              <span style="font-weight:700; color:#0f172a;">🎵 ${titleText}</span>
              <audio controls src="${panel.mediaUrl || ''}">
                Tarayıcınız ses oynatmayı desteklemiyor.
              </audio>
            </div>
          `;
        } else if (panel.type === "file") {
          innerMediaHtml = `
            <div class="attachment-download-box">
              <div class="attachment-info">
                <span class="attachment-icon">📁</span>
                <div class="attachment-meta">
                  <h4>${panel.fileName || titleText}</h4>
                  <span>${panel.fileSize || '105 KB'} • ${isEn ? 'Verified Project Attachment (<300MB)' : 'Onaylı Proje Eki (<300MB)'}</span>
                </div>
              </div>
              <a href="${panel.fileUrl || 'project-files.zip'}" download class="attachment-btn">
                📥 ${isEn ? 'Download File' : 'Dosyayı İndir'}
              </a>
            </div>
          `;
        }

        article.innerHTML = `
          <div class="panel-controls-header">
            <div class="panel-order-btns">
              <span class="panel-drag-handle" draggable="true" title="${isEn ? 'Drag to Reorder' : 'Sıralamak İçin Sürükleyin'}">⠿</span>
              <button type="button" class="panel-ctrl-btn" onclick="movePanelUp(this)" title="${isEn ? 'Move Up' : 'Yukarı Taşı'}">⬆️</button>
              <button type="button" class="panel-ctrl-btn" onclick="movePanelDown(this)" title="${isEn ? 'Move Down' : 'Aşağı Taşı'}">⬇️</button>
            </div>
            <div class="panel-size-btns">
              <span style="font-size:11px; margin-right:2px;">${isEn ? 'Size:' : 'Boyut:'}</span>
              <button type="button" class="panel-ctrl-btn ${panel.width === '100%' || !panel.width ? 'active':''}" onclick="setPanelWidth(this, '100%')">100%</button>
              <button type="button" class="panel-ctrl-btn ${panel.width === '75%' ? 'active':''}" onclick="setPanelWidth(this, '75%')">75%</button>
              <button type="button" class="panel-ctrl-btn ${panel.width === '50%' ? 'active':''}" onclick="setPanelWidth(this, '50%')">50%</button>
              <button type="button" class="panel-ctrl-btn ${panel.width === '33%' ? 'active':''}" onclick="setPanelWidth(this, '33%')">33%</button>
            </div>
            <button type="button" class="card-delete-btn" style="position:static;" onclick="deleteCustomPanelLive(this)">🗑️ ${isEn ? 'Delete' : 'Sil'}</button>
          </div>
          <h2 class="block-title" data-editable="true">${titleText}</h2>
          ${innerMediaHtml}
          ${panel.content ? `<div class="panel-text-body" style="line-height: 1.85;" data-editable="true">${contentText}</div>` : ''}
        `;
        universalContainer.appendChild(article);
      });
    }
  }
};

// Global Panel Taşıma, Boyutlandırma ve Ders Satırı Silme Fonksiyonları
function movePanelUp(btn) {
  const panel = btn.closest(".custom-panel-item");
  if (panel && panel.previousElementSibling && panel.previousElementSibling.classList.contains("custom-panel-item")) {
    panel.parentNode.insertBefore(panel, panel.previousElementSibling);
    if (typeof showToast === "function") showToast("⬆️ Panel yukarı taşındı!");
  }
}

function movePanelDown(btn) {
  const panel = btn.closest(".custom-panel-item");
  if (panel && panel.nextElementSibling && panel.nextElementSibling.classList.contains("custom-panel-item")) {
    panel.parentNode.insertBefore(panel.nextElementSibling, panel);
    if (typeof showToast === "function") showToast("⬇️ Panel aşağı taşındı!");
  }
}

function setPanelWidth(btn, widthStr) {
  const panel = btn.closest(".custom-panel-item");
  if (panel) {
    panel.setAttribute("data-width", widthStr);
    panel.style.width = (widthStr === "100%" ? "100%" : (widthStr === "50%" ? "48%" : (widthStr === "75%" ? "73%" : "31%")));
    panel.style.flexBasis = panel.style.width;
    btn.parentNode.querySelectorAll(".panel-ctrl-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    if (typeof showToast === "function") showToast(`📐 Panel genişliği ${widthStr} olarak ayarlandı!`);
  }
}

function deleteScheduleRow(btn) {
  const isEn = document.documentElement.lang === "en" || location.pathname.includes("-en");
  if (confirm(isEn ? "Are you sure you want to delete this course row?" : "Bu ders satırını silmek istediğinize emin misiniz?")) {
    const tr = btn.closest("tr");
    if (tr) {
      tr.remove();
      if (typeof showToast === "function") showToast(isEn ? "🗑️ Course row deleted." : "🗑️ Ders satırı silindi.");
    }
  }
}

window.movePanelUp = movePanelUp;
window.movePanelDown = movePanelDown;
window.setPanelWidth = setPanelWidth;
window.deleteScheduleRow = deleteScheduleRow;

document.addEventListener("DOMContentLoaded", () => {
  SiteStore.applyToPage();
});
