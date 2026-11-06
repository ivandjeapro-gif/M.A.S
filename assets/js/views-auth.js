/* =========================================================
   Authentification (simulation)
   ========================================================= */

const AUTH_KEY = 'baobab.auth';
const DEMO_ACCOUNT = { email: 'aminata.traore@baobab.demo', password: 'baobab2026' };

function isAuthed() {
  return sessionStorage.getItem(AUTH_KEY) === '1';
}

function clearAuth() {
  sessionStorage.removeItem(AUTH_KEY);
}

function authNextTarget() {
  const search = location.hash.split('?')[1] || '';
  const next = new URLSearchParams(search).get('next') || '';
  return /^\/app(\/|$|\?)/.test(next) ? `#${next}` : '#/app';
}

function renderAuth() {
  appRoot.innerHTML = `
    <main class="auth">
      <section class="auth__visual" aria-label="BAOBAB Mine Academy">
        <div class="auth__visual-top">
          <a class="auth__brand" href="#/"><img src="assets/img/logo.png" alt="BAOBAB Mine Academy" /></a>
          <a class="auth__back" href="#/">Retour au site ${icon('arrow-right')}</a>
        </div>
        <div class="auth__visual-mid">
          <span class="auth__kicker">Espace apprenant</span>
          <h1>Reprenez votre parcours,<br />là où vous l’avez laissé.</h1>
          <p>Vos modules, votre agenda de directs et vos résultats réunis dans un même espace.</p>
          <ul class="auth__perks">
            <li>${icon('play')}<span><b>Reprendre un cours</b><small>Vidéos, exercices et notes au même endroit.</small></span></li>
            <li>${icon('calendar')}<span><b>Vos prochains directs</b><small>Inscriptions et rappels dans votre agenda.</small></span></li>
            <li>${icon('award')}<span><b>Quiz et certificats</b><small>Suivez vos acquis et téléchargez vos documents.</small></span></li>
          </ul>
        </div>
        <div class="auth__quote">
          <p>« La formation m’a donné une méthode concrète pour structurer mes plannings de production. »</p>
          <div class="auth__quote-author">
            <span class="auth__quote-avatar" aria-hidden="true">MK</span>
            <span><b>Mariam Kouassi</b><small>Étudiante en géologie · promo 2026</small></span>
          </div>
        </div>
      </section>

      <section class="auth__panel">
        <div class="auth__panel-top">
          <span>Une question sur votre compte ?</span>
          <button type="button" data-contact="Connexion à mon espace">Contacter l’académie</button>
        </div>

        <div class="auth__form-wrap">
          <span class="auth__eyebrow">Connexion</span>
          <h2 class="auth__title">Se connecter</h2>
          <p class="auth__sub">Accédez à votre tableau de bord, à vos formations et à votre agenda personnel.</p>

          <form class="auth__form" id="auth-form" novalidate>
            <div class="auth__field">
              <label for="auth-email">Courriel</label>
              <input class="field" id="auth-email" name="email" type="email" autocomplete="email" placeholder="vous@exemple.com" required />
            </div>
            <div class="auth__field">
              <label for="auth-password">Mot de passe</label>
              <div class="auth__input-wrap">
                <input class="field" id="auth-password" name="password" type="password" autocomplete="current-password" placeholder="Votre mot de passe" required />
                <button class="auth__eye" type="button" data-auth-eye aria-label="Afficher le mot de passe">${icon('eye')}</button>
              </div>
            </div>
            <div class="auth__row">
              <label class="auth__check"><input type="checkbox" checked /> Rester connecté</label>
              <button class="auth__link" type="button" data-auth-forgot>Mot de passe oublié ?</button>
            </div>
            <p class="auth__error" id="auth-error" role="alert" hidden></p>
            <button class="btn btn-navy btn-lg btn-block auth__submit" type="submit">Se connecter ${icon('arrow-right')}</button>
          </form>

          <div class="auth__divider"><span>ou</span></div>
          <button class="btn btn-outline btn-block" type="button" data-auth-demo>Entrer avec le compte démo</button>
          <p class="auth__hint">Démonstration : aucune donnée réelle n’est collectée. Compte démo <b>${DEMO_ACCOUNT.email}</b>.</p>
        </div>

        <div class="auth__panel-foot">
          <span>${icon('shield')} Connexion sécurisée · Démonstration</span>
          <a href="#/catalogue">Pas encore inscrit ? Explorer les formations</a>
        </div>
      </section>
    </main>`;

  bindAuth();
}

function bindAuth() {
  const form = document.getElementById('auth-form');
  const email = document.getElementById('auth-email');
  const password = document.getElementById('auth-password');
  const error = document.getElementById('auth-error');
  const eye = form.querySelector('[data-auth-eye]');

  eye.addEventListener('click', () => {
    const reveal = password.type === 'password';
    password.type = reveal ? 'text' : 'password';
    eye.innerHTML = icon(reveal ? 'eye-off' : 'eye');
    eye.setAttribute('aria-label', reveal ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
  });

  form.querySelector('[data-auth-forgot]').addEventListener('click', () => openForgotPassword(email.value.trim()));

  document.querySelector('[data-auth-demo]').addEventListener('click', () => {
    email.value = DEMO_ACCOUNT.email;
    password.value = DEMO_ACCOUNT.password;
    error.hidden = true;
    signIn();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    error.hidden = true;
    const value = email.value.trim();
    if (!value) {
      showAuthError('Renseignez votre courriel.');
      email.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      showAuthError('Ce courriel ne semble pas valide.');
      email.focus();
      return;
    }
    if (!password.value) {
      showAuthError('Renseignez votre mot de passe.');
      password.focus();
      return;
    }
    signIn();
  });

  function showAuthError(message) {
    error.textContent = message;
    error.hidden = false;
  }
}

function signIn() {
  const submit = document.querySelector('.auth__submit');
  if (!submit || submit.disabled) return;
  submit.disabled = true;
  submit.textContent = 'Connexion…';

  setTimeout(() => {
    if (!location.hash.startsWith('#/connexion')) return;
    const target = authNextTarget();
    sessionStorage.setItem(AUTH_KEY, '1');
    toast(`Bienvenue ${USER.first} — connexion simulée.`);
    navigate(target);
  }, 450);
}

function openForgotPassword(prefill = '') {
  openModal(`
    <div class="modal__head">
      <div><span class="eyebrow">Accès au compte</span><h2>Mot de passe oublié</h2><p>Indiquez votre courriel : vous recevrez un lien de réinitialisation (simulation).</p></div>
      <button class="modal__close" data-close aria-label="Fermer">${icon('x')}</button>
    </div>
    <div class="modal__body">
      <label class="auth__field" style="display:block">
        <span style="display:block;margin-bottom:6px;font-size:11px;font-weight:500;color:var(--ink)">Courriel</span>
        <input class="field" id="forgot-email" type="email" placeholder="vous@exemple.com" value="${esc(prefill)}" />
      </label>
    </div>
    <div class="modal__foot">
      <p>Aucun courriel réel ne sera envoyé dans cette démonstration.</p>
      <div class="modal__actions"><button class="btn btn-navy" id="forgot-send">Envoyer le lien</button></div>
    </div>`, 'modal--narrow');

  const input = document.getElementById('forgot-email');
  const send = () => {
    const value = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast('Indiquez un courriel valide.');
      input.focus();
      return;
    }
    closeModal();
    toast(`Lien de réinitialisation envoyé à ${value} (simulation).`);
  };
  document.getElementById('forgot-send').addEventListener('click', send);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); send(); } });
  input.focus({ preventScroll: true });
}
