(() => {
  const cfg = window.WEDDING_CONFIG;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const setText = (sel, value) => $$(sel).forEach(el => { el.textContent = value; });

  setText('[data-first]', cfg.couple.first);
  setText('[data-second]', cfg.couple.second);
  setText('[data-initials]', cfg.couple.initials);
  setText('[data-seal]', cfg.couple.first.charAt(0) || 'N');
  setText('[data-date-label]', cfg.dateLabel);
  setText('[data-intro]', cfg.intro);
  setText('[data-rsvp-deadline]', cfg.rsvpDeadline);
  setText('[data-footer]', cfg.footer);

  setText('[data-ceremony-title]', cfg.ceremony.title);
  setText('[data-ceremony-time]', cfg.ceremony.time);
  setText('[data-ceremony-venue]', cfg.ceremony.venue);
  setText('[data-ceremony-address]', cfg.ceremony.address);
  setText('[data-reception-title]', cfg.reception.title);
  setText('[data-reception-time]', cfg.reception.time);
  setText('[data-reception-venue]', cfg.reception.venue);
  setText('[data-reception-address]', cfg.reception.address);

  const mapLinks = [
    [$('[data-ceremony-map]'), cfg.ceremony.mapUrl],
    [$('[data-reception-map]'), cfg.reception.mapUrl]
  ];
  mapLinks.forEach(([el, href]) => {
    if (!el) return;
    if (!href || href === '#') el.classList.add('is-disabled');
    else { el.href = href; el.target = '_blank'; el.rel = 'noopener noreferrer'; }
  });

  const storyList = $('#storyList');
  cfg.story.forEach(item => {
    const article = document.createElement('article');
    article.className = 'story-item reveal';
    article.innerHTML = `
      <div class="story-year">${escapeHtml(item.year)}</div>
      <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></div>`;
    storyList.appendChild(article);
  });

  const scheduleList = $('#scheduleList');
  cfg.schedule.forEach(([time, label]) => {
    const row = document.createElement('div');
    row.className = 'timeline-item reveal';
    row.innerHTML = `
      <span class="timeline-dot"></span>
      <div class="timeline-time">${escapeHtml(time)}</div>
      <div class="timeline-label">${escapeHtml(label)}</div>`;
    scheduleList.appendChild(row);
  });

  // Personalização simples por URL: ?convidado=João%20Silva
  const guestFromUrl = new URLSearchParams(location.search).get('convidado');
  if (guestFromUrl) $('#name').value = guestFromUrl;

  // Opening animation
  const gate = $('#invitationGate');
  const opener = $('#openInvitation');
  let opening = false;
  const openInvitation = () => {
    if (opening) return;
    opening = true;
    opener.classList.add('is-opening');
    setTimeout(() => {
      gate.classList.add('opened');
      document.body.classList.remove('locked');
      sessionStorage.setItem('wedding-invitation-opened', '1');
      setTimeout(() => $('.hero .reveal')?.classList.add('visible'), 180);
    }, 1050);
  };
  opener.addEventListener('click', openInvitation);
  opener.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openInvitation(); }
  });
  if (sessionStorage.getItem('wedding-invitation-opened') === '1' || new URLSearchParams(location.search).get('preview') === '1') {
    gate.classList.add('opened');
    document.body.classList.remove('locked');
  }

  // Scroll reveal
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .15 });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  // Countdown
  const weddingDate = new Date(cfg.date).getTime();
  const updateCountdown = () => {
    const diff = Math.max(0, weddingDate - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    $('#days').textContent = String(d).padStart(2, '0');
    $('#hours').textContent = String(h).padStart(2, '0');
    $('#minutes').textContent = String(m).padStart(2, '0');
    $('#seconds').textContent = String(s).padStart(2, '0');
  };
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // RSVP conditional fields
  const attendanceDetails = $('#attendanceDetails');
  $$('input[name="attendance"]').forEach(input => input.addEventListener('change', () => {
    attendanceDetails.classList.toggle('hidden', input.value === 'nao' && input.checked);
  }));

  // RSVP submit
  const form = $('#rsvpForm');
  const status = $('#formStatus');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = $('.submit-button', form);
    button.disabled = true;
    status.textContent = 'A guardar a tua resposta…';

    const data = Object.fromEntries(new FormData(form).entries());
    const payload = {
      name: data.name?.trim(),
      attendance: data.attendance,
      guests: data.attendance === 'sim' ? Number(data.guests || 1) : 0,
      children: data.attendance === 'sim' ? Number(data.children || 0) : 0,
      guest_names: data.attendance === 'sim' ? (data.guestNames || '').trim() : '',
      dietary: data.attendance === 'sim' ? (data.dietary || '').trim() : '',
      transport: data.attendance === 'sim' ? (data.transport || '') : '',
      message: (data.message || '').trim(),
      submitted_at: new Date().toISOString()
    };

    try {
      if (cfg.supabase.url && cfg.supabase.anonKey) {
        const response = await fetch(`${cfg.supabase.url.replace(/\/$/, '')}/rest/v1/rsvps`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': cfg.supabase.anonKey,
            'Authorization': `Bearer ${cfg.supabase.anonKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`Supabase respondeu ${response.status}`);
      } else {
        const demo = JSON.parse(localStorage.getItem('wedding-rsvp-demo') || '[]');
        demo.push(payload);
        localStorage.setItem('wedding-rsvp-demo', JSON.stringify(demo));
      }

      status.textContent = data.attendance === 'sim'
        ? 'Resposta guardada. Obrigado — mal podemos esperar para celebrar contigo! ♡'
        : 'Resposta guardada. Obrigado por nos avisares. ♡';
      form.reset();
      attendanceDetails.classList.remove('hidden');
    } catch (error) {
      console.error(error);
      status.textContent = 'Não foi possível guardar a resposta. Tenta novamente dentro de alguns instantes.';
    } finally {
      button.disabled = false;
    }
  });

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[c]);
  }
})();
