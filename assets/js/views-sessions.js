/* =========================================================
   Sessions en direct (site public) + salle de direct simulée
   ========================================================= */

const DEMO_TODAY = '2026-11-05';
let sessionsFilter = 'all';

function courseById(id) { return COURSES.find((c) => c.id === id); }
function liveSessionById(id) { return LIVE_SESSIONS.find((s) => s.id === id); }

function liveInstructor(session) {
  return Object.values(INSTRUCTORS).find((i) => i.name === session.instructor) || INSTRUCTORS.moussa;
}

function initialsOf(name) {
  return String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function liveAvatar(session) {
  const inst = liveInstructor(session);
  if (inst.photo) return `<img src="${inst.photo}" alt="${esc(inst.name)}" />`;
  return `<span class="avatar navy">${initialsOf(inst.name)}</span>`;
}

function sortedLiveSessions() {
  return LIVE_SESSIONS.slice().sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));
}

function nextLiveSession() {
  const list = sortedLiveSessions();
  return list.find((s) => s.date >= DEMO_TODAY) || list[0];
}

function isLiveRegistered(session) { return !!session.registered; }

function filteredLiveSessions() {
  const list = sortedLiveSessions();
  if (sessionsFilter === 'mine') return list.filter(isLiveRegistered);
  if (sessionsFilter !== 'all') return list.filter((s) => s.tag === sessionsFilter);
  return list;
}

function sessionTags() {
  return ['all', 'mine'].concat([...new Set(LIVE_SESSIONS.map((s) => s.tag))]);
}

function sessionTagLabel(tag) {
  if (tag === 'all') return 'Toutes les sessions';
  if (tag === 'mine') return 'Mes inscriptions';
  return tag;
}

function monthShort(date) { return MONTHS_SHORT[date.getMonth()].replace('.', '').toUpperCase(); }

