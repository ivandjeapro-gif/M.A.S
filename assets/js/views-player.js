/* =========================================================
   Espace de cours — lecteur, ressources, exercice, quiz
   ========================================================= */

function renderPlayer() {
  const l = LESSON;
  const content = `
    <div class="player-head">
      <div>
        <a class="back-link" href="#/formation/planification">${icon('arrow-left')} ${esc(l.courseTitle)}</a>
        <span class="page-eyebrow">Module ${l.module} · ${esc(l.moduleTitle)} · Leçon ${l.lessonNo}</span>
        <h1 class="lesson-title">${esc(l.title)}</h1>
        <p class="lesson-meta">Avec ${esc(l.instructor)} · Vidéo de ${l.duration} · Niveau ${l.level}</p>
      </div>
      <div class="page-head__aside"><span class="pill pill-cream">${l.doneLessons} / ${l.totalLessons} leçons terminées · ${l.progress} %</span></div>
    </div>

    <div class="player-grid">
      <div>
        <div class="video-frame">
          <img src="${l.image}" alt="Aperçu de la leçon" />
          <span class="video-badge">5.1 · De l’objectif mensuel au planning hebdomadaire</span>
          <button class="video-play" id="video-play" aria-label="Lire la vidéo">${icon('play')}</button>
          <div class="video-caption"><span>« Commençons par la capacité disponible de notre flotte. »</span></div>
          <div class="video-controls">
            <div class="video-scrub"><span></span></div>
            <div class="video-controls__row">
              ${icon('play')} ${icon('wifi')}
              <span id="video-time">09:42 / 18:30</span>
              <span class="video-controls__spacer"></span>
              <span>1×</span>
              <span class="video-controls__chip">360p</span>
              <span>HD</span>
              ${icon('zoom')}
              ${icon('compass')}
            </div>
          </div>
        </div>

        <div class="lesson-nav">
          <button class="btn btn-outline" id="prev-lesson">Leçon précédente</button>
          <button class="btn btn-navy" id="mark-done">${state.lessonDone ? 'Leçon terminée ✓' : 'Marquer comme terminée ✓'}</button>
        </div>

        <div class="lesson-tabs">
          <button class="is-active" data-ltab="retenir">À retenir</button>
          <button data-ltab="ressources">Ressources <span class="count">(2)</span></button>
          <button data-ltab="exercice">Exercice</button>
          <button data-ltab="quiz">Quiz de parcours</button>
        </div>

        <div class="lesson-body" id="lesson-panels">
          <div data-lpanel="retenir">
            <h2>Relier capacité et objectif de production</h2>
            <p>À la fin de cette leçon, vous pourrez répartir un objectif mensuel en tenant compte des heures disponibles, du rendement des engins et des aléas opérationnels.</p>
            <p>Un objectif mensuel n’est pas une simple division : la disponibilité de la flotte, les arrêts de maintenance et les contraintes d’accès modifient la capacité réelle. Le planning doit rendre ces écarts visibles.</p>
            <div class="tip">${icon('help')}<span>Un planning réaliste intègre les arrêts prévus avant de répartir les tonnages. La capacité théorique n’est pas la capacité disponible.</span></div>

            <div class="resources">
              <h2>Vos ressources</h2>
              <div class="resource-grid">
                <div class="resource">${icon('file-text')}<div><b>Fiche méthode · Planning</b><span>PDF · 480 Ko · 4 pages</span></div><a class="dl" href="#" data-dl="Fiche méthode">${icon('download')}</a></div>
                <div class="resource">${icon('file-text')}<div><b>Données du cas pratique</b><span>XLSX · 120 Ko · Modèle à compléter</span></div><a class="dl" href="#" data-dl="Données du cas pratique">${icon('download')}</a></div>
              </div>
            </div>

            <div class="work-card">
              <div class="work-card__head">
                <div><span class="eyebrow">À vous de jouer · Exercice 5.1</span><h2>Planifiez une semaine d’exploitation.</h2></div>
                <span class="pill pill-cream">À remettre · 30 min</span>
              </div>
              <p>À partir du fichier fourni, répartissez un objectif de 12 000 tonnes sur 5 jours. Intégrez 4 heures de maintenance le mercredi et justifiez votre marge de sécurité.</p>
              <p><b style="color:var(--ink)">Livrable :</b> un planning complété et 3 lignes de justification. Format XLSX ou PDF, 5 Mo maximum.</p>
              <div class="dropzone">
                ${icon('download')}
                <div><b>Déposez votre fichier ici</b><span>ou choisissez un fichier sur votre ordinateur</span></div>
                <button class="btn btn-outline btn-sm" id="choose-file">Choisir un fichier</button>
              </div>
            </div>

            <div class="quiz-card">
              <div class="quiz-card__head"><span class="eyebrow">Test de connaissance · Quiz de parcours</span><span class="quiz-card__count">Question 2 / 5 · Une seule réponse</span></div>
              <h2>Quelle capacité retenir pour votre planning ?</h2>
              <p>Un engin produit 300 t/h. Sur 8 heures planifiées, 2 heures sont réservées à la maintenance. Quel tonnage journalier pouvez-vous prévoir ?</p>
              <div class="quiz-options">
                <button class="quiz-option ${state.quizChoice === '2400' ? 'is-selected' : ''}" data-choice="2400"><span class="radio"></span>2 400 tonnes</button>
                <button class="quiz-option ${state.quizChoice === '1800' ? 'is-selected' : ''}" data-choice="1800"><span class="radio"></span>1 800 tonnes</button>
                <button class="quiz-option ${state.quizChoice === '600' ? 'is-selected' : ''}" data-choice="600"><span class="radio"></span>600 tonnes</button>
              </div>
              <div class="quiz-card__foot">
                <p>Vos réponses sont conservées dans ce parcours de démonstration.</p>
                <button class="btn btn-navy" id="quiz-validate">Valider ma réponse</button>
              </div>
            </div>
          </div>

          <div data-lpanel="ressources" hidden>
            <h2>Ressources de la leçon</h2>
            <div class="resource-grid" style="margin-top:10px">
              <div class="resource">${icon('file-text')}<div><b>Fiche méthode · Planning</b><span>PDF · 480 Ko · 4 pages</span></div><a class="dl" href="#" data-dl="Fiche méthode">${icon('download')}</a></div>
              <div class="resource">${icon('file-text')}<div><b>Données du cas pratique</b><span>XLSX · 120 Ko · Modèle à compléter</span></div><a class="dl" href="#" data-dl="Données du cas pratique">${icon('download')}</a></div>
            </div>
          </div>

          <div data-lpanel="exercice" hidden>
            <h2>Exercice 5.1 · Planifiez une semaine d’exploitation</h2>
            <p>À partir du fichier fourni, répartissez un objectif de 12 000 tonnes sur 5 jours. Intégrez 4 heures de maintenance le mercredi et justifiez votre marge de sécurité.</p>
            <div class="dropzone">${icon('download')}<div><b>Déposez votre fichier ici</b><span>ou choisissez un fichier sur votre ordinateur</span></div><button class="btn btn-outline btn-sm" id="choose-file-2">Choisir un fichier</button></div>
          </div>

          <div data-lpanel="quiz" hidden>
            <h2>Test de connaissance · Quiz de parcours</h2>
            <p>Question 2 / 5 · Une seule réponse</p>
            <div class="quiz-options">
              <button class="quiz-option ${state.quizChoice === '2400' ? 'is-selected' : ''}" data-choice="2400"><span class="radio"></span>2 400 tonnes</button>
              <button class="quiz-option ${state.quizChoice === '1800' ? 'is-selected' : ''}" data-choice="1800"><span class="radio"></span>1 800 tonnes</button>
              <button class="quiz-option ${state.quizChoice === '600' ? 'is-selected' : ''}" data-choice="600"><span class="radio"></span>600 tonnes</button>
            </div>
            <div style="display:flex;justify-content:flex-end;margin-top:12px"><button class="btn btn-navy" data-validate>Valider ma réponse</button></div>
          </div>
        </div>
      </div>

      <aside class="rail">
        <div class="rail-card">
          <h2>Votre parcours</h2>
          <div class="rail-progress">
            <div class="progress"><span style="width:67%"></span></div>
            <div class="rail-progress__label" style="margin-top:6px"><span>4 modules validés sur 6</span><span>67 %</span></div>
          </div>
          <ul class="rail-check">
            ${LESSON_MODULES.slice(0, 3).map((m) => `<li>${icon('check-circle')}<span>${esc(m.title)}</span></li>`).join('')}
            <li>${icon('check-circle')}<span>Séquençage</span></li>
            <li class="is-current">${icon('play')}<span>Production &amp; suivi</span></li>
          </ul>
          <div class="rail-section-title">05 · Production &amp; suivi</div>
          <div class="rail-lessons">
            ${LESSON_MODULES[4].lessons.map((les, i) => `
              <button class="rail-lesson ${les.state === 'active' ? 'is-active' : ''}" data-rail="${i}" data-rail-state="${les.state}">
                ${icon(les.state === 'quiz' ? 'check-circle' : 'play')}
                <div><b>${esc(les.title)}</b><span>${esc(les.time)} · ${les.state === 'active' ? 'En cours' : 'À suivre'}</span></div>
              </button>`).join('')}
          </div>
          <div class="rail-lessons" style="margin-top:6px">
            <div class="rail-lesson is-locked">${icon('lock')}<div><b>06 · Examen final</b><span>Accès soumis aux prérequis</span></div></div>
          </div>
        </div>

        <div class="notes-card" id="notes-card">
          <div class="notes-card__head"><h2>Mes notes</h2>${icon('edit')}</div>
          ${state.notes.map((n) => `<p class="notes-card__text">${esc(n)}</p>`).join('')}
          <p class="notes-card__hint">${state.notes.length > 1 ? `${state.notes.length} notes enregistrées` : 'Note enregistrée'} · Vous seule y avez accès</p>
          <button class="notes-card__add" id="add-note">+ Ajouter une note</button>
        </div>

        <button class="ask" data-contact="Une question sur le cours">${icon('help')} Une question sur le cours ? Écrire au formateur ${icon('arrow-right')}</button>
      </aside>
    </div>

    <p style="font-size:9px;color:var(--faint);margin-top:24px;padding-top:14px;border-top:1px solid var(--line-soft)">Démonstration · Données et documents simulés. Examen final réussi : certificat ou diplôme selon le parcours, sans accréditation officielle revendiquée.</p>`;

  appShell({ active: 'courses', crumbs: [{ label: 'Mon espace', href: '#/app' }, { label: 'Planification minière', href: '#/formation/planification' }, { label: 'Module 5' }], content });

  const setLessonTab = (key) => {
    appRoot.querySelectorAll('.lesson-tabs button').forEach((b) => b.classList.toggle('is-active', b.dataset.ltab === key));
    appRoot.querySelectorAll('[data-lpanel]').forEach((p) => { p.hidden = p.dataset.lpanel !== key; });
  };
  appRoot.querySelectorAll('.lesson-tabs button').forEach((btn) => {
    btn.addEventListener('click', () => setLessonTab(btn.dataset.ltab));
  });

  appRoot.querySelectorAll('[data-rail]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const st = btn.dataset.railState;
      if (st === 'quiz') {
        setLessonTab('quiz');
        toast('Quiz de parcours affiché ci-dessous.');
      } else if (st === 'active') {
        toast('Vous êtes déjà sur cette leçon.');
      } else {
        toast(`« ${btn.querySelector('b').textContent} » — leçon de démonstration bientôt disponible.`);
      }
    });
  });

  appRoot.querySelectorAll('[data-choice]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.quizChoice = btn.dataset.choice;
      appRoot.querySelectorAll('[data-choice]').forEach((b) => b.classList.toggle('is-selected', b === btn));
    });
  });

  const validate = () => {
    if (state.quizChoice === '1800') toast('Bonne réponse : 6 h × 300 t = 1 800 tonnes.');
    else toast('Pas tout à fait. Tenez compte des 2 h de maintenance : 6 h × 300 t.');
  };
  appRoot.querySelectorAll('[data-validate], #quiz-validate').forEach((b) => b.addEventListener('click', validate));

  const mark = document.getElementById('mark-done');
  mark.addEventListener('click', () => {
    state.lessonDone = !state.lessonDone;
    mark.textContent = state.lessonDone ? 'Leçon terminée ✓' : 'Marquer comme terminée ✓';
    toast(state.lessonDone ? 'Leçon marquée comme terminée.' : 'Leçon marquée comme non terminée.');
  });

  document.getElementById('prev-lesson').addEventListener('click', () => toast('Retour à la leçon précédente : Séquençage des phases.'));

  appRoot.querySelectorAll('[data-dl]').forEach((a) => {
    a.addEventListener('click', (e) => { e.preventDefault(); toast(`Téléchargement simulé : ${a.dataset.dl}.`); });
  });
  appRoot.querySelectorAll('#choose-file, #choose-file-2').forEach((b) => {
    b.addEventListener('click', () => toast('Dépôt de fichier simulé dans cette démonstration.'));
  });
  document.getElementById('add-note').addEventListener('click', openNoteModal);
  document.getElementById('video-play').addEventListener('click', () => toast('Lecture vidéo simulée — extrait de démonstration.'));
}

