/* =========================================================
   Vues publiques — accueil, catalogue
   ========================================================= */

function renderHome() {
  const featured = COURSES.filter((c) => c.featured).slice(0, 3);
  const faq = [
    { q: 'Puis-je suivre les cours avec une connexion limitée ?', a: 'Oui. Aucune qualité vidéo, tous les supports PDF légers et les sessions enregistrées. Une connexion mobile lente reste adaptée à un usage régulier.', open: true },
    { q: 'Faut-il déjà travailler dans les mines ?', a: 'Non. Les parcours débutants ne supposent aucune expérience du secteur. Les niveaux intermédiaires demandent en revanche des bases techniques ou une pratique de terrain.' },
    { q: 'Comment se déroulent les évaluations ?', a: 'Chaque module se conclut par un quiz de parcours. L’examen final, sous conditions de prérequis, permet d’obtenir un certificat ou un diplôme selon le parcours.' },
    { q: 'Quel document reçoit-on en fin de formation ?', a: 'Un certificat de réussite est délivré après validation de l’examen final. Certains parcours donnent accès à un diplôme. Les documents sont téléchargeables en PDF.' },
  ];

  appRoot.innerHTML = `
    ${siteHeader('accueil')}
    <main>
      <section class="hero">
        <div class="container">
          <div class="hero__grid">
            <div class="hero__copy">
              <span class="hero__eyebrow">L’expertise minière, en partage</span>
              <h1>Le savoir du terrain.<br />L’ambition de demain.</h1>
              <p class="hero__lede">Formez-vous aux métiers des mines avec des professionnels en activité. Des connaissances solides, des cas concrets et un parcours à votre rythme.</p>
              <div class="hero__actions">
                <a class="btn btn-gold btn-lg" href="#/catalogue">Trouver ma formation ${icon('arrow-up-right')}</a>
                <a class="btn btn-ghost-light btn-lg" href="#/?scroll=pedagogie">Découvrir l’académie</a>
              </div>
              <p class="hero__note">${icon('map-pin')} Ancré en Afrique de l’Ouest. Ouvert à vos ambitions.</p>
            </div>
            <div class="hero__media">
              <video autoplay muted loop playsinline preload="metadata" poster="assets/img/hero-woman.jpg" aria-label="Géologue sur un site minier à ciel ouvert">
                <source src="assets/video/hero.mp4" type="video/mp4" />
              </video>
              <div class="hero__caption">
                <b>01</b>
                <div>
                  <strong>Comprendre. Pratiquer. Transmettre.</strong>
                  <span>Des compétences ancrées dans la réalité des sites.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="features">
        <div class="container">
          <div class="features__grid">
            <div class="feature">${icon('users')}<div><strong>L’expérience du terrain</strong><span>Des formateurs en activité</span></div></div>
            <div class="feature">${icon('video')}<div><strong>En direct et en replay</strong><span>Apprenez selon vos disponibilités</span></div></div>
            <div class="feature">${icon('target')}<div><strong>Le pratique au cœur</strong><span>Exercices, quiz et études de cas</span></div></div>
            <div class="feature">${icon('wifi')}<div><strong>Pensé pour vos connexions</strong><span>Vidéos optimisées et PDF légers</span></div></div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <div>
              <span class="eyebrow">Des compétences qui font avancer</span>
              <h2 class="section-title">Votre prochain cap commence ici.</h2>
              <p class="section-sub">De l’exploration à l’exploitation, construisez une expertise utile sur le terrain.</p>
            </div>
            <a class="btn btn-outline" href="#/catalogue">Voir toutes les formations ${icon('arrow-right')}</a>
          </div>
          <div class="course-grid">${featured.map(courseCard).join('')}</div>
        </div>
      </section>

      <section class="section pedagogy" id="pedagogie">
        <div class="container">
          <div class="pedagogy__head">
            <div>
              <span class="eyebrow">Une pédagogie en mouvement</span>
              <h2 class="section-title">Du premier cours à la mise en pratique.</h2>
            </div>
            <p>Un parcours progressif, pour transformer les notions en réflexes métier. Vous apprenez, vous échangez, puis vous vous confrontez à des situations concrètes.</p>
          </div>
          <div class="pedagogy__cards">
            <div class="ped-card">
              <div class="ped-card__top"><span class="ped-card__n">01</span><span class="ped-card__icon">${icon('book-open')}</span></div>
              <h3>Comprendre</h3><p>Des vidéos structurées et des fiches synthétiques, à consulter à votre rythme.</p>
            </div>
            <div class="ped-card">
              <div class="ped-card__top"><span class="ped-card__n">02</span><span class="ped-card__icon">${icon('users')}</span></div>
              <h3>Échanger</h3><p>Des sessions en direct pour poser vos questions et croiser les expériences.</p>
            </div>
            <div class="ped-card">
              <div class="ped-card__top"><span class="ped-card__n">03</span><span class="ped-card__icon">${icon('target')}</span></div>
              <h3>Pratiquer</h3><p>Des exercices guidés et des cas miniers pour appliquer chaque notion.</p>
            </div>
            <div class="ped-card">
              <div class="ped-card__top"><span class="ped-card__n">04</span><span class="ped-card__icon">${icon('award')}</span></div>
              <h3>Valider</h3><p>Des tests de connaissance puis un examen final pour valider votre parcours.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="split">
            <div class="split__media"><img src="assets/img/pedagogy.jpg" alt="Professionnels sur un site minier" loading="lazy" /></div>
            <div>
              <span class="eyebrow">Les mines s’apprennent aussi sur le terrain</span>
              <h2>Une expertise concrète. Une transmission exigeante.</h2>
              <p>BAOBAB Mine Academy rapproche le monde de la formation de celui des opérations minières. Notre ambition : rendre les savoirs métier plus accessibles, sans perdre leur exigence.</p>
              <ul class="check-list">
                <li>${icon('check')} Des situations inspirées du quotidien des sites</li>
                <li>${icon('check')} Un regard ouvert aux enjeux du secteur</li>
                <li>${icon('check')} Des parcours pour étudiants et professionnels</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section class="section instructors">
        <div class="container">
          <div class="instructors__grid">
            <div>
              <span class="eyebrow">Des regards de praticiens</span>
              <h2>Apprenez auprès de ceux qui font.</h2>
              <p class="section-sub">Ingénieurs, géologues et spécialistes HSE partagent des méthodes, mais aussi leurs réflexes de terrain. Profils de formateurs fictifs pour cette démonstration.</p>
            </div>
            <div class="instructor-photo"><img src="assets/img/moussa.jpg" alt="Moussa Koné" loading="lazy" /></div>
            <ul class="instructor-list">
              <li class="is-lead"><strong>Moussa Koné</strong><span class="role">Ingénieur des mines · Planification &amp; exploitation</span></li>
              <li><strong>Fatou Diarra</strong><span class="role">Géologue &amp; exploration</span></li>
              <li><strong>Adama Ouédraogo</strong><span class="role">Prévention &amp; sécurité HSE</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section class="section pricing">
        <div class="container">
          <div class="pricing__grid">
            <div>
              <span class="eyebrow">Investir dans votre avenir</span>
              <h2>Étudiant aujourd’hui. Professionnel de demain.</h2>
              <p>Des tarifs dédiés aux étudiants, des contenus progressifs et des supports légers pour avancer, même avec une connexion limitée.</p>
              <div class="pricing__features">
                <span>${icon('video')} Vidéos en 360p</span>
                <span>${icon('file-text')} PDF légers</span>
                <span>${icon('headphones')} Directs enregistrés</span>
              </div>
            </div>
            <div class="price-card">
              <span class="price-card__label">À partir de</span>
              <div class="price-card__amount">25 000<small>FCFA / formation</small></div>
              <div class="price-card__cta"><a class="btn btn-gold" href="#/catalogue">Découvrir les tarifs</a></div>
              <div class="price-card__note"><span>Cours vidéo, supports, exercices et évaluation</span><span>Tarifs étudiants</span></div>
            </div>
          </div>
        </div>
      </section>

      <section class="section live">
        <div class="container">
          <div class="section-head">
            <div>
              <span class="eyebrow">La transmission se vit aussi en direct</span>
              <h2 class="section-title">Votre prochain rendez-vous avec le terrain.</h2>
            </div>
            <a class="btn btn-outline" href="#/sessions">Toutes les sessions ${icon('arrow-right')}</a>
          </div>
          <div class="live__grid">
            <article class="event-card">
              <div class="event-card__date"><b>12</b><span>nov.</span></div>
              <div>
                <div class="event-card__time">18:00 – 19:30 GMT</div>
                <h3 class="event-card__title">Du modèle de blocs au plan de production</h3>
                <p class="event-card__who">Moussa Koné · Planification minière</p>
                <a class="event-card__link" href="#/sessions/live-12">Programme et inscription</a>
              </div>
            </article>
            <article class="event-card">
              <div class="event-card__date"><b>14</b><span>nov.</span></div>
              <div>
                <div class="event-card__time">10:00 – 11:00 GMT</div>
                <h3 class="event-card__title">Lire un échantillon, interpréter un terrain</h3>
                <p class="event-card__who">Fatou Diarra · Géologie de terrain</p>
                <a class="event-card__link" href="#/sessions/live-14">Programme et inscription</a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="section" id="faq">
        <div class="container">
          <div class="faq__grid">
            <div class="faq__intro">
              <span class="eyebrow">Tout simplement</span>
              <h2>Quelques réponses avant de vous lancer.</h2>
              <p>Notre équipe vous aide à choisir un parcours adapté à votre niveau et à vos objectifs.</p>
              <a class="link-arrow" href="#/" data-contact="Contacter l’académie">Contacter l’académie ${icon('arrow-right')}</a>
            </div>
            <div>
              ${faq.map((f, i) => `
                <div class="faq-item ${f.open ? 'is-open' : ''}">
                  <button class="faq-item__q" data-faq="${i}">${esc(f.q)} ${icon('plus')}</button>
                  <div class="faq-item__a">${esc(f.a)}</div>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </section>

      <section class="cta-band">
        <div class="container">
          <div class="cta-band__inner">
            <div>
              <span class="eyebrow" style="color:var(--gold-soft)">Votre avenir se construit</span>
              <h2>Donnez de la profondeur à votre expertise.</h2>
              <p>Choisissez votre formation. Avancez à votre rythme. Faites la différence sur le terrain.</p>
            </div>
            <a class="btn btn-gold btn-lg" href="#/catalogue">Explorer les formations ${icon('arrow-right')}</a>
          </div>
        </div>
      </section>
    </main>
    ${siteFooter()}`;

  appRoot.querySelectorAll('[data-faq]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const open = item.classList.contains('is-open');
      appRoot.querySelectorAll('.faq-item').forEach((el) => el.classList.remove('is-open'));
      if (!open) item.classList.add('is-open');
    });
  });
}

/* ---------------- Catalogue ---------------- */
function renderCatalogue() {
  appRoot.innerHTML = `
    ${siteHeader('formations')}
    <main>
      <section class="cat-hero">
        <div class="container">
          <span class="eyebrow" style="color:var(--gold-soft)">Le catalogue BAOBAB</span>
          <h1>Un savoir à acquérir. Un cap à franchir.</h1>
          <p>Explorez 6 formations pour relier les connaissances aux réalités des mines.</p>
          <form class="cat-search" id="cat-search" role="search">
            ${icon('search')}
            <input type="search" id="cat-q" placeholder="Rechercher une formation, une compétence, un formateur…" aria-label="Rechercher une formation" value="${esc(state.catalogue.q)}" />
            <button class="btn btn-navy" type="submit">Rechercher</button>
          </form>
        </div>
      </section>

      <section class="cat-body">
        <div class="container">
          <div class="cat-layout">
            <aside class="filters" aria-label="Filtres">
              <div class="filters__head"><h2>Affiner</h2>${icon('sliders')}</div>

              <div class="filter-group">
                <h3>Public</h3>
                ${filterOpt('audience', 'tous', 'Tous les profils', true)}
                ${filterOpt('audience', 'etudiants', 'Étudiants')}
                ${filterOpt('audience', 'professionnels', 'Professionnels')}
              </div>

              <div class="filter-group">
                <h3>Domaine</h3>
                ${filterOpt('domains', 'exploitation', 'Exploitation minière')}
                ${filterOpt('domains', 'geologie', 'Géologie & exploration')}
                ${filterOpt('domains', 'securite', 'Sécurité & environnement')}
                ${filterOpt('domains', 'traitement', 'Traitement des minéraux')}
                ${filterOpt('domains', 'economie', 'Économie minière')}
              </div>

              <div class="filter-group">
                <h3>Niveau</h3>
                ${filterOpt('levels', 'debutant', 'Débutant')}
                ${filterOpt('levels', 'intermediaire', 'Intermédiaire')}
                ${filterOpt('levels', 'avance', 'Avancé')}
              </div>

              <div class="filter-group">
                <h3>Format</h3>
                ${filterOpt('formats', 'video-direct', 'Vidéos & direct')}
                ${filterOpt('formats', 'replay', 'Vidéos en replay')}
              </div>

              <div class="filter-group">
                <h3>Tarif étudiant · FCFA</h3>
                <div class="price-range">
                  <div class="price-range__labels"><span class="price-range__chip">25 000</span><span class="price-range__chip">45 000</span></div>
                  <div class="price-range__track"><span class="price-range__fill"></span><span class="price-range__knob"></span></div>
                  <p class="price-range__note">Tarifs professionnels indiqués sur chaque fiche.</p>
                </div>
              </div>

              <button class="filters__reset" id="filters-reset">Réinitialiser les filtres</button>
            </aside>

            <div class="cat-main">
              <div class="cat-main__bar">
                <span class="cat-main__count" id="cat-count"></span>
                <label class="cat-sort">Trier par :
                  <select id="cat-sort">
                    <option value="recommended">Recommandées</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="hours">Durée</option>
                  </select>
                </label>
              </div>
              <div class="course-grid cat-grid" id="cat-grid"></div>
              <div class="cat-foot">
                <p id="cat-shown"></p>
                <div class="pagination"><button class="is-active">1</button></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="cat-cta">
        <div class="container">
          <div class="cat-cta__inner">
            <div>
              <h2>Vous hésitez sur votre parcours ?</h2>
              <p>Parlez-nous de votre niveau et de votre projet. Nous vous aidons à trouver votre point de départ.</p>
            </div>
            <button class="btn btn-outline" id="cat-help">Être accompagné ${icon('arrow-right')}</button>
          </div>
        </div>
      </section>
    </main>
    ${siteFooter()}`;

  const grid = document.getElementById('cat-grid');
  const count = document.getElementById('cat-count');
  const shown = document.getElementById('cat-shown');

  function applyFilters() {
    const c = state.catalogue;
    let list = COURSES.filter((course) => {
      if (c.audience !== 'tous' && !course.audience.includes(c.audience)) return false;
      if (c.domains.length && !c.domains.some((d) => course.domains.includes(d))) return false;
      if (c.levels.length && !c.levels.some((l) => course.levels.includes(l))) return false;
      if (c.formats.length && !c.formats.some((f) => course.formats.includes(f))) return false;
      if (c.q) {
        const q = c.q.toLowerCase();
        const teacher = INSTRUCTORS[course.instructor].name.toLowerCase();
        const hay = `${course.title} ${course.category} ${course.short} ${teacher}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (c.sort === 'price-asc') list = list.sort((a, b) => a.price - b.price);
    if (c.sort === 'price-desc') list = list.sort((a, b) => b.price - a.price);
    if (c.sort === 'hours') list = list.sort((a, b) => a.hours - b.hours);

    count.textContent = `${list.length} formation${list.length > 1 ? 's' : ''} disponible${list.length > 1 ? 's' : ''}`;
    shown.textContent = list.length === COURSES.length
      ? `Vous avez consulté les ${COURSES.length} formations du catalogue.`
      : `${list.length} résultat${list.length > 1 ? 's' : ''} sur ${COURSES.length} formations.`;
    grid.innerHTML = list.length
      ? list.map(courseCard).join('')
      : '<p class="cat-empty">Aucune formation ne correspond à votre recherche.<br/>Essayez d’élargir vos filtres.</p>';
  }

  appRoot.querySelectorAll('[data-filter]').forEach((input) => {
    input.addEventListener('change', () => {
      const field = input.dataset.filter;
      const value = input.value;
      if (field === 'audience') {
        state.catalogue.audience = value;
        appRoot.querySelectorAll('[data-filter="audience"]').forEach((el) => { if (el !== input) el.checked = false; });
      } else {
        const arr = state.catalogue[field];
        if (input.checked) arr.push(value);
        else {
          const i = arr.indexOf(value);
          if (i >= 0) arr.splice(i, 1);
        }
      }
      applyFilters();
    });
  });

  document.getElementById('cat-q').addEventListener('input', (e) => {
    state.catalogue.q = e.target.value;
    applyFilters();
  });
  document.getElementById('cat-search').addEventListener('submit', (e) => {
    e.preventDefault();
    state.catalogue.q = document.getElementById('cat-q').value;
    applyFilters();
  });
  document.getElementById('cat-sort').addEventListener('change', (e) => {
    state.catalogue.sort = e.target.value;
    applyFilters();
  });
  document.getElementById('filters-reset').addEventListener('click', () => {
    state.catalogue = { q: '', audience: 'tous', domains: [], levels: [], formats: [], sort: 'recommended' };
    renderCatalogue();
  });
  document.getElementById('cat-help').addEventListener('click', () => openContactModal('Choisir mon parcours'));

  applyFilters();
}

function filterOpt(field, value, label, checked = false) {
  const isChecked = field === 'audience'
    ? state.catalogue.audience === value
    : state.catalogue[field].includes(value);
  return `
    <label class="filter-opt">
      <input type="checkbox" data-filter="${field}" value="${value}" ${checked || isChecked ? 'checked' : ''} />
      <span class="filter-opt__box">${icon('check')}</span>
      <span>${label}</span>
    </label>`;
}
