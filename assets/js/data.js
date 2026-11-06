/* =========================================================
   BAOBAB Mine Academy — données de démonstration
   ========================================================= */

const BRAND = {
  name: 'BAOBAB Mine Academy',
  baseline: 'Le savoir du terrain. L’ambition de demain. Une académie dédiée aux métiers des mines.',
  demo: 'Plateforme de démonstration · Contenus, profils, tarifs et résultats simulés.',
};

const USER = {
  first: 'Aminata',
  last: 'Traoré',
  initials: 'AT',
  role: 'Offre étudiante',
};

const INSTRUCTORS = {
  moussa: {
    id: 'moussa', name: 'Moussa Koné',
    role: 'Ingénieur des mines · Planification & exploitation',
    photo: 'assets/img/moussa.jpg',
    bio: 'Spécialiste des opérations à ciel ouvert, il transmet une méthode qui relie données géologiques, capacités des équipements et décisions de production.',
    quote: 'Un bon planning relie la géologie aux réalités de production. C’est cette lecture que je transmets.',
  },
  fatou: {
    id: 'fatou', name: 'Fatou Diarra',
    role: 'Géologue & exploration',
    photo: 'assets/img/hero-woman.jpg',
    bio: 'Géologue de terrain, elle accompagne les équipes dans la lecture des indices, l’échantillonnage et la construction d’hypothèses fiables.',
    quote: 'Le terrain parle à qui sait l’observer. Mon rôle est de transmettre cette lecture.',
  },
  adama: {
    id: 'adama', name: 'Adama Ouédraogo',
    role: 'Prévention & sécurité HSE',
    photo: 'assets/img/hse-workers.jpg',
    bio: 'Ancien responsable HSE sur sites industriels, il enseigne une prévention concrète, ancrée dans les situations réelles de travail.',
    quote: 'La sécurité n’est pas un document : c’est une décision prise avant chaque geste.',
  },
  aissata: {
    id: 'aissata', name: 'Aïssata Ba',
    role: 'Métallurgie & traitement des minerais',
    photo: 'assets/img/plant.jpg',
    bio: 'Spécialiste des procédés de traitement, elle relie les performances de l’usine aux caractéristiques du minerai et aux contraintes d’exploitation.',
    quote: 'Comprendre le minerai, c’est déjà optimiser une partie de l’usine.',
  },
};