function durationLabel(start, end) {
  const minutes = timeToMinutes(end) - timeToMinutes(start);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h} h ${String(m).padStart(2, '0')}`;
  if (h) return `${h} h`;
  return `${m} min`;
}

function formatSec(total) {
  const sec = Math.max(0, Math.round(total));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/* =========================================================
   Page publique
   ========================================================= */

function renderSessions() {
  const next = nextLiveSession();
  const list = filteredLiveSessions();
  const confirmed = LIVE_SESSIONS.filter(isLiveRegistered).length;

  appRoot.innerHTML = `
    ${siteHeader('direct')}
    <main>
      <section class="sessions-hero">
        <div class="container sessions-hero-grid">
          <div>
            <div class="eyebrow">Apprendre ensemble · Sessions en direct</div>
            <h1>Le terrain, en direct avec vous.</h1>
            <p class="sessions-lead">Des ateliers animés par des professionnels en activité. Posez vos questions, travaillez sur un cas réel et repartez avec une méthode applicable dès le lendemain.</p>
            <div class="sessions-hero-actions">
              <a class="btn btn-gold" href="#/sessions/${next.id}">Voir la prochaine session ${icon('arrow-right')}</a>
              <button class="btn btn-ghost-light" data-open-room="${next.id}" data-mode="waiting">Tester la salle de direct</button>
            </div>
            <div class="sessions-hero-note">${icon('globe')} Sessions gratuites pour les apprenants inscrits · Replay disponible après chaque direct.</div>
          </div>

          <div class="session-spotlight">
            <div class="spotlight-top">
              <span class="live-signal"><i></i> Prochain direct</span>
              <span class="spotlight-date">${longDate(next.date)}</span>
            </div>
            <h2>${esc(next.title)}</h2>
            <p>${esc(next.description)}</p>
            <div class="spotlight-coach">
              ${liveAvatar(next)}
              <div>
                <strong>${esc(next.instructor)}</strong>
                <span>${esc(liveInstructor(next).role)}</span>
              </div>
            </div>
            <div class="spotlight-foot">
              <span class="session-time">${next.start}-${next.end} GMT · ${durationLabel(next.start, next.end)}</span>
              <a class="link-arrow" href="#/sessions/${next.id}">Voir le programme ${icon('arrow-right')}</a>
            </div>
          </div>
        </div>
      </section>

      <section class="sessions-section">
        <div class="container sessions-layout">
          <div>
            <div class="section-head sessions-list-head">
              <div>
                <div class="section-kicker">Calendrier des sessions</div>
                <h2 class="section-title">Vos prochains rendez-vous.</h2>
              </div>
              <div class="sessions-chips">
                ${sessionTags().map((tag) => `<button class="sessions-chip ${sessionsFilter === tag ? 'active' : ''}" data-sessions-filter="${tag}">${sessionTagLabel(tag)}</button>`).join('')}
              </div>
            </div>

            <div class="sessions-list">
              ${list.length ? list.map(sessionRow).join('') : `
                <div class="session-empty">
                  ${icon('calendar')}
                  <h3>Aucune session dans cette sélection.</h3>
                  <p>Choisissez un autre thème ou inscrivez-vous à un prochain direct.</p>
                  <button class="btn btn-outline btn-sm" data-sessions-filter="all">Voir toutes les sessions</button>
                </div>`}
            </div>
          </div>

          <aside class="sessions-rail">
            <div class="session-info-card">
              <div class="panel-kicker">Comment ça se passe ?</div>
              <h3>Un atelier, pas une conférence.</h3>
              <p>Chaque session part d’un cas concret et laisse une large place à vos questions.</p>
              <ul class="session-info-list">
                <li>${icon('check-circle')} Lien d’accès ouvert 15 minutes avant le direct.</li>
                <li>${icon('check-circle')} 60 minutes d’atelier, puis 30 minutes de questions.</li>
                <li>${icon('check-circle')} Replay, support et exercice disponibles après la session.</li>
              </ul>
              <button class="link-arrow session-link-btn" data-quality>Régler la qualité vidéo ${icon('arrow-right')}</button>
            </div>

            <div class="session-info-card dark">
              <div class="panel-kicker">Une question avant le direct ?</div>
              <h3>L’équipe pédagogique vous répond.</h3>
              <p>Plusieurs créneaux sont proposés chaque mois. Dites-nous ce que vous aimeriez approfondir.</p>
              <button class="btn btn-gold btn-sm" data-contact="Sessions en direct">Écrire à l’académie ${icon('arrow-right')}</button>
            </div>

            <div class="session-info-card" style="background:#fff">
              <div class="panel-kicker">Votre agenda</div>
              <h3>${confirmed} session${confirmed > 1 ? 's' : ''} confirmée${confirmed > 1 ? 's' : ''}.</h3>
              <p>Téléchargez le fichier calendrier d’une session pour la retrouver dans votre agenda personnel.</p>
              <a class="link-arrow" href="#/app/agenda">Ouvrir mon agenda ${icon('arrow-right')}</a>
            </div>
          </aside>
        </div>
      </section>

      <section class="sessions-replays">
        <div class="container">
          <div class="block-head">
            <div>
              <div class="section-kicker">Vous avez manqué un direct ?</div>
              <h2>À revoir à votre rythme.</h2>
            </div>
            <a class="link-arrow" href="#/app/agenda">Tous les replays ${icon('arrow-right')}</a>
          </div>
          <div class="sessions-replay-grid">
            ${REPLAYS.map(replayCard).join('')}
          </div>
        </div>
      </section>

      <section class="sessions-final">
        <div class="container final-grid">
          <div>
            <div class="eyebrow">Votre prochain cap</div>
            <h2>Un direct vous intéresse ?<br />Suivez tout le parcours.</h2>
            <p>Chaque session est reliée à une formation. Retrouvez les modules, les exercices et les replays.</p>
          </div>
          <div class="final-actions">
            <a class="btn btn-gold" href="#/catalogue">Explorer les formations ${icon('arrow-right')}</a>
            <button class="btn btn-ghost-light" data-contact="Sessions en direct">Poser une question</button>
          </div>
        </div>
      </section>
    </main>
    ${siteFooter()}`;

  bindSessionsPage();
}

function sessionRow(session) {
  const d = parseISO(session.date);
  const registered = isLiveRegistered(session);
  return `
  <article class="session-row ${session.id === nextLiveSession().id ? 'is-next' : ''}">
    <div class="session-date">
      <span class="d">${d.getDate()}</span>
      <span class="m">${monthShort(d)}</span>
      <span class="w">${DAYS[d.getDay()].slice(0, 3)}</span>
    </div>
    <div class="session-main">
      <div class="session-meta">
        <span>${session.start}-${session.end} GMT</span>
        <span>·</span>
        <span>${durationLabel(session.start, session.end)}</span>
        <span>·</span>
        <span>${esc(session.tag)}</span>
        ${registered ? `<span class="pill pill-green session-pill">Inscrite</span>` : ''}
      </div>
      <h3><a href="#/sessions/${session.id}">${esc(session.title)}</a></h3>
      <p>${esc(session.description)}</p>
      <div class="session-coach">
        ${liveAvatar(session)}
        <span>Avec ${esc(session.instructor)} · ${esc(liveInstructor(session).role)}</span>
      </div>
    </div>
    <div class="session-side">
      <span class="session-time">${longDate(session.date)}</span>
      <button class="btn ${registered ? 'btn-outline' : 'btn-navy'} btn-sm session-register-btn ${registered ? 'is-on' : ''}" data-toggle-live="${session.id}" title="${registered ? 'Cliquer pour annuler l’inscription' : 'S’inscrire à cette session'}">
        ${registered ? `Inscription confirmée ${icon('check')}` : `S’inscrire ${icon('arrow-right')}`}
      </button>
      <a class="link-arrow session-detail-link" href="#/sessions/${session.id}">Voir le détail ${icon('arrow-right')}</a>
    </div>
  </article>`;
}

function replayCard(replay) {
  return `
  <button class="replay-card public-replay-card" data-public-replay="${replay.id}">
    <div class="replay-thumb">
      <img src="${replay.image}" alt="" loading="lazy" />
      <span class="play-badge">${icon('play')}</span>
    </div>
    <div class="replay-body">
      <div class="date">${esc(replay.date)}</div>
      <h3>${esc(replay.title)}</h3>
      <p>${esc(replay.meta)}</p>
      <span class="link-arrow">Voir le replay ${icon('arrow-right')}</span>
    </div>
  </button>`;
}

function bindSessionsPage() {
  appRoot.querySelectorAll('[data-sessions-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      sessionsFilter = btn.dataset.sessionsFilter;
      const y = window.scrollY;
      renderSessions();
      window.scrollTo({ top: y, behavior: 'auto' });
    });
  });
  appRoot.querySelectorAll('[data-open-room]').forEach((btn) => {
    btn.addEventListener('click', () => openLiveRoom(btn.dataset.openRoom, btn.dataset.mode || 'waiting'));
  });
  appRoot.querySelectorAll('[data-toggle-live]').forEach((btn) => {
    btn.addEventListener('click', () => toggleLiveRegistration(btn.dataset.toggleLive));
  });
  appRoot.querySelectorAll('[data-public-replay]').forEach((btn) => {
    btn.addEventListener('click', () => openPublicReplay(btn.dataset.publicReplay));
  });
  appRoot.querySelectorAll('[data-quality]').forEach((btn) => {
    btn.addEventListener('click', () => openInfoModal('Qualité vidéo'));
  });
}

/* =========================================================
   Détail d'une session
   ========================================================= */

function renderSessionDetail(id) {
  const live = liveSessionById(id) || nextLiveSession();
  const course = courseById(live.course);
  const registered = isLiveRegistered(live);
  const d = parseISO(live.date);
  const points = course ? course.objectives.slice(0, 4) : [
    'Partir d’un cas concret issu du terrain',
    'Échanger avec un professionnel en activité',
    'Repartir avec une méthode applicable',
    'Revoir la session en replay',
  ];
  const other = sortedLiveSessions().find((s) => s.id !== live.id);
  const replays = REPLAYS.filter((r) => r.course === live.course);

  appRoot.innerHTML = `
    ${siteHeader('direct')}
    <main>
      <section class="session-detail-hero">
        <div class="container">
          <a class="session-back" href="#/sessions">${icon('arrow-left')} Toutes les sessions en direct</a>
          <div class="session-detail-grid">
            <div>
              <div class="eyebrow">Session en direct · ${esc(live.tag)}</div>
              <h1>${esc(live.title)}</h1>
              <p class="session-detail-lead">${esc(live.description)}</p>
              <div class="session-facts">
                <span>${icon('calendar')} ${longDate(live.date)}</span>
                <span>${icon('clock')} ${live.start}-${live.end} GMT · ${durationLabel(live.start, live.end)}</span>
                <span>${icon('user')} ${esc(live.instructor)}</span>
                <span>${icon('globe')} En ligne · replay inclus</span>
              </div>
            </div>
            <div class="session-detail-date">
              <span class="month">${MONTHS[d.getMonth()]}</span>
              <span class="day">${d.getDate()}</span>
              <span class="weekday">${DAYS[d.getDay()]}</span>
              <span class="time">${live.start} GMT</span>
            </div>
          </div>
        </div>
      </section>

      <section class="session-detail-body">
        <div class="container session-detail-layout">
          <div class="session-detail-content">
            <div class="session-copy">
              <div class="section-kicker">Ce que vous allez travailler</div>
              <h2>Un cas concret, une méthode, vos questions.</h2>
              <p>${esc(live.description)} ${course ? `Cette session prolonge la formation « ${esc(course.title)} ».` : ''} Elle est conçue pour être suivie même si vous n’avez pas encore terminé tous les modules.</p>
              <ul class="session-points">
                ${points.map((p) => `<li>${icon('check-circle')} ${esc(p)}</li>`).join('')}
              </ul>
            </div>

            <div class="session-run">
              <h3>Comment se déroule la session</h3>
              <div class="session-steps">
                <div class="session-step"><span class="n">01</span><div><strong>Avant · Préparez vos questions</strong><p>Revoyez les modules associés et notez les points que vous voulez clarifier.</p></div></div>
                <div class="session-step"><span class="n">02</span><div><strong>Pendant · 60 min d’atelier</strong><p>Le formateur part d’un cas, construit la méthode avec vous et répond aux questions.</p></div></div>
                <div class="session-step"><span class="n">03</span><div><strong>Après · Questions et support</strong><p>30 minutes d’échanges, puis le support et le replay sont publiés dans votre espace.</p></div></div>
                <div class="session-step"><span class="n">04</span><div><strong>Accès · 15 min avant</strong><p>Le bouton d’accès apparaît dans votre agenda. Aucun logiciel à installer.</p></div></div>
              </div>
              <div class="session-reminder">${icon('help')} Session de démonstration : la salle de direct est simulée dans le navigateur. Aucune donnée réelle n’est transmise.</div>
            </div>

            ${replays.length ? `
              <div class="session-run" style="background:#fff">
                <h3>Revoir une session liée</h3>
                <div class="sessions-replay-grid" style="margin-top:14px;grid-template-columns:1fr">
                  ${replays.map(replayCard).join('')}
                </div>
              </div>` : ''}
          </div>

          <aside>
            <div class="session-side-card">
              <div class="session-side-inner">
                <span class="pill ${registered ? 'pill-green' : 'pill-cream'}">${registered ? 'Inscription confirmée' : 'Inscription ouverte'}</span>
                <h3>${registered ? 'Votre place est réservée.' : 'Réservez votre place.'}</h3>
                <p class="side-intro">${registered ? 'Vous recevrez le lien d’accès 15 minutes avant le direct. Le replay restera disponible.' : 'L’inscription est gratuite pour les apprenants. Vous pourrez annuler à tout moment.'}</p>
                <div class="session-side-line"><span>Date</span><strong>${shortDate(live.date)}</strong></div>
                <div class="session-side-line"><span>Horaire</span><strong>${live.start}-${live.end} GMT</strong></div>
                <div class="session-side-line"><span>Durée</span><strong>${durationLabel(live.start, live.end)}</strong></div>
                <div class="session-side-line"><span>Format</span><strong>Atelier en ligne</strong></div>
                <div class="session-side-line"><span>Accès</span><strong>15 min avant</strong></div>
                <div class="session-side-actions">
                  <button class="btn ${registered ? 'btn-outline' : 'btn-navy'} btn-block" data-toggle-live="${live.id}">
                    ${registered ? `Annuler mon inscription ${icon('x')}` : `S’inscrire au direct ${icon('arrow-right')}`}
                  </button>
                  <button class="btn btn-outline btn-block" data-add-agenda="${live.id}">${icon('calendar')} Ajouter à mon agenda</button>
                  <button class="btn btn-outline btn-block" data-open-room="${live.id}" data-mode="waiting">${icon('monitor')} Tester la salle de direct</button>
                </div>
                <div class="session-side-foot">${registered ? 'Inscription enregistrée dans cette démonstration.' : 'Aucun paiement demandé. Session simulée.'} Le direct est enregistré et le replay sera ajouté à votre espace.</div>
              </div>
              ${other ? `
                <div class="session-related">
                  <div class="panel-kicker">Également au programme</div>
                  <h4>${esc(other.title)}</h4>
                  <p>${shortDate(other.date)} · ${other.start} GMT · ${esc(other.tag)}</p>
                  <a class="link-arrow" href="#/sessions/${other.id}">Voir la session ${icon('arrow-right')}</a>
                </div>` : ''}
            </div>

            ${course ? `
              <div class="session-info-card" style="margin-top:14px">
                <div class="panel-kicker">Formation liée</div>
                <h3 style="font-size:18px">${esc(course.title)}</h3>
                <p>${course.hours} h · ${course.modulesCount} modules · ${esc(course.level)}</p>
                <a class="btn btn-outline btn-sm btn-block" href="#/formation/${course.id}" style="margin-top:12px">Voir la formation ${icon('arrow-right')}</a>
              </div>` : ''}
          </aside>
        </div>
      </section>

      <section class="sessions-final">
        <div class="container final-grid">
          <div>
            <div class="eyebrow">Avant le direct</div>
            <h2>Préparez vos questions.<br />Nous préparons le reste.</h2>
            <p>Un doute sur le programme ou l’accès à la salle ? L’équipe pédagogique vous répond.</p>
          </div>
          <div class="final-actions">
            <button class="btn btn-ghost-light" data-contact="Sessions en direct">Contacter l’académie</button>
            <a class="btn btn-gold" href="#/catalogue">Voir les formations ${icon('arrow-right')}</a>
          </div>
        </div>
      </section>
    </main>
    ${siteFooter()}`;

  bindSessionDetailPage();
}

function bindSessionDetailPage() {
  appRoot.querySelectorAll('[data-toggle-live]').forEach((btn) => {
    btn.addEventListener('click', () => toggleLiveRegistration(btn.dataset.toggleLive));
  });
  appRoot.querySelectorAll('[data-add-agenda]').forEach((btn) => {
    btn.addEventListener('click', () => addLiveToAgenda(btn.dataset.addAgenda));
  });
  appRoot.querySelectorAll('[data-open-room]').forEach((btn) => {
    btn.addEventListener('click', () => openLiveRoom(btn.dataset.openRoom, btn.dataset.mode || 'waiting'));
  });
  appRoot.querySelectorAll('[data-public-replay]').forEach((btn) => {
    btn.addEventListener('click', () => openPublicReplay(btn.dataset.publicReplay));
  });
}

/* ---------- Inscription / calendrier ---------- */
function refreshSessionsView() {
  const y = window.scrollY;
  const route = location.hash.split('?')[0];
  if (/^#\/sessions\/.+/.test(route)) renderSessionDetail(route.split('/')[2]);
  else renderSessions();
  window.scrollTo({ top: y, behavior: 'auto' });
}

function toggleLiveRegistration(id) {
  const live = liveSessionById(id);
  if (!live) return;
  const wasRegistered = live.registered;
  live.registered = !wasRegistered;
  if (!live.registered) live.inAgenda = false;
  toast(wasRegistered
    ? 'Inscription annulée. Vous pourrez vous réinscrire à tout moment.'
    : 'Inscription confirmée. Le lien d’accès sera disponible 15 minutes avant le direct.');
  refreshSessionsView();
}

function addLiveToAgenda(id) {
  const live = liveSessionById(id);
  if (!live) return;
  const already = live.registered && live.inAgenda;
  live.registered = true;
  live.inAgenda = true;
  downloadSessionIcs(id, false);
  toast(already
    ? 'Cette session est déjà dans votre agenda.'
    : `Session ajoutée à votre agenda : ${shortDate(live.date)} · ${live.start}–${live.end} GMT.`);
  refreshSessionsView();
}

function icsStamp(date, time) {
  return `${date.replace(/-/g, '')}T${time.replace(':', '')}00Z`;
}

function downloadSessionIcs(id, notify = true) {
  const live = liveSessionById(id);
  if (!live) return;
  const safeTitle = live.title.replace(/[\\;,]/g, ' ');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BAOBAB Mine Academy//Sessions en direct//FR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${live.id}@baobab-mine-academy.demo`,
    `DTSTAMP:${icsStamp(DEMO_TODAY, '08:00')}`,
    `DTSTART:${icsStamp(live.date, live.start)}`,
    `DTEND:${icsStamp(live.date, live.end)}`,
    `SUMMARY:${safeTitle}`,
    `DESCRIPTION:Session en direct BAOBAB Mine Academy avec ${live.instructor}. ${live.description.replace(/[\\;,]/g, ' ')}`,
    'LOCATION:En ligne - BAOBAB Mine Academy',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `baobab-session-${live.id}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  if (notify) toast('Fichier calendrier téléchargé.');
}

/* =========================================================
   Salle de direct simulée
   ========================================================= */
let liveSimTimer = null;

const liveSim = {
  sessionId: null,
  mode: 'waiting',
  running: false,
  elapsed: 0,
  duration: 90 * 60,
  tab: 'chat',
  viewers: 128,
  messages: [],
  questions: [],
  scriptIndex: 0,
};

const LIVE_SCRIPT = [
  { who: 'Formateur', coach: true, text: 'Bienvenue à toutes et tous. Nous allons partir du cas affiché à l’écran.' },
  { who: 'Fatou D.', text: 'Bonjour, peut-on revenir sur la différence entre donnée de terrain et hypothèse de travail ?' },
  { who: 'Formateur', coach: true, text: 'Bonne question : la donnée de terrain se mesure, l’hypothèse se construit puis se vérifie. Nous allons le voir sur le cas.' },
  { who: 'Ibrahim K.', text: 'Le fichier du cas pratique sera disponible après la session ?' },
  { who: 'Awa S.', text: 'Merci, c’est plus clair avec le tableau à l’écran.' },
];

function resetLiveSim(session, mode) {
  liveSim.sessionId = session.id;
  liveSim.mode = mode || 'waiting';
  liveSim.running = false;
  liveSim.elapsed = 0;
  liveSim.duration = Math.max(1, timeToMinutes(session.end) - timeToMinutes(session.start)) * 60;
  liveSim.tab = 'chat';
  liveSim.viewers = 128 + Math.floor(Math.random() * 12);
  liveSim.scriptIndex = 0;
  liveSim.messages = [
    { system: true, text: 'Salle de démonstration ouverte. Les messages sont simulés.' },
    { who: session.instructor, coach: true, text: `Bonjour Aminata, ravie de vous retrouver pour cet atelier sur « ${session.title} ».` },
    { who: 'Awa S.', text: 'Bonjour à tous, je suis depuis Dakar.' },
    { who: 'Ibrahim K.', text: 'Le son est bon de mon côté.' },
    { who: 'Fatou D.', text: 'Prête pour la démonstration.' },
  ];
  liveSim.questions = [
    { who: 'Ibrahim K.', text: 'Comment choisir entre un planning hebdomadaire et un planning journalier ?', answered: true },
  ];
}

function stopLiveSim() {
  if (liveSimTimer) {
    clearInterval(liveSimTimer);
    liveSimTimer = null;
  }
  liveSim.running = false;
}

function openLiveRoom(id, mode) {
  const live = liveSessionById(id) || nextLiveSession();
  stopLiveSim();
  stopPublicReplay();
  resetLiveSim(live, mode || 'waiting');
  openModal(`
    <button class="live-modal__close" data-close aria-label="Fermer">${icon('x')}</button>
    <div class="live-room" id="live-room">${liveRoomBody(live)}</div>`, 'live-modal');
  bindLiveRoom(live);
  if (liveSim.mode === 'live') startLiveSim();
}

function liveRoomBody(live) {
  const waiting = liveSim.mode !== 'live';
  const course = courseById(live.course);
  return `
  <div class="live-stage-wrap">
    <img class="live-stage-bg" src="${course ? course.image : 'assets/img/mine-pit.jpg'}" alt="" />
    <div class="live-stage-shade"></div>
    ${waiting ? liveWaitingHtml(live) : liveStageHtml(live)}
  </div>
  ${liveChatHtml(live)}`;
}

function liveWaitingHtml(live) {
  return `
  <div class="live-waiting">
    <span class="wait-ring">${icon('monitor')}</span>
    <div class="live-kicker">Salle de direct · démonstration</div>
    <h2>Le direct commence bientôt.</h2>
    <p>${longDate(live.date)} · ${live.start}-${live.end} GMT avec ${esc(live.instructor)}.<br />Vous pouvez tester le son, le chat et les questions avant l’ouverture.</p>
    <div class="wait-actions">
      <button class="btn btn-gold" data-live-start>Démarrer la simulation ${icon('play')}</button>
      <button class="btn btn-ghost-light" data-live-question>Une question ?</button>
    </div>
    <div class="wait-note">Salle de démonstration · le direct est simulé, aucun flux réel n’est diffusé.</div>
  </div>`;
}

function liveStageHtml(live) {
  return `
  <div class="live-stage-top">
    <span class="live-badge"><i></i> En direct</span>
    <span class="live-viewers">${icon('users')} <span id="live-viewers">${liveSim.viewers}</span> participants</span>
  </div>
  <div class="live-stage-center">
    <div class="live-kicker">Atelier · ${esc(live.tag)}</div>
    <h2>${esc(live.title)}</h2>
    <p class="live-topic">${esc(live.description)}</p>
    <div class="live-speaker">
      ${liveAvatar(live)}
      <div>
        <strong>${esc(live.instructor)}</strong>
        <span>${esc(liveInstructor(live).role)}</span>
      </div>
    </div>
    <div class="live-actions">
      <button class="btn btn-gold btn-sm" data-live-prep>${icon('file-text')} Fiche préparatoire</button>
      <button class="btn btn-ghost-light btn-sm" data-live-hand>${icon('message')} Lever la main</button>
    </div>
  </div>
  <div class="live-controls">
    <div class="live-progress"><span id="live-progress-fill" style="width:${(liveSim.elapsed / liveSim.duration) * 100}%"></span></div>
    <button class="ctrl-btn" data-live-toggle-play id="live-play-btn" aria-label="${liveSim.running ? 'Mettre en pause' : 'Reprendre la session'}">${liveSim.running ? icon('pause') : icon('play')}</button>
    <span id="live-elapsed">${formatSec(liveSim.elapsed)} / ${formatSec(liveSim.duration)}</span>
    <span class="spacer"></span>
    <span class="live-quality-note">360p · son activé</span>
    <button class="ctrl-btn" data-live-leave aria-label="Quitter la salle">${icon('x')}</button>
  </div>`;
}

function liveChatHtml(live) {
  return `
  <div class="live-chat">
    <div class="live-chat-head">
      <div class="live-chat-tabs">
        <button class="live-chat-tab ${liveSim.tab === 'chat' ? 'active' : ''}" data-live-tab="chat">Discussion</button>
        <button class="live-chat-tab ${liveSim.tab === 'qa' ? 'active' : ''}" data-live-tab="qa">Questions</button>
      </div>
      <span>${liveSim.mode === 'live' ? 'En direct' : 'En attente'}</span>
    </div>
    <div class="live-chat-list" id="live-chat-list">${liveChatListHtml()}</div>
    <form class="live-chat-form" data-live-form>
      <input type="text" name="message" maxlength="240" placeholder="${liveSim.tab === 'qa' ? 'Poser une question…' : 'Écrire un message…'}" aria-label="${liveSim.tab === 'qa' ? 'Poser une question' : 'Écrire un message'}" autocomplete="off" />
      <button type="submit" aria-label="Envoyer">${icon('arrow-right')}</button>
    </form>
    <div class="live-chat-foot">Démonstration · messages et participants simulés.</div>
  </div>`;
}

function liveChatListHtml() {
  if (liveSim.tab === 'qa') {
    return liveSim.questions.map((q) => `
      <div class="live-msg ${q.answered ? 'system' : ''}">
        <span class="avatar navy">${initialsOf(q.who)}</span>
        <div class="msg-body">
          <strong>${esc(q.who)}${q.you ? ' · vous' : ''}</strong>
          <p>${esc(q.text)}</p>
          ${q.answered ? '<p class="live-msg__note">Question traitée pendant l’atelier</p>' : ''}
        </div>
      </div>`).join('') || '<div class="live-msg system"><p>Aucune question pour le moment. Posez la première.</p></div>';
  }
  return liveSim.messages.map((m) => {
    if (m.system) return `<div class="live-msg system"><p>${esc(m.text)}</p></div>`;
    return `<div class="live-msg">
      <span class="avatar navy">${initialsOf(m.who)}</span>
      <div class="msg-body">
        <strong class="${m.coach ? 'is-coach' : ''}">${esc(m.who)}${m.coach ? ' · formateur' : m.you ? ' · vous' : ''}</strong>
        <p>${esc(m.text)}</p>
      </div>
    </div>`;
  }).join('') || '<div class="live-msg system"><p>La discussion est ouverte.</p></div>';
}

function refreshLiveChatList() {
  const list = document.getElementById('live-chat-list');
  if (list) list.innerHTML = liveChatListHtml();
  document.querySelectorAll('.live-chat-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.liveTab === liveSim.tab);
  });
  const input = document.querySelector('.live-chat-form input');
  if (input) {
    input.placeholder = liveSim.tab === 'qa' ? 'Poser une question…' : 'Écrire un message…';
    input.setAttribute('aria-label', liveSim.tab === 'qa' ? 'Poser une question' : 'Écrire un message');
  }
  if (list) list.scrollTop = list.scrollHeight;
}

function bindLiveRoom(live) {
  const room = document.getElementById('live-room');
  if (!room) return;

  room.querySelectorAll('[data-live-start]').forEach((btn) => {
    btn.addEventListener('click', () => {
      liveSim.mode = 'live';
      liveSim.elapsed = 0;
      const fresh = liveSessionById(live.id) || live;
      room.innerHTML = liveRoomBody(fresh);
      bindLiveRoom(fresh);
      startLiveSim();
    });
  });

  room.querySelectorAll('[data-live-question]').forEach((btn) => {
    btn.addEventListener('click', () => {
      liveSim.tab = 'qa';
      refreshLiveChatList();
      const input = document.querySelector('.live-chat-form input');
      if (input) input.focus();
    });
  });

  room.querySelectorAll('[data-live-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      liveSim.tab = tab.dataset.liveTab;
      refreshLiveChatList();
    });
  });

  room.querySelectorAll('[data-live-toggle-play]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (liveSim.running) {
        stopLiveSim();
        updateLivePlayButton();
        toast('Diffusion simulée en pause.');
        return;
      }
      if (liveSim.elapsed >= liveSim.duration) liveSim.elapsed = 0;
      startLiveSim();
    });
  });

  room.querySelectorAll('[data-live-leave]').forEach((btn) => {
    btn.addEventListener('click', () => {
      stopLiveSim();
      closeModal();
      toast('Vous avez quitté la salle de démonstration.');
    });
  });

  room.querySelectorAll('[data-live-hand]').forEach((btn) => {
    btn.addEventListener('click', raiseHand);
  });

  room.querySelectorAll('[data-live-prep]').forEach((btn) => {
    btn.addEventListener('click', () => {
      stopLiveSim();
      closeModal();
      navigate(`#/formation/${live.course}`);
      toast('Fiche préparatoire : retrouvez les modules associés à la session.');
    });
  });

  const form = room.querySelector('[data-live-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      sendLiveMessage(form);
    });
  }
}

