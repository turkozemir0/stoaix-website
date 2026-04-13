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
  'CRM & Pipeline': 'CRM & Pipeline',
  'Track and score every lead': 'Her lead\'i takip et ve puanla',
  'Integrations': 'Entegrasyonlar',
  'Connect your existing tools': 'Mevcut araçlarını bağla',
  'Pricing': 'Fiyatlandırma',
  'Solutions': 'Çözümler',
  'Healthcare Clinics': 'Sağlık Klinikleri',
  'Hair transplant, dental, aesthetics': 'Saç ekimi, diş, estetik',
  'Partner Program': 'Partner Programı',
  'Earn up to 50% recurring commission': '%50\'ye kadar tekrarlayan komisyon kazan',
  'Log in': 'Giriş yap',
  'Start free trial': 'Ücretsiz deneyin',
  'Product': 'Ürün',
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
  'Agencies & Resellers': 'Ajanslar & Bayiler',
  'White Label': 'Beyaz Etiket',
  'About': 'Hakkımızda',
  'Blog': 'Blog',
  'Careers': 'Kariyer',
  'Privacy Policy': 'Gizlilik Politikası',
  'Terms of Service': 'Kullanım Koşulları',
  'Cookie Policy': 'Çerez Politikası',
  'GDPR': 'KVKK',
  '© 2026 STOAIX Ltd. — London, UK': '© 2026 STOAIX Ltd. — Londra, UK',
  'Made for businesses that refuse to miss a lead.': 'Lead kaçırmayı reddeden işletmeler için.',
  'Monthly': 'Aylık',
  'Annual': 'Yıllık',
  'Save 20%': '%20 Tasarruf',
  'Start free trial': 'Ücretsiz deneyin',
  'Most popular': 'En popüler',
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
  'live in minutes.': 'dakikalar içinde canlı.',
  'Voice calls, WhatsApp, and web chat — fully automated.': 'Sesli aramalar, WhatsApp ve web chat — tamamen otomatik.',
  'No code. No meetings. Works for any business.': 'Kod yok. Toplantı yok. Her işletme için çalışır.',
  'Watch demo': 'Demo izle',
  'Trusted by clinics, agencies, and businesses across': 'Klinikler, ajanslar ve işletmeler tarafından güvenilir',
  '12+ countries': '12+ ülke',
  'Powered by the best. Connects with everything.': 'En iyiler tarafından desteklenir. Her şeyle entegre olur.',
  'What is STOAIX?': 'STOAIX nedir?',
  'Stop missing leads.': 'Lead kaçırmayı bırakın.',
  'Start converting them.': 'Onları dönüştürmeye başlayın.',
  'Every unanswered call is a lead handed to your competitor. STOAIX deploys an AI agent that never sleeps — it picks up every call, replies to every message, and books appointments while you focus on what you do best.': 'Yanıtsız her çağrı, rakibinize gönderilen bir lead\'dir. STOAIX, hiç uyumayan bir AI ajan konuşlandırır — her aramayı alır, her mesajı yanıtlar ve siz en iyi yaptığınıza odaklanırken randevuları düzenler.',
  'See how it works': 'Nasıl çalıştığını gör',
  'Voice AI Receptionist': 'Sesli AI Resepsiyonist',
  'Answers every inbound call in your language, 24/7. Books appointments, answers FAQs, and hands off to your team when needed.': 'Her gelen aramayı kendi dilinizde 7/24 yanıtlar. Randevu alır, SSS\'leri yanıtlar ve gerektiğinde ekibinize devreder.',
  'WhatsApp & Chat Automation': 'WhatsApp & Chat Otomasyonu',
  'The same AI brain across WhatsApp, web chat, and Instagram DM. One knowledge base, every channel covered.': 'WhatsApp, web chat ve Instagram DM\'de aynı AI beyni. Tek bilgi tabanı, tüm kanallar kapsanır.',
  'Smart CRM & Lead Pipeline': 'Akıllı CRM & Lead Pipeline',
  'Every conversation auto-logged. Leads scored, qualified, and routed — without anyone touching a spreadsheet.': 'Her konuşma otomatik kaydedilir. Lead\'ler puanlanır, nitelendirilir ve yönlendirilir — hiç kimse elektronik tabloya dokunmadan.',
  '15+ Languages by Default': 'Varsayılan olarak 15+ Dil',
  'English, Turkish, Arabic, Spanish, French, Russian, German and more. Your AI detects and switches languages automatically — no setup needed.': 'İngilizce, Türkçe, Arapça, İspanyolca, Fransızca, Rusça, Almanca ve daha fazlası. AI\'ınız dilleri otomatik olarak algılar ve değiştirir — kurulum gerekmez.',
  'Works for every business': 'Her işletme için çalışır',
  'AI that': 'AI',
  'talks like your team.': 'ekibiniz gibi konuşur.',
  'Built for': 'İçin yapıldı:',
  'dental clinics.': 'diş klinikleri.',
  'hair transplants.': 'saç ekimi klinikleri.',
  'real estate agencies.': 'gayrimenkul ajansları.',
  'education centers.': 'eğitim merkezleri.',
  'e-commerce brands.': 'e-ticaret markaları.',
  'law firms.': 'hukuk firmaları.',
  'any business.': 'her işletme.',
  'Always answering': '7/24 yanıtlıyor',
  'Auto-detected': 'Otomatik algılama',
  'Time to go live': 'Yayına geçme süresi',
  'Setup fee': 'Kurulum ücreti',
  'Omnichannel': 'Çok Kanallı',
  'Every channel.': 'Her kanal.',
  'One platform.': 'Tek platform.',
  'Your customers reach you however they want. STOAIX handles all of it — from the same dashboard, with the same AI brain.': 'Müşterileriniz size istedikleri şekilde ulaşır. STOAIX hepsini yönetir — aynı dashboard\'dan, aynı AI beyniyle.',
  'WhatsApp': 'WhatsApp',
  'Web Chat': 'Web Chat',
  'Outbound': 'Outbound',
  'Instagram DM': 'Instagram DM',
  'Inbound calls, handled instantly.': 'Gelen aramalar, anında işlenir.',
  'Your AI agent picks up every call — no hold music, no voicemail. It answers questions, takes appointment requests, and transfers to your team only when necessary. Works in 15+ languages out of the box — detects the caller\'s language automatically.': 'AI ajanınız her aramayı alır — bekleme müziği yok, sesli mesaj yok. Soruları yanıtlar, randevu talepleri alır ve yalnızca gerektiğinde ekibinize devreder. Kutudan çıktığı gibi 15+ dilde çalışır — arayanın dilini otomatik algılar.',
  'Instant pickup, zero hold time': 'Anında bağlanma, sıfır bekleme süresi',
  'Full call recording + transcript': 'Tam çağrı kaydı + transkript',
  'Smart handoff — human when needed': 'Akıllı devir — gerektiğinde insana',
  'Appointment booking included': 'Randevu rezervasyonu dahil',
  'Incoming call': 'Gelen arama',
  'Appointment booked': 'Randevu alındı',
  'CRM updated': 'CRM güncellendi',
  'WhatsApp automation that feels human.': 'İnsan gibi hissettiren WhatsApp otomasyonu.',
  'The same AI knowledge base — now in your customers\' most-used app. Handle price inquiries, FAQs, document collection, and appointment confirmations over WhatsApp, 24/7.': 'Aynı AI bilgi tabanı — şimdi müşterilerinizin en çok kullandığı uygulamada. Fiyat sorguları, SSS\'ler, belge toplama ve randevu onaylarını WhatsApp üzerinden 7/24 yönetin.',
  'Official WhatsApp Business API': 'Resmi WhatsApp Business API',
  'Media & document collection': 'Medya ve belge toplama',
  'Multilingual auto-detection': 'Çok dilli otomatik algılama',
  'Human handoff in 1 tap': '1 dokunuşta insana devir',
  'Online': 'Çevrimiçi',
  'Convert website visitors into booked leads.': 'Web sitesi ziyaretçilerini rezervasyonlu lead\'lere dönüştürün.',
  'A smart chat widget on your site that does more than answer questions — it qualifies visitors, collects their details, and books appointments directly in your calendar.': 'Sitenizde yalnızca soru yanıtlamaktan fazlasını yapan akıllı bir chat widget\'ı — ziyaretçileri nitelendirir, bilgilerini toplar ve doğrudan takviminize randevu ekler.',
  '1-line embed, any website': '1 satır kod, her web sitesi',
  'Lead qualification built-in': 'Dahili lead nitelendirme',
  'Calendar integration': 'Takvim entegrasyonu',
  'Fully branded to your business': 'İşletmenize özel marka',
  'AI Assistant': 'AI Asistan',
  'Hi! I\'m here to help. What are you looking for today?': 'Merhaba! Yardımcı olmak için buradayım. Bugün ne arıyorsunuz?',
  'Treatment prices': 'Tedavi fiyatları',
  'Book appointment': 'Randevu al',
  'Find us': 'Bizi bul',
  'Your AI calls leads before your competitor does.': 'AI\'ınız, lead\'leri rakibinizden önce arar.',
  'New lead comes in at midnight? Your AI agent calls them back within 60 seconds. Set up automated outbound sequences for lead follow-up, appointment reminders, and reactivation campaigns.': 'Gece yarısı yeni bir lead mi geldi? AI ajanınız onları 60 saniye içinde geri arar. Lead takibi, randevu hatırlatıcıları ve yeniden aktivasyon kampanyaları için otomatik outbound dizileri kurun.',
  'First call within 60 seconds': 'İlk arama 60 saniye içinde',
  'Automated follow-up sequences': 'Otomatik takip dizileri',
  'Old lead reactivation': 'Eski lead yeniden aktivasyonu',
  'No-show prevention reminders': 'Gelmeme önleme hatırlatıcıları',
  'Outbound Campaign': 'Outbound Kampanya',
  'Leads dialled': 'Aranan lead\'ler',
  'Connected': 'Bağlandı',
  'Booked': 'Rezervasyon',
  'Lead created — 11:47 PM': 'Lead oluşturuldu — 23:47',
  'AI call placed — 11:47 PM (60s later)': 'AI araması yapıldı — 23:47 (60s sonra)',
  'Voicemail left — 11:48 PM': 'Sesli mesaj bırakıldı — 23:48',
  'Follow-up SMS — 9:00 AM': 'Takip SMS\'i — 09:00',
  'WhatsApp — Day 3': 'WhatsApp — 3. Gün',
  'Turn DMs into booked appointments.': 'DM\'leri rezervasyonlu randevulara dönüştürün.',
  'Instagram DMs are your highest-intent leads — and most businesses reply hours later. STOAIX responds instantly, qualifies the lead, and moves them toward booking before they check a competitor.': 'Instagram DM\'leri en yüksek niyetli lead\'lerinizdir — ve çoğu işletme saatler sonra yanıtlar. STOAIX anında yanıt verir, lead\'i nitelendirir ve bir rakibe bakmadan önce rezervasyona yönlendirir.',
  'Instant DM responses': 'Anında DM yanıtları',
  'Story reply automation': 'Story yanıt otomasyonu',
  'Link to WhatsApp or booking page': 'WhatsApp veya rezervasyon sayfasına bağlantı',
  'Lead captured to CRM automatically': 'Lead otomatik olarak CRM\'e kaydedilir',
  'Live Demo': 'Canlı Demo',
  'See it in action.': 'Çalışırken görün.',
  'Try STOAIX live — ask it anything, book an appointment, hear the voice. No signup required.': 'STOAIX\'i canlı deneyin — her şeyi sorun, randevu alın, sesi dinleyin. Kayıt gerekmez.',
  'Coming Soon': 'Yakında',
  'Interactive Voice Demo': 'İnteraktif Sesli Demo',
  'Speak with STOAIX\'s AI agent live — no signup required. Ask questions, hear the voice, book an appointment in real time.': 'STOAIX\'in AI ajanıyla canlı konuşun — kayıt gerekmez. Sorular sorun, sesi dinleyin, gerçek zamanlı randevu alın.',
  'Platform': 'Platform',
  'Built for results,': 'Sonuçlar için tasarlandı,',
  'not complexity.': 'karmaşıklık için değil.',
  'A clean dashboard that gives you everything you need — calls, leads, conversations, and performance — in one place.': 'Tüm ihtiyaçlarınızı tek bir yerde sunan temiz bir dashboard — aramalar, lead\'ler, konuşmalar ve performans.',
  'Dashboard Overview': 'Dashboard Genel Bakış',
  'CRM Pipeline': 'CRM Pipeline',
  'Call Transcript': 'Çağrı Transkripti',
  'Effortless setup': 'Kolay kurulum',
  'Live in 5 minutes.': '5 dakikada canlı.',
  'No engineer needed.': 'Mühendis gerekmez.',
  'Tell us about your business': 'İşletmenizi bize anlatın',
  'Answer a few questions. Paste your FAQs or let our AI generate them from your website. Your knowledge base is ready instantly.': 'Birkaç soruyu yanıtlayın. SSS\'lerinizi yapıştırın veya AI\'ımızın web sitenizden oluşturmasına izin verin. Bilgi tabanınız anında hazır.',
  'Configure your AI agent': 'AI ajanınızı yapılandırın',
  'Choose your agent\'s name, voice, and channels. Set your booking rules and handoff conditions. All without writing a single line of code.': 'Ajanınızın adını, sesini ve kanallarını seçin. Rezervasyon kurallarınızı ve devir koşullarınızı belirleyin. Tek bir satır kod yazmadan.',
  'Go live': 'Yayına geçin',
  'Forward your number. Add the chat widget. Connect WhatsApp. Your AI agent is answering calls and messages — right now.': 'Numaranızı yönlendirin. Chat widget\'ını ekleyin. WhatsApp\'ı bağlayın. AI ajanınız aramaları ve mesajları şu anda yanıtlıyor.',
  'Simple, transparent pricing.': 'Basit, şeffaf fiyatlandırma.',
  'Start free. Scale when you\'re ready. No contracts, cancel anytime.': 'Ücretsiz başlayın. Hazır olduğunuzda büyütün. Sözleşme yok, istediğiniz zaman iptal edin.',
  'WhatsApp & web chat to get started': 'Başlamak için WhatsApp ve web chat',
  'Add Voice AI to your channels': 'Kanallarınıza Sesli AI ekleyin',
  'Full system. Outbound included.': 'Tam sistem. Outbound dahil.',
  'Manage multiple clients from one dashboard': 'Birden fazla müşteriyi tek dashboarddan yönetin',
  'WhatsApp AI chatbot': 'WhatsApp AI chatbot',
  'Web chat widget': 'Web chat widget',
  'Knowledge base (30 FAQs)': 'Bilgi tabanı (30 SSS)',
  'CRM lite — lead pipeline': 'CRM lite — lead pipeline',
  '2 users': '2 kullanıcı',
  'Email support': 'E-posta desteği',
  'Everything in Lite': 'Lite\'taki her şey',
  'Voice AI — inbound calls': 'Sesli AI — gelen aramalar',
  '300 minutes/mo included': 'Ayda 300 dakika dahil',
  'Call recording + transcript': 'Çağrı kaydı + transkript',
  '5 users': '5 kullanıcı',
  'Priority email support': 'Öncelikli e-posta desteği',
  'Everything in Plus': 'Plus\'taki her şey',
  'Voice AI — inbound + outbound': 'Sesli AI — gelen + giden',
  '750 minutes/mo included': 'Ayda 750 dakika dahil',
  '15+ languages (auto-detected)': '15+ dil (otomatik algılama)',
  'Unlimited knowledge base': 'Sınırsız bilgi tabanı',
  'Advanced CRM + lead scoring': 'Gelişmiş CRM + lead puanlama',
  'Zapier / Make / Webhook': 'Zapier / Make / Webhook',
  '10 users': '10 kullanıcı',
  'Monthly performance report': 'Aylık performans raporu',
  'Everything in Advanced': 'Advanced\'taki her şey',
  'Multi-org management': 'Çok org yönetimi',
  'Reseller dashboard': 'Bayi dashboard\'u',
  'White-label ready': 'Beyaz etiket hazır',
  'Unlimited users': 'Sınırsız kullanıcı',
  'Early feature access': 'Erken özellik erişimi',
  'Priority technical support': 'Öncelikli teknik destek',
  'Voice AI usage: $0.15/min after plan limit · ': 'Sesli AI kullanımı: Plan limitinden sonra $0.15/dk · ',
  'All plans: 7-day free trial, no credit card · ': 'Tüm planlar: 7 günlük ücretsiz deneme, kredi kartı yok · ',
  'Annual billing saves 20%': 'Yıllık faturalama %20 tasarruf sağlar',
  'Partners & White Label': 'Partnerler & Beyaz Etiket',
  'Build your own': 'Kendinizinkini kurun',
  'AI business.': 'AI işletmesi.',
  'Sell STOAIX under your own brand. White-label our platform, set your own prices, keep the margin. Perfect for agencies, consultants, and resellers worldwide.': 'STOAIX\'i kendi markanız altında satın. Platformumuzu beyaz etiketleyin, kendi fiyatlarınızı belirleyin, marjı tutun. Ajanslar, danışmanlar ve dünya genelindeki bayiler için mükemmel.',
  'Your brand, zero dev cost': 'Markanız, sıfır geliştirme maliyeti',
  'Custom domain, logo, agent name — STOAIX invisible': 'Özel domain, logo, ajan adı — STOAIX görünmez',
  '~40% margin per client': 'Müşteri başına ~%40 marj',
  '10 Advanced clients = ~$1,200/mo recurring profit': '10 Advanced müşteri = ~1.200$/ay tekrarlayan kâr',
  'Sell globally': 'Globalde sat',
  'No geography limits. Any sector. Any language.': 'Coğrafi sınır yok. Her sektör. Her dil.',
  'Become a partner': 'Partner ol',
  'Example: 10 Advanced clients': 'Örnek: 10 Advanced müşteri',
  'STOAIX wholesale (10 × $149)': 'STOAIX toptan (10 × $149)',
  'Your platform fee': 'Platform ücretiniz',
  'Your revenue (10 × $299)': 'Geliriniz (10 × $299)',
  'Net profit': 'Net kâr',
  '+ Activation fee: $1,497 one-time': '+ Aktivasyon ücreti: $1.497 tek seferlik',
  'Your AI receptionist is': 'AI resepsiyonistiniz',
  'one signup away.': 'bir kayıt uzağınızda.',
  '7-day free trial. No credit card. Set up in minutes.': '7 günlük ücretsiz deneme. Kredi kartı yok. Dakikalar içinde kurulum.',
  'Start your free trial': 'Ücretsiz denemenizi başlatın',
  'Talk to sales': 'Satışla görüşün',
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
  'Partner Program — STOAIX | Earn Recurring Revenue Selling AI Automation': 'Partner Programı — STOAIX | AI Otomasyonu Satarak Tekrarlayan Gelir Elde Et',
  'Partner Program — Now Open': 'Partner Programı — Şimdi Açık',
  'Sell AI automation.': 'AI otomasyonu satın.',
  'Earn recurring revenue.': 'Tekrarlayan gelir elde edin.',
  'Refer, resell, or white-label STOAIX. Earn up to 50% recurring commission on every client you bring in — no technical background required.': 'STOAIX\'i yönlendirin, yeniden satın veya beyaz etiketleyin. Getirdiğiniz her müşteriden %50\'ye kadar tekrarlayan komisyon kazanın — teknik bilgi gerekmez.',
  'Apply to Partner Program': 'Partner Programına Başvurun',
  'See commission tiers': 'Komisyon kademelerini görün',
  '$0 to join · No technical skills required · Recurring commissions': 'Katılım ücreti $0 · Teknik beceri gerekmez · Tekrarlayan komisyonlar',
  'Max recurring commission': 'Maks. tekrarlayan komisyon',
  'Partner tiers': 'Partner kademeleri',
  'Cost to join': 'Katılım maliyeti',
  'Languages supported': 'Desteklenen diller',
  'Who it\'s for': 'Kimler için',
  'Two ways to partner with STOAIX': 'STOAIX ile ortaklık kurmanın iki yolu',
  'Whether you want to refer clients casually or build a full AI agency business, there\'s a tier for you.': 'İster müşterileri rahat bir şekilde yönlendirmek isteyin ister tam bir AI ajans işi kurmak isteyin, sizin için bir kademe var.',
  'Affiliate / Referral Partner': 'Affiliate / Referral Partner',
  'You have a network — clients, followers, or contacts who need AI automation. Refer them and earn recurring commission every month they stay.': 'Bir ağınız var — AI otomasyonuna ihtiyaç duyan müşteriler, takipçiler veya kişiler. Onları yönlendirin ve her ay aktif kaldıkları sürece tekrarlayan komisyon kazanın.',
  'Start earning from the very first referral': 'İlk yönlendirmeden itibaren kazanmaya başlayın',
  '10–25% recurring commission (rises with volume)': '%10–25 tekrarlayan komisyon (hacimle artar)',
  'STOAIX handles all onboarding and support': 'STOAIX tüm onboarding ve desteği yönetir',
  'Great for: consultants, coaches, business networks': 'Şunlar için ideal: danışmanlar, koçlar, iş ağları',
  'Agency / White-Label Partner': 'Ajans / Beyaz Etiket Partner',
  'Build your own AI agency on top of STOAIX infrastructure. Sell under your brand, manage multiple clients from one dashboard, keep the margin.': 'STOAIX altyapısı üzerinde kendi AI ajansınızı kurun. Markanız altında satın, birden fazla müşteriyi tek dashboarddan yönetin, marjı tutun.',
  'Up to 50% recurring commission': '%50\'ye kadar tekrarlayan komisyon',
  'White-label: your logo, your domain, your brand': 'Beyaz etiket: logonuz, domaininiz, markanız',
  'Multi-client dashboard (Agency plan: $499/mo)': 'Çok müşterili dashboard (Agency planı: $499/ay)',
  'Great for: digital agencies, AI consultants, resellers': 'Şunlar için ideal: dijital ajanslar, AI danışmanları, bayiler',
  'Why STOAIX': 'Neden STOAIX',
  'Your clients save $400–$600/month vs. building it themselves': 'Müşterileriniz, kendileri kurmayla karşılaştırıldığında ayda $400–$600 tasarruf eder',
  'The typical AI agency stack (VAPI + GHL + Make/N8N) costs $800–$1,000/mo and takes weeks to set up. STOAIX Agency is $499/mo — everything included, live in minutes.': 'Tipik AI ajans altyapısı (VAPI + GHL + Make/N8N) $800–$1.000/ay maliyetli ve kurulması haftalar alır. STOAIX Agency $499/ay — her şey dahil, dakikalar içinde canlı.',
  'Feature': 'Özellik',
  'Monthly cost': 'Aylık maliyet',
  'Voice AI': 'Sesli AI',
  'WhatsApp + Web Chat': 'WhatsApp + Web Chat',
  'CRM + Pipeline': 'CRM + Pipeline',
  'Multi-client management': 'Çok müşteri yönetimi',
  'Setup time': 'Kurulum süresi',
  'Languages': 'Diller',
  'VAPI — separate billing, usage caps': 'VAPI — ayrı faturalama, kullanım limitleri',
  'Included — inbound + outbound': 'Dahil — gelen + giden',
  'Extra integration + cost': 'Ek entegrasyon + maliyet',
  'Included — same knowledge base': 'Dahil — aynı bilgi tabanı',
  'GHL subscription required': 'GHL aboneliği gerekli',
  'Built-in — lead scoring + follow-up': 'Dahili — lead puanlama + takip',
  'Manual per-client setup': 'Müşteri başına manuel kurulum',
  'Reseller dashboard — one panel': 'Bayi dashboard\'u — tek panel',
  '2–4 weeks per client': 'Müşteri başına 2–4 hafta',
  'Under 5 minutes — self-serve': '5 dakikadan az — self-servis',
  'Manual prompt engineering': 'Manuel prompt mühendisliği',
  '15+ languages — native support': '15+ dil — yerel destek',
  'Commission structure': 'Komisyon yapısı',
  '6 tiers. The more you sell, the more you keep.': '6 kademe. Ne kadar çok satarsanız, o kadar çok kazanırsınız.',
  'Commission is recurring — you earn every month your referred clients stay active. Higher tiers unlock with volume and optional training.': 'Komisyon tekrarlayandır — yönlendirdiğiniz müşteriler aktif kaldığı her ay kazanırsınız. Daha yüksek kademeler hacim ve isteğe bağlı eğitimle açılır.',
  'Tier': 'Kademe',
  'Commission': 'Komisyon',
  'Requirement': 'Gereksinim',
  'Training unlock': 'Eğitim kilidi açma',
  'Starting tier — anyone can join': 'Başlangıç kademesi — herkes katılabilir',
  'Active referrals generating MRR': 'MRR üreten aktif yönlendirmeler',
  'Consistent sales track record': 'Tutarlı satış sicili',
  'High-retention partner': 'Yüksek tutma oranı partneri',
  'City/region exclusivity granted': 'Şehir/bölge münhasırlığı verildi',
  'Top-performing partners only': 'Yalnızca en iyi performans gösteren partnerler',
  'Max 15% with free training': 'Ücretsiz eğitimle maks. %15',
  'Max 25% with Starter training': 'Starter eğitimle maks. %25',
  'Max 35% with Pro training': 'Pro eğitimle maks. %35',
  'Max 50% with Elite training': 'Elite eğitimle maks. %50',
  'Exclusivity + volume bonuses': 'Münhasırlık + hacim bonusları',
  'Maximum recurring commission': 'Maksimum tekrarlayan komisyon',
  'First referral': 'İlk yönlendirme',
  '3+ active clients': '3+ aktif müşteri',
  '10+ active clients': '10+ aktif müşteri',
  '25+ active clients': '25+ aktif müşteri',
  'Proven volume + approval': 'Kanıtlanmış hacim + onay',
  'Elite training + performance': 'Elite eğitim + performans',
  'Free training available': 'Ücretsiz eğitim mevcut',
  'Starter training ($49.99)': 'Starter eğitimi ($49.99)',
  'Pro training ($497)': 'Pro eğitimi ($497)',
  'Elite training ($749)': 'Elite eğitimi ($749)',
  'Elite training required': 'Elite eğitimi gerekli',
  'Process': 'Süreç',
  'Three steps to your first commission': 'İlk komisyonunuza üç adım',
  'No technical setup. No waiting weeks. You find clients — we handle everything else.': 'Teknik kurulum yok. Haftalarca bekleme yok. Müşterileri siz bulun — geri kalanını biz hallederiz.',
  'Apply & get approved': 'Başvurun ve onaylanın',
  'Email us or fill the application. We review within 48 hours. You\'ll get a partner dashboard, referral link, and sales materials.': 'Bize e-posta gönderin veya başvuruyu doldurun. 48 saat içinde değerlendiririz. Bir partner dashboard\'u, yönlendirme bağlantısı ve satış materyalleri alacaksınız.',
  'Refer or sell': 'Yönlendirin veya satın',
  'Share your link or run the sales call yourself. STOAIX handles onboarding, support, and technical setup — you just connect the client.': 'Bağlantınızı paylaşın veya satış görüşmesini kendiniz yapın. STOAIX onboarding, destek ve teknik kurumu yönetir — siz yalnızca müşteriyi bağlarsınız.',
  'Earn every month': 'Her ay kazanın',
  'Commission is paid monthly, recurring for as long as the client stays active. Volume bonuses, upsell bonuses, and retention bonuses on top.': 'Komisyon aylık ödenir, müşteri aktif kaldığı sürece tekrarlanır. Üstüne hacim bonusları, upsell bonusları ve tutma bonusları.',
  'Training': 'Eğitim',
  'Learn to sell AI — unlock higher commission caps': 'AI satmayı öğrenin — daha yüksek komisyon limitlerini açın',
  'Optional training tracks teach you how to position AI automation, run discovery calls, and close deals. Each level raises your maximum commission cap.': 'İsteğe bağlı eğitim parçaları, AI otomasyonunu nasıl konumlandıracağınızı, keşif görüşmeleri nasıl yürüteceğinizi ve anlaşmaları nasıl kapatacağınızı öğretir. Her seviye maksimum komisyon limitinizi artırır.',
  'Commission cap': 'Komisyon limiti',
  'Up to 15%': '%15\'e kadar',
  'Up to 25%': '%25\'e kadar',
  'Up to 35%': '%35\'e kadar',
  'Up to 50%': '%50\'ye kadar',
  'Partner onboarding guide': 'Partner onboarding rehberi',
  'Product overview videos': 'Ürün genel bakış videoları',
  'Sales deck template': 'Satış sunumu şablonu',
  'Referral link + dashboard': 'Yönlendirme bağlantısı + dashboard',
  'Everything in Free': 'Ücretsiz\'deki her şey',
  'Discovery call framework': 'Keşif görüşmesi çerçevesi',
  'Objection handling scripts': 'İtiraz yönetimi senaryoları',
  'Sector-specific pitch guides': 'Sektöre özel pitch rehberleri',
  'Everything in Starter': 'Starter\'daki her şey',
  'Live Zoom training sessions': 'Canlı Zoom eğitim oturumları',
  'Demo account access': 'Demo hesap erişimi',
  'Close-rate improvement program': 'Kapanma oranı iyileştirme programı',
  'Everything in Pro': 'Pro\'daki her şey',
  '1-on-1 strategy sessions': 'Birebir strateji oturumları',
  'White-label setup support': 'Beyaz etiket kurulum desteği',
  'Regional exclusivity eligible': 'Bölgesel münhasırlık hakkı',
  'Bonuses': 'Bonuslar',
  'Commission is just the base. Bonuses stack on top.': 'Komisyon yalnızca tabandır. Bonuslar üst üste eklenir.',
  'High performers earn additional bonuses on speed, volume, retention, and upsells — on top of the base recurring commission.': 'Yüksek performanslı çalışanlar, temel tekrarlayan komisyonun üstüne hız, hacim, tutma ve upsell bonusları kazanır.',
  'Speed Bonus': 'Hız Bonusu',
  'Close 3 clients in the first 30 days and earn a one-time $500 activation bonus. Rewards momentum at launch.': 'İlk 30 günde 3 müşteriyi kapatın ve tek seferlik $500 aktivasyon bonusu kazanın. Başlangıçtaki ivmeyi ödüllendirir.',
  'Volume Bonus': 'Hacim Bonusu',
  'Reach 10, 25, and 50 active clients to unlock tiered volume bonuses. The more clients you manage, the higher the multiplier.': '10, 25 ve 50 aktif müşteriye ulaşarak kademeli hacim bonusları açın. Ne kadar çok müşteri yönetirseniz, çarpan o kadar yüksek olur.',
  'Retention Bonus': 'Tutma Bonusu',
  'Clients who stay 6+ months earn you a loyalty bonus. Incentivizes quality placements over churn-prone quick closes.': '6+ ay kalan müşteriler size sadakat bonusu kazandırır. Kayıp oranı yüksek hızlı kapanmalar yerine kaliteli yerleştirmeleri teşvik eder.',
  'Upsell Bonus': 'Upsell Bonusu',
  'When a client you referred upgrades their plan (e.g. Lite → Advanced → Agency), you earn a percentage of the incremental MRR.': 'Yönlendirdiğiniz bir müşteri planını yükselttiğinde (örn. Lite → Advanced → Agency), artımlı MRR\'nin bir yüzdesini kazanırsınız.',
  'Ready to earn recurring revenue from AI?': 'AI\'dan tekrarlayan gelir elde etmeye hazır mısınız?',
  'Applications take 2 minutes. Approval within 48 hours. Start referring the same day.': 'Başvurular 2 dakika sürer. 48 saat içinde onay. Aynı gün yönlendirmeye başlayın.',
  'Apply Now': 'Şimdi Başvurun',
  'Ask a question': 'Soru sorun',
});