const COURSES = [
  {
    id: 'planification',
    category: 'Exploitation minière',
    title: 'Planification minière à ciel ouvert',
    short: 'Du modèle géologique au planning de production : construisez un plan cohérent, réaliste et pilotable.',
    level: 'Intermédiaire', hours: 24, modulesCount: 6, lessons: 18, format: 'Vidéos & direct',
    price: 45000, proPrice: 75000, instructor: 'moussa', image: 'assets/img/mine-pit.jpg',
    audience: ['etudiants', 'professionnels'], domains: ['exploitation'], levels: ['intermediaire'], formats: ['video-direct'],
    featured: true, enrolled: true, progress: 67,
    objectives: [
      'Lire un modèle de blocs et identifier les données utiles',
      'Définir des phases d’exploitation cohérentes',
      'Dimensionner un objectif de production réaliste',
      'Suivre les écarts et ajuster le planning',
    ],
    description: 'Du modèle géologique au planning de production : apprenez à construire un plan cohérent, réaliste et pilotable.',
    modules: [
      { n: '01', title: 'Fondamentaux de la mine à ciel ouvert', duration: '3 h', topics: 'Méthodes d’exploitation · Organisation d’un site · Quiz de repérage', state: 'done' },
      { n: '02', title: 'Du gisement au modèle de blocs', duration: '4 h', topics: 'Teneurs et tonnages · Lecture du modèle · Qualité des données', state: 'done' },
      { n: '03', title: 'Conception et limites de fosse', duration: '4 h', topics: 'Géométrie de fosse · Contraintes géotechniques · Exercice guidé', state: 'done' },
      { n: '04', title: 'Séquençage et phases d’exploitation', duration: '4 h', topics: 'Phasage · Accès et capacités · Cas de séquençage', state: 'done' },
      { n: '05', title: 'Production & suivi', duration: '5 h', topics: 'Planning de production · Flotte et rendement · Suivi des écarts', state: 'active', next: 'Construire un planning de production', slotsLabel: '3 créneaux · 5 h planifiées' },
      { n: '06', title: 'Cas pratique & évaluation finale', duration: '4 h', topics: 'Examen final · Validation du parcours · Certificat ou diplôme', state: 'locked', note: 'À planifier · après module 5', lockNote: 'Accès soumis aux prérequis.' },
    ],
    lectures: '18 leçons · 5 quiz de parcours · 1 examen final',
  },
  {
    id: 'geologie',
    category: 'Géologie & exploration',
    title: 'Géologie de terrain et exploration',
    short: 'Lire un terrain, interpréter un échantillon et construire une hypothèse d’exploration solide.',
    level: 'Débutant', hours: 18, modulesCount: 5, lessons: 14, format: 'Vidéos & direct',
    price: 35000, proPrice: 60000, instructor: 'fatou', image: 'assets/img/gold-panning.jpg',
    audience: ['etudiants', 'professionnels'], domains: ['geologie'], levels: ['debutant'], formats: ['video-direct'],
    featured: true, enrolled: false, progress: 0,
    objectives: [
      'Reconnaître les indices géologiques sur le terrain',
      'Préparer et lire un échantillon représentatif',
      'Construire une coupe et une hypothèse d’exploration',
      'Restituer une interprétation argumentée',
    ],
    description: 'Apprenez à lire un terrain, prélever et interpréter des échantillons, puis construire une hypothèse d’exploration fiable.',
    modules: [
      { n: '01', title: 'Lire un terrain et ses indices', duration: '3 h', topics: 'Cartographie · Structures · Lecture paysagère', state: 'todo' },
      { n: '02', title: 'Échantillonnage et préparation', duration: '4 h', topics: 'Représentativité · Protocole · Contrôle qualité', state: 'todo' },
      { n: '03', title: 'Cartographie et coupes', duration: '4 h', topics: 'Coupes · Corrélations · Outils de terrain', state: 'todo' },
      { n: '04', title: 'Interpréter les indices', duration: '3 h', topics: 'Minéralisation · Hypothèses · Étude de cas', state: 'todo' },
      { n: '05', title: 'Synthèse et évaluation finale', duration: '4 h', topics: 'Examen final · Validation · Certificat', state: 'locked' },
    ],
    lectures: '14 leçons · 4 quiz de parcours · 1 examen final',
  },
  {
    id: 'hse',
    category: 'Sécurité & environnement',
    title: 'Les fondamentaux HSE en mine',
    short: 'Prévenir les risques, structurer les permis de travail et ancrer les bons réflexes sur site.',
    level: 'Débutant', hours: 12, modulesCount: 4, lessons: 10, format: 'Vidéos & direct',
    price: 25000, proPrice: 45000, instructor: 'adama', image: 'assets/img/hse-workers.jpg',
    audience: ['etudiants', 'professionnels'], domains: ['securite'], levels: ['debutant'], formats: ['video-direct'],
    featured: true, enrolled: true, progress: 100, certificate: true,
    objectives: [
      'Identifier les risques d’un poste de travail',
      'Appliquer les règles de permis et de consignation',
      'Réagir face à une situation d’urgence',
      'Ancrer les fondamentaux HSE au quotidien',
    ],
    description: 'Les fondamentaux HSE pour intervenir sur un site minier : analyser les risques, appliquer les permis et réagir en situation d’urgence.',
    modules: [
      { n: '01', title: 'Cadre HSE et responsabilités', duration: '3 h', topics: 'Rôles · Obligations · Culture sécurité', state: 'done' },
      { n: '02', title: 'Identifier les risques', duration: '3 h', topics: 'Analyse de poste · Matrice de risque · Exercice', state: 'done' },
      { n: '03', title: 'Prévention et permis de travail', duration: '3 h', topics: 'Permis · Consignation · Bonnes pratiques', state: 'done' },
      { n: '04', title: 'Situations d’urgence et examen final', duration: '3 h', topics: 'Scénarios · Alerte · Examen final', state: 'done' },
    ],
    lectures: '10 leçons · 4 quiz de parcours · 1 examen final',
  },
  {
    id: 'traitement',
    category: 'Traitement des minéraux',
    title: 'Introduction au traitement des minerais',
    short: 'Comprendre la chaîne de traitement, du concassage à la concentration, et ses indicateurs clés.',
    level: 'Débutant', hours: 20, modulesCount: 5, lessons: 15, format: 'Vidéos & direct',
    price: 40000, proPrice: 68000, instructor: 'aissata', image: 'assets/img/plant.jpg',
    audience: ['professionnels'], domains: ['traitement'], levels: ['debutant'], formats: ['video-direct'],
    featured: false, enrolled: false, progress: 0,
    objectives: [
      'Décrire les étapes d’une chaîne de traitement',
      'Relier granulométrie et performance',
      'Comprendre les procédés de concentration',
      'Lire les principaux indicateurs d’usine',
    ],
    description: 'Une immersion dans la chaîne de traitement des minerais : concassage, broyage, séparation, concentration et indicateurs de performance.',
    modules: [
      { n: '01', title: 'La chaîne de traitement', duration: '4 h', topics: 'Schéma de procédé · Flux · Vocabulaire', state: 'todo' },
      { n: '02', title: 'Concassage et broyage', duration: '4 h', topics: 'Granulométrie · Énergie · Équipements', state: 'todo' },
      { n: '03', title: 'Séparation et concentration', duration: '4 h', topics: 'Flottation · Gravimétrie · Rendement', state: 'todo' },
      { n: '04', title: 'Gestion de l’eau et des résidus', duration: '4 h', topics: 'Boucles d’eau · Résidus · Environnement', state: 'todo' },
      { n: '05', title: 'Optimisation et examen final', duration: '4 h', topics: 'Indicateurs · Amélioration · Examen final', state: 'locked' },
    ],
    lectures: '15 leçons · 4 quiz de parcours · 1 examen final',
  },
  {
    id: 'economie',
    category: 'Économie minière',
    title: 'Coûts et rentabilité d’un projet minier',
    short: 'Structurer les coûts, modéliser la rentabilité et éclairer les décisions d’investissement.',
    level: 'Intermédiaire', hours: 16, modulesCount: 4, lessons: 12, format: 'Vidéos & direct',
    price: 40000, proPrice: 70000, instructor: 'moussa', image: 'assets/img/environment.jpg',
    audience: ['professionnels'], domains: ['economie'], levels: ['intermediaire'], formats: ['video-direct'],
    featured: false, enrolled: false, progress: 0,
    objectives: [
      'Décomposer la structure de coûts d’une mine',
      'Construire un modèle de rentabilité simple',
      'Tester la sensibilité aux hypothèses clés',
      'Présenter une recommandation d’investissement',
    ],
    description: 'Coûts d’exploitation, investissements, sensibilité : construisez un modèle de rentabilité lisible et utilisez-le pour décider.',
    modules: [
      { n: '01', title: 'Structure de coûts d’une mine', duration: '4 h', topics: 'CAPEX · OPEX · Coût de revient', state: 'todo' },
      { n: '02', title: 'Modéliser la rentabilité', duration: '4 h', topics: 'Flux de trésorerie · VAN · TRI', state: 'todo' },
      { n: '03', title: 'Sensibilité et risques', duration: '4 h', topics: 'Scénarios · Prix · Taux de change', state: 'todo' },
      { n: '04', title: 'Décision d’investissement et examen final', duration: '4 h', topics: 'Recommandation · Examen final · Certificat', state: 'locked' },
    ],
    lectures: '12 leçons · 3 quiz de parcours · 1 examen final',
  },
  {
    id: 'environnement',
    category: 'Sécurité & environnement',
    title: 'Gestion environnementale des sites',
    short: 'Piloter les impacts, l’eau et la réhabilitation d’un site minier dans une logique durable.',
    level: 'Intermédiaire', hours: 15, modulesCount: 4, lessons: 12, format: 'Vidéos & replay',
    price: 35000, proPrice: 62000, instructor: 'fatou', image: 'assets/img/environment.jpg',
    audience: ['professionnels'], domains: ['securite'], levels: ['intermediaire'], formats: ['replay'],
    featured: false, enrolled: false, progress: 0,
    objectives: [
      'Identifier les impacts environnementaux d’un site',
      'Structurer la gestion de l’eau et des résidus',
      'Préparer un plan de réhabilitation',
      'Piloter les indicateurs environnementaux',
    ],
    description: 'Impacts, eau, résidus, biodiversité et réhabilitation : les fondamentaux pour gérer l’environnement d’un site minier.',
    modules: [
      { n: '01', title: 'Cadre réglementaire et impacts', duration: '3 h', topics: 'Cadre · Étude d’impact · Parties prenantes', state: 'todo' },
      { n: '02', title: 'Gestion de l’eau et des résidus', duration: '4 h', topics: 'Bilans · Traitement · Surveillance', state: 'todo' },
      { n: '03', title: 'Réhabilitation des sites', duration: '4 h', topics: 'Plan de fermeture · Végétalisation · Suivi', state: 'todo' },
      { n: '04', title: 'Plan de gestion et examen final', duration: '4 h', topics: 'Indicateurs · Plan d’action · Examen final', state: 'locked' },
    ],
    lectures: '12 leçons · 3 quiz de parcours · 1 examen final',
  },
];