function openNoteModal() {
  openModal(`
    <div class="modal__head">
      <div><span class="eyebrow">Mes notes</span><h2>Ajouter une note</h2><p>Construire un planning de production · 09:42</p></div>
      <button class="modal__close" data-close aria-label="Fermer">${icon('x')}</button>
    </div>
    <div class="modal__body">
      <label class="chooser__label" style="margin-top:0" for="note-input">Votre note</label>
      <textarea class="field field--area" id="note-input" rows="4" placeholder="Ex. Déduire les arrêts de maintenance avant de calculer la capacité…"></textarea>
      <p class="muted-note" style="margin-top:10px">Les notes restent privées et sont conservées pendant cette démonstration.</p>
    </div>
    <div class="modal__foot">
      <p>Une note n’est pas une réponse d’exercice : elle ne modifie pas votre progression.</p>
      <div class="modal__actions">
        <button class="btn btn-outline" data-close>Annuler</button>
        <button class="btn btn-navy" id="save-note">Enregistrer la note</button>
      </div>
    </div>`, 'modal--narrow');
  const input = document.getElementById('note-input');
  input.focus();
  document.getElementById('save-note').addEventListener('click', () => {
    const value = input.value.trim();
    if (!value) { toast('Écrivez votre note avant d’enregistrer.'); return; }
    state.notes.push(`Note · ${value}`);
    closeModal();
    renderPlayer();
    toast('Note enregistrée.');
  });
}
