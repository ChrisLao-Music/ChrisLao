// Simple client-side router + language-filtered music list
(function () {
  const sections = document.querySelectorAll('.tab-section');
  const nav = document.querySelector('.main-nav');

  const player = document.getElementById('player');
  const playerSource = document.getElementById('player-source');
  const trackTitle = document.getElementById('track-title');
  const lyricsTagalog = document.getElementById('lyrics-tagalog');
  const lyricsEnglish = document.getElementById('lyrics-english');
  const dropButtons = document.querySelectorAll('.dropbtn');
  const musicList = document.getElementById('music-list');

  // tracks: set src to match your filenames (prefer no spaces)
  const TRACKS = {
    mahal: { src: 'Mahal Pa Rin Kita.mp3', title: 'Mahal Pa Rin Kita', lang: 'tagalog' },
    pwede: { src: 'Kung Pwede Lang.mp3', title: 'Kung Pwede Lang', lang: 'tagalog' },
    still: { src: 'I Still Love You.mp3', title: 'I Still Love You', lang: 'english' },
    could: { src: 'If Only I Could.mp3', title: 'If Only I Could', lang: 'english' }
  };

  function setActiveTab(id, pushHistory = false) {
    sections.forEach(s => {
      if (s.id === id) {
        s.removeAttribute('hidden');
        s.classList.add('active');
      } else {
        s.setAttribute('hidden', '');
        s.classList.remove('active');
      }
    });
    document.querySelectorAll('.main-nav a').forEach(a => {
      a.classList.toggle('active', a.dataset.tab === id);
    });
    if (pushHistory) history.pushState({ tab: id }, '', '#' + id);
  }

  // build music list for language
  function renderMusicList(lang) {
    musicList.innerHTML = ''; // clear
    trackTitle.textContent = lang === 'tagalog' ? 'Tagalog Songs' : 'English Songs';
    const ul = document.createElement('ul');
    ul.className = 'music-ul';
    Object.keys(TRACKS).forEach(key => {
      const t = TRACKS[key];
      if (t.lang !== lang) return;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#';
      a.dataset.track = key;
      a.className = 'music-track';
      a.textContent = t.title;
      li.appendChild(a);
      ul.appendChild(li);
    });
    if (!ul.children.length) {
      musicList.textContent = 'No tracks found for this language.';
    } else {
      musicList.appendChild(ul);
    }
  }

  // play track by key
  function playTrack(key) {
    const t = TRACKS[key];
    if (!t) return;
    playerSource.src = t.src;
    player.load();
    trackTitle.textContent = t.title;
    player.play().catch(() => {});
    // switch lyrics language to track language
    if (t.lang === 'tagalog') {
      lyricsTagalog.removeAttribute('hidden');
      lyricsEnglish.setAttribute('hidden', '');
    } else {
      lyricsEnglish.removeAttribute('hidden');
      lyricsTagalog.setAttribute('hidden', '');
    }
  }

  // handle nav and dropdown clicks
  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-tab], a[data-action]');
    if (!a) return;
    e.preventDefault();

    // music-language selection (data-action="music-lang")
    if (a.dataset.action === 'music-lang') {
      const lang = a.dataset.lang;
      setActiveTab('music', true);
      renderMusicList(lang);
      // close dropdowns
      document.querySelectorAll('.dropdown .dropdown-content').forEach(d => d.style.display = '');
      dropButtons.forEach(b => b.setAttribute('aria-expanded', 'false'));
      return;
    }

    // normal tab links
    if (a.dataset.tab) {
      const tab = a.dataset.tab;
      setActiveTab(tab, true);

      // lyrics language selection inside Lyrics dropdown
      const lang = a.dataset.lang;
      if (tab === 'lyrics' && lang) {
        if (lang === 'tagalog') {
          lyricsTagalog.removeAttribute('hidden');
          lyricsEnglish.setAttribute('hidden', '');
        } else {
          lyricsEnglish.removeAttribute('hidden');
          lyricsTagalog.setAttribute('hidden', '');
        }
      }
      // close dropdowns
      document.querySelectorAll('.dropdown .dropdown-content').forEach(d => d.style.display = '');
      dropButtons.forEach(b => b.setAttribute('aria-expanded', 'false'));
    }
  });

  // handle clicks on generated music list (play track)
  musicList.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-track]');
    if (!a) return;
    e.preventDefault();
    const key = a.dataset.track;
    playTrack(key);
  });

  // dropdown toggle for buttons (mobile / keyboard)
  dropButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      const dd = btn.nextElementSibling;
      if (dd) dd.style.display = expanded ? 'none' : 'block';
    });
  });

  // click outside to close dropdowns
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown .dropdown-content').forEach(d => d.style.display = '');
      dropButtons.forEach(b => b.setAttribute('aria-expanded', 'false'));
    }
  });

  // initialize from hash and default lyrics
  document.addEventListener('DOMContentLoaded', () => {
    const initial = (location.hash || '#home').replace('#', '');
    setActiveTab(document.getElementById(initial) ? initial : 'home', false);
    lyricsEnglish.setAttribute('hidden', '');
  });

  // handle back/forward
  window.addEventListener('popstate', () => {
    const hash = (location.hash || '#home').replace('#', '');
    setActiveTab(document.getElementById(hash) ? hash : 'home', false);
  });
})();