const LIVE_SESSIONS = [
  {
    id: 'live-12', date: '2026-11-12', start: '18:00', end: '19:30',
    title: 'Du modèle de blocs au plan de production', instructor: 'Moussa Koné',
    course: 'planification', registered: true, inAgenda: true, tag: 'Planification',
    description: 'Atelier de la formation Planification minière à ciel ouvert. À partir d’un modèle simplifié, construisons les premières étapes d’un planning de production.',
    details: 'Lien ouvert dès 17:45 GMT. Session enregistrée ; replay et support après le direct. Revoyez le module 2 et préparez vos questions.',
  },
  {
    id: 'live-14', date: '2026-11-14', start: '10:00', end: '11:00',
    title: 'Lire un échantillon, interpréter un terrain', instructor: 'Fatou Diarra',
    course: 'geologie', registered: true, inAgenda: false, tag: 'Géologie',
    description: 'Un atelier de lecture d’échantillons et d’interprétation de terrain, ouvert aux apprenants du parcours Géologie.',
    details: 'Session accessible après inscription. Replay prévu.',
  },
  {
    id: 'live-21', date: '2026-11-21', start: '10:00', end: '11:00',
    title: 'Prévention HSE : analyser une situation', instructor: 'Adama Ouédraogo',
    course: 'hse', registered: false, inAgenda: false, tag: 'HSE',
    description: 'Analyse collective d’une situation de travail et construction des barrières de prévention.',
    details: 'Ouvert aux apprenants HSE. Replay disponible.',
  },
  {
    id: 'live-28', date: '2026-11-28', start: '10:00', end: '11:00',
    title: 'Lire les indicateurs d’usine', instructor: 'Aïssata Ba',
    course: 'traitement', registered: false, inAgenda: false, tag: 'Traitement',
    description: 'Décoder les indicateurs d’une usine de traitement et repérer les dérives.',
    details: 'Session enregistrée. Replay et fiche synthétique après le direct.',
  },
];

