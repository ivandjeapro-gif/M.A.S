/* =========================================================
   Agenda personnel + planification
   ========================================================= */

const MODULE_TITLES = {
  '05': 'Production & suivi',
};

function eventsFor(dateISO) {
  const list = [];
  if (state.agendaMode !== 'live') {
    state.slots.forEach((s) => {
      if (s.date === dateISO) list.push({ start: s.start, end: s.end, label: `Module ${s.module || '05'}`, kind: 'module' });
    });
    PLANNING_TASKS.forEach((t) => {
      if (t.date === dateISO) list.push({ start: t.start, end: t.end, label: t.label, kind: 'module' });
    });
  }
  if (state.agendaMode !== 'modules') {
    LIVE_SESSIONS.forEach((l) => {
      if (l.date === dateISO) list.push({ start: l.start, end: l.end, label: 'Direct', kind: 'live', mine: !!l.inAgenda });
    });
  }
  return list.sort((a, b) => a.start.localeCompare(b.start));
}

function renderAgenda() {
  const content = `
    <div class="page-head">
      <div>
        <span class="page-eyebrow">Apprendre ensemble</span>
        <h1 class="page-title">Votre agenda personnel.</h1>
        <p class="page-sub">Planifiez vos modules sur plusieurs jours et gardez les sessions en direct à l’œil.</p>
      </div>
      <div class="page-head__aside page-head__actions">
        <button class="btn btn-outline" id="open-chooser">Modules à planifier (1)</button>
        <button class="btn btn-navy" id="open-live">${icon('video')} Planifier un direct</button>
      </div>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;gap:16px;margin-top:18px;flex-wrap:wrap">
      <div class="chooser__tabs" style="margin:0;gap:4px">
        <button class="${state.agendaMode === 'all' ? 'is-active' : ''}" data-mode="all">Toutes les sessions</button>
        <button class="${state.agendaMode === 'modules' ? 'is-active' : ''}" data-mode="modules">Mes formations</button>
        <button class="${state.agendaMode === 'live' ? 'is-active' : ''}" data-mode="live">Sessions en direct</button>
      </div>
      <span style="font-size:9px;color:var(--muted);display:inline-flex;align-items:center;gap:6px">${icon('compass')} ${AGREEMENT.timezone}</span>
    </div>

    <div class="agenda-layout ${state.chooserOpen ? 'is-chooser' : ''}">
      <div>
        <section class="cal-card" id="cal-card">
          <div class="cal-head">
            <h2>${calendarTitle()}</h2>
            <div class="cal-nav">
              <button id="cal-prev" aria-label="Mois précédent">${icon('chevron-left')}</button>
              <button class="is-current" id="cal-today">Aujourd’hui</button>
              <button class="is-hint" id="cal-hint">Clic droit</button>
              <button id="cal-next" aria-label="Mois suivant">${icon('chevron-right')}</button>
            </div>
          </div>
          <div class="cal-week">
            <span>Lun.</span><span>Mar.</span><span>Mer.</span><span>Jeu.</span><span>Ven.</span><span>Sam.</span><span>Dim.</span>
          </div>
          <div class="cal-grid" id="cal-grid">${calendarCells()}</div>
          <div class="cal-legend">
            <span><i></i> Modules planifiés</span>
            <span><i class="live"></i> Directs dans votre agenda</span>
            <span><i class="live live--open"></i> Inscriptions ouvertes</span>
            <span class="count">${monthCounts()}</span>
          </div>
        </section>

        <section class="replays">
          <div class="replays__head">
            <h2>À revoir à votre rythme</h2>
            <a href="#/app/cours">Tous les replays</a>
          </div>
          <div class="replay-grid">
            <article class="replay-card">
              <a class="replay-card__media" href="#/app/cours"><img src="assets/img/mine-pit.jpg" alt="" /><span class="replay-card__play">${icon('play')}</span></a>
              <div>
                <span class="replay-card__date">22 oct. 2026</span>
                <h3>Les choix de séquençage en pratique</h3>
                <p>Moussa Koné · 1 h 18 · Planification</p>
                <a href="#/app/cours">Voir le replay ${icon('arrow-right')}</a>
              </div>
            </article>
            <article class="replay-card">
              <a class="replay-card__media" href="#/app/cours"><img src="assets/img/hse-workers.jpg" alt="" /><span class="replay-card__play">${icon('play')}</span></a>
              <div>
                <span class="replay-card__date">24 oct. 2026</span>
                <h3>Identifier les risques sur un poste de travail</h3>
                <p>Adama Ouédraogo · 52 min · HSE</p>
                <a href="#/app/cours">Voir le replay ${icon('arrow-right')}</a>
              </div>
            </article>
          </div>
        </section>
      </div>

      <aside class="rail" id="agenda-rail">${agendaRail()}</aside>
    </div>

    <p style="font-size:9px;color:var(--faint);margin-top:22px;padding-top:14px;border-top:1px solid var(--line-soft)">${esc(BRAND.demo)}</p>`;

  appShell({
    active: state.agendaMode === 'live' ? 'live' : 'agenda',
    crumbs: [{ label: 'Mon espace', href: '#/app' }, { label: 'Agenda personnel' }],
    content,
  });

  bindAgenda();
}

