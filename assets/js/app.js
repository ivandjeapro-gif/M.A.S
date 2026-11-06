/* =========================================================
   Routeur
   ========================================================= */

function parseRoute() {
  const hash = location.hash.replace(/^#/, '');
  return hash || '/';
}

function router() {
  closeModal();
  stopSessionTimers();
  closeDayPop();
  document.querySelectorAll('.ctx-menu').forEach((m) => m.remove());
  const raw = parseRoute();
  const [route, search] = raw.split('?');
  const params = new URLSearchParams(search || '');
  let scrollTarget = null;

  if (route === '/' || route === '') {
    renderHome();
    scrollTarget = params.get('scroll');
  } else if (route === '/catalogue') {
    renderCatalogue();
  } else if (route.startsWith('/formation/')) {
    renderCourseDetail(route.split('/')[2]);
  } else if (route === '/sessions') {
    renderSessions();
  } else if (route.startsWith('/sessions/')) {
    renderSessionDetail(route.split('/')[2]);
  } else if (route === '/connexion') {
    renderAuth();
  } else if (route === '/app' || route.startsWith('/app/')) {
    if (!isAuthed()) {
      location.replace(`#/connexion?next=${encodeURIComponent(raw)}`);
      return;
    }
    if (route === '/app') {
      renderDashboard();
    } else if (route === '/app/formations') {
      renderMyCourses();
    } else if (route === '/app/cours') {
      renderPlayer();
    } else if (route === '/app/agenda') {
      state.agendaMode = params.get('mode') || 'modules';
      if (params.get('day')) state.selectedDay = params.get('day');
      renderAgenda();
    } else if (route === '/app/resultats') {
      state.resultsTab = params.get('tab') || 'overview';
      renderResults();
    } else {
      renderDashboard();
    }
  } else {
    renderHome();
  }

  if (scrollTarget) {
    const el = document.getElementById(scrollTarget);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    else window.scrollTo({ top: 0, behavior: 'auto' });
  } else if (route === '/app/resultats' && state.resultsTab !== 'overview') {
    const el = document.getElementById(state.resultsTab === 'quizzes' ? 'quiz-section' : 'cert-section');
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    else window.scrollTo({ top: 0, behavior: 'auto' });
  } else {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);

if (document.readyState !== 'loading') router();