const REPLAYS = [
  { id: 'replay-1', date: '22 octobre 2026', title: 'Les choix de séquençage en pratique', meta: 'Moussa Koné · 1 h 18 · Planification', image: 'assets/img/mine-pit.jpg', course: 'planification' },
  { id: 'replay-2', date: '24 octobre 2026', title: 'Identifier les risques sur un poste de travail', meta: 'Adama Ouédraogo · 52 min · HSE', image: 'assets/img/hse-workers.jpg', course: 'hse' },
];

/* Module 5 planifié sur 3 créneaux */
const PLANNED_SLOTS = [
  { date: '2026-11-09', start: '09:00', end: '11:00', module: '05' },
  { date: '2026-11-10', start: '09:00', end: '11:00', module: '05' },
  { date: '2026-11-11', start: '09:00', end: '10:00', module: '05' },
];

const PLANNING_TASKS = [
  { date: '2026-11-12', start: '18:00', end: '19:30', label: 'Planification', kind: 'module' },
  { date: '2026-11-19', start: '18:00', end: '19:00', label: 'Cas pratique', kind: 'module' },
  { date: '2026-11-26', start: '18:00', end: '19:00', label: 'Traitement', kind: 'module' },
];

const RESULTS = {
  certificate: {
    ref: 'CERT-HSE-2026', course: 'Les fondamentaux HSE en mine', date: '28 octobre 2026',
    hours: 12, modules: 4, instructor: 'Adama Ouédraogo', score: 86,
  },
  quizzes: [
    { label: 'Quiz de parcours · Fondamentaux de la mine', date: '29 oct. 2026', score: '18 / 20', status: 'Réussi', tone: 'green' },
    { label: 'Quiz de parcours · Modèle de blocs', date: '31 oct. 2026', score: '17 / 20', status: 'Réussi', tone: 'green' },
    { label: 'Quiz de parcours · Conception de fosse', date: '2 nov. 2026', score: '18 / 20', status: 'Réussi', tone: 'green' },
    { label: 'Quiz de parcours · Séquençage', date: '4 nov. 2026', score: '16 / 20', status: 'Réussi', tone: 'green' },
    { label: 'Quiz de parcours · Production & suivi', date: 'Non terminé', score: null, status: 'En cours', tone: 'cream' },
    { label: 'Examen final · Synthèse du parcours', date: 'À venir', score: null, status: 'Verrouillé', tone: 'muted' },
  ],
};