/* ─── Healthcare Clinics page ────────────────────────────── */
const TR_HEALTHCARE = Object.assign({}, TR_COMMON, {
  'Built for healthcare clinics': 'Sağlık klinikleri için tasarlandı',
  'Your AI receptionist,': 'AI resepsiyonistiniz,',
  'Answers every call 24/7 in Turkish, English, and Arabic. Qualifies patients, books consultations, and follows up on cold leads — all without a single meeting with us.': 'Türkçe, İngilizce ve Arapça olarak 7/24 her aramayı yanıtlar. Hastaları nitelendirir, konsültasyon alır ve soğuk lead\'leri takip eder — bizimle tek bir toplantı bile olmadan.',
  'Start 10-day free trial': '10 günlük ücretsiz denemeye başlayın',
  'See pricing': 'Fiyatlandırmaya bak',
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
  'STOAIX is a self-serve platform. You sign up, configure your AI agent using the guided setup — no code, no meetings — and it\'s live on your clinic\'s number in minutes.': 'STOAIX bir self-servis platformdur. Kaydolun, rehberli kurulum kullanarak AI ajanınızı yapılandırın — kod yok, toplantı yok — ve dakikalar içinde kliniğinizin numarasında canlı.',
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
  'Voice, chat, CRM, and follow-up — in one self-serve platform. No separate tools. No integrations to stitch together.': 'Ses, chat, CRM ve takip — tek bir self-servis platformda. Ayrı araçlar yok. Birbirine bağlamak için entegrasyonlar yok.',
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
  'Gulf and Middle East patients — a major underserved segment': 'Körfez ve Orta Doğu hastaları — büyük bir yetersiz hizmet alan segment',
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