function startLiveSim() {
  stopLiveSim();
  liveSim.running = true;
  updateLivePlayButton();
  liveSimTimer = setInterval(() => {
    if (!liveSim.sessionId || !document.querySelector('.live-modal')) { stopLiveSim(); return; }
    liveSim.elapsed = Math.min(liveSim.duration, liveSim.elapsed + 5);
    updateLiveClock();
    if (liveSim.elapsed >= liveSim.duration) {
      stopLiveSim();
      updateLivePlayButton();
      toast('Fin de la session simulée. Le replay serait disponible dans votre espace.');
      return;
    }
    if (liveSim.elapsed % 25 === 0) pushScriptedLiveMessage();
  }, 1000);
}

function updateLiveClock() {
  const elapsed = document.getElementById('live-elapsed');
  const fill = document.getElementById('live-progress-fill');
  if (elapsed) elapsed.textContent = `${formatSec(liveSim.elapsed)} / ${formatSec(liveSim.duration)}`;
  if (fill) fill.style.width = `${Math.min(100, (liveSim.elapsed / liveSim.duration) * 100)}%`;
}

function updateLivePlayButton() {
  const btn = document.getElementById('live-play-btn');
  if (btn) {
    btn.innerHTML = liveSim.running ? icon('pause') : icon('play');
    btn.setAttribute('aria-label', liveSim.running ? 'Mettre en pause' : 'Reprendre la session');
  }
}

