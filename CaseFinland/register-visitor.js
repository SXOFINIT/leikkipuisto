// Dummy data for today's visitors – replace with live data later
const todaysVisitors = [
  {
    id: 'V-2034',
    name: 'Anna Korhonen',
    company: 'Nordic Foods',
    time: '09:30',
    location: 'Helsinki HQ – Lobby A',
    purpose: 'Business meeting',
    host: 'You',
    statusKey: 'expected', // expected | checkedin | departed | late
    statusLabel: 'Expected',
    parking: 'P1 garage – visitor',
    vehicle: 'ABC-123'
  },
  {
    id: 'V-2035',
    name: 'Markus Svensson',
    company: 'Svea Security',
    time: '10:00',
    location: 'Helsinki HQ – Lobby B',
    purpose: 'Contractor',
    host: 'You',
    statusKey: 'checkedin',
    statusLabel: 'Checked in',
    parking: '',
    vehicle: ''
  },
  {
    id: 'V-2030',
    name: 'Laura Jensen',
    company: 'Aurora Consulting',
    time: '08:15',
    location: 'Tampere Office',
    purpose: 'Interview',
    host: 'HR Team',
    statusKey: 'departed',
    statusLabel: 'Departed',
    parking: 'Outdoor visitor spots',
    vehicle: 'JKL-789'
  },
  {
    id: 'V-2036',
    name: 'Oleg Petrov',
    company: 'Baltic Partners',
    time: '09:00',
    location: 'Helsinki HQ – Lobby A',
    purpose: 'Business meeting',
    host: 'You',
    statusKey: 'late',
    statusLabel: 'Late',
    parking: '',
    vehicle: ''
  }
];

function renderTodaysVisitors() {
  const list = document.getElementById('visit-list');
  const dateLabel = document.getElementById('visitor-date-label');
  const countLabel = document.getElementById('visitor-count-label');
  if (!list) return;

  list.innerHTML = '';

  const visitors = todaysVisitors;
  const count = visitors.length;

  if (dateLabel) {
    const now = new Date();
    const label = now.toLocaleDateString(undefined, {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
    dateLabel.textContent = label;
  }

  if (countLabel) {
    countLabel.textContent = count === 1 ? '1 visitor' : `${count} visitors`;
  }

  if (!visitors.length) {
    const li = document.createElement('li');
    li.innerHTML =
      '<div class="visit-name">No visitors today</div>' +
      '<div class="meta"><span>New registrations will appear here.</span></div>';
    list.appendChild(li);
    return;
  }

  visitors.forEach(v => {
    const li = document.createElement('li');

    const statusClass = {
      expected: 'status-expected',
      checkedin: 'status-checkedin',
      departed: 'status-departed',
      late: 'status-late'
    }[v.statusKey] || 'status-expected';

    const hasParking = !!v.parking;

    li.innerHTML =
      `<div>
        <div class="visit-name">${v.name}${v.company ? ' · ' + v.company : ''}</div>
        <div class="meta">
          <span>${v.time}</span>
          <span>${v.location}</span>
          <span>${v.purpose}</span>
          <span>Host: ${v.host}</span>
        </div>
        ${hasParking ? `
          <div class="parking-tag">
            <span>Parking</span>${v.parking}${v.vehicle ? ' · ' + v.vehicle : ''}
          </div>` : ''}
      </div>
      <div>
        <span class="status-pill ${statusClass}">${v.statusLabel}</span>
      </div>`;

    list.appendChild(li);
  });
}

function showToast(text) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  if (text) toastText.textContent = text;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 2600);
}

function initToastActions() {
  const btnCalendar = document.getElementById('btn-calendar');
  const btnBadge = document.getElementById('btn-badge');

  if (btnCalendar) {
    btnCalendar.addEventListener('click', () => {
      // In a real integration, open calendar event creation
      showToast('Calendar event will be created in your calendar tool.');
    });
  }

  if (btnBadge) {
    btnBadge.addEventListener('click', () => {
      // In a real integration, open badge print view
      showToast('Badge print job has been sent to reception.');
    });
  }
}

function validateForm() {
  let valid = true;

  const requiredIds = ['v-first', 'v-last', 'v-email', 'v-datetime', 'v-host', 'v-location', 'v-purpose'];
  requiredIds.forEach(id => {
    const input = document.getElementById(id);
    const err = document.querySelector(`.error[data-err-for="${id}"]`);
    if (!input || !err) return;
    if (!input.value.trim()) {
      err.textContent = 'Required field';
      valid = false;
    } else {
      err.textContent = '';
    }
  });

  const email = document.getElementById('v-email');
  const errEmail = document.querySelector(`.error[data-err-for="v-email"]`);
  if (email && errEmail && email.value.trim()) {
    const ok = /\S+@\S+\.\S+/.test(email.value.trim());
    if (!ok) {
      errEmail.textContent = 'Enter a valid email';
      valid = false;
    }
  }

  return valid;
}

function initVisitorForm() {
  const form = document.getElementById('visitor-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const first = document.getElementById('v-first').value.trim();
    const last = document.getElementById('v-last').value.trim();
    const email = document.getElementById('v-email').value.trim();
    const company = document.getElementById('v-company').value.trim();
    const datetime = document.getElementById('v-datetime').value;
    const host = document.getElementById('v-host').value.trim();
    const location = document.getElementById('v-location').value;
    const purpose = document.getElementById('v-purpose').value;
    const parkingValue = document.getElementById('v-parking').value;
    const vehicle = document.getElementById('v-vehicle').value.trim();
    const message = document.getElementById('v-message').value.trim();
    const nda = document.getElementById('v-nda').checked;

    const dt = datetime ? new Date(datetime) : null;
    const timeLabel = dt
      ? dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'Time';

    let parkingLabel = '';
    if (parkingValue === 'p1') parkingLabel = 'P1 garage – visitor';
    if (parkingValue === 'outdoor') parkingLabel = 'Outdoor visitor spots';
    if (parkingValue === 'ev') parkingLabel = 'EV charging spot';

    const visitor = {
      id: 'V-' + Math.floor(2000 + Math.random() * 8000),
      name: `${first} ${last}`,
      company,
      time: timeLabel,
      location,
      purpose,
      host: host || 'You',
      statusKey: 'expected',
      statusLabel: 'Expected',
      parking: parkingLabel,
      vehicle
    };

    todaysVisitors.unshift(visitor);
    renderTodaysVisitors();

    const toastMsg = [
      `Invitation email will be sent to ${email}.`,
      parkingLabel ? `Parking reserved: ${parkingLabel}${vehicle ? ' (' + vehicle + ')' : ''}.` : 'No parking reserved.',
      message ? 'Your message will be included in the email.' : 'You did not add a personal message.'
    ].join(' ');

    showToast(toastMsg);

    form.reset();
    const hostField = document.getElementById('v-host');
    if (hostField) hostField.value = 'You';
  });
}

function init() {
  renderTodaysVisitors();
  initVisitorForm();
  initToastActions();
}

window.addEventListener('DOMContentLoaded', init);
