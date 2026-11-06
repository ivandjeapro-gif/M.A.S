/* =========================================================
   Helpers UI partagés
   ========================================================= */

const appRoot = document.getElementById('app');
const modalRoot = document.getElementById('modal-root');
const toastRoot = document.getElementById('toast-root');

const state = {
  slots: PLANNED_SLOTS.map((s) => ({ ...s })),
  selectedDay: '2026-11-09',
  calendarMonth: 0,
  agendaMode: 'modules',
  chooserOpen: false,
  chooserModule: '05',
  chooserFilter: 'all',
  chooserQuery: '',
  chooserNewSlot: false,
  catalogue: { q: '', audience: 'tous', domains: [], levels: [], formats: [], sort: 'recommended' },
  lessonTab: 'retenir',
  quizChoice: '1800',
  lessonDone: false,
  notes: ['09:42 · Penser à déduire les arrêts de maintenance avant de calculer la capacité.'],
  resultsTab: 'overview',
};

function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function money(n) {
  return n.toLocaleString('fr-FR').replace(/\u202f|\u00a0/g, ' ');
}

function getCourse(id) {
  return COURSES.find((c) => c.id === id) || COURSES[0];
}

function userAvatar(extra = '') {
  return `<div class="user-avatar ${extra}" aria-hidden="true"><img src="assets/img/avatar-aminata.jpg" alt="" /></div>`;
}

/* ---------- Header / footer publics ---------- */
function siteHeader(active = '') {
  const item = (key, label, href) =>
    `<a href="${href}" class="${active === key ? 'is-active' : ''}">${label}</a>`;
  return `
    <header class="site-header">
      <div class="container site-header__inner">
        <a class="brand" href="#/"><img src="assets/img/logo.png" alt="BAOBAB Mine Academy" /></a>
        <nav class="site-nav">
          ${item('accueil', 'Accueil', '#/')}
          ${item('formations', 'Formations', '#/catalogue')}
          ${item('approche', 'Notre approche', '#/?scroll=pedagogie')}
          ${item('direct', 'Sessions en direct', '#/sessions')}
        </nav>
        <div class="site-header__actions">
          <a class="site-header__login" href="${isAuthed() ? '#/app' : '#/connexion'}">${isAuthed() ? 'Mon espace' : 'Se connecter'}</a>
          <a class="btn btn-navy" href="#/catalogue">Explorer les formations ${icon('arrow-up-right')}</a>
        </div>
      </div>
    </header>`;
}

function siteFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="site-footer__top">
          <div class="site-footer__brand">
            <img src="assets/img/logo.png" alt="BAOBAB Mine Academy" />
            <p class="site-footer__baseline">${esc(BRAND.baseline)}</p>
          </div>
          <nav class="site-footer__links">
            <a href="#/?scroll=pedagogie">À propos</a>
            <a href="#/" data-contact="Nous contacter">Nous contacter</a>
            <a href="#/?scroll=faq">Aide &amp; FAQ</a>
          </nav>
        </div>
        <div class="site-footer__bottom">
          <span>${esc(BRAND.demo)}</span>
          <div class="site-footer__legal">
            <span>© 2026 BAOBAB Mine Academy</span>
            <a href="#/" data-info="Confidentialité">Confidentialité</a>
            <a href="#/" data-info="Conditions d’utilisation">Conditions d’utilisation</a>
          </div>
        </div>
      </div>
    </footer>`;
}

/* ---------- Modales ---------- */
let lastFocused = null;
function openModal(html, className = '') {
  lastFocused = document.activeElement;
  modalRoot.innerHTML = `<div class="overlay" data-overlay><div class="modal ${className}">${html}</div></div>`;
  const overlay = modalRoot.querySelector('[data-overlay]');
  overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) closeModal(); });
  overlay.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', closeModal));
  document.body.style.overflow = 'hidden';
  const focusable = overlay.querySelector('button, [href], input, select');
  if (focusable) focusable.focus({ preventScroll: true });
}

function closeModal() {
  modalRoot.innerHTML = '';
  document.body.style.overflow = '';
  if (lastFocused && document.contains(lastFocused)) lastFocused.focus({ preventScroll: true });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    const pop = document.querySelector('.day-pop');
    if (pop) pop.remove();
    const ctx = document.querySelector('.ctx-menu');
    if (ctx) ctx.remove();
  }
});

function toast(message) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  toastRoot.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function navigate(hash) {
  if (location.hash === hash) router();
  else location.hash = hash;
}

/* ---------- Menus ancrés (notifications, compte) ---------- */
function anchorMenu(anchor, html) {
  document.querySelectorAll('.ctx-menu').forEach((m) => m.remove());
  const menu = document.createElement('div');
  menu.className = 'ctx-menu ctx-menu--plain';
  menu.innerHTML = html;
  document.body.appendChild(menu);
  const rect = anchor.getBoundingClientRect();
  const width = menu.offsetWidth || 248;
  const left = Math.min(Math.max(12, rect.right - width), window.innerWidth - width - 12);
  menu.style.left = `${left + window.scrollX}px`;
  menu.style.top = `${rect.bottom + window.scrollY + 8}px`;
  setTimeout(() => {
    document.addEventListener('click', function onDoc(ev) {
      if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener('click', onDoc); }
    });
  });
  return menu;
}

function bindTopbar() {
  const search = document.getElementById('top-search');
  if (search) search.addEventListener('click', openSearchModal);
  const bell = document.getElementById('top-bell');
  if (bell) bell.addEventListener('click', () => openNotifications(bell));
  const avatar = document.getElementById('top-avatar');
  if (avatar) avatar.addEventListener('click', () => openUserMenu(avatar));
  const sideUser = document.getElementById('side-user');
  if (sideUser) sideUser.addEventListener('click', () => openUserMenu(sideUser));
}

/* ---------- Recherche globale ---------- */
function searchResults(query) {
  const q = query.trim().toLowerCase();
  const pages = [
    { label: 'Tableau de bord', href: '#/app', icon: 'grid' },
    { label: 'Mes formations', href: '#/app/formations', icon: 'book' },
    { label: 'Catalogue des formations', href: '#/catalogue', icon: 'search' },
    { label: 'Agenda personnel', href: '#/app/agenda', icon: 'calendar' },
    { label: 'Sessions en direct', href: '#/sessions', icon: 'video' },
    { label: 'Agenda des directs', href: '#/app/agenda?mode=live&day=2026-11-12', icon: 'calendar' },
    { label: 'Quiz de parcours', href: '#/app/resultats?tab=quizzes', icon: 'award' },
    { label: 'Résultats & certificats', href: '#/app/resultats', icon: 'medal' },
  ].filter((p) => !q || p.label.toLowerCase().includes(q));
  const courses = COURSES.filter((c) => !q
    || `${c.title} ${c.category} ${INSTRUCTORS[c.instructor].name}`.toLowerCase().includes(q));
  if (!pages.length && !courses.length) {
    return '<p class="search-empty">Aucun résultat. Essayez un autre mot-clé.</p>';
  }
  return `
    ${courses.length ? `<p class="search-group">Formations</p>${courses.map((c) => `
      <a class="search-item" href="#/formation/${c.id}">
        <span class="search-item__icon">${icon('book')}</span>
        <div><b>${esc(c.title)}</b><span>${esc(c.category)} · ${c.hours} h · ${esc(INSTRUCTORS[c.instructor].name)}</span></div>
        <span class="search-item__type">Formation</span>
      </a>`).join('')}` : ''}
    ${pages.length ? `<p class="search-group">Mon espace</p>${pages.map((p) => `
      <a class="search-item" href="${p.href}">
        <span class="search-item__icon">${icon(p.icon)}</span>
        <div><b>${esc(p.label)}</b><span>Accès direct</span></div>
        <span class="search-item__type">Page</span>
      </a>`).join('')}` : ''}`;
}

function openSearchModal() {
  openModal(`
    <div class="modal__head">
      <div><span class="eyebrow">Recherche</span><h2>Où voulez-vous aller ?</h2><p>Formations, pages de votre espace et sessions en direct.</p></div>
      <button class="modal__close" data-close aria-label="Fermer">${icon('x')}</button>
    </div>
    <div class="modal__body">
      <div class="chooser__search" style="margin-top:0">${icon('search')}<input class="field" id="global-search" placeholder="Une formation, une page, un formateur…" autocomplete="off" /></div>
      <div class="search-results" id="search-results">${searchResults('')}</div>
    </div>`, 'modal--narrow');
  const input = document.getElementById('global-search');
  input.focus();
  input.addEventListener('input', () => {
    document.getElementById('search-results').innerHTML = searchResults(input.value);
  });
  document.getElementById('search-results').addEventListener('click', (e) => {
    if (e.target.closest('a')) closeModal();
  });
}

/* ---------- Notifications & compte ---------- */
function openNotifications(anchor) {
  const menu = anchorMenu(anchor, `
    <div class="ctx-menu__label">Notifications</div>
    <button data-notif="live"><span class="menu-ico">${icon('video')}</span><span><b>Direct du 12 novembre</b><small>Inscription confirmée · 18:00 GMT</small></span></button>
    <button data-notif="quiz"><span class="menu-ico">${icon('award')}</span><span><b>Quiz Production &amp; suivi</b><small>En cours · à terminer</small></span></button>
    <button data-notif="cert"><span class="menu-ico">${icon('medal')}</span><span><b>Certificat HSE disponible</b><small>Émis le 28 octobre 2026</small></span></button>
    <button data-notif="read" class="ctx-menu__foot">Tout marquer comme lu</button>`);
  menu.querySelector('[data-notif="live"]').addEventListener('click', () => { menu.remove(); navigate('#/app/agenda?mode=live&day=2026-11-12'); });
  menu.querySelector('[data-notif="quiz"]').addEventListener('click', () => { menu.remove(); navigate('#/app/resultats?tab=quizzes'); });
  menu.querySelector('[data-notif="cert"]').addEventListener('click', () => { menu.remove(); navigate('#/app/resultats?tab=certs'); });
  menu.querySelector('[data-notif="read"]').addEventListener('click', () => { menu.remove(); toast('Notifications marquées comme lues.'); });
}

function openUserMenu(anchor) {
  const menu = anchorMenu(anchor, `
    <div class="ctx-menu__label">${esc(USER.first)} ${esc(USER.last)} · ${esc(USER.role)}</div>
    <button data-user="profile"><span class="menu-ico">${icon('users')}</span><span><b>Mon profil</b><small>Compte et préférences</small></span></button>
    <button data-user="formations"><span class="menu-ico">${icon('book')}</span><span><b>Mes formations</b><small>Vos parcours en cours</small></span></button>
    <button data-user="results"><span class="menu-ico">${icon('medal')}</span><span><b>Mes résultats</b><small>Quiz, examen et certificats</small></span></button>
    <button data-user="logout"><span class="menu-ico">${icon('arrow-left')}</span><span><b>Se déconnecter</b><small>Revenir au site public</small></span></button>`);
  menu.querySelector('[data-user="profile"]').addEventListener('click', () => { menu.remove(); openProfileModal(); });
  menu.querySelector('[data-user="formations"]').addEventListener('click', () => { menu.remove(); navigate('#/app/formations'); });
  menu.querySelector('[data-user="results"]').addEventListener('click', () => { menu.remove(); navigate('#/app/resultats'); });
  menu.querySelector('[data-user="logout"]').addEventListener('click', () => {
    menu.remove();
    closeModal();
    clearAuth();
    navigate('#/');
    toast('Déconnexion simulée — retour au site public.');
  });
}

function openProfileModal() {
  openModal(`
    <div class="profile-hero">
      <div class="profile-photo">
        <img src="assets/img/avatar-aminata.jpg" alt="Portrait d’${esc(USER.first)} ${esc(USER.last)}" />
        <span class="profile-photo__check" aria-label="Compte vérifié">${icon('check')}</span>
      </div>
      <div class="profile-hero__id">
        <span class="eyebrow">Profil apprenant</span>
        <h2>${esc(USER.first)} ${esc(USER.last)}</h2>
        <p>Étudiante en géologie · 26 ans</p>
        <span class="profile-hero__ref">${icon('award')} N° apprenant BAO-2026-00184</span>
      </div>
      <div class="profile-hero__side">
        <span class="profile-hero__badge">Compte vérifié</span>
        <span class="profile-hero__since">Inscrite le 12 septembre 2026</span>
      </div>
      <button class="modal__close" data-close aria-label="Fermer">${icon('x')}</button>
    </div>
    <div class="modal__body profile-body">
      <div class="profile-section-head">
        <h3>Pièce d’identité</h3>
        <span class="pill pill-cream">CNI</span>
      </div>
      <div class="profile-id">
        <div class="profile-id__main">
          <span class="profile-id__label">Carte nationale d’identité</span>
          <b class="profile-id__num">CI-0845-1720-33</b>
          <span class="profile-id__meta">Délivrée le 12 septembre 2021 · Expire le 12 septembre 2031</span>
        </div>
        <span class="profile-id__stamp">${icon('lock')} Document contrôlé</span>
      </div>

      <div class="profile-section-head"><h3>Coordonnées</h3></div>
      <div class="profile-details">
        <div class="profile-detail">
          <span class="profile-detail__ico">${icon('phone')}</span>
          <span><small>Téléphone</small><b>+225 07 08 45 17 20</b></span>
        </div>
        <div class="profile-detail">
          <span class="profile-detail__ico">${icon('mail')}</span>
          <span><small>Courriel</small><b>aminata.traore@baobab.demo</b></span>
        </div>
        <div class="profile-detail profile-detail--wide">
          <span class="profile-detail__ico">${icon('map-pin')}</span>
          <span><small>Adresse</small><b>Cocody Angré, Abidjan · Côte d’Ivoire</b></span>
        </div>
      </div>

      <div class="profile-section-head"><h3>Informations personnelles</h3></div>
      <div class="profile-details">
        <div class="profile-detail">
          <span class="profile-detail__ico">${icon('calendar')}</span>
          <span><small>Date de naissance</small><b>14 mars 1998</b></span>
        </div>
        <div class="profile-detail">
          <span class="profile-detail__ico">${icon('globe')}</span>
          <span><small>Nationalité</small><b>Ivoirienne</b></span>
        </div>
        <div class="profile-detail">
          <span class="profile-detail__ico">${icon('graduation')}</span>
          <span><small>Établissement</small><b>Université Félix Houphouët-Boigny</b></span>
        </div>
        <div class="profile-detail">
          <span class="profile-detail__ico">${icon('book')}</span>
          <span><small>Offre</small><b>Étudiante · tarif réduit</b></span>
        </div>
      </div>
    </div>
    <div class="modal__foot">
      <p>Données de démonstration. Aucune information réelle n’est collectée ni transmise.</p>
      <div class="modal__actions">
        <a class="btn btn-outline" href="#/app/resultats" data-close>Mes résultats</a>
        <button class="btn btn-navy" data-close>Fermer</button>
      </div>
    </div>`, 'modal--narrow profile-modal');
}

/* ---------- Contact & informations ---------- */
function openContactModal(subject = '') {
  openModal(`
    <div class="modal__head">
      <div><span class="eyebrow">Contact</span><h2>Écrire à l’académie</h2><p>Notre équipe répond sous 24 h ouvrées (simulation).</p></div>
      <button class="modal__close" data-close aria-label="Fermer">${icon('x')}</button>
    </div>
    <div class="modal__body">
      <div class="live-form">
        <div class="live-form__full"><label for="contact-subject">Sujet</label><input class="field" id="contact-subject" value="${esc(subject || 'Une question sur les formations')}" /></div>
        <div><label>Votre nom</label><input class="field" value="${esc(USER.first)} ${esc(USER.last)}" /></div>
        <div><label>Courriel</label><input class="field" value="aminata.traore@baobab.demo" /></div>
        <div class="live-form__full"><label for="contact-message">Message</label><textarea class="field field--area" id="contact-message" rows="4" placeholder="Décrivez votre demande…"></textarea></div>
      </div>
      <p class="muted-note" style="margin-top:12px">Formulaire de démonstration : aucun message n’est réellement envoyé.</p>
    </div>
    <div class="modal__foot">
      <p>Réponse simulée · contact@baobab-mine-academy.demo</p>
      <div class="modal__actions">
        <button class="btn btn-outline" data-close>Annuler</button>
        <button class="btn btn-navy" id="contact-send">${icon('mail')} Envoyer</button>
      </div>
    </div>`, 'modal--narrow');
  document.getElementById('contact-send').addEventListener('click', () => {
    const message = document.getElementById('contact-message').value.trim();
    if (!message) { toast('Écrivez votre message avant d’envoyer.'); return; }
    closeModal();
    toast('Message envoyé (simulation). Réponse sous 24 h ouvrées.');
  });
}

function openInfoModal(title) {
  const bodies = {
    'Confidentialité': 'Cette démonstration ne collecte aucune donnée personnelle réelle. Les informations affichées sont simulées et restent dans votre navigateur.',
    'Conditions d’utilisation': 'Prototype de démonstration : les contenus, tarifs, résultats et certificats sont fictifs. Aucune formation réelle ni accréditation officielle n’est délivrée.',
    'Espace démo': 'Cette plateforme est une simulation. Les données, documents et résultats sont fictifs et servent uniquement à illustrer le parcours apprenant.',
    'Qualité vidéo': 'La lecture s’adapte automatiquement à votre connexion. Le mode 360p limite la consommation de données et reste lisible pour les cours et les replays de cette démonstration.',
  };
  openModal(`
    <div class="modal__head">
      <div><span class="eyebrow">Information</span><h2>${esc(title)}</h2></div>
      <button class="modal__close" data-close aria-label="Fermer">${icon('x')}</button>
    </div>
    <div class="modal__body"><p class="muted-note" style="font-size:12.5px">${esc(bodies[title] || 'Cette page présente des informations de démonstration.')}</p></div>
    <div class="modal__foot">
      <p>BAOBAB Mine Academy · simulation</p>
      <div class="modal__actions"><button class="btn btn-navy" data-close>Fermer</button></div>
    </div>`, 'modal--narrow');
}

document.addEventListener('click', (e) => {
  const contact = e.target.closest('[data-contact]');
  if (contact) {
    e.preventDefault();
    openContactModal(contact.dataset.contact || '');
    return;
  }
  const info = e.target.closest('[data-info]');
  if (info) {
    e.preventDefault();
    openInfoModal(info.dataset.info);
  }
});

/* ---------- Dates ---------- */
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const MONTHS_SHORT = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function isoOf(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function longDate(iso) {
  const d = parseISO(iso);
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
function shortDate(iso) {
  const d = parseISO(iso);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}
function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}
function minutesToTime(minutes) {
  const m = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}
function slotDuration(slot) {
  return (timeToMinutes(slot.end) - timeToMinutes(slot.start)) / 60;
}

function slotsTotal() {
  return state.slots.reduce((sum, s) => sum + slotDuration(s), 0);
}

function hasConflict(slots) {
  const sorted = [...slots].sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const cur = sorted[i];
    if (prev.date === cur.date && timeToMinutes(cur.start) < timeToMinutes(prev.end)) return true;
  }
  return false;
}

/* ---------- Petits composants ---------- */
function statusPill(module) {
  if (module.state === 'done') return '<span class="pill pill-green">Terminé</span>';
  if (module.state === 'active') return '<span class="pill pill-cream">En cours</span>';
  if (module.state === 'locked') return '<span class="pill pill-muted">Accès verrouillé</span>';
  return '';
}

function courseCard(course) {
  const teacher = INSTRUCTORS[course.instructor];
  return `
    <a class="course-card" href="#/formation/${course.id}">
      <div class="course-card__media">
        <img src="${course.image}" alt="${esc(course.title)}" loading="lazy" />
        <span class="pill pill-light course-card__level">${course.level}</span>
      </div>
      <div class="course-card__body">
        <span class="course-card__cat">${esc(course.category)}</span>
        <h3 class="course-card__title">${esc(course.title)}</h3>
        <p class="course-card__meta">${course.hours} h · ${course.modulesCount} modules · ${esc(course.format)}</p>
        <p class="course-card__teacher">Avec ${esc(teacher.name)}</p>
        <div class="course-card__foot">
          <span class="course-card__price">${money(course.price)} <small>FCFA</small><em>Tarif étudiant</em></span>
          <span class="course-card__go">${icon('arrow-up-right')}</span>
        </div>
      </div>
    </a>`;
}