function pushScriptedLiveMessage() {
  if (liveSim.scriptIndex >= LIVE_SCRIPT.length) return;
  const live = liveSessionById(liveSim.sessionId);
  const template = LIVE_SCRIPT[liveSim.scriptIndex++];
  const message = Object.assign({}, template, {
    who: template.coach && live ? live.instructor : template.who,
  });
  liveSim.messages.push(message);
  liveSim.viewers += 1;
  const viewers = document.getElementById('live-viewers');
  if (viewers) viewers.textContent = liveSim.viewers;
  if (liveSim.tab === 'chat') refreshLiveChatList();
}

function sendLiveMessage(form) {
  const input = form.querySelector('input[name="message"]');
  if (!input) return;
  const text = input.value.trim();
  if (!text) { input.focus(); return; }
  const who = `${USER.first} ${USER.last}`;
  if (liveSim.tab === 'qa') {
    liveSim.questions.push({ who, text, you: true });
    input.value = '';
    refreshLiveChatList();
    const id = liveSim.sessionId;
    setTimeout(() => {
      if (liveSim.sessionId !== id || !document.querySelector('.live-modal')) return;
      const current = liveSessionById(id);
      liveSim.questions.push({
        who: current ? current.instructor : 'Formateur',
        text: 'Merci pour votre question. Je la garde pour la partie échanges, après la démonstration.',
        answered: false,
      });
      if (liveSim.tab === 'qa') refreshLiveChatList();
    }, 1500);
    toast('Question envoyée au formateur (démonstration).');
  } else {
    liveSim.messages.push({ who, text, you: true });
    input.value = '';
    refreshLiveChatList();
    const id = liveSim.sessionId;
    setTimeout(() => {
      if (liveSim.sessionId !== id || !document.querySelector('.live-modal')) return;
      const current = liveSessionById(id);
      liveSim.messages.push({
        who: current ? current.instructor : 'Formateur',
        coach: true,
        text: 'Bien reçu, je prends votre remarque en compte pour la suite de l’atelier.',
      });
      if (liveSim.tab === 'chat') refreshLiveChatList();
    }, 1400);
    toast('Message envoyé (démonstration).');
  }
}