function calendarFirst() {
  return new Date(2026, 10 + state.calendarMonth, 1);
}

function calendarTitle() {
  const d = calendarFirst();
  const month = MONTHS[d.getMonth()];
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${d.getFullYear()}`;
}

function monthCounts() {
  const d = calendarFirst();
  const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  const moduleDays = new Set([...state.slots.map((s) => s.date), ...PLANNING_TASKS.map((t) => t.date)].filter((day) => day.startsWith(prefix)));
  const liveCount = LIVE_SESSIONS.filter((l) => l.date.startsWith(prefix)).length;
  const moduleLabel = moduleDays.size ? '1 module planifié' : 'Aucun module planifié';
  const liveLabel = liveCount === 0 ? 'aucune session' : `${liveCount} session${liveCount > 1 ? 's' : ''}`;
  return `${moduleLabel} · ${liveLabel} ce mois-ci`;
}

function calendarCells() {
  const first = calendarFirst();
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(first.getFullYear(), first.getMonth(), 1 - offset);
  let html = '';
  for (let i = 0; i < 42; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    const iso = isoOf(d);
    const out = d.getMonth() !== first.getMonth();
    const today = iso === '2026-11-05';
    const selected = iso === state.selectedDay;
    const events = eventsFor(iso);
    html += `
      <div class="cal-cell ${out ? 'is-out' : ''} ${today ? 'is-today' : ''} ${selected ? 'is-selected' : ''}" data-day="${iso}">
        <span class="cal-daynum">${d.getDate()}</span>
        <div class="cal-events">
          ${events.slice(0, 2).map((e) => `<div class="cal-event ${e.kind === 'live' ? 'cal-event--live' : ''} ${e.mine ? 'is-mine' : ''}"><b>${e.start}–${e.end}</b><span>${esc(e.label)}</span></div>`).join('')}
        </div>
      </div>`;
  }
  return html;
}

function agendaRail() {
  if (state.chooserOpen) return chooserPanel();
  const iso = state.selectedDay;
  const events = eventsFor(iso);
  const slot = state.slots.find((s) => s.date === iso);
  const live = LIVE_SESSIONS.find((l) => l.date === iso);
  const hasModule = events.some((e) => e.kind === 'module');
  const slotModule = slot
    ? getCourse('planification').modules.find((m) => m.n === (slot.module || '05'))
    : null;
  const slotTitle = slotModule ? `Module ${slotModule.n} · ${slotModule.title}` : 'Module 5 · Production &amp; suivi';

  return `
    <div class="day-card">
      <span class="day-card__label">${longDate(iso)} · Créneau sélectionné</span>
      <h2>${hasModule ? slotTitle : live ? esc(live.title) : 'Aucun créneau planifié'}</h2>
      <span class="pill ${hasModule ? 'pill-cream' : 'pill-muted'}">${hasModule ? 'Module personnel' : live ? 'Session en direct' : 'Journée libre'}</span>
      <p class="day-card__desc">${hasModule
        ? `${slotTitle} de la formation Planification minière à ciel ouvert · ${state.slots.filter((s) => (s.module || '05') === (slot?.module || '05')).length} créneau(x) planifié(s).`
        : live
          ? `${esc(live.title)} — session en direct avec ${esc(live.instructor)}.`
          : 'Choisissez un module pour planifier un créneau. Les créneaux ne valident pas les acquis.'}</p>
      <ul class="day-card__times">
        ${events.length
          ? events.map((e) => `<li>${icon('clock')}<span>${e.start}–${e.end} GMT · ${esc(e.label)}${e.kind === 'live' ? ' · session en direct' : ''}</span></li>`).join('')
          : `<li>${icon('clock')}<span>${AGREEMENT.timezone}</span></li>`}
      </ul>
      ${hasModule ? `
        <div class="day-card__coach">
          <img src="assets/img/moussa.jpg" alt="" />
          <div><b>Moussa Koné</b><span>Ingénieur des mines</span></div>
        </div>
        <p class="day-card__note">Ce module est réparti sur trois jours : 2 h les 9 et 10 novembre, puis 1 h le 11 novembre.</p>` : ''}
      <button class="btn ${hasModule ? 'btn-outline' : 'btn-navy'} btn-block" id="open-plan">${hasModule ? 'Replanifier les créneaux' : 'Planifier un module'} ${icon('calendar')}</button>
      <button class="btn btn-outline btn-block" id="rail-live">${icon('video')} Planifier un direct</button>
      ${hasModule ? `<div class="day-card__hint">${icon('help')}<span>Planifier un créneau ne modifie ni la progression ni les prérequis d’accès au module.</span></div>` : ''}
      ${hasModule ? '<p class="day-card__note">Module personnel. Clic droit sur un jour pour planifier un autre module.</p>' : ''}
    </div>

    ${directCard(iso)}`;
}

function directCard(iso) {
  const session = LIVE_SESSIONS.find((l) => l.date === iso && l.inAgenda)
    || LIVE_SESSIONS.find((l) => l.date === iso)
    || LIVE_SESSIONS.find((l) => l.date > iso && l.inAgenda)
    || LIVE_SESSIONS.find((l) => l.date > iso);
  if (!session) return '';
  const d = parseISO(session.date);
  const day = DAYS[d.getDay()];
  const sessionCourse = getCourse(session.course);
  return `
    <div class="direct-card">
      <h3>Direct · ${day.charAt(0).toUpperCase()}${day.slice(1)} ${d.getDate()} ${MONTHS[d.getMonth()]}</h3>
      <p>${esc(session.title)}<br/>${session.start}–${session.end} GMT · ${esc(session.instructor)} · ${session.registered ? 'inscription confirmée' : 'inscription ouverte'}.</p>
      <p>Atelier de la formation ${esc(sessionCourse.title)}. À partir d’un modèle simplifié, construisons les étapes d’un planning de production.</p>
      <p>Lien ouvert ${session.registered ? 'dès 15 minutes avant' : 'après inscription'}. Session enregistrée ; replay et support après le direct.</p>
      ${session.registered && session.inAgenda
        ? `<a class="link-arrow" href="#/app/cours">Consulter la fiche préparatoire ${icon('arrow-right')}</a>`
        : `<button class="btn btn-navy btn-sm" id="register-live">${session.registered ? 'Ajouter à mon agenda' : 'S’inscrire au direct'}</button>`}
    </div>`;
}

function chooserPanel() {
  const course = getCourse('planification');
  const selected = course.modules.find((m) => m.n === state.chooserModule) || course.modules[4];
  const countActive = course.modules.filter((m) => m.state === 'active').length;
  const countUnplanned = course.modules.filter((m) => m.state !== 'active' && m.state !== 'done').length;
  const q = state.chooserQuery.trim().toLowerCase();
  const visible = course.modules.filter((m) => {
    const filterOk = state.chooserFilter === 'all'
      || (state.chooserFilter === 'active' ? m.state === 'active' : m.state !== 'active' && m.state !== 'done');
    const queryOk = !q || `${m.n} ${m.title} ${m.topics}`.toLowerCase().includes(q);
    return filterOk && queryOk;
  });
  const isModify = selected.n === '05' && !state.chooserNewSlot;
  const startVal = isModify ? state.slots[0].start : '09:00';
  const durationVal = isModify ? Math.round(slotDuration(state.slots[0])) : 2;
  const dateVal = selected.n === '05' ? (isModify ? state.slots[0].date : state.selectedDay) : state.selectedDay;
  return `
    <div class="chooser">
      <div class="chooser__head">
        <div><span class="eyebrow">${longDate(state.selectedDay)}</span><h2>Choisir un module</h2></div>
        <button class="chooser__close" id="chooser-close" aria-label="Fermer">${icon('x')}</button>
      </div>
      <div class="chooser__search">${icon('search')}<input class="field" id="chooser-search" value="${esc(state.chooserQuery)}" placeholder="Rechercher un module, un numéro…" autocomplete="off" /></div>
      <p class="chooser__label">Cours parent</p>
      <select class="field field--select"><option>Planification minière à ciel ouvert</option></select>
      <div class="chooser__tabs">
        <button class="${state.chooserFilter === 'all' ? 'is-active' : ''}" data-chooser-tab="all">Tous (${course.modules.length})</button>
        <button class="${state.chooserFilter === 'active' ? 'is-active' : ''}" data-chooser-tab="active">En cours (${countActive})</button>
        <button class="${state.chooserFilter === 'unplanned' ? 'is-active' : ''}" data-chooser-tab="unplanned">Non planifiée (${countUnplanned})</button>
      </div>
      <p class="chooser__meta">24 h · ${course.modules.length} modules · Les créneaux ne valident pas les acquis.</p>
      <div class="chooser__list">
        ${visible.length ? visible.map((m) => `
          <button class="chooser-module ${m.n === state.chooserModule ? 'is-selected' : ''} ${m.state === 'locked' ? 'is-locked' : ''}" data-module="${m.n}">
            <b>${m.n}</b>
            <div><h3>${esc(m.title)}</h3><p>${esc(m.duration)} · ${m.state === 'active' ? 'En cours · 3 créneaux déjà planifiés' : m.state === 'done' ? 'Terminé · Aucun créneau futur' : m.state === 'locked' ? 'Accès verrouillé · Non planifié' : 'À planifier'}</p>${m.n === '05' && m.n === state.chooserModule ? `<div class="chooser-module__slots">${state.slots.map((s) => `<span>${shortDate(s.date)} · ${s.start}–${s.end} GMT · ${formatHours(slotDuration(s))}</span>`).join('')}</div>` : ''}${m.state === 'locked' ? `<p class="chooser-module__lock">Planifiable à l’avance. L’examen reste verrouillé jusqu’à la validation des prérequis, dont le module 5.</p>` : ''}</div>
            <span>${m.state === 'locked' ? icon('lock') : m.state === 'active' ? icon('clock') : icon('check-circle')}</span>
          </button>`).join('') : '<p class="chooser__meta">Aucun module ne correspond à cette recherche.</p>'}
      </div>
      <div class="chooser-form">
        ${selected.n === '05' ? `
          <div class="chooser-form__tabs">
            <button class="${!state.chooserNewSlot ? 'is-active' : ''}" data-chooser-form="modify">Modifier le créneau</button>
            <button class="${state.chooserNewSlot ? 'is-active' : ''}" data-chooser-form="new">Nouveau créneau sans conflit</button>
          </div>
          <div class="chooser-form__info">${state.chooserNewSlot
            ? 'Ce nouveau créneau s’ajoutera aux créneaux existants du module 5, sans les remplacer. Aucun doublon ne sera créé.'
            : 'Vous modifiez le premier des créneaux du module 5. Les deux autres créneaux sont conservés.'}</div>` : `
          <div class="chooser-form__info">Ce module n’a pas encore de créneau. Choisissez une date et une durée pour l’ajouter à votre agenda.</div>`}
        <div class="chooser-form__grid">
          <div style="grid-column:1/-1"><label class="chooser__label" style="margin-top:0">${selected.n === '05' && !state.chooserNewSlot ? 'Date de destination' : 'Date'}</label><input class="field" type="date" value="${dateVal}" id="chooser-date" /></div>
          <div><label class="chooser__label" style="margin-top:0">Heure de début</label><select class="field field--select" id="chooser-start">
            ${['08:00', '09:00', '10:00', '11:00', '14:00', '18:00'].map((h) => `<option ${h === startVal ? 'selected' : ''}>${h}</option>`).join('')}
          </select></div>
          <div><label class="chooser__label" style="margin-top:0">Durée</label><select class="field field--select" id="chooser-duration">
            ${[1, 2, 3, 4].map((h) => `<option value="${h}" ${h === durationVal ? 'selected' : ''}>${h} h</option>`).join('')}
          </select></div>
        </div>
        <div class="chooser-form__note">${icon('check-circle')} Aucun conflit détecté avec vos autres créneaux.</div>
        <div class="chooser-form__actions">
          <button class="btn btn-outline btn-sm" id="chooser-cancel">Annuler</button>
          <button class="btn btn-navy btn-sm" id="chooser-save">${selected.n === '05' && !state.chooserNewSlot ? 'Enregistrer la modification' : 'Ajouter à l’agenda'}</button>
        </div>
      </div>
    </div>`;
}

function bindAgenda() {
  const selectDay = (cell) => {
    state.selectedDay = cell.dataset.day;
    closeDayPop();
    showDayPop(cell);
    appRoot.querySelectorAll('.cal-cell').forEach((c) => c.classList.toggle('is-selected', c === cell));
    document.getElementById('agenda-rail').innerHTML = agendaRail();
    bindRail();
  };
  appRoot.querySelectorAll('[data-day]').forEach((cell) => {
    cell.addEventListener('click', () => selectDay(cell));
    cell.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      selectDay(cell);
    });
  });

  appRoot.querySelectorAll('[data-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.agendaMode = btn.dataset.mode;
      renderAgenda();
    });
  });

  document.getElementById('open-chooser').addEventListener('click', () => {
    state.chooserOpen = true;
    state.chooserNewSlot = false;
    renderAgenda();
  });
  document.getElementById('open-live').addEventListener('click', openLiveModal);
  bindRail();

  document.getElementById('cal-prev').addEventListener('click', () => {
    state.calendarMonth -= 1;
    renderAgenda();
  });
  document.getElementById('cal-next').addEventListener('click', () => {
    state.calendarMonth += 1;
    renderAgenda();
  });
  document.getElementById('cal-today').addEventListener('click', () => {
    state.calendarMonth = 0;
    state.selectedDay = '2026-11-05';
    renderAgenda();
  });
  const hint = document.getElementById('cal-hint');
  if (hint) hint.addEventListener('click', () => toast('Clic droit sur un jour pour planifier un module ou ouvrir ses créneaux.'));
}

function bindRail() {
  const rerenderRail = () => {
    document.getElementById('agenda-rail').innerHTML = agendaRail();
    bindRail();
  };

  document.querySelectorAll('#chooser-close, #chooser-cancel').forEach((b) => {
    b.addEventListener('click', () => {
      state.chooserOpen = false;
      state.chooserQuery = '';
      state.chooserFilter = 'all';
      state.chooserNewSlot = false;
      renderAgenda();
    });
  });

  const search = document.getElementById('chooser-search');
  if (search) {
    search.addEventListener('input', () => {
      state.chooserQuery = search.value;
      const caret = search.value.length;
      rerenderRail();
      const next = document.getElementById('chooser-search');
      if (next) { next.focus(); next.setSelectionRange(caret, caret); }
    });
  }

  document.querySelectorAll('[data-chooser-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.chooserFilter = btn.dataset.chooserTab;
      rerenderRail();
    });
  });

  document.querySelectorAll('[data-chooser-form]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.chooserNewSlot = btn.dataset.chooserForm === 'new';
      rerenderRail();
    });
  });

  document.querySelectorAll('.chooser-module').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.chooserModule = btn.dataset.module;
      state.chooserNewSlot = false;
      rerenderRail();
    });
  });

  const save = document.getElementById('chooser-save');
  if (save) {
    save.addEventListener('click', () => {
      const date = document.getElementById('chooser-date').value || state.selectedDay;
      const start = document.getElementById('chooser-start').value;
      const duration = Number(document.getElementById('chooser-duration').value);
      const end = minutesToTime(timeToMinutes(start) + duration * 60);
      const isNew = state.chooserModule !== '05' || state.chooserNewSlot;
      const next = isNew
        ? [...state.slots, { date, start, end, module: state.chooserModule }]
        : state.slots.map((s, i) => (i === 0 ? { ...s, date, start, end } : s));
      if (hasConflict(next)) {
        toast('Ce créneau chevauche un autre créneau de votre agenda.');
        return;
      }
      state.slots = next;
      state.selectedDay = date;
      state.agendaMode = 'modules';
      state.chooserOpen = false;
      state.chooserQuery = '';
      state.chooserFilter = 'all';
      state.chooserNewSlot = false;
      renderAgenda();
      toast(isNew
        ? `Module ${state.chooserModule} ajouté le ${shortDate(date)} · ${start}–${end} GMT.`
        : `Créneau du module 5 modifié : ${shortDate(date)} · ${start}–${end} GMT.`);
    });
  }

  const plan = document.getElementById('open-plan');
  if (plan) plan.addEventListener('click', openPlanModal);

  const railLive = document.getElementById('rail-live');
  if (railLive) railLive.addEventListener('click', openLiveModal);

  const register = document.getElementById('register-live');
  if (register) {
    register.addEventListener('click', () => {
      const session = LIVE_SESSIONS.find((l) => l.date === state.selectedDay && l.inAgenda)
        || LIVE_SESSIONS.find((l) => l.date === state.selectedDay)
        || LIVE_SESSIONS.find((l) => l.date > state.selectedDay && l.inAgenda)
        || LIVE_SESSIONS.find((l) => l.date > state.selectedDay);
      if (!session) return;
      const alreadyRegistered = session.registered;
      session.registered = true;
      session.inAgenda = true;
      state.selectedDay = session.date;
      state.agendaMode = 'all';
      state.calendarMonth = monthOffset(session.date);
      renderAgenda();
      toast(alreadyRegistered
        ? `Direct ajouté à votre agenda : ${shortDate(session.date)} · ${session.start}–${session.end} GMT.`
        : `Inscription confirmée : direct du ${shortDate(session.date)} ajouté à votre agenda.`);
    });
  }
}

function showDayPop(cell) {
  closeDayPop();
  const iso = cell.dataset.day;
  const pop = document.createElement('div');
  pop.className = 'day-pop';
  pop.innerHTML = `
    <div class="day-pop__label">${longDate(iso)}</div>
    <button data-pop-plan>${icon('calendar')} Planifier un module${icon('chevron-right', 'chev')}</button>
    <button data-pop-live>${icon('video')} Planifier un direct</button>
    <button data-pop-events>${icon('file-text')} Voir les événements du jour</button>`;
  const card = document.getElementById('cal-card');
  const rect = cell.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();
  card.style.position = 'relative';
  pop.style.left = `${Math.min(rect.left - cardRect.left, cardRect.width - 260)}px`;
  pop.style.top = `${rect.top - cardRect.top + 28}px`;
  card.appendChild(pop);
  pop.querySelector('[data-pop-plan]').addEventListener('click', (e) => {
    e.stopPropagation();
    closeDayPop();
    openPlanModal();
  });
  pop.querySelector('[data-pop-live]').addEventListener('click', (e) => {
    e.stopPropagation();
    closeDayPop();
    openLiveModal();
  });
  pop.querySelector('[data-pop-events]').addEventListener('click', (e) => {
    e.stopPropagation();
    const evts = eventsFor(iso);
    toast(evts.length
      ? `${evts.length} événement(s) le ${longDate(iso)} : ${evts.map((ev) => `${ev.start} ${ev.label}`).join(' · ')}.`
      : 'Aucun événement planifié ce jour.');
  });
  setTimeout(() => {
    document.addEventListener('click', function onDoc(ev) {
      if (!pop.contains(ev.target)) { closeDayPop(); document.removeEventListener('click', onDoc); }
    });
  });
}

function closeDayPop() {
  document.querySelectorAll('.day-pop').forEach((p) => p.remove());
}

/* ---------------- Modale planifier un module ---------------- */
function openPlanModal() {
  let draft = state.slots.map((s) => ({ ...s }));
  const render = () => {
    const total = draft.reduce((sum, s) => sum + slotDuration(s), 0);
    const conflict = hasConflict(draft);
    return `
      <div class="modal__head">
        <div>
          <span class="eyebrow">02 · Dates et créneaux</span>
          <h2>Planifier un module</h2>
          <p>Répartissez ce module sur plusieurs jours, sans déplacer le cours entier.</p>
        </div>
        <button class="modal__close" data-close aria-label="Fermer">${icon('x')}</button>
      </div>
      <div class="modal__body">
        <div class="plan-summary">
          <span class="plan-summary__n">05</span>
          <div><span>Planification minière à ciel ouvert · 24 h · 6 modules</span><b>Production &amp; suivi</b></div>
          <div class="plan-summary__meta"><strong>Durée totale : 5 h</strong>En cours</div>
        </div>
        <div class="plan-tz">
          <span>${icon('compass')} ${AGREEMENT.timezone}</span>
          <span class="pill pill-cream">${draft.length} créneaux · ${uniqueDays(draft)} jours</span>
        </div>
        <div class="slots">
          ${draft.map((s, i) => `
            <div class="slot-row" data-slot="${i}">
              <div><label>Date</label><input class="field" type="date" value="${s.date}" data-field="date" data-i="${i}" /></div>
              <div><label>Début</label><input class="field" type="time" value="${s.start}" data-field="start" data-i="${i}" /></div>
              <div><label>Fin</label><input class="field" type="time" value="${s.end}" data-field="end" data-i="${i}" /></div>
              <div><label>Durée</label><select class="field field--select" data-field="duration" data-i="${i}">
                ${[1, 2, 3, 4, 5].map((h) => `<option value="${h}" ${slotDuration(s) === h ? 'selected' : ''}>${h} h</option>`).join('')}
              </select></div>
              <button class="slot-del" data-del="${i}" aria-label="Supprimer le créneau">${icon('trash')}</button>
            </div>`).join('')}
        </div>
        <div class="slot-add">
          <button class="btn btn-outline btn-sm" id="add-slot">${icon('plus')} Ajouter un créneau</button>
          <span class="plan-check">${conflict ? '<span style="color:var(--red)">Chevauchement détecté</span>' : `${icon('check-circle')} Aucun chevauchement dans votre agenda`}</span>
        </div>
        <div class="plan-total">
          <div><span>Temps réparti</span><b>${formatHours(total)} / 5 h</b></div>
          <div><span>Restant à répartir</span><b>${formatHours(Math.max(0, 5 - total))}</b></div>
          <p>${total === 5 ? 'La durée du module est entièrement répartie' : 'Continuez à répartir les heures du module'} sur les ${uniqueDays(draft)} jour(s) sélectionné(s).</p>
        </div>
      </div>
      <div class="modal__foot">
        <p>Seuls les créneaux du module 5 sont enregistrés. Votre progression reste à 67 % et le direct du jeudi 12 novembre, 18:00–19:30 avec Moussa Koné, est conservé.</p>
        <div class="modal__actions">
          <button class="btn btn-outline" data-close>Annuler</button>
          <button class="btn btn-navy" id="save-plan">${icon('calendar')} Enregistrer dans l’agenda</button>
        </div>
      </div>`;
  };

  openModal(render());
  bindPlanModal(() => draft, (next) => { draft = next; refresh(); });

  function refresh() {
    const overlay = modalRoot.querySelector('.overlay');
    overlay.querySelector('.modal').innerHTML = render();
    bindPlanModal(() => draft, (next) => { draft = next; refresh(); });
  }

  function bindPlanModal(getDraft, setDraft) {
    const root = modalRoot.querySelector('.modal');
    root.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', closeModal));
    root.querySelectorAll('[data-field]').forEach((input) => {
      input.addEventListener('change', () => {
        const i = Number(input.dataset.i);
        const d = getDraft().map((s) => ({ ...s }));
        const field = input.dataset.field;
        if (field === 'duration') {
          const start = timeToMinutes(d[i].start);
          const end = start + Number(input.value) * 60;
          d[i].end = `${String(Math.floor(end / 60) % 24).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`;
        } else {
          d[i][field] = input.value;
        }
        setDraft(d);
      });
    });
    root.querySelectorAll('[data-del]').forEach((b) => {
      b.addEventListener('click', () => {
        setDraft(getDraft().filter((_, i) => i !== Number(b.dataset.del)));
      });
    });
    root.querySelector('#add-slot').addEventListener('click', () => {
      const next = getDraft().map((s) => ({ ...s }));
      next.push({ date: state.selectedDay, start: '09:00', end: '11:00' });
      setDraft(next);
    });
    root.querySelector('#save-plan').addEventListener('click', () => {
      state.slots = getDraft().map((s) => ({ ...s }));
      closeModal();
      toast('Créneaux enregistrés dans votre agenda.');
      if (location.hash.startsWith('#/app/agenda')) renderAgenda();
      else if (location.hash.startsWith('#/formation/')) renderCourseDetail('planification');
    });
  }
}

/* ---------------- Modale planifier un direct ---------------- */
function monthOffset(iso) {
  const d = parseISO(iso);
  return (d.getFullYear() - 2026) * 12 + (d.getMonth() - 10);
}

function openLiveModal() {
  const sessions = [...LIVE_SESSIONS].sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));
  const mine = sessions.filter((s) => s.registered);
  const open = sessions.filter((s) => !s.registered);
  const item = (s) => {
    const d = parseISO(s.date);
    const course = getCourse(s.course);
    const added = s.registered && s.inAgenda;
    return `
      <div class="live-item ${added ? 'is-added' : ''}">
        <div class="live-date"><b>${d.getDate()}</b><span>${MONTHS_SHORT[d.getMonth()]}</span></div>
        <div class="live-item__body">
          <b>${esc(s.title)}</b>
          <span>${s.start}–${s.end} GMT · ${esc(s.instructor)} · ${esc(course.title)}</span>
        </div>
        <div class="live-item__action">
          ${added
            ? `<span class="pill pill-green">${icon('check')} Dans votre agenda</span>`
            : `<button class="btn btn-navy btn-sm" data-live="${s.id}">${s.registered ? 'Ajouter à l’agenda' : 'S’inscrire'}</button>`}
        </div>
      </div>`;
  };

  openModal(`
    <div class="modal__head">
      <div>
        <span class="eyebrow">Sessions en direct</span>
        <h2>Planifier un direct</h2>
        <p>Choisissez un direct auquel vous êtes inscrite pour l’ajouter à votre agenda, ou inscrivez-vous à une session ouverte.</p>
      </div>
      <button class="modal__close" data-close aria-label="Fermer">${icon('x')}</button>
    </div>
    <div class="modal__body">
      <div class="plan-tz">
        <span>${icon('compass')} ${AGREEMENT.timezone}</span>
        <span class="pill pill-cream">${mine.length} inscription${mine.length > 1 ? 's' : ''} · ${open.length} ouverte${open.length > 1 ? 's' : ''}</span>
      </div>
      <div class="live-list">
        <p class="live-group">Vos inscriptions</p>
        ${mine.length ? mine.map(item).join('') : '<p class="chooser__meta">Aucune inscription pour le moment.</p>'}
        ${open.length ? `<p class="live-group">Inscriptions ouvertes</p>${open.map(item).join('')}` : ''}
      </div>
      <p class="live-note">${icon('help')} Un direct ajouté à votre agenda reste une session animée : il ne valide ni une leçon ni un module.</p>
    </div>
    <div class="modal__foot">
      <p>Vous recevrez un rappel 15 minutes avant le direct et le replay restera disponible après la session.</p>
      <div class="modal__actions">
        <button class="btn btn-outline" data-close>Fermer</button>
      </div>
    </div>`, 'modal--narrow');

  modalRoot.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', closeModal));
  modalRoot.querySelectorAll('[data-live]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const session = LIVE_SESSIONS.find((l) => l.id === btn.dataset.live);
      if (!session) return;
      const alreadyRegistered = session.registered;
      session.registered = true;
      session.inAgenda = true;
      state.selectedDay = session.date;
      state.agendaMode = 'all';
      state.calendarMonth = monthOffset(session.date);
      state.chooserOpen = false;
      closeModal();
      if (location.hash.startsWith('#/app/agenda')) renderAgenda();
      else navigate(`#/app/agenda?mode=all&day=${session.date}`);
      toast(alreadyRegistered
        ? `Direct ajouté à votre agenda : ${shortDate(session.date)} · ${session.start}–${session.end} GMT.`
        : `Inscription confirmée : direct du ${shortDate(session.date)} ajouté à votre agenda.`);
    });
  });
}

