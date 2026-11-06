/* =========================================================
   Espace apprenant — shell, dashboard, fiche formation
   ========================================================= */

const SIDE_NAV = [
  { key: 'dashboard', label: 'Tableau de bord', href: '#/app', icon: 'grid' },
  { key: 'courses', label: 'Mes formations', href: '#/app/formations', icon: 'book' },
  { key: 'catalogue', label: 'Catalogue', href: '#/catalogue', icon: 'search' },
  { key: 'agenda', label: 'Agenda', href: '#/app/agenda', icon: 'calendar' },
  { key: 'quiz', label: 'Quiz de parcours', href: '#/app/resultats?tab=quizzes', icon: 'award' },
  { key: 'live', label: 'Sessions en direct', href: '#/app/agenda?mode=live&day=2026-11-12', icon: 'video' },
  { key: 'results', label: 'Résultats & certificats', href: '#/app/resultats', icon: 'medal' },
];

function sidebar(active) {
  return `
    <aside class="sidebar">
      <a class="sidebar__brand" href="#/app"><img src="assets/img/logo.png" alt="BAOBAB Mine Academy" /></a>
      <div class="sidebar__eyebrow">Mon espace</div>
      <div class="sidebar__tag">Apprendre. Pratiquer. Progresser.</div>
      <nav class="side-nav">
        ${SIDE_NAV.map((n) => `<a href="${n.href}" class="${n.key === active ? 'is-active' : ''}">${icon(n.icon)}<span>${n.label}</span></a>`).join('')}
      </nav>
      <div class="sidebar__promo">
        ${icon('wifi')}
        <strong>Votre connexion, votre rythme.</strong>
        <p>Privilégiez les vidéos en 360p et les supports PDF légers.</p>
        <a href="#/app/cours">Régler la qualité ${icon('arrow-right')}</a>
      </div>
      <div class="sidebar__foot">
        <button class="sidebar__help" data-contact="Besoin d’aide">${icon('help')} Besoin d’aide ?</button>
        <button class="sidebar__user" id="side-user" aria-label="Ouvrir mon compte">
          ${userAvatar()}
          <div><b>${USER.first} ${USER.last}</b><span>${USER.role}</span></div>
        </button>
      </div>
    </aside>`;
}

function topbar(crumbs) {
  const parts = crumbs.map((c, i) => {
    const sep = i ? '<span class="sep">/</span>' : '';
    const label = c.href ? `<a href="${c.href}">${esc(c.label)}</a>` : `<span>${esc(c.label)}</span>`;
    return sep + label;
  }).join('');
  return `
    <header class="topbar">
      <div class="crumbs">${parts}</div>
      <div class="topbar__right">
        <button class="demo-pill" data-info="Espace démo">Espace démo</button>
        <button class="topbar__icon" id="top-search" aria-label="Rechercher">${icon('search')}</button>
        <button class="topbar__icon" id="top-bell" aria-label="Notifications">${icon('bell')}</button>
        <button class="topbar__avatar" id="top-avatar" aria-label="Ouvrir mon compte">${userAvatar()}</button>
      </div>
    </header>`;
}

function appShell({ active, crumbs, content, wide = false }) {
  appRoot.innerHTML = `
    <div class="app-shell">
      ${sidebar(active)}
      <div class="app-main">
        ${topbar(crumbs)}
        <main class="app-content ${wide ? 'app-content--wide' : ''}">${content}</main>
      </div>
    </div>`;
  bindTopbar();
}