function raiseHand() {
  liveSim.messages.push({ system: true, text: `${USER.first} ${USER.last} a levé la main. Le formateur vous donnera la parole.` });
  if (liveSim.tab === 'chat') refreshLiveChatList();
  toast('Votre main est levée. Le formateur sera notifié (démonstration).');
}

/* =========================================================
   Replay public simulé
   ========================================================= */
const publicReplayState = { id: null, playing: false, elapsed: 0, duration: 78 * 60, timer: null };

function stopPublicReplay() {
  if (publicReplayState.timer) {
    clearInterval(publicReplayState.timer);
    publicReplayState.timer = null;
  }
  publicReplayState.playing = false;
}

function stopSessionTimers() {
  stopLiveSim();
  stopPublicReplay();
}

function openPublicReplay(id) {
  const replay = REPLAYS.find((r) => r.id === id) || REPLAYS[0];
  stopPublicReplay();
  stopLiveSim();
  publicReplayState.id = replay.id;
  publicReplayState.elapsed = 0;

  openModal(`
    <div class="modal__head">
      <div>
        <span class="eyebrow">Replay · Session en direct</span>
        <h2>${esc(replay.title)}</h2>
        <p>${esc(replay.date)} · ${esc(replay.meta)}</p>
      </div>
      <button class="modal__close" data-close aria-label="Fermer">${icon('x')}</button>
    </div>
    <div class="modal__body">
      <div class="public-replay-player">
        <img src="${replay.image}" alt="Aperçu du replay" />
        <div class="public-replay-shade"></div>
        <button class="play-btn" data-replay-toggle aria-label="Lire le replay">${icon('play')}</button>
        <div class="public-replay-caption">${icon('play')} Replay de démonstration · BAOBAB Mine Academy</div>
      </div>
      <div class="public-replay-controls">
        <div class="public-replay-bar"><span id="replay-played" style="width:0"></span></div>
        <button class="ctrl-btn" data-replay-toggle aria-label="Lecture / pause">${icon('play')}</button>
        <span class="time"><span id="replay-current">00:00</span> / ${formatSec(publicReplayState.duration)}</span>
        <span class="spacer"></span>
        <span class="replay-quality">360p · Éco</span>
      </div>
      <div class="demo-info">
        <p><strong>${esc(replay.title)}</strong> — ${esc(replay.meta)}.</p>
        <p>Ce replay est simulé : la lecture illustre l’expérience sans diffuser de vidéo réelle. Le support et l’exercice associés sont disponibles dans la formation.</p>
      </div>
    </div>
    <div class="modal__foot">
      <p>Replay de démonstration · aucun flux vidéo réel n’est diffusé.</p>
      <div class="modal__actions">
        <button class="btn btn-outline" data-close>Fermer</button>
        <a class="btn btn-navy" href="#/formation/${replay.course}" data-close>Ouvrir la formation ${icon('arrow-right')}</a>
      </div>
    </div>`, 'modal--replay');

  modalRoot.querySelectorAll('[data-replay-toggle]').forEach((btn) => {
    btn.addEventListener('click', togglePublicReplay);
  });
  updatePublicReplayUi();
}