const LESSON = {
  courseId: 'planification',
  module: '05', moduleTitle: 'Production & suivi', lessonNo: '13',
  title: 'Construire un planning de production',
  instructor: 'Moussa Koné', duration: '18 min 30', level: 'Intermédiaire',
  courseTitle: 'Planification minière à ciel ouvert',
  image: 'assets/img/mine-pit.jpg',
  doneLessons: 12, totalLessons: 18, progress: 67,
};

const LESSON_MODULES = [
  { n: '01', title: 'Fondamentaux de la mine', state: 'done' },
  { n: '02', title: 'Le modèle de blocs', state: 'done' },
  { n: '03', title: 'Conception de fosse', state: 'done' },
  { n: '04', title: 'Séquençage', state: 'done' },
  { n: '05', title: 'Production & suivi', state: 'current', lessons: [
    { title: 'Construire un planning de production', time: '18 min 30', state: 'active' },
    { title: 'Flotte et rendement', time: '22 min', state: 'todo' },
    { title: 'Analyser les écarts', time: '16 min', state: 'todo' },
    { title: 'Test de connaissance · Quiz 5', time: '5 questions', state: 'quiz' },
  ]},
  { n: '06', title: 'Examen final', state: 'locked' },
];

const AGREEMENT = {
  timezone: 'GMT (UTC+0) · Abidjan / Dakar',
  nextModule: { n: '05', title: 'Production & suivi', duration: '5 h', course: 'Planification minière à ciel ouvert' },
};