/* ---------------- Dashboard ---------------- */
function renderDashboard() {
  const hse = getCourse('hse');
  const content = `
    <div class="page-head">
      <div>
        <span class="page-eyebrow">Jeudi 5 novembre 2026</span>
        <h1 class="page-title">Bonjour ${USER.first}, gardez le cap.</h1>
        <p class="page-sub">Chaque notion maîtrisée vous rapproche du terrain. Reprenons là où vous en étiez.</p>
      </div>
      <div class="page-head__aside"><span class="pill pill-cream">Parcours étudiant</span></div>
    </div>

    <div class="stats">
      <div class="stat-card">
        <div class="stat-card__icon">${icon('book')}</div>
        <div><div class="stat-card__n">2</div><div class="stat-card__label">Formations inscrites</div><div class="stat-card__sub">1 en cours · 1 terminée</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon">${icon('clock')}</div>
        <div><div class="stat-card__n">16 <small>h</small></div><div class="stat-card__label">Temps d’apprentissage</div><div class="stat-card__sub">Sur l’ensemble de vos parcours</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon">${icon('award')}</div>
        <div><div class="stat-card__n">1</div><div class="stat-card__label">Certificat obtenu</div><div class="stat-card__sub">Examen final validé · Simulation</div></div>
      </div>
    </div>

    <div class="dash-grid">
      <section class="resume-card">
        <div class="resume-card__top">
          <div class="resume-card__copy">
            <span class="eyebrow">Reprendre ma formation</span>
            <h2>Planification minière à ciel ouvert</h2>
            <p class="resume-card__meta">Moussa Koné · 24 h · Intermédiaire</p>
            <span class="pill pill-cream">67 % du parcours terminé</span>
          </div>
          <div class="resume-card__media"><img src="assets/img/mine-pit.jpg" alt="" /></div>
        </div>
        <div class="resume-card__body">
          <div class="resume-card__counts"><span>12 leçons sur 18 terminées</span><span>4 modules sur 6</span></div>
          <div class="progress"><span style="width:67%"></span></div>
          <div class="resume-card__module">
            <div>
              <span class="eyebrow">Module 5 · Production &amp; suivi</span>
              <h3>Construire un planning de production</h3>
              <p>Vidéo · Reprendre à 09:42 / 18:30</p>
            </div>
            <a class="btn btn-navy" href="#/app/cours">Reprendre le cours ${icon('play')}</a>
          </div>
        </div>
      </section>

      <aside class="next-live">
        <div class="next-live__head">
          <span class="eyebrow">Votre prochain direct</span>
          ${icon('wifi')}
        </div>
        <div class="next-live__date">
          <b>12</b>
          <span>Novembre 2026<small>Jeudi · 18:00 GMT</small></span>
        </div>
        <h3>Du modèle de blocs au plan de production</h3>
        <p class="next-live__meta">Avec Moussa Koné · 1 h 30</p>
        <span class="pill pill-green">Inscription confirmée</span>
        <p>Le lien d’accès sera disponible 15 minutes avant la session. Replay prévu.</p>
        <a class="btn btn-outline btn-block" href="#/app/agenda?mode=live&day=2026-11-12">Voir la session</a>
      </aside>
    </div>

    <div class="dash-bottom">
      <section class="panel">
        <div class="panel__head"><h2>Mes formations</h2><a href="#/app/formations">Tout voir ${icon('arrow-right')}</a></div>
        <article class="my-course">
          <img src="${hse.image}" alt="" />
          <div>
            <span class="pill pill-green">Certificat · 28 octobre 2026</span>
            <h3>${hse.title}</h3>
            <p>Examen final validé · 86 / 100 · Adama Ouédraogo</p>
            <a href="#/app/resultats">Consulter mon certificat ${icon('arrow-right')}</a>
          </div>
        </article>
      </section>

      <section class="panel">
        <div class="panel__head"><h2>Dernières avancées</h2></div>
        <ul class="activity">
          <li>${icon('check-circle', 'is-ok')}<div><b>Quiz du module 4 réussi</b><span>16 / 20 · 4 novembre</span></div></li>
          <li>${icon('file-check', 'is-doc')}<div><b>Exercice de séquençage remis</b><span>Corrigé disponible · 3 novembre</span></div></li>
          <li>${icon('award', 'is-doc')}<div><b>Certificat HSE disponible</b><span>28 octobre 2026</span></div></li>
        </ul>
      </section>
    </div>

    <p style="font-size:9px;color:var(--faint);margin-top:22px;padding-top:14px;border-top:1px solid var(--line-soft)">${esc(BRAND.demo)}</p>`;

  appShell({ active: 'dashboard', crumbs: [{ label: 'Mon espace' }, { label: 'Tableau de bord' }], content });
}