function uniqueDays(slots) {
  return new Set(slots.map((s) => s.date)).size;
}

function formatHours(n) {
  return `${Number.isInteger(n) ? n : n.toFixed(1).replace('.', ',')} h`;
}

/* ---------------- Menu contextuel module ---------------- */
function openModuleMenu(anchor) {
  document.querySelectorAll('.ctx-menu').forEach((m) => m.remove());
  const menu = document.createElement('div');
  menu.className = 'ctx-menu';
  menu.innerHTML = `
    <div class="ctx-menu__label">Module 05 · Production &amp; suivi</div>
    <button data-act="add">${icon('calendar')} Ajouter un créneau</button>
    <button data-act="view">${icon('clock')} Voir les créneaux</button>
    <button data-act="replan">${icon('refresh')} Replanifier les créneaux</button>`;
  document.body.appendChild(menu);
  const rect = anchor.getBoundingClientRect();
  menu.style.left = `${Math.min(rect.left + window.scrollX - 180, window.innerWidth - 270)}px`;
  menu.style.top = `${rect.bottom + window.scrollY + 6}px`;
  menu.querySelector('[data-act="add"]').addEventListener('click', () => { menu.remove(); openPlanModal(); });
  menu.querySelector('[data-act="view"]').addEventListener('click', () => {
    menu.remove();
    toast(`${state.slots.length} créneaux : ${state.slots.map((s) => `${shortDate(s.date)} ${s.start}–${s.end}`).join(' · ')}`);
  });
  menu.querySelector('[data-act="replan"]').addEventListener('click', () => { menu.remove(); openPlanModal(); });
  setTimeout(() => {
    document.addEventListener('click', function onDoc(ev) {
      if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener('click', onDoc); }
    });
  });
}
