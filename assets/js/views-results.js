/* =========================================================
   Résultats & attestations
   ========================================================= */

function renderResults() {
  const r = RESULTS;
  const cert = r.certificate;
  const content = `
    <div class="results-head page-head">
      <div>
        <span class="page-eyebrow">Vos acquis et vos documents</span>
        <h1 class="page-title">Suivez vos acquis et vos documents.</h1>
        <p class="page-sub">Suivez vos quiz de parcours, votre examen final et obtenez votre certificat ou diplôme selon votre parcours.</p>
      </div>
      <div class="page-head__aside medal">${icon('medal')}</div>
    </div>

    <div class="stats">
      <div class="stat-card"><div style="padding:2px 6px"><div class="stat-card__n">01</div><div class="stat-card__label" style="margin-top:4px">Certificat ou diplôme</div><div class="stat-card__sub">1 document disponible</div></div></div>
      <div class="stat-card"><div style="padding:2px 6px"><div class="stat-card__n">86 <small>/ 100</small></div><div class="stat-card__label" style="margin-top:4px">Examen final HSE</div><div class="stat-card__sub">Résultat final · 86 / 100</div></div></div>
      <div class="stat-card"><div style="padding:2px 6px"><div class="stat-card__n">01</div><div class="stat-card__label" style="margin-top:4px">Certificat disponible</div><div class="stat-card__sub">Document simulé</div></div></div>
    </div>

    <div class="tabs" style="margin-top:20px">
      <button class="${state.resultsTab === 'overview' ? 'is-active' : ''}" data-rtab="overview">Vue d’ensemble</button>
      <button class="${state.resultsTab === 'quizzes' ? 'is-active' : ''}" data-rtab="quizzes">Quiz de parcours</button>
      <button class="${state.resultsTab === 'certs' ? 'is-active' : ''}" data-rtab="certs">Certificats &amp; diplômes</button>
    </div>

    <section class="cert-section" id="cert-section">
      <div>
        <h2>Un certificat obtenu. Une trace à conserver.</h2>
        <div class="certificate">
          <div class="certificate__inner">
            <div class="certificate__brand">
              <img src="assets/img/logo.png" alt="BAOBAB Mine Academy" />
              <span class="certificate__demo">Exemple · Démonstration</span>
            </div>
            <h3>Certificat de réussite</h3>
            <p class="certificate__lead">BAOBAB Mine Academy atteste, à titre d’exemple, que</p>
            <p class="certificate__name">${USER.first} ${USER.last}</p>
            <div class="certificate__rule"></div>
            <p class="certificate__text">a réussi l’examen final de la formation</p>
            <p class="certificate__course">${esc(cert.course)}</p>
            <p class="certificate__meta">${cert.hours} heures de formation · Examen final : 86 / 100</p>
            <div class="certificate__bottom">
              <div>Émise le 28 octobre 2026<br/><b>Réf. ${cert.ref}</b></div>
              <div style="text-align:right">La direction pédagogique<br/><b>Signature non apposée · Exemple</b></div>
            </div>
            <p class="certificate__foot">Certificat simulé · Sans valeur officielle</p>
          </div>
        </div>
      </div>

      <aside class="cert-side">
        <span class="pill pill-green">Formation validée</span>
        <h3>Certificat · ${esc(cert.course)}</h3>
        <p class="cert-side__meta">${USER.first} ${USER.last} · ${cert.hours} h · ${cert.modules} modules · ${esc(cert.instructor)}</p>
        <div class="cert-side__score"><span>Examen final</span><b>86 / 100</b></div>
        <p class="cert-side__rule">Règle de démonstration · réussite à partir de 70 / 100. Examen final réussi le 28 octobre 2026.</p>
        <button class="btn btn-navy btn-block" id="download-cert">Télécharger le certificat ${icon('download')}</button>
        <p class="muted-note">PDF · Certificat simulé · 240 Ko<br/><br/>Ce certificat illustre la réussite d’un parcours BAOBAB. Il ne constitue ni un diplôme d’État ni une certification officiellement accréditée.</p>
      </aside>
    </section>

    <section class="results-table-wrap" id="quiz-section">
      <div class="results-table-wrap__head">
        <div><h2>Vos quiz de parcours et examen final</h2><p>Planification minière à ciel ouvert · 4 quiz validés sur 5 · Examen final à venir</p></div>
        <span class="pill pill-cream">4 quiz validés</span>
      </div>
      <div class="results-table">
        <div class="results-row results-row--head"><span>Quiz / Examen</span><span>Date</span><span>Note</span><span>Statut</span></div>
        ${r.quizzes.map((q) => `
          <div class="results-row">
            <b>${esc(q.label)}</b>
            <span>${esc(q.date)}</span>
            <span class="${q.score ? 'score' : 'dash'}">${q.score || '—'}</span>
            <span><span class="pill pill-${q.tone === 'green' ? 'green' : q.tone === 'cream' ? 'cream' : 'muted'}">${esc(q.status)}</span></span>
          </div>`).join('')}
      </div>
    </section>

    <div class="results-cta">
      ${icon('award')}
      <div><b>Votre prochain certificat se prépare maintenant.</b><p>Terminez les modules 5 et 6, remettez votre pratique et réussissez l’examen final pour obtenir votre certificat.</p></div>
      <button class="btn btn-navy" id="prepare-exam">Préparer mon examen final ${icon('arrow-right')}</button>
    </div>

    <p style="font-size:9px;color:var(--faint);margin-top:22px;padding-top:14px;border-top:1px solid var(--line-soft)">${esc(BRAND.demo)}</p>`;

  appShell({
    active: state.resultsTab === 'quizzes' ? 'quiz' : 'results',
    crumbs: [{ label: 'Mon espace', href: '#/app' }, { label: 'Résultats & certificats' }],
    content,
  });

  document.getElementById('download-cert').addEventListener('click', () => toast('Téléchargement simulé : certificat PDF.'));
  document.getElementById('prepare-exam').addEventListener('click', openExamModal);

  const tabs = appRoot.querySelectorAll('[data-rtab]');
  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.resultsTab = btn.dataset.rtab;
      tabs.forEach((b) => b.classList.toggle('is-active', b === btn));
      const map = { overview: 'cert-section', quizzes: 'quiz-section', certs: 'cert-section' };
      const el = document.getElementById(map[btn.dataset.rtab]);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function openExamModal() {
  openModal(`
    <div class="modal__head">
      <div><span class="eyebrow">Examen final</span><h2>Préparer votre examen final</h2><p>Planification minière à ciel ouvert · 4 h · certificat ou diplôme</p></div>
      <button class="modal__close" data-close aria-label="Fermer">${icon('x')}</button>
    </div>
    <div class="modal__body">
      <p class="muted-note" style="font-size:12.5px">L’examen final s’ouvre après validation des prérequis du parcours.</p>
      <ul class="check-list" style="margin-top:12px">
        <li>${icon('check')} Modules 1 à 4 validés</li>
        <li>${icon('clock')} Module 5 · Production &amp; suivi en cours</li>
        <li>${icon('lock')} Module 6 · à débloquer après le module 5</li>
      </ul>
      <p class="muted-note" style="margin-top:12px">Réussite attendue : 70 / 100 minimum. Le certificat est simulé dans cette démonstration.</p>
    </div>
    <div class="modal__foot">
      <p>Continuez le module 5 puis revenez préparer l’examen final.</p>
      <div class="modal__actions">
        <button class="btn btn-outline" data-close>Plus tard</button>
        <a class="btn btn-navy" href="#/app/cours" data-close>Reprendre le module 5 ${icon('arrow-right')}</a>
      </div>
    </div>`, 'modal--narrow');
}