/* ---------------- Mes formations ---------------- */
function renderMyCourses() {
  const enrolled = COURSES.filter((c) => c.enrolled);
  const others = COURSES.filter((c) => !c.enrolled).slice(0, 3);
  const content = `
    <div class="page-head">
      <div>
        <span class="page-eyebrow">Apprendre. Pratiquer. Progresser.</span>
        <h1 class="page-title">Mes formations</h1>
        <p class="page-sub">Retrouvez vos parcours en cours, vos certificats et les formations à découvrir.</p>
      </div>
      <div class="page-head__aside"><a class="btn btn-navy" href="#/catalogue">Explorer le catalogue ${icon('arrow-right')}</a></div>
    </div>

    <div class="course-list">
      ${enrolled.map((c) => `
        <article class="course-line">
          <img src="${c.image}" alt="" />
          <div class="course-line__body">
            <span class="eyebrow">${esc(c.category)}</span>
            <h3>${esc(c.title)}</h3>
            <p>${INSTRUCTORS[c.instructor].name} · ${c.hours} h · ${c.modulesCount} modules</p>
            <div class="progress"><span style="width:${c.progress}%"></span></div>
            <p style="margin-top:5px">${c.progress}% du parcours terminé</p>
          </div>
          <div class="course-line__side">
            <span class="pill ${c.progress === 100 ? 'pill-green' : 'pill-cream'}">${c.progress === 100 ? 'Terminée' : 'En cours'}</span>
            <a class="btn btn-outline btn-sm" href="#/formation/${c.id}">${c.progress === 100 ? 'Revoir le parcours' : 'Continuer'} ${icon('arrow-right')}</a>
          </div>
        </article>`).join('')}
    </div>

    <div class="section-head" style="margin-top:34px;margin-bottom:4px">
      <div><h2 class="section-title" style="font-size:24px;margin-top:0">À découvrir</h2></div>
      <a class="link-arrow" href="#/catalogue">Tout le catalogue ${icon('arrow-right')}</a>
    </div>
    <div class="course-grid" style="margin-top:16px">${others.map(courseCard).join('')}</div>

    <p style="font-size:9px;color:var(--faint);margin-top:26px;padding-top:14px;border-top:1px solid var(--line-soft)">${esc(BRAND.demo)}</p>`;

  appShell({ active: 'courses', crumbs: [{ label: 'Mon espace' }, { label: 'Mes formations' }], content });
}

