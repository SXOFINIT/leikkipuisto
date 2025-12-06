// Dummy recent requests – replace with live data from ticketing system later
const recentRequests = [
  {
    id: 'SR-10234',
    category: 'IT Support',
    title: 'Docking station not working',
    location: 'Helsinki HQ – Floor 3',
    status: 'In progress',
    statusKey: 'progress',
    created: 'Today 09:15',
    sla: 'Respond within 4h',
    mine: true,
    breached: false
  },
  {
    id: 'SR-10221',
    category: 'Cleaning',
    title: 'Spill in coffee area',
    location: 'Helsinki HQ – Floor 2',
    status: 'Resolved',
    statusKey: 'resolved',
    created: 'Yesterday 14:05',
    sla: 'Completed within 24h',
    mine: true,
    breached: false
  },
  {
    id: 'SR-10190',
    category: 'HVAC / Temperature',
    title: 'Office too warm – west wing',
    location: 'Tampere Office – 1st floor',
    status: 'SLA breached',
    statusKey: 'breached',
    created: '2 days ago 10:22',
    sla: 'Target: 8h response (missed)',
    mine: true,
    breached: true
  },
  {
    id: 'SR-10175',
    category: 'Furniture',
    title: 'Additional ergonomic chair',
    location: 'Helsinki HQ – Floor 3',
    status: 'Open',
    statusKey: 'open',
    created: 'Last week',
    sla: 'Target: 3 business days',
    mine: false
  }
];

function renderRecentRequests() {
  const list = document.getElementById('req-list');
  const mineToggle = document.getElementById('toggle-mine');
  if (!list) return;

  const onlyMine = mineToggle && mineToggle.checked;
  const items = recentRequests.filter(r => !onlyMine || r.mine);

  list.innerHTML = '';

  if (!items.length) {
    const li = document.createElement('li');
    li.innerHTML = '<div class="req-main-title">No recent requests</div>' +
      '<div class="meta"><span>Submit a new request to see it here.</span></div>';
    list.appendChild(li);
    return;
  }

  items.forEach(req => {
    const li = document.createElement('li');

    const metaParts = [
      req.id,
      req.category,
      req.location,
      req.created
    ];

    const statusClass = {
      open: 'status-open',
      progress: 'status-progress',
      resolved: 'status-resolved',
      breached: 'status-breached'
    }[req.statusKey] || 'status-open';

    li.innerHTML =
      `<div>
        <div class="req-main-title">${req.title}</div>
        <div class="meta">
          <span>${req.id}</span>
          <span>${req.category}</span>
          <span>${req.location}</span>
          <span>${req.created}</span>
        </div>
        ${req.breached ? `
          <div class="sla-badge">
            <span>SLA breached</span> ${req.sla}
          </div>` : ''}
      </div>
      <div>
        <span class="status-pill ${statusClass}">${req.status}</span>
      </div>`;

    list.appendChild(li);
  });
}

function initRequestForm() {
  const form = document.getElementById('request-form');
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  const btnTrack = document.getElementById('btn-track');
  const btnNew = document.getElementById('btn-new');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const category = document.getElementById('r-category').value || 'General';
    const priority = document.getElementById('r-priority').value || 'Normal';
    const location = document.getElementById('r-location').value || 'Not specified';
    const desc = document.getElementById('r-desc').value || 'Service request';

    // Very simple "create" request in demo
    const id = 'SR-' + Math.floor(10000 + Math.random() * 90000);
    const newReq = {
      id,
      category,
      title: desc.length > 50 ? desc.slice(0, 47) + '…' : desc,
      location,
      status: 'Open',
      statusKey: 'open',
      created: 'Just now',
      sla: 'Respond within 4h',
      mine: true,
      breached: false
    };

    recentRequests.unshift(newReq);
    renderRecentRequests();

    if (toast && toastText) {
      toastText.textContent = `Request ${id} has been logged as ${priority} priority (${category}).`;
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 2600);
    }

    form.reset();
  });

  if (btnTrack) {
    btnTrack.addEventListener('click', () => {
      toast.style.display = 'none';
      const list = document.getElementById('req-list');
      if (list) {
        list.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  if (btnNew) {
    btnNew.addEventListener('click', () => {
      toast.style.display = 'none';
      form.reset();
      const category = document.getElementById('r-category');
      if (category) category.focus();
    });
  }
}

function initFilters() {
  const mineToggle = document.getElementById('toggle-mine');
  if (!mineToggle) return;
  mineToggle.addEventListener('change', renderRecentRequests);
}

function init() {
  renderRecentRequests();
  initRequestForm();
  initFilters();
}

window.addEventListener('DOMContentLoaded', init);
