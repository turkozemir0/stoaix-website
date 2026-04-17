/* ═══════════════════════════════════════════════════════════
   STOAIX — i18n.js  (EN ↔ TR language toggle)
   ═══════════════════════════════════════════════════════════ */
'use strict';

/* ─── Tags whose subtrees we never translate ─────────────── */
const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'CODE', 'PRE',
  'SVG', 'PATH', 'CIRCLE', 'LINE', 'RECT', 'POLYLINE',
  'POLYGON', 'ELLIPSE', 'G', 'DEFS', 'USE', 'CLIPPATH', 'CANVAS'
]);

/* ─── Helpers ────────────────────────────────────────────── */
function norm(s) { return s.replace(/\s+/g, ' ').trim(); }

function translateTree(root, dict) {
  if (!root) return;
  if (root.nodeType === Node.TEXT_NODE) {
    const n = norm(root.nodeValue);
    if (n && Object.prototype.hasOwnProperty.call(dict, n)) {
      root.nodeValue = root.nodeValue.replace(n, dict[n]);
    }
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  if (SKIP_TAGS.has(root.tagName)) return;
  /* translate placeholder / aria-label / title attrs */
  ['placeholder', 'title', 'aria-label'].forEach(attr => {
    if (root.hasAttribute(attr)) {
      const v = norm(root.getAttribute(attr));
      if (dict[v]) root.setAttribute(attr, dict[v]);
    }
  });
  root.childNodes.forEach(c => translateTree(c, dict));
}

function getPath() {
  return window.location.pathname
    .replace(/\.html$/, '').replace(/\/+$/, '') || '/';
}

/* ─── Language toggle button ─────────────────────────────── */
function injectToggle(activeLang, onToggle) {
  const nav = document.querySelector('.nav-actions');
  if (!nav || document.querySelector('.lang-toggle')) return;

  const w = document.createElement('div');
  w.className = 'lang-toggle';
  w.innerHTML =
    '<button class="lang-btn' + (activeLang === 'en' ? ' lang-active' : '') + '" data-lang="en">EN</button>' +
    '<span class="lang-sep">|</span>' +
    '<button class="lang-btn' + (activeLang === 'tr' ? ' lang-active' : '') + '" data-lang="tr">TR</button>';

  nav.insertBefore(w, nav.firstChild);

  w.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.lang !== activeLang) onToggle(btn.dataset.lang);
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   TRANSLATION DICTIONARIES
   ═══════════════════════════════════════════════════════════ */

/* ─── Shared (navbar / footer / common CTAs) ─────────────── */
const TR_COMMON = {
  'Product': 'Ürün',
  'Voice AI': 'Sesli AI',
  'Answer every call, 24/7': 'Her aramayı yanıtla, 7/24',
  'WhatsApp & Chat': 'WhatsApp & Chat',
  'Automate message channels': 'Mesaj kanallarını otomatikleştir',
  'CRM & Pipeline': 'CRM ve Pipeline',
  'Track and score every lead': 'Her lead\'i takip et ve puanla',
  'Integrations': 'Entegrasyonlar',
  'Connect your existing tools': 'Mevcut araçlarını bağla',
  'Pricing': 'Fiyatlandırma',
  'Solutions': 'Çözümler',
  'Healthcare Clinics': 'Sağlık Klinikleri',
  'Hair transplant, dental, aesthetics': 'Saç ekimi, diş, estetik',
  'Partner Program': 'Partner Programı',
  'Earn up to 50% recurring commission': '%50\'ye kadar aylık komisyon kazanın',
  'Log in': 'Giriş yap',
  'Start free trial': 'Ücretsiz deneyin',
  'Features': 'Özellikler',
  'Healthcare': 'Sağlık',
  'Partners': 'Partnerler',
  'AI receptionist for any business. Answer every call, handle every message, convert every lead.': 'Her işletme için AI resepsiyonist. Her aramayı yanıtla, her mesajı yönet, her lead\'i dönüştür.',
  'WhatsApp Chatbot': 'WhatsApp Chatbot',
  'Web Chat Widget': 'Web Chat Widget',
  'Outbound AI': 'Outbound AI',
  'Real Estate': 'Gayrimenkul',
  'Education': 'Eğitim',
  'E-Commerce': 'E-Ticaret',
  'Agencies & Resellers': 'Ajanslar ve Bayiler',
  'White Label': 'Beyaz Etiket',
  'About': 'Hakkımızda',
  'Blog': 'Blog',
  'Careers': 'Kariyer',
  'Privacy Policy': 'Gizlilik Politikası',
  'Terms of Service': 'Kullanım Koşulları',
  'Cookie Policy': 'Çerez Politikası',
  'GDPR': 'KVKK',
  '© 2026 STOAIX Ltd. — London, UK': '© 2026 STOAIX Ltd. — Londra, UK',
  'Made for businesses that refuse to miss a lead.': 'Lead kaçırmayan işletmeler için tasarlandı.',
  'Monthly': 'Aylık',
  'Annual': 'Yıllık',
  'Save 20%': '%20 Tasarruf Et',
  'Most popular': 'En Popüler',
};

/* ─── Index page ─────────────────────────────────────────── */
const TR_INDEX = Object.assign({}, TR_COMMON, {
  'STOAIX — AI Voice & Chat Platform for Any Business': 'STOAIX — Her İşletme İçin AI Ses ve Chat Platformu',
  '7-day free trial · No credit card required': '7 günlük ücretsiz deneme · Kredi kartı gerekmez',
  'receptionist': 'resepsiyonist',
  'call center': 'çağrı merkezi',
  'sales agent': 'satış temsilcisi',
  'chatbot': 'chatbot',
  'voice agent': 'sesli ajan',
  'CRM': 'CRM',
  'live in minutes.': 'dakikalar içinde hazır.',
  'Voice calls, WhatsApp, and web chat — fully automated.': 'Sesli aramalar, WhatsApp ve web chat — tamamen otomatik.',
  'No code. No meetings. Works for any business.': 'Kod gerektirmez. Toplantı gerektirmez. Her işletme için çalışır.',
  'Watch demo': 'Demo İzle',
  'Trusted by clinics, agencies, and businesses across': 'Klinikler, ajanslar ve işletmelerin tercihi —',
  '12+ countries': '12+ ülkede',
  'Powered by the best. Connects with everything.': 'En iyi teknolojilerle güçlendirildi. Her şeyle entegre olur.',
  'What is STOAIX?': 'STOAIX nedir?',
  'Stop missing leads.': 'Lead kaçırmayı durdurun.',
  'Start converting them.': 'Dönüştürmeye başlayın.',
  'Every unanswered call is a lead handed to your competitor. STOAIX deploys an AI agent that never sleeps — it picks up every call, replies to every message, and books appointments while you focus on what you do best.': 'Yanıtsız her çağrı, rakibinize hediye edilmiş bir lead\'dir. STOAIX hiç uyumayan bir AI ajan devreye sokar — her aramayı karşılar, her mesajı yanıtlar ve siz asıl işinize odaklanırken randevuları planlar.',
  'See how it works': 'Nasıl çalıştığını gör',
  'Voice AI Receptionist': 'Sesli AI Resepsiyonist',
  'Answers every inbound call in your language, 24/7. Books appointments, answers FAQs, and hands off to your team when needed.': 'Gelen her aramayı kendi dilinizde 7/24 yanıtlar. Randevu oluşturur, sık sorulan soruları yanıtlar ve gerektiğinde ekibinize aktarır.',
  'WhatsApp & Chat Automation': 'WhatsApp ve Chat Otomasyonu',
  'The same AI brain across WhatsApp, web chat, and Instagram DM. One knowledge base, every channel covered.': 'WhatsApp, web chat ve Instagram DM\'de tek bir AI. Tek bilgi tabanı, tüm kanallar kapsanır.',
  'Smart CRM & Lead Pipeline': 'Akıllı CRM ve Lead Pipeline',
  'Every conversation auto-logged. Leads scored, qualified, and routed — without anyone touching a spreadsheet.': 'Her konuşma otomatik olarak kaydedilir. Lead\'ler puanlanır, nitelendirilir ve yönlendirilir — kimse elektronik tabloya dokunmadan.',
  '15+ Languages by Default': 'Varsayılan Olarak 15+ Dil',
  'English, Turkish, Arabic, Spanish, French, Russian, German and more. Your AI detects and switches languages automatically — no setup needed.': 'İngilizce, Türkçe, Arapça, İspanyolca, Fransızca, Rusça, Almanca ve daha fazlası. AI\'ınız dili otomatik olarak algılar ve geçiş yapar — herhangi bir kurulum gerekmez.',
  'Works for every business': 'Her işletme için çalışır',
  'AI that': 'AI,',
  'talks like your team.': 'ekibiniz gibi konuşur.',
  'Built for': 'Şunlar için:',
  'dental clinics.': 'diş klinikleri.',
  'hair transplants.': 'saç ekimi klinikleri.',
  'real estate agencies.': 'gayrimenkul ajansları.',
  'education centers.': 'eğitim merkezleri.',
  'e-commerce brands.': 'e-ticaret markaları.',
  'law firms.': 'hukuk firmaları.',
  'any business.': 'her tür işletme.',
  'Always answering': '7/24 Yanıtlıyor',
  'Auto-detected': 'Otomatik Algılama',
  'Time to go live': 'Yayına Geçiş Süresi',
  'Setup fee': 'Kurulum Ücreti',
  'Omnichannel': 'Çok Kanallı',
  'Every channel.': 'Her kanal.',
  'One platform.': 'Tek platform.',
  'Your customers reach you however they want. STOAIX handles all of it — from the same dashboard, with the same AI brain.': 'Müşterileriniz size istedikleri kanaldan ulaşır. STOAIX hepsini tek bir dashboard\'dan, aynı AI ile yönetir.',
  'WhatsApp': 'WhatsApp',
  'Web Chat': 'Web Chat',
  'Outbound': 'Outbound',
  'Instagram DM': 'Instagram DM',
  'Inbound calls, handled instantly.': 'Gelen aramalar anında karşılanır.',
  'Your AI agent picks up every call — no hold music, no voicemail. It answers questions, takes appointment requests, and transfers to your team only when necessary. Works in 15+ languages out of the box — detects the caller\'s language automatically.': 'AI ajanınız her aramayı karşılar — bekleme müziği yok, sesli mesaj yok. Soruları yanıtlar, randevu talepleri alır ve yalnızca gerektiğinde ekibinize aktarır. Kutusundan çıktığı gibi 15+ dilde çalışır — arayanın dilini otomatik olarak algılar.',
  'Instant pickup, zero hold time': 'Anında yanıt, sıfır bekleme süresi',
  'Full call recording + transcript': 'Tam çağrı kaydı ve transkript',
  'Smart handoff — human when needed': 'Akıllı aktarım — gerektiğinde insana yönlendir',
  'Appointment booking included': 'Randevu oluşturma dahil',
  'Incoming call': 'Gelen Arama',
  'Appointment booked': 'Randevu Oluşturuldu',
  'CRM updated': 'CRM Güncellendi',
  'WhatsApp automation that feels human.': 'İnsan gibi hissettiren WhatsApp otomasyonu.',
  'The same AI knowledge base — now in your customers\' most-used app. Handle price inquiries, FAQs, document collection, and appointment confirmations over WhatsApp, 24/7.': 'Aynı AI bilgi tabanı — artık müşterilerinizin en çok kullandığı uygulamada. Fiyat sorguları, sık sorulan sorular, belge toplama ve randevu onaylarını WhatsApp üzerinden 7/24 yönetin.',
  'Official WhatsApp Business API': 'Resmi WhatsApp Business API',
  'Media & document collection': 'Medya ve belge toplama',
  'Multilingual auto-detection': 'Otomatik dil algılama',
  'Human handoff in 1 tap': 'Tek dokunuşla insana aktar',
  'Online': 'Çevrimiçi',
  'Convert website visitors into booked leads.': 'Web sitesi ziyaretçilerini randevulu müşterilere dönüştürün.',
  'A smart chat widget on your site that does more than answer questions — it qualifies visitors, collects their details, and books appointments directly in your calendar.': 'Sitenizde yalnızca soru yanıtlamakla kalmayan akıllı bir chat widget\'ı — ziyaretçileri nitelendirir, bilgilerini toplar ve randevuları doğrudan takviminize ekler.',
  '1-line embed, any website': '1 satır kod, her web sitesine uyumlu',
  'Lead qualification built-in': 'Dahili lead nitelendirme',
  'Calendar integration': 'Takvim entegrasyonu',
  'Fully branded to your business': 'İşletmenize özel tasarım',
  'AI Assistant': 'AI Asistan',
  'Hi! I\'m here to help. What are you looking for today?': 'Merhaba! Size yardımcı olmak için buradayım. Bugün ne arıyorsunuz?',
  'Treatment prices': 'Tedavi fiyatları',
  'Book appointment': 'Randevu Al',
  'Find us': 'Bize Ulaşın',
  'Your AI calls leads before your competitor does.': 'AI\'ınız, lead\'leri rakibinizden önce arar.',
  'New lead comes in at midnight? Your AI agent calls them back within 60 seconds. Set up automated outbound sequences for lead follow-up, appointment reminders, and reactivation campaigns.': 'Gece yarısı yeni bir lead mi geldi? AI ajanınız 60 saniye içinde geri arar. Lead takibi, randevu hatırlatıcıları ve yeniden aktivasyon kampanyaları için otomatik diziler oluşturun.',
  'First call within 60 seconds': '60 saniye içinde ilk arama',
  'Automated follow-up sequences': 'Otomatik takip dizileri',
  'Old lead reactivation': 'Eski lead\'leri yeniden devreye alma',
  'No-show prevention reminders': 'Gelmeme önleme hatırlatıcıları',
  'Outbound Campaign': 'Outbound Kampanya',
  'Leads dialled': 'Aranan Lead\'ler',
  'Connected': 'Bağlandı',
  'Booked': 'Rezerve Edildi',
  'Lead created — 11:47 PM': 'Lead oluşturuldu — 23:47',
  'AI call placed — 11:47 PM (60s later)': 'AI araması yapıldı — 23:47 (60 sn sonra)',
  'Voicemail left — 11:48 PM': 'Sesli mesaj bırakıldı — 23:48',
  'Follow-up SMS — 9:00 AM': 'Takip SMS\'i — 09:00',
  'WhatsApp — Day 3': 'WhatsApp — 3. Gün',
  'Turn DMs into booked appointments.': 'DM\'leri randevuya dönüştürün.',
  'Instagram DMs are your highest-intent leads — and most businesses reply hours later. STOAIX responds instantly, qualifies the lead, and moves them toward booking before they check a competitor.': 'Instagram DM\'leri en yüksek satın alma niyetli lead\'lerinizdir — çoğu işletme saatler sonra yanıt verir. STOAIX anında karşılık verir, lead\'i nitelendirir ve rakip araştırmadan önce randevuya yönlendirir.',
  'Instant DM responses': 'Anında DM yanıtı',
  'Story reply automation': 'Story yanıtı otomasyonu',
  'Link to WhatsApp or booking page': 'WhatsApp veya randevu sayfasına yönlendirme',
  'Lead captured to CRM automatically': 'Lead otomatik olarak CRM\'e kaydedilir',
  'Live Demo': 'Canlı Demo',
  'See it in action.': 'Canlı görün.',
  'Try STOAIX live — ask it anything, book an appointment, hear the voice. No signup required.': 'STOAIX\'i canlı deneyin — her şeyi sorun, randevu alın, sesi dinleyin. Kayıt gerekmez.',
  'Coming Soon': 'Yakında',
  'Interactive Voice Demo': 'Sesli Canlı Demo',
  'Speak with STOAIX\'s AI agent live — no signup required. Ask questions, hear the voice, book an appointment in real time.': 'STOAIX AI ajanıyla canlı konuşun — kayıt gerekmez. Sorular sorun, sesi dinleyin, gerçek zamanlı randevu alın.',
  'Platform': 'Platform',
  'Built for results,': 'Sonuç odaklı tasarım,',
  'not complexity.': 'gereksiz karmaşıklık değil.',
  'A clean dashboard that gives you everything you need — calls, leads, conversations, and performance — in one place.': 'Tüm ihtiyaçlarınızı tek bir yerde toplayan sade bir dashboard — aramalar, lead\'ler, konuşmalar ve performans.',
  'Dashboard Overview': 'Dashboard Genel Bakışı',
  'CRM Pipeline': 'CRM Pipeline',
  'Call Transcript': 'Çağrı Transkripti',
  'Effortless setup': 'Zahmetsiz kurulum',
  'Live in 5 minutes.': '5 dakikada yayında.',
  'No engineer needed.': 'Geliştirici gerekmez.',
  'Tell us about your business': 'İşletmenizi bize anlatın',
  'Answer a few questions. Paste your FAQs or let our AI generate them from your website. Your knowledge base is ready instantly.': 'Birkaç soruyu yanıtlayın. Sık sorulan sorularınızı yapıştırın ya da AI\'ımızın web sitenizden otomatik oluşturmasına izin verin. Bilgi tabanınız anında hazır.',
  'Configure your AI agent': 'AI ajanınızı yapılandırın',
  'Choose your agent\'s name, voice, and channels. Set your booking rules and handoff conditions. All without writing a single line of code.': 'Ajanınızın adını, sesini ve kanallarını seçin. Randevu kurallarını ve aktarım koşullarını belirleyin. Tek bir satır kod yazmadan.',
  'Go live': 'Yayına alın',
  'Forward your number. Add the chat widget. Connect WhatsApp. Your AI agent is answering calls and messages — right now.': 'Numaranızı yönlendirin. Chat widget\'ını ekleyin. WhatsApp\'ı bağlayın. AI ajanınız aramaları ve mesajları şu an yanıtlıyor.',
  'Simple, transparent pricing.': 'Sade ve şeffaf fiyatlandırma.',
  'Start free. Scale when you\'re ready. No contracts, cancel anytime.': 'Ücretsiz başlayın. Hazır olduğunuzda büyütün. Sözleşme yok, istediğiniz zaman iptal edin.',
  'WhatsApp & web chat to get started': 'Başlamak için WhatsApp ve web chat',
  'Add Voice AI to your channels': 'Kanallarınıza Sesli AI ekleyin',
  'Full system. Outbound included.': 'Eksiksiz sistem. Outbound dahil.',
  'Manage multiple clients from one dashboard': 'Tüm müşterilerinizi tek panelden yönetin',
  /* --- New pricing feature items --- */
  'WhatsApp messages — 500/mo': 'WhatsApp mesajı — 500/ay',
  'WhatsApp messages — 2,000/mo': 'WhatsApp mesajı — 2.000/ay',
  'WhatsApp messages — 5,000/mo': 'WhatsApp mesajı — 5.000/ay',
  'WhatsApp messages — Unlimited': 'WhatsApp mesajı — Sınırsız',
  'Voice agent': 'Sesli ajan',
  'Voice agent — 60 min/mo': 'Sesli ajan — 60 dk/ay',
  'Voice agent — 200 min/mo': 'Sesli ajan — 200 dk/ay',
  'Voice agent — Unlimited': 'Sesli ajan — Sınırsız',
  'Kanban board': 'Kanban panosu',
  'CSV import': 'CSV içe aktarma',
  'Advanced analytics': 'Gelişmiş analitik',
  'Outbound webhook': 'Outbound webhook',
  'Team members — 1': 'Ekip üyesi — 1',
  'Team members — 3': 'Ekip üyesi — 3',
  'Team members — 10': 'Ekip üyesi — 10',
  'Team members — Unlimited': 'Ekip üyesi — Sınırsız',
  /* --- Legacy pricing strings (kept for compatibility) --- */
  'Voice AI usage: $0.15/min after plan limit · ': 'Sesli AI kullanımı: Plan limitinden sonra $0,15/dk · ',
  'All plans: 7-day free trial, no credit card · ': 'Tüm planlarda: 7 günlük ücretsiz deneme, kredi kartı gerekmez · ',
  'Annual billing saves 20%': 'Yıllık ödemede %20 tasarruf',
  'Partners & White Label': 'Partnerler ve Beyaz Etiket',
  'Build your own': 'Kendi',
  'AI business.': 'AI işletmenizi kurun.',
  'Sell STOAIX under your own brand. White-label our platform, set your own prices, keep the margin. Perfect for agencies, consultants, and resellers worldwide.': 'STOAIX\'i kendi markanız altında satın. Platformumuzu beyaz etiketleyin, kendi fiyatlarınızı belirleyin, kârı cebinize koyun. Ajanslar, danışmanlar ve dünya genelindeki bayiler için biçilmiş kaftan.',
  'Your brand, zero dev cost': 'Markanız, sıfır geliştirme maliyeti',
  'Custom domain, logo, agent name — STOAIX invisible': 'Özel domain, logo, ajan adı — STOAIX arka planda kalır',
  '~40% margin per client': 'Müşteri başına ~%40 kâr marjı',
  '10 Advanced clients = ~$1,200/mo recurring profit': '10 Advanced müşteri = aylık ~1.200$ tekrarlayan kâr',
  'Sell globally': 'Globale satın',
  'No geography limits. Any sector. Any language.': 'Coğrafi sınır yok. Her sektör. Her dil.',
  'Become a partner': 'Partner Olun',
  'Example: 10 Advanced clients': 'Örnek: 10 Advanced müşteri',
  'STOAIX wholesale (10 × $149)': 'STOAIX toptan fiyatı (10 × $149)',
  'Your platform fee': 'Platform ücretiniz',
  'Your revenue (10 × $299)': 'Geliriniz (10 × $299)',
  'Net profit': 'Net kâr',
  '+ Activation fee: $1,497 one-time': '+ Aktivasyon ücreti: tek seferlik $1.497',
  'Your AI receptionist is': 'AI resepsiyonistiniz',
  'one signup away.': 'bir kayıt kadar uzağınızda.',
  '7-day free trial. No credit card. Set up in minutes.': '7 günlük ücretsiz deneme. Kredi kartı gerekmez. Dakikalar içinde kurulum.',
  'Start your free trial': 'Ücretsiz Denemeyi Başlatın',
  'Talk to sales': 'Satış Ekibiyle Konuşun',
  'No contracts · Cancel anytime · 10-day free trial': 'Sözleşme yok · İstediğiniz zaman iptal edin · 10 günlük ücretsiz deneme',
  'Voice AI': 'Sesli AI',
  'WhatsApp Chatbot': 'WhatsApp Chatbot',
  'Web Chat Widget': 'Web Chat Widget',
  'Outbound AI': 'Outbound AI',
  'Healthcare Clinics': 'Sağlık Klinikleri',
  'Real Estate': 'Gayrimenkul',
  'Education': 'Eğitim',
  'E-Commerce': 'E-Ticaret',
  'Agencies & Resellers': 'Ajanslar & Bayiler',
  'White Label': 'Beyaz Etiket',
});

/* ─── Partners page ──────────────────────────────────────── */
const TR_PARTNERS = Object.assign({}, TR_COMMON, {
  'Partner Program — STOAIX | Earn Recurring Revenue Selling AI Automation': 'Partner Programı — STOAIX | AI Otomasyonu Satarak Tekrarlayan Gelir Kazanın',
  'Partner Program — Now Open': 'Partner Programı — Başvurular Açık',
  'Sell AI automation.': 'AI otomasyonu satın.',
  'Earn recurring revenue.': 'Tekrarlayan gelir elde edin.',
  'Refer clients or go white-label. Earn up to 40% recurring commission on every active client — no technical background required.': 'Müşteri yönlendirin veya white-label seçin. Her aktif müşteriden %40\'a kadar aylık komisyon kazanın — teknik bilgi gerekmez.',
  'Apply to Partner Program': 'Partner Programına Başvurun',
  'See commission tiers': 'Komisyon kademelerini inceleyin',
  '$0 to join · No technical skills required · Recurring commissions': 'Ücretsiz katılım · Teknik bilgi gerekmez · Aylık tekrarlayan komisyon',
  'Max recurring commission': 'Maks. aylık komisyon',
  'Affiliate tiers': 'Affiliate kademeleri',
  'Cost to join': 'Katılım ücreti',
  'Languages supported': 'Desteklenen diller',
  'Who it\'s for': 'Kimler için uygun',
  'Two ways to partner with STOAIX': 'STOAIX ile iş ortağı olmanın iki yolu',
  'Whether you want to refer clients casually or build a full AI agency business, there\'s a tier for you.': 'İster zaman zaman müşteri yönlendirin, ister tam kapsamlı bir AI ajans işi kurun — size uygun bir kademe var.',
  'Affiliate / Referral Partner': 'Affiliate / Yönlendirme Ortağı',
  'You have a network — clients, followers, or contacts who need AI automation. Refer them and earn recurring commission every month they stay.': 'Bir ağınız var — AI otomasyonuna ihtiyaç duyan müşteriler, takipçiler veya bağlantılar. Onları yönlendirin, aktif kaldıkları her ay komisyon kazanın.',
  'Start earning from the very first referral': 'İlk yönlendirmeden itibaren kazanmaya başlayın',
  '10–30% recurring commission (rises with active clients)': 'Aylık %10–30 komisyon (aktif müşteri sayısıyla birlikte artar)',
  'STOAIX handles all onboarding and support': 'Tüm onboarding ve destek süreçlerini STOAIX yönetir',
  'Great for: consultants, coaches, business networks': 'İdeal profiller: danışmanlar, koçlar, iş ağları',
  'Agency / White-Label Partner': 'Ajans / Beyaz Etiket Ortağı',
  'Build your own AI agency on top of STOAIX infrastructure. Sell under your brand, manage multiple clients from one dashboard, keep the margin.': 'STOAIX altyapısı üzerine kendi AI ajansınızı kurun. Kendi markanızla satın, tek panelden tüm müşterilerinizi yönetin, kârı cebinize koyun.',
  '40% recurring commission on every active client': 'Her aktif müşteriden %40 aylık komisyon',
  'White-label: your logo, your domain, your brand': 'Beyaz etiket: logonuz, domaininiz, markanız',
  'One-time setup fee — no ongoing platform cost': 'Tek seferlik kurulum ücreti — süregelen platform maliyeti yok',
  'Great for: digital agencies, AI consultants, resellers': 'İdeal profiller: dijital ajanslar, AI danışmanları, bayiler',
  'Why STOAIX': 'Neden STOAIX',
  'Your clients save $400–$600/month vs. building it themselves': 'Müşterileriniz, kendi başlarına kurmayla kıyaslandığında ayda $400–$600 tasarruf eder',
  'The typical AI agency stack (VAPI + GHL + Make/N8N) costs $800–$1,000/mo and takes weeks to set up. STOAIX Agency is $499/mo — everything included, live in minutes.': 'Tipik bir AI ajans altyapısı (VAPI + GHL + Make/N8N) aylık $800–$1.000\'e mal olur ve kurulumu haftalar alır. STOAIX Agency ise $499/ay — her şey dahil, dakikalar içinde hazır.',
  'Feature': 'Özellik',
  'Monthly cost': 'Aylık maliyet',
  'Voice AI': 'Sesli AI',
  'WhatsApp + Web Chat': 'WhatsApp + Web Chat',
  'CRM + Pipeline': 'CRM + Pipeline',
  'Multi-client management': 'Çok müşteri yönetimi',
  'Setup time': 'Kurulum süresi',
  'Languages': 'Diller',
  'VAPI — separate billing, usage caps': 'VAPI — ayrı faturalama, kullanım sınırları',
  'Included — inbound + outbound': 'Dahil — gelen ve giden aramalar',
  'Extra integration + cost': 'Ek entegrasyon ve ek maliyet',
  'Included — same knowledge base': 'Dahil — tek bilgi tabanı',
  'GHL subscription required': 'GHL aboneliği gerektirir',
  'Built-in — lead scoring + follow-up': 'Dahili — lead puanlama ve takip',
  'Manual per-client setup': 'Her müşteri için manuel kurulum',
  'Reseller dashboard — one panel': 'Bayi paneli — tek ekran',
  '2–4 weeks per client': 'Müşteri başına 2–4 hafta',
  'Under 5 minutes — self-serve': '5 dakikadan kısa — self-servis',
  'Manual prompt engineering': 'Manuel prompt ayarları',
  '15+ languages — native support': '15+ dil — yerleşik destek',
  'Commission structure': 'Komisyon yapısı',
  '3 tiers. Rises as your client base grows.': '3 kademe. Müşteri tabanınız büyüdükçe oran yükselir.',
  'Commission is recurring — you earn every month your referred clients stay active. Tier is based on your current active client count and adjusts dynamically.': 'Komisyon aylık tekrarlanır — yönlendirdiğiniz müşteriler aktif kaldıkça kazanmaya devam edersiniz. Kademe, anlık aktif müşteri sayısına göre otomatik olarak güncellenir.',
  'Tier': 'Kademe',
  'Commission': 'Komisyon',
  'Active clients': 'Aktif müşteriler',
  'Notes': 'Notlar',
  'Default tier — anyone can join': 'Başlangıç kademesi — herkese açık',
  'Consistent referral track record': 'Düzenli yönlendirme geçmişi',
  'High-volume affiliate partner': 'Yüksek hacimli affiliate ortağı',
  'Recurring monthly': 'Aylık tekrarlayan',
  '1–5 active clients': '1–5 aktif müşteri',
  '5–10 active clients': '5–10 aktif müşteri',
  '10–20 active clients': '10–20 aktif müşteri',
  'Sign up instantly, no approval needed': 'Anında kayıt, onay gerekmez',
  'Tier auto-adjusts with active count': 'Kademe aktif müşteri sayısına göre otomatik güncellenir',
  'Tier drops if active count falls': 'Aktif sayı düşerse kademe de düşer',
  'White Label': 'Beyaz Etiket',
  'Sell STOAIX as your own product.': 'STOAIX\'i kendi ürününüz olarak satın.',
  'Choose a white-label package and run the entire platform under your brand — your logo, your domain, your pricing. Earn 40% on every active client, every month.': 'Bir beyaz etiket paketi seçin ve tüm platformu kendi markanız altında işletin — logonuz, domaininiz, fiyatlandırmanız. Her aktif müşteriden her ay %40 kazanın.',
  'WL Basic — $997': 'WL Basic — $997',
  'Full white-label setup under your brand. One-time fee, no recurring platform cost. Earn 40% commission on every client you manage.': 'Markanız altında eksiksiz beyaz etiket kurulumu. Tek seferlik ücret, süregelen platform maliyeti yok. Yönettiğiniz her müşteriden %40 komisyon kazanın.',
  'Your logo, domain, and brand throughout': 'Her yerde kendi logonuz, domaininiz ve markanız',
  '40% recurring commission on all active clients': 'Tüm aktif müşterilerden %40 aylık komisyon',
  'Partner dashboard to track clients & commissions': 'Müşterileri ve komisyonları takip etmek için partner paneli',
  'Dedicated onboarding support': 'Özel başlangıç desteği',
  'WL Pro — $1,497': 'WL Pro — $1.497',
  'Everything in WL Basic plus a 4-session live sales training program. Learn how to close AI automation deals and build a repeatable pipeline.': 'WL Basic\'teki her şeye ek olarak 4 oturumlu canlı satış eğitimi. AI otomasyon tekliflerini nasıl kapatacağınızı ve tekrarlanabilir bir satış süreci nasıl oluşturacağınızı öğrenin.',
  'Everything in WL Basic': 'WL Basic\'teki her şey',
  '4 live sales training sessions (1 month)': '4 canlı satış eğitimi oturumu (1 ay)',
  'Discovery call & closing frameworks': 'Keşif görüşmesi ve kapanış teknikleri',
  'Process': 'Süreç',
  'Three steps to your first commission': 'İlk komisyonunuza giden üç adım',
  'No technical setup. No waiting. You find clients — we handle everything else.': 'Teknik kurulum yok. Bekleme yok. Müşterileri siz bulun — geri kalanını biz hallederiz.',
  'Sign up instantly': 'Hemen kayıt olun',
  'Fill in your details and your affiliate account is ready in minutes. You get a unique referral link and access to your partner dashboard immediately.': 'Bilgilerinizi doldurun, affiliate hesabınız dakikalar içinde hazır. Anında benzersiz bir yönlendirme bağlantısı ve partner panelinize erişim elde edersiniz.',
  'Refer or sell': 'Yönlendirin veya satın',
  'Share your link or run the sales call yourself. STOAIX handles onboarding, support, and technical setup — you just connect the client.': 'Bağlantınızı paylaşın ya da satış görüşmesini bizzat siz yapın. STOAIX onboarding, destek ve teknik kurulumu yönetir — siz sadece müşteriyi bağlarsınız.',
  'Earn every month': 'Her ay kazanmaya devam edin',
  'Commission is paid monthly, recurring for as long as the client stays active. The more active clients you have, the higher your tier and commission rate.': 'Komisyon aylık ödenir; müşteri aktif olduğu sürece tekrarlanır. Aktif müşteri sayınız arttıkça kademeniz ve komisyon oranınız da yükselir.',
  'Ready to earn recurring revenue from AI?': 'AI\'dan aylık tekrarlayan gelir elde etmeye hazır mısınız?',
  'Sign up takes 2 minutes. Your referral link is ready instantly. Start earning the same day.': 'Kayıt 2 dakika sürer. Yönlendirme bağlantınız anında hazır. Aynı gün kazanmaya başlayın.',
  'Apply Now': 'Hemen Başvurun',
  'Ask a question': 'Soru sorun',
});

/* ─── Healthcare Clinics page ────────────────────────────── */
const TR_HEALTHCARE = Object.assign({}, TR_COMMON, {
  'Built for healthcare clinics': 'Sağlık klinikleri için tasarlandı',
  // Hero animated word translations
  'Your AI': 'AI',
  'receptionist': 'resepsiyonist',
  'call center': 'çağrı merkezi',
  'sales agent': 'satış temsilcisi',
  'chatbot': 'chatbot',
  'voice agent': 'sesli ajan',
  'live in minutes.': 'dakikalar içinde hazır.',
  // Hero sub
  'Answers every call 24/7. Qualifies patients, books consultations, and follows up on cold leads — all without a single meeting with us.': '7/24 her aramayı yanıtlar. Hastaları nitelendirir, konsültasyon randevusu planlar ve soğuk lead\'leri takip eder — bizimle tek bir toplantı bile olmadan.',
  'Available in': 'Şu dillerde mevcut:',
  'and more.': 've daha fazlası.',
  // Rotating language names
  'Russian': 'Rusça',
  'German': 'Almanca',
  'French': 'Fransızca',
  'Spanish': 'İspanyolca',
  'Italian': 'İtalyanca',
  'Dutch': 'Hollandaca',
  'Portuguese': 'Portekizce',
  'Japanese': 'Japonca',
  'Korean': 'Korece',
  'Chinese': 'Çince',
  'Hindi': 'Hintçe',
  'Polish': 'Lehçe',
  // Who it's for section
  "Who it's for": 'Kimler İçin?',
  'Built for every healthcare clinic vertical': 'Her sağlık kliniği dikeyi için tasarlandı',
  'Configure your AI for your specific procedure type, patient profile, and intake requirements — all within the same platform.': 'Prosedür türünüze, hasta profilinize ve kabul gereksinimlerinize özel AI\'ınızı yapılandırın — hepsi aynı platformda.',
  'High-value international patients, long decision cycles, and multilingual enquiries. STOAIX handles the volume, qualifies FUE vs. DHI conversations, and surfaces ready leads.': 'Yüksek değerli uluslararası hastalar, uzun karar süreçleri ve çok dilli sorgular. STOAIX hacmi yönetir, FUE - DHI görüşmelerini nitelendirir ve hazır lead\'leri öne çıkarır.',
  'Implants, veneers, zirconia — patients ask the same questions 50 times a day. STOAIX answers all of them instantly, collects treatment history, and books around your schedule.': 'İmplant, veneer, zirkonyum — hastalar aynı soruları günde 50 kez soruyor. STOAIX hepsini anında yanıtlar, tedavi geçmişini toplar ve takviminize göre randevu oluşturur.',
  'High-ticket, high-sensitivity procedures. STOAIX warms the lead, collects photos and health history, and routes only pre-qualified patients to your surgeons.': 'Yüksek ücretli, hassas prosedürler. STOAIX lead\'i ısıtır, fotoğraf ve sağlık geçmişini toplar ve yalnızca ön nitelikli hastaları cerrahlarınıza yönlendirir.',
  'Botox, fillers, PRP — high enquiry volume, repeat patients, seasonal spikes. STOAIX manages appointment reminders, follow-up sequences, and re-engagement campaigns.': 'Botoks, dolgu, PRP — yüksek sorgu hacmi, tekrar eden hastalar, mevsimsel zirveler. STOAIX randevu hatırlatmalarını, takip dizilerini ve yeniden etkileşim kampanyalarını yönetir.',
  // Multilingual section
  'Multilingual': 'Çok Dilli',
  'Healthcare tourism patients come from Turkey, the UK, Europe, and the Middle East. STOAIX switches languages mid-conversation based on what the patient speaks — no configuration needed, no human translator required.': 'Sağlık turizmi hastaları Türkiye, İngiltere, Avrupa ve Orta Doğu\'dan geliyor. STOAIX, hastanın konuştuğu dile göre konuşma ortasında dil değiştirir — yapılandırma gerekmez, insan tercüman gerekmez.',
  'Turkish, English, and Arabic are included in the Advanced plan. Additional languages are available as add-ons: Russian, German, French, Spanish, and more.': 'Türkçe, İngilizce ve Arapça Advanced planına dahildir. Ek diller eklenti olarak mevcuttur: Rusça, Almanca, Fransızca, İspanyolca ve daha fazlası.',
  'Start with all three languages': 'Üç dille hemen başlayın',
  'Start 10-day free trial': '10 günlük ücretsiz denemeye başlayın',
  'See pricing': 'Fiyatları İnceleyin',
  'No credit card required · Cancel anytime · Setup in minutes': 'Kredi kartı gerekmez · İstediğiniz zaman iptal edin · Dakikalar içinde kurulum',
  'Always answers': 'Her zaman yanıtlar',
  'Languages (TR / EN / AR)': 'Diller (TR / EN / AR)',
  'Time to set up': 'Kurulum süresi',
  'The real cost': 'Gerçek maliyet',
  'Four ways your clinic leaks revenue every day': 'Kliniğinizin her gün gelir kaybetmesinin dört yolu',
  'Every clinic we talk to — hair transplant, dental, aesthetic — has the same four problems.': 'Konuştuğumuz her klinik — saç ekimi, diş, estetik — aynı dört soruna sahip.',
  'Missed calls = missed revenue': 'Cevapsız aramalar = kaçan gelir',
  'International patients call at midnight your time. After-hours and weekends are your busiest windows — and exactly when your team is offline. Every unanswered ring goes to a competitor.': 'Uluslararası hastalar sizin gece yarınızda arıyor. Mesai saatleri dışı ve hafta sonları en yoğun pencereleriniz — ve tam olarak ekibinizin çevrimdışı olduğu zaman. Her yanıtsız çağrı bir rakibe gidiyor.',
  'Failed follow-ups': 'Başarısız takipler',
  'A consultation ends with "I\'ll think about it." Nobody calls back on day 3. Nobody sends a WhatsApp on day 7. That warm lead cools in silence — and you never knew how close they were.': 'Bir konsültasyon "Düşüneceğim" ile bitiyor. 3. günde kimse geri aramıyor. 7. günde kimse WhatsApp atmıyor. O sıcak lead sessizlikte soğuyor — ve ne kadar yakın olduklarını hiç bilmediniz.',
  'Dead lead lists': 'Ölü lead listeleri',
  'Hundreds of old enquiries buried in Excel, WhatsApp, and your CRM. Each one asked about a procedure, then went quiet. They haven\'t said no — they just haven\'t been re-engaged.': 'Excel\'e, WhatsApp\'a ve CRM\'inize gömülü yüzlerce eski sorgulama. Her biri bir prosedür hakkında sordu, sonra sessizleşti. Hayır demediler — sadece yeniden ilgilenilmediler.',
  'Call center overload': 'Çağrı merkezi aşırı yükü',
  'Your team spends hours answering "how much does a hair transplant cost?" over and over. Repetitive questions eat the time that should go to closing actual consultations.': 'Ekibiniz saatlerini "saç ekimi ne kadar?" sorusunu tekrar tekrar yanıtlayarak geçiriyor. Tekrarlayan sorular, gerçek konsültasyonları kapatmaya ayrılması gereken zamanı yiyor.',
  'How it works': 'Nasıl çalışır',
  'Set up once. Let it run.': 'Bir kez kurun. Çalıştırın.',
  'STOAIX is a self-serve platform. You sign up, configure your AI agent using the guided setup — no code, no meetings — and it\'s live on your clinic\'s number in minutes.': 'STOAIX bir self-servis platformdur. Kaydolun, rehberli kurulum ile AI ajanınızı yapılandırın — kod yok, toplantı yok — ve dakikalar içinde kliniğinizin numarasında yayına alın.',
  'Answers every inbound call instantly, 24/7': 'Her gelen aramayı anında yanıtlar, 7/24',
  'Asks the right qualification questions for your procedure type': 'Prosedür türünüz için doğru nitelendirme sorularını sorar',
  'Collects patient name, condition, photos needed, and preferred dates': 'Hasta adı, durum, gerekli fotoğraflar ve tercih edilen tarihleri toplar',
  'Books consultations directly into your calendar': 'Konsültasyonları doğrudan takviminize ekler',
  'Follows up automatically when a patient goes cold': 'Bir hasta soğuduğunda otomatik olarak takip eder',
  'Transfers to your team the moment a patient is ready to commit': 'Hasta taahhüt etmeye hazır olduğu anda ekibinize devreder',
  'Try it free for 10 days': '10 gün ücretsiz deneyin',
  'Patient qualified — consultation booked for Tuesday 14:00': 'Hasta nitelendi — Salı 14:00\'de konsültasyon rezervasyonu yapıldı',
  'Features': 'Özellikler',
  'Everything a clinic needs. Nothing it doesn\'t.': 'Bir kliniğin ihtiyacı olan her şey. İhtiyacı olmayan hiçbir şey.',
  'Voice, chat, CRM, and follow-up — in one self-serve platform. No separate tools. No integrations to stitch together.': 'Ses, chat, CRM ve takip — tek bir self-servis platformda. Ayrı araç yok. Entegrasyon derdi yok.',
  'Voice AI — Inbound (Plus+)': 'Sesli AI — Gelen (Plus+)',
  'Every incoming call answered within 2 seconds, 24/7. No voicemail, no hold music. Patients get answers; your team gets qualified leads.': 'Her gelen arama 2 saniye içinde yanıtlanır, 7/24. Sesli mesaj yok, bekleme müziği yok. Hastalar yanıt alır; ekibiniz nitelikli lead\'ler alır.',
  'Voice AI — Outbound (Advanced)': 'Sesli AI — Giden (Advanced)',
  'Automatically calls leads who went cold, confirms upcoming appointments, and re-engages past enquiries. Converts "I\'ll think about it" into booked slots.': 'Soğuyan lead\'leri otomatik olarak arar, yaklaşan randevuları onaylar ve geçmiş sorgulamaları yeniden devreye sokar. "Düşüneceğim"i rezervasyonlu slotlara dönüştürür.',
  'WhatsApp AI Chatbot (Lite+)': 'WhatsApp AI Chatbot (Lite+)',
  'Answers patient questions on WhatsApp 24/7 using your clinic\'s knowledge base. Price enquiries, procedure info, availability — handled automatically.': 'Kliniğinizin bilgi tabanını kullanarak WhatsApp\'ta 7/24 hasta sorularını yanıtlar. Fiyat sorgulamaları, prosedür bilgisi, müsaitlik — otomatik olarak yönetilir.',
  '3 Languages Built-in (Advanced)': '3 Dil Dahili (Advanced)',
  'Zapier, Make & Webhook (Advanced)': 'Zapier, Make & Webhook (Advanced)',
  'Hair Transplant Clinics': 'Saç Ekimi Klinikleri',
  'Dental Clinics': 'Diş Klinikleri',
  'Aesthetic Surgery': 'Estetik Cerrahi',
  'Medical Aesthetics': 'Medikal Estetik',
  'Your patients speak three languages. So does STOAIX.': 'Hastalarınız üç dil konuşuyor. STOAIX de öyle.',
  'Turkish': 'Türkçe',
  'Local patients, domestic referrals, staff communication': 'Yerel hastalar, yurt içi yönlendirmeler, personel iletişimi',
  'English': 'İngilizce',
  'UK, EU, US, Australian healthcare tourism patients': 'İngiltere, AB, ABD, Avustralya sağlık turizmi hastaları',
  'Arabic': 'Arapça',
  'Gulf and Middle East patients — a major underserved segment': 'Körfez ve Orta Doğu hastaları — yeterince kapsanmamış büyük bir pazar',
  'More available': 'Daha fazlası mevcut',
  'Russian, German, French, Spanish, Italian, Dutch, and more': 'Rusça, Almanca, Fransızca, İspanyolca, İtalyanca, Hollandaca ve daha fazlası',
  'Sign up': 'Kaydolun',
  'Start your 10-day free trial. No credit card required.': '10 günlük ücretsiz denemenizi başlatın. Kredi kartı gerekmez.',
  'Configure your agent': 'Ajanınızı yapılandırın',
  'Add your procedures, FAQs, and intake questions using the no-code builder.': 'Kod gerektirmeyen oluşturucuyu kullanarak prosedürlerinizi, SSS\'lerinizi ve kabul sorularınızı ekleyin.',
  'Connect your number': 'Numaranızı bağlayın',
  'Forward your clinic\'s phone number or assign a new one to STOAIX.': 'Kliniğinizin telefon numarasını STOAIX\'e yönlendirin veya yeni bir numara atayın.',
  'Your AI receptionist is active. View every call and lead from your dashboard.': 'AI resepsiyonistiniz aktif. Her aramayı ve lead\'i dashboard\'unuzdan görüntüleyin.',
  'WhatsApp AI chatbot — 24/7': 'WhatsApp AI chatbot — 7/24',
  'Voice AI — inbound 24/7': 'Sesli AI — gelen 7/24',
  '300 min/mo included': 'Ayda 300 dk dahil',
  'Call recording & transcript': 'Çağrı kaydı ve transkript',
  'Voice AI — inbound + outbound': 'Sesli AI — gelen + giden',
  '750 min/mo included': 'Ayda 750 dk dahil',
  'Turkish + English + Arabic': 'Türkçe + İngilizce + Arapça',
  'Multi-location management': 'Çok lokasyon yönetimi',
  'Separate agent per location': 'Lokasyon başına ayrı ajan',
  'White-label (logo, color, domain)': 'Beyaz etiket (logo, renk, domain)',
  '© 2026 STOAIX. All rights reserved.': '© 2026 STOAIX. Tüm hakları saklıdır.',
  'AI Receptionist — Voice, Chat & CRM for Any Business': 'AI Resepsiyonist — Her İşletme için Ses, Chat ve CRM',
  'See full FAQ': 'Tüm SSS\'lere bakın',
});

/* ═══════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════ */
(function initI18n() {
  const path = getPath();

  const DICT_MAP = {
    '/': TR_INDEX,
    '/index': TR_INDEX,
    '/partners': TR_PARTNERS,
    '/healthcare-clinics': TR_HEALTHCARE,
  };

  const dict = DICT_MAP[path] || null;
  const storedLang = localStorage.getItem('stoaix-lang') || 'en';

  function handleToggle(targetLang) {
    localStorage.setItem('stoaix-lang', targetLang);
    window.location.reload();
  }

  function applyTranslation() {
    if (storedLang !== 'tr' || !dict) return;
    translateTree(document.body, dict);
    /* Also translate <title> */
    const t = norm(document.title);
    if (dict[t]) document.title = dict[t];
  }

  /* Run as early as possible to avoid flash */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectToggle(storedLang, handleToggle);
      applyTranslation();
    });
  } else {
    injectToggle(storedLang, handleToggle);
    applyTranslation();
  }
})();