/* ---------------- Détail formation ---------------- */
function renderCourseDetail(courseId) {
  const course = getCourse(courseId);
  const coach = INSTRUCTORS[course.instructor];

  const content = `
    <a class="back-link" href="#/app/formations">${icon('arrow-left')} Retour à mes formations</a>

    <section class="course-hero">
      <div class="course-hero__copy">
        <span class="eyebrow">${esc(course.category)}</span>
        <h1>${esc(course.title)}</h1>
        <p>${esc(course.short)}</p>
        <div class="course-hero__pills">
          <span class="pill">${course.level}</span>
          <span class="pill">${course.hours} h · ${course.modulesCount} modules</span>
          <span class="pill">${esc(course.format)}</span>
        </div>
      </div>
      <div class="course-hero__media"><img src="${course.image}" alt="" /></div>
    </section>

    <div class="tabs" role="tablist">
      <button class="is-active" data-tab="overview">Vue d’ensemble</button>
      <button data-tab="program">Programme</button>
      <button data-tab="teacher">Votre formateur</button>
      <button data-tab="evaluation">Modalités d’évaluation</button>
    </div>

    <div class="detail-grid">
      <div class="detail-main">
        <div id="panel-overview">
          <h2>Ce que vous saurez faire</h2>
          <p>${esc(course.description)}</p>
          <ul class="objectives">
            ${course.objectives.map((o) => `<li>${icon('check-circle')}<span>${esc(o)}</span></li>`).join('')}
          </ul>
        </div>

        <div id="panel-program">
          <div class="program-head">
            <h2>Le programme</h2>
            <span>${esc(course.lectures)}</span>
          </div>
          <p style="font-size:10px;color:var(--muted);margin-bottom:10px">Clic droit sur un module ou bouton … pour gérer ses créneaux.</p>
          <div class="module-list">
            ${course.modules.map((m, i) => `
              <article class="module-row ${m.state === 'active' ? 'is-active' : ''} ${m.state === 'locked' ? 'is-locked' : ''}" data-module="${i}">
                <span class="module-row__n">${m.n}</span>
                <div>
                  <h3>${esc(m.title)}</h3>
                  <p>${esc(m.topics)}</p>
                </div>
                <div class="module-row__side">
                  <span>${esc(m.duration)}</span>
                  ${m.state === 'active' ? `<button class="module-row__more" data-more="${i}" aria-label="Actions du module">${icon('chevron-down')}</button>` : m.state === 'done' ? icon('check-circle') : m.state === 'locked' ? icon('lock') : ''}
                </div>
                ${m.state === 'active' ? `<div class="module-row__notes"><span class="pill pill-cream">En cours</span><span>${esc(m.slotsLabel || '')}</span></div>` : ''}
                ${m.state === 'done' ? `<div class="module-row__notes"><span class="pill pill-green">Terminé</span></div>` : ''}
                ${m.state === 'locked' ? `<div class="module-row__notes"><span class="pill pill-muted">À planifier · après module 5</span><span>${esc(m.lockNote)}</span></div>` : ''}
                ${m.state === 'active' && m.next ? `<div class="module-row__notes" style="color:var(--gold-dark)">Votre prochaine leçon : ${esc(m.next)}</div>` : ''}
                ${m.state === 'active' ? `<div class="module-row__slots">${state.slots.map((s) => `<span>${rowSlotLine(s)}</span>`).join('')}</div>` : ''}
              </article>`).join('')}
          </div>
        </div>

        <div id="panel-teacher" style="margin-top:26px">
          <div class="detail-card">
            <h2>L’expertise derrière le cours</h2>
            <div class="instructor-mini">
              <img src="${coach.photo}" alt="" />
              <div>
                <b>${esc(coach.name)}</b>
                <span class="role">${esc(coach.role)}</span>
                <p>${esc(coach.bio)}</p>
                <p style="color:var(--gold-dark);font-style:italic">« ${esc(coach.quote)} »</p>
              </div>
            </div>
          </div>
        </div>

        <div id="panel-evaluation" style="margin-top:16px">
          <div class="detail-card detail-card--cream">
            <span class="eyebrow">Modalités d’évaluation</span>
            <h2 style="margin-top:8px">Deux types d’évaluation pour valider votre progression.</h2>
            <p style="font-size:10.5px;color:var(--muted);margin-top:6px">1. Tests de connaissance · 5 quiz de parcours pour vérifier les acquis au fil des modules.</p>
            <p style="font-size:10.5px;color:var(--muted);margin-top:4px">2. Examen final : sa réussite donne accès au certificat ou au diplôme prévu par le parcours.</p>
            <p class="muted-note" style="margin-top:10px">Simulation BAOBAB Mine Academy — sans accréditation ni diplôme d’État revendiqué.</p>
          </div>
        </div>

      </div>

      <aside class="rail">
        <div class="enroll-card">
          ${course.enrolled ? '<span class="pill pill-green">Vous êtes inscrite</span>' : '<span class="pill pill-cream">Inscription ouverte</span>'}
          <h2>${course.enrolled ? 'Votre parcours continue.' : 'Rejoignez ce parcours.'}</h2>
          <div class="enroll-card__counts"><span>${course.enrolled ? '12 leçons sur 18 terminées' : `${course.lessons} leçons`}</span>${course.enrolled ? '' : `<span>${course.modulesCount} modules</span>`}</div>
          <div class="progress"><span style="width:${course.progress}%"></span></div>
          <div class="enroll-card__meta"><span>Progression pédagogique</span><span>${course.progress} %</span></div>
          ${course.enrolled ? '<div class="enroll-card__done">4 modules sur 6 terminés</div>' : ''}
          ${courseCta(course)}
          <p class="muted-note enroll-note">Un créneau planifié ne valide ni une leçon ni un module.</p>
          <ul class="enroll-list">
            <li>${icon('video')}<span>18 vidéos en replay</span></li>
            <li>${icon('users')}<span>2 ateliers en direct</span></li>
            <li>${icon('file-text')}<span>6 supports PDF légers</span></li>
            <li>${icon('check-circle')}<span>Tests de connaissance et examen final</span></li>
            <li>${icon('award')}<span>Certificat ou diplôme après réussite à l’examen final</span></li>
          </ul>
          <div class="enroll-prices">
            Votre tarif étudiant : <b>${money(course.price)} FCFA</b><br/>
            Tarif professionnel : <b>${money(course.proPrice)} FCFA</b>
          </div>
          <p class="muted-note">Simulation BAOBAB Mine Academy — sans accréditation ni diplôme d’État revendiqué.</p>
        </div>

        <div class="plan-card">
          <span class="eyebrow">Planification du module</span>
          <h3>Module 5 · Production &amp; suivi</h3>
          <ul>
            ${state.slots.map((s) => `<li><span class="dot"></span>${s.date.slice(8)} nov. · ${s.start}–${s.end} GMT</li>`).join('')}
          </ul>
          <div class="plan-card__foot"><span>${slotsTotalCours()} h au total · sur ${state.slots.length} jours</span><span>GMT (UTC+0)</span></div>
        </div>

        <div class="detail-card">
          <span class="eyebrow">Avant de commencer</span>
          <h2 style="margin-top:8px;font-size:17px">Pour étudiants avancés et jeunes professionnels.</h2>
          <p class="muted-note">Notions de géologie et bases de calcul sur tableur recommandées. Un ordinateur est conseillé pour les exercices.</p>
        </div>

        <div class="agenda-mini">
          <span class="eyebrow">Agenda personnel</span>
          <h3>Planification de chaque module.</h3>
          <ul class="check-list" style="margin-top:8px">
            <li>${icon('check')} Modules 1–4 terminés</li>
            <li>${icon('check')} Module 5 : 09–11 nov. 2026 · 09:00–11:00 GMT puis 09:00–10:00 GMT</li>
            <li>${icon('check')} Module 6 : à planifier après validation du module 5</li>
          </ul>
          <p>${state.slots.length} créneaux planifiés</p>
          <p style="margin-top:4px">Clic droit sur un module ou menu · Ajouter à l’agenda. Choisissez ensuite vos dates et horaires.</p>
          <div class="agenda-mini__date">Jeudi 12 novembre · 18:00 GMT</div>
          <p>Du modèle de blocs au plan de production. Vous êtes inscrite.</p>
          <a class="link-arrow" href="#/app/agenda?mode=live&day=2026-11-12" style="margin-top:8px">Voir la session ${icon('arrow-right')}</a>
        </div>
      </aside>
    </div>

    <p style="font-size:9px;color:var(--faint);margin-top:24px;padding-top:14px;border-top:1px solid var(--line-soft)">${esc(BRAND.demo)}</p>`;

  appShell({
    active: 'courses',
    crumbs: [{ label: 'Mon espace', href: '#/app' }, { label: 'Planification minière' }],
    content,
  });

  const tabs = appRoot.querySelectorAll('.tabs button');
  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabs.forEach((b) => b.classList.toggle('is-active', b === btn));
      const map = { overview: 'panel-overview', program: 'panel-program', teacher: 'panel-teacher', evaluation: 'panel-evaluation' };
      const el = document.getElementById(map[btn.dataset.tab]);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  appRoot.querySelectorAll('[data-more]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModuleMenu(btn);
    });
  });

  appRoot.querySelectorAll('.module-row.is-active').forEach((row) => {
    row.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      openModuleMenu(row);
    });
  });

  const enroll = document.getElementById('enroll-btn');
  if (enroll) enroll.addEventListener('click', () => openEnrollModal(course));
}