function togglePublicReplay() {
  if (publicReplayState.playing) {
    stopPublicReplay();
    updatePublicReplayUi();
    return;
  }
  publicReplayState.playing = true;
  publicReplayState.timer = setInterval(() => {
    if (!document.getElementById('replay-current')) { stopPublicReplay(); return; }
    publicReplayState.elapsed = Math.min(publicReplayState.duration, publicReplayState.elapsed + 5);
    updatePublicReplayUi();
    if (publicReplayState.elapsed >= publicReplayState.duration) {
      stopPublicReplay();
      updatePublicReplayUi();
      toast('Fin du replay de démonstration.');
    }
  }, 1000);
  updatePublicReplayUi();
}

function updatePublicReplayUi() {
  const current = document.getElementById('replay-current');
  const played = document.getElementById('replay-played');
  if (current) current.textContent = formatSec(publicReplayState.elapsed);
  if (played) played.style.width = `${Math.min(100, (publicReplayState.elapsed / publicReplayState.duration) * 100)}%`;
  document.querySelectorAll('[data-replay-toggle]').forEach((btn) => {
    btn.innerHTML = publicReplayState.playing ? icon('pause') : icon('play');
    btn.setAttribute('aria-label', publicReplayState.playing ? 'Mettre en pause' : 'Lire le replay');
  });
}
