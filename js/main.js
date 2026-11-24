/**
 * Web Tasarımının Temelleri - Kişisel Web Sitesi
 * JavaScript Etkileşim Dosyası (main.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobil Menü Açma/Kapatma
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (menuToggle && mainNav) {
    const isEn = document.documentElement.lang.toLowerCase().startsWith('en');
    const closeMenu = () => {
      mainNav.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', isEn ? 'Open menu' : 'Menüyü Aç');
    };
    menuToggle.addEventListener('click', (event) => {
      event.preventDefault();
      const open = mainNav.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? (isEn ? 'Close menu' : 'Menüyü Kapat') : (isEn ? 'Open menu' : 'Menüyü Aç'));
    });
    mainNav.addEventListener('click', event => {
      if (event.target.closest('a[href]')) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && mainNav.classList.contains('active')) {
        closeMenu(); menuToggle.focus();
      }
    });
    document.addEventListener('click', event => {
      if (mainNav.classList.contains('active') && !mainNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 920 && mainNav.classList.contains('active')) closeMenu();
    }, {passive:true});
  }

  // 2. Yetenek İlerleme Çubukları Animasyonu (Varsa)
  const skillFills = document.querySelectorAll('.skill-bar-fill');
  if (skillFills.length > 0) {
    skillFills.forEach(fill => {
      const targetWidth = fill.style.width;
      fill.style.width = '0%';
      setTimeout(() => {
        fill.style.width = targetWidth;
      }, 200);
    });
  }

  // İletişim formu portable-contact.js tarafından yönetilir.

});

// 4. Blog Detay Modalı (Devamını Oku Tıklandığında Tam Açılma)
function openBlogDetailModal(index) {
  const data = (typeof SiteStore !== "undefined") ? SiteStore.getData() : null;
  const blogs = (data && data.blogs) ? data.blogs : [];
  const blog = blogs[index] || {
    title: "Blog Detay",
    category: "Bilişim",
    date: "2024",
    thumb: "images/blog1.svg",
    excerpt: "Detaylar...",
    fullContent: "<p>Blog detay içeriği...</p>"
  };

  const isEn = document.documentElement.lang === "en" || location.pathname.includes("-en");

  let modal = document.getElementById("blog-detail-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "blog-detail-modal";
    document.body.appendChild(modal);
  }

  const categoryText = (typeof SiteTranslator !== "undefined" && isEn) ? SiteTranslator.translate(blog.category, "en") : blog.category;
  const titleText = (typeof SiteTranslator !== "undefined" && isEn) ? SiteTranslator.translate(blog.title, "en") : blog.title;
  const closeText = isEn ? "Close" : "Kapat";
  const authorName = (data && data.profile && data.profile.name) ? data.profile.name : "Kevser Çetkin";

  modal.innerHTML = `
    <div class="blog-modal-overlay" onclick="closeBlogDetailModal()"></div>
    <article class="blog-modal-content">
      <div class="blog-modal-header">
        <span class="blog-modal-badge">${categoryText}</span>
        <button type="button" class="blog-modal-close" onclick="closeBlogDetailModal()" aria-label="${closeText}">&times;</button>
      </div>
      <h2 class="blog-modal-title">${titleText}</h2>
      <div class="blog-modal-meta">
        <span>📅 ${blog.date}</span>
        <span>•</span>
        <span>👤 ${authorName}</span>
      </div>
      <div class="blog-modal-img-box">
        <img src="${blog.thumb}" alt="${titleText}" class="blog-modal-img">
      </div>
      <div class="blog-modal-body">
        ${blog.fullContent || `<p>${blog.excerpt}</p>`}
      </div>
      <div class="blog-modal-footer">
        <button type="button" class="btn-wix-lime" onclick="closeBlogDetailModal()" style="padding: 10px 26px; border-radius: 50px; font-weight: 700; cursor: pointer; border: none;">
          ✖ ${closeText}
        </button>
      </div>
    </article>
  `;

  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeBlogDetailModal() {
  const modal = document.getElementById("blog-detail-modal");
  if (modal) {
    modal.style.display = "none";
  }
  document.body.style.overflow = "";
}

window.openBlogDetailModal = openBlogDetailModal;
window.closeBlogDetailModal = closeBlogDetailModal;

// 5. Proje Detay Modalı (Detaylar Tıklandığında Tam Açılma)
function openProjectDetailModal(index) {
  const data = (typeof SiteStore !== "undefined") ? SiteStore.getData() : null;
  const projects = (data && data.projects) ? data.projects : [];
  const proj = projects[index] || {
    title: "Proje Başlığı",
    category: "Web Geliştirme",
    desc: "Proje açıklaması",
    techs: ["HTML5", "CSS3"],
    thumb: "images/project1.svg"
  };

  const isEn = document.documentElement.lang === "en" || location.pathname.includes("-en");

  let modal = document.getElementById("project-detail-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "project-detail-modal";
    document.body.appendChild(modal);
  }

  const categoryText = (typeof SiteTranslator !== "undefined" && isEn) ? SiteTranslator.translate(proj.category, "en") : proj.category;
  const titleText = (typeof SiteTranslator !== "undefined" && isEn) ? SiteTranslator.translate(proj.title, "en") : proj.title;
  const descText = (typeof SiteTranslator !== "undefined" && isEn) ? SiteTranslator.translate(proj.desc, "en") : proj.desc;
  const closeText = isEn ? "Close" : "Kapat";

  modal.innerHTML = `
    <div class="project-modal-overlay" onclick="closeProjectDetailModal()"></div>
    <article class="project-modal-content">
      <div class="project-modal-header">
        <span class="project-modal-badge">${categoryText}</span>
        <button type="button" class="project-modal-close" onclick="closeProjectDetailModal()" aria-label="${closeText}">&times;</button>
      </div>
      <h2 class="project-modal-title">${titleText}</h2>
      <div class="project-modal-img-box">
        <img src="${proj.thumb}" alt="${titleText}" class="project-modal-img">
      </div>
      <div class="project-modal-body">
        <h4 style="margin: 0 0 10px; color: #0f172a; font-size: 1.15rem;">${isEn ? 'Project Overview & Technical Scope' : 'Proje Özeti & Teknik Kapsam'}</h4>
        <p style="line-height: 1.85; margin-bottom: 1.2rem;">${descText}</p>
        
        <div style="background:#f8fafc; border-left:4px solid #2563eb; padding:14px 18px; border-radius:8px; margin:16px 0;">
          <strong style="color:#0f172a;">${isEn ? 'Academic Curriculum Reference:' : 'Akademik Kriter Referansı:'}</strong>
          ${isEn ? 'Prepared in full compliance with course evaluation criteria (Graphic & Animation I / Fundamentals of Web Design). Built using semantic HTML5, CSS3 box modeling, and fluid responsive design.' : 'Grafik Animasyon I ve Web Tasarımının Temelleri dersi değerlendirme kriterlerine tam uyumlu olarak üretilmiştir. Semantik HTML5, CSS3 kutu modelleme ve responsive tasarım kuralları gözetilmiştir.'}
        </div>

        <h4 style="margin: 18px 0 10px; color: #0f172a; font-size: 1.15rem;">${isEn ? 'Technologies & Tools Used' : 'Kullanılan Teknolojiler & Araçlar'}</h4>
        <div class="project-modal-techs">
          ${(proj.techs || ["HTML5", "CSS3"]).map(t => `<span class="tech-tag" style="background:#0f172a; color:#fff; padding:6px 14px; border-radius:6px; font-size:0.85rem; font-weight:700;">${t}</span>`).join(" ")}
        </div>
      </div>
      <div class="project-modal-footer">
        <span style="font-size:0.88rem; color:#64748b; font-weight:600;">
          ${isEn ? 'Status: Evaluated & Active' : 'Durum: Değerlendirildi & Aktif'}
        </span>
        <button type="button" class="btn-wix-lime" onclick="closeProjectDetailModal()" style="padding: 10px 26px; border-radius: 50px; font-weight: 700; cursor: pointer; border: none;">
          ✖ ${closeText}
        </button>
      </div>
    </article>
  `;

  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeProjectDetailModal() {
  const modal = document.getElementById("project-detail-modal");
  if (modal) modal.style.display = "none";
  document.body.style.overflow = "";
}

window.openProjectDetailModal = openProjectDetailModal;
window.closeProjectDetailModal = closeProjectDetailModal;

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeBlogDetailModal();
    closeProjectDetailModal();
  }
});



/* Görünürlük animasyonları: admin düzenleme alanlarını etkilemez. */
document.addEventListener('DOMContentLoaded', () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('.section-header, .page-header-section .container, .project-card, .blog-card, .gallery-card, .contact-info-card, .contact-form-card, .wix-intro-content');
  if (reduced || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px 40px 0px' });
  items.forEach((el, i) => {
    el.classList.add('reveal-on-scroll');
    if (el.matches('.project-card,.blog-card,.gallery-card')) el.style.transitionDelay = `${(i % 3) * 85}ms`;
    observer.observe(el);
  });
});