function courseCta(course) {
  if (!course.enrolled) {
    return `<button class="btn btn-navy btn-block" id="enroll-btn">S’inscrire ${icon('arrow-right')}</button>`;
  }
  if (course.progress === 100) {
    return `<a class="btn btn-navy btn-block" href="#/app/resultats?tab=certs">Voir mon certificat ${icon('arrow-right')}</a>`;
  }
  if (course.id === 'planification') {
    return `<a class="btn btn-navy btn-block" href="#/app/cours">Reprendre le cours ${icon('play')}</a>`;
  }
  return `<a class="btn btn-navy btn-block" href="#/app/formations">Voir mes formations ${icon('arrow-right')}</a>`;
}

function openEnrollModal(course) {
  openModal(`
    <div class="modal__head">
      <div>
        <span class="eyebrow">Inscription</span>
        <h2>Rejoindre ce parcours</h2>
        <p>${esc(course.title)}</p>
      </div>
      <button class="modal__close" data-close aria-label="Fermer">${icon('x')}</button>
    </div>
    <div class="modal__body">
      <div class="plan-summary">
        <span class="plan-summary__n">${esc(course.level.slice(0, 1))}</span>
        <div><span>${esc(course.category)} · ${course.hours} h · ${course.modulesCount} modules</span><b>${esc(course.title)}</b></div>
        <div class="plan-summary__meta"><strong>${money(course.price)} FCFA</strong>Tarif étudiant</div>
      </div>
      <div class="profile-grid" style="margin-top:16px">
        <div><span>Format</span><b>${esc(course.format)}</b></div>
        <div><span>Niveau</span><b>${esc(course.level)}</b></div>
        <div><span>Formateur</span><b>${esc(INSTRUCTORS[course.instructor].name)}</b></div>
        <div><span>Accès</span><b>À votre rythme · replay inclus</b></div>
      </div>
      <p class="muted-note" style="margin-top:14px">Inscription simulée : aucun paiement n’est demandé. Le parcours apparaîtra dans « Mes formations ».</p>
    </div>
    <div class="modal__foot">
      <p>Tarif professionnel : ${money(course.proPrice)} FCFA. Supports PDF légers et directs enregistrés inclus.</p>
      <div class="modal__actions">
        <button class="btn btn-outline" data-close>Annuler</button>
        <button class="btn btn-navy" id="confirm-enroll">Confirmer l’inscription ${icon('check')}</button>
      </div>
    </div>`, 'modal--narrow');

  document.getElementById('confirm-enroll').addEventListener('click', () => {
    course.enrolled = true;
    course.progress = course.progress || 0;
    closeModal();
    renderCourseDetail(course.id);
    toast(`Inscription confirmée à « ${course.title} ».`);
  });
}

function rowSlotLine(s) {
  const d = parseISO(s.date);
  const day = DAYS[d.getDay()].slice(0, 3);
  const h = slotDuration(s);
  const hours = Number.isInteger(h) ? h : h.toFixed(1).replace('.', ',');
  return `${day.charAt(0).toUpperCase() + day.slice(1)}. ${String(d.getDate()).padStart(2, '0')} ${MONTHS_SHORT[d.getMonth()]} · ${s.start}–${s.end} GMT · ${hours} h`;
}

function slotsTotalCours() {
  const total = slotsTotal();
  return Number.isInteger(total) ? total : total.toFixed(1).replace('.', ',');
}
