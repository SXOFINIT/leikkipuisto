// Demo data – replace with live integrations to booking, visitor, and calendar systems
const data = {
  bookings: [
    { title: 'Omega Room',  start: '09:00', end: '10:00', location: 'Floor 3 – West', type: 'room' },
    { title: 'Desk 3A-17',  start: '08:00', end: '16:00', location: 'Floor 3 – Focus zone', type: 'desk' }
  ],
  visitors: [
    { name: 'Guest A', eta: '10:30', host: 'You' },
    { name: 'Guest B', eta: '15:00', host: 'You' }
  ],
  meetings: [
    { title: 'Project Sync',   start: '11:00', end: '11:45', room: 'Omega Room' },
    { title: 'Budget Review',  start: '15:00', end: '16:00', room: null } // highlighted: no room booked
  ],
  menu: [
    {
      id: 1,
      name: 'Salmon Bowl',
      description: 'Grilled salmon with quinoa, greens and lemon yogurt.',
      favourite: true,
      price: '€12.50',
      diets: ['High protein', 'Gluten free'],
      allergens: ['Fish', 'Milk'],
      co2: '0.8 kg CO₂e',
      co2Value: 0.8,
      calories: 620,
      days: ['mon', 'wed', 'fri'],
      glutenFree: true,
      image: 'images/Salmonbowl.jpg'
    },
    {
      id: 2,
      name: 'Veggie Pasta',
      description: 'Penne with tomato-basil sauce and roasted vegetables.',
      favourite: false,
      price: '€9.90',
      diets: ['Vegetarian'],
      allergens: ['Gluten'],
      co2: '0.6 kg CO₂e',
      co2Value: 0.6,
      calories: 540,
      days: ['mon', 'tue', 'thu'],
      glutenFree: false,
      image: 'images/VeggiePasta.jpg'
    },
    {
      id: 3,
      name: 'Chicken Wrap',
      description: 'Wholegrain wrap with chicken, salad and spicy aioli.',
      favourite: false,
      price: '€8.50',
      diets: ['High protein'],
      allergens: ['Gluten', 'Egg'],
      co2: '0.9 kg CO₂e',
      co2Value: 0.9,
      calories: 680,
      days: ['tue', 'thu'],
      glutenFree: false,
      image: 'images/Chickenwrap.jpg',
      warning: 'Has garlic'   // highlighted as “not favourite” for this reason
    },
    {
      id: 4,
      name: 'Berry Smoothie',
      description: 'Mixed berries with oat milk and chia seeds.',
      favourite: true,
      price: '€4.90',
      diets: ['Vegan'],
      allergens: ['Oats'],
      co2: '0.2 kg CO₂e',
      co2Value: 0.2,
      calories: 210,
      days: ['mon', 'tue', 'wed', 'thu', 'fri'],
      glutenFree: true,
      image: 'images/BerrySmoothie.jpg'
    },
    {
      id: 5,
      name: 'Tapsa’s Lasagna',
      description: 'Slow-cooked Bolognese, creamy cheese and fresh herbs.',
      favourite: false,
      price: '€11.50',
      diets: [],
      allergens: ['Gluten', 'Milk'],
      co2: '1.2 kg CO₂e',
      co2Value: 1.2,
      calories: 780,
      days: ['wed', 'fri'],
      glutenFree: false,
      image: 'images/lasagna.jpg'
    },
    {
      id: 6,
      name: 'Chickpea Buddha Bowl',
      description: 'Roasted chickpeas, brown rice, veggies and tahini dressing.',
      favourite: false,
      price: '€10.40',
      diets: ['Vegan', 'Dairy free'],
      allergens: ['Sesame'],
      co2: '0.5 kg CO₂e',
      co2Value: 0.5,
      calories: 550,
      days: ['tue', 'thu'],
      glutenFree: true,
      image: 'images/Chickpea.jpg'
    }
  ],
  // Recommended / upcoming items for “tomorrow”
  recommendedMenu: [
    {
      id: 'promo-mars',
      title: 'Tomorrow: 2-for-1 Mars bars',
      label: 'Promotion',
      highlight: true,
      body: 'Pick up two Mars bars from the café tomorrow and pay only for one. While stocks last.',
      meta: 'Available at Panorama Café only.'
    },
    {
      id: 'promo-tapsa-lasagna',
      title: 'Tapsa’s Lasagna is back',
      label: 'Your favourite',
      highlight: false,
      body: 'Your favourite Tapsa’s Lasagna will be on tomorrow’s lunch menu in the main restaurant.',
      meta: 'Tip: it often sells out early.'
    }
  ]
};

// Menu UI state
const menuState = {
  activeDay: null,
  activeFilters: new Set()
};

/* --------------------------
 * Render My Day
 * -------------------------- */

function renderBookings() {
  const ul = document.getElementById('booking-list');
  if (!ul) return;

  ul.innerHTML = '';

  if (!data.bookings.length) {
    ul.classList.add('empty');
    return;
  }

  ul.classList.remove('empty');

  data.bookings.forEach(b => {
    const li = document.createElement('li');
    li.innerHTML =
      `<div><strong>${b.title}</strong><br/><span>${b.start}–${b.end}</span> · <span>${b.location}</span></div>` +
      `<span class="badge success">Booked</span>`;
    ul.appendChild(li);
  });
}

function renderVisitors() {
  const ul = document.getElementById('visitor-list');
  if (!ul) return;

  ul.innerHTML = '';

  if (!data.visitors.length) {
    ul.classList.add('empty');
    return;
  }

  ul.classList.remove('empty');

  data.visitors.forEach(v => {
    const li = document.createElement('li');
    li.innerHTML =
      `<div><strong>${v.name}</strong><br/><span>ETA ${v.eta}</span> · Host: ${v.host}</div>` +
      `<span class="badge success">Registered</span>`;
    ul.appendChild(li);
  });
}

function renderMeetings() {
  const ul = document.getElementById('meeting-list');
  if (!ul) return;

  ul.innerHTML = '';

  let needsRoom = 0;

  if (!data.meetings.length) {
    ul.classList.add('empty');
  } else {
    ul.classList.remove('empty');
  }

  data.meetings.forEach(m => {
    const li = document.createElement('li');
    const room = m.room ? m.room : 'Room —';

    const leftHtml =
      `<div><strong>${m.title}</strong><br>` +
      `<span>${m.start}–${m.end}</span> · <span>${room}</span></div>`;

    const rightHtml = m.room
      ? `<span class="badge success">Room booked</span>`
      : `<a href="book-room.html" class="badge warning badge-cta">Room needed · Book room</a>`;

    li.innerHTML = leftHtml + rightHtml;

    if (!m.room) {
      li.classList.add('no-room');
      needsRoom++;
    }
    ul.appendChild(li);
  });

  const alert = document.getElementById('meeting-alert');
  if (alert) {
    if (needsRoom > 0) {
      alert.hidden = false;
      alert.textContent = `You have ${needsRoom} meeting(s) without a room booking. Book now to avoid conflicts.`;
    } else {
      alert.hidden = true;
    }
  }
}

/* --------------------------
 * Menu helpers (tabs, filters)
 * -------------------------- */

function initMenuState() {
  const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const today = new Date();
  const todayKey = dayKeys[today.getDay()];

  const defaultDay = ['mon', 'tue', 'wed', 'thu', 'fri'].includes(todayKey)
    ? todayKey
    : 'mon';

  menuState.activeDay = defaultDay;
}

function getFilteredMenuItems() {
  const day = menuState.activeDay;
  let items = data.menu.slice();

  if (day) {
    items = items.filter(item => !item.days || item.days.includes(day));
  }

  menuState.activeFilters.forEach(filter => {
    if (filter === 'vegan') {
      items = items.filter(item => (item.diets || []).includes('Vegan'));
    }
    if (filter === 'glutenfree') {
      items = items.filter(item => item.glutenFree);
    }
    if (filter === 'lowco2') {
      items = items.filter(item => (item.co2Value || 999) <= 0.6);
    }
  });

  return items;
}

function initMenuControls() {
  // Tabs
  const tabs = document.querySelectorAll('.menu-tab');
  tabs.forEach(tab => {
    const day = tab.getAttribute('data-day');
    if (day === menuState.activeDay) {
      tab.setAttribute('aria-selected', 'true');
    } else {
      tab.setAttribute('aria-selected', 'false');
    }

    tab.addEventListener('click', () => {
      menuState.activeDay = day;
      tabs.forEach(t => t.setAttribute('aria-selected', t === tab ? 'true' : 'false'));
      renderMenu();
    });
  });

  // Filters
  const filters = document.querySelectorAll('.menu-filter');
  filters.forEach(btn => {
    const key = btn.getAttribute('data-filter');
    btn.addEventListener('click', () => {
      if (menuState.activeFilters.has(key)) {
        menuState.activeFilters.delete(key);
        btn.classList.remove('is-active');
      } else {
        menuState.activeFilters.add(key);
        btn.classList.add('is-active');
      }
      renderMenu();
    });
  });
}

/* --------------------------
 * Meal modal helpers
 * -------------------------- */

function openMealModal(item) {
  const modal = document.getElementById('meal-modal');
  if (!modal) return;

  const titleEl = document.getElementById('meal-modal-title');
  const priceEl = document.getElementById('meal-modal-price');
  const descEl = document.getElementById('meal-modal-desc');
  const caloriesEl = document.getElementById('meal-modal-calories');
  const co2El = document.getElementById('meal-modal-co2');
  const tagsContainer = document.getElementById('meal-modal-tags');

  if (titleEl) titleEl.textContent = item.name;
  if (priceEl) priceEl.textContent = item.price;
  if (descEl) descEl.textContent = item.description;
  if (caloriesEl) caloriesEl.textContent = item.calories ? item.calories + ' kcal' : '–';
  if (co2El) co2El.textContent = item.co2 || '–';

  if (tagsContainer) {
    tagsContainer.innerHTML = '';

    (item.diets || []).forEach(d => {
      const span = document.createElement('span');
      span.className = 'diet-tag';
      span.textContent = d;
      tagsContainer.appendChild(span);
    });

    (item.allergens || []).forEach(a => {
      const span = document.createElement('span');
      span.className = 'allergen-tag';
      span.textContent = a;
      tagsContainer.appendChild(span);
    });

    if (item.warning) {
      const span = document.createElement('span');
      span.className = 'warning-note';
      span.textContent = '⚠ ' + item.warning;
      tagsContainer.appendChild(span);
    }
  }

  const payBtn = document.getElementById('meal-modal-pay');
  if (payBtn) {
    payBtn.onclick = () => {
      alert('Proceeding to secure payment for ' + item.name);
    };
  }

  modal.hidden = false;
}

function closeMealModal() {
  const modal = document.getElementById('meal-modal');
  if (!modal) return;
  modal.hidden = true;
}

function initMealModal() {
  const modal = document.getElementById('meal-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('meal-modal-close');
  const closeBtn2 = document.getElementById('meal-modal-close-2');

  [closeBtn, closeBtn2].forEach(btn => {
    if (btn) btn.addEventListener('click', closeMealModal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeMealModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMealModal();
  });
}

/* --------------------------
 * Render Menu
 * -------------------------- */

function renderMenu() {
  const grid = document.getElementById('menu-grid');
  const reco = document.getElementById('menu-recommended');
  if (!grid) return;

  grid.innerHTML = '';

  const items = getFilteredMenuItems();

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'menu-card';
    card.dataset.id = String(item.id);

    const diets = item.diets || [];
    const allergens = item.allergens || [];

    const dietTags = diets.map(d => `<span class="diet-tag">${d}</span>`).join('');
    const allergenTags = allergens.map(a => `<span class="allergen-tag">${a}</span>`).join('');

    let rightMeta = '';
    if (item.favourite) {
      rightMeta = '<span class="favourite">★ Favourite</span>';
    } else if (item.warning) {
      rightMeta = `<span class="warning-note">⚠ ${item.warning}</span>`;
    } else {
      rightMeta = '<span></span>';
    }

    const imgSrc = item.image || 'images/placeholder.jpg';

    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${imgSrc}" alt="${item.name}" class="menu-image">
      </div>
      <div class="content">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="menu-tags">
          ${dietTags}
          ${allergenTags}
        </div>
      </div>
      <div class="menu-meta-row">
        <span class="co2-chip">${item.co2 || ''}</span>
        ${rightMeta}
      </div>
      <div class="actions">
        <span class="price">${item.price}</span>
        <button class="pay" data-id="${item.id}">Pay now</button>
      </div>
    `;

    grid.appendChild(card);
  });

  // Click handler: pay & modal (single delegated handler)
  grid.onclick = function (e) {
    const payBtn = e.target.closest && e.target.closest('button.pay');
    if (payBtn) {
      const id = payBtn.getAttribute('data-id');
      alert('Proceeding to secure payment for item #' + id);
      return;
    }

    const card = e.target.closest && e.target.closest('.menu-card');
    if (card) {
      const id = Number(card.dataset.id);
      const item = data.menu.find(m => m.id === id);
      if (item) openMealModal(item);
    }
  };

  // Header labels
  const dateLabel = document.getElementById('menu-date-label');
  const locationLabel = document.getElementById('menu-location-label');
  if (dateLabel) dateLabel.textContent = 'Today';
  if (locationLabel) locationLabel.textContent = 'Main restaurant';

  // Recommended section
  if (reco) {
    reco.innerHTML = '';
    (data.recommendedMenu || []).forEach(item => {
      const card = document.createElement('article');
      card.className = 'reco-card';
      card.innerHTML = `
        <div class="reco-title">${item.title}</div>
        <div>${item.body}</div>
        <div class="reco-pill ${item.highlight ? 'highlight' : ''}">
          <span>${item.label}</span>
          <span>Tomorrow</span>
        </div>
        <div style="font-size:.78rem; color:#6b7280; margin-top:.1rem;">
          ${item.meta || ''}
        </div>
      `;
      reco.appendChild(card);
    });
  }
}

/* --------------------------
 * Hero summary wiring
 * -------------------------- */

function updateHeroSummary() {
  const roomsCountEl = document.getElementById('hero-rooms-count');
  const desksCountEl = document.getElementById('hero-desks-count');
  const visitorsCountEl = document.getElementById('hero-visitors-count');
  const nextMeetingEl = document.getElementById('hero-next-meeting');
  const nextMeetingRoomEl = document.getElementById('hero-next-meeting-room');
  const menuHighlightEl = document.getElementById('hero-menu-highlight');

  // Rooms & desks – use explicit type where available, fall back to name heuristics
  let roomCount = 0;
  let deskCount = 0;

  data.bookings.forEach(b => {
    const type = b.type ||
      (b.title && b.title.toLowerCase().includes('desk') ? 'desk' : 'room');
    if (type === 'desk') deskCount++;
    else roomCount++;
  });

  if (roomsCountEl) roomsCountEl.textContent = roomCount || '0';
  if (desksCountEl) desksCountEl.textContent = deskCount || '0';
  if (visitorsCountEl) visitorsCountEl.textContent = data.visitors.length || '0';

  // Next meeting – pick earliest by start time
  if (data.meetings.length) {
    const next = data.meetings
      .slice()
      .sort((a, b) => (a.start || '').localeCompare(b.start || ''))[0];

    if (nextMeetingEl) {
      nextMeetingEl.textContent = `${next.title} (${next.start}–${next.end})`;
    }
    if (nextMeetingRoomEl) {
      nextMeetingRoomEl.textContent = next.room ? next.room : 'No room booked';
    }
  } else {
    if (nextMeetingEl) nextMeetingEl.textContent = 'No meetings';
    if (nextMeetingRoomEl) nextMeetingRoomEl.textContent = '—';
  }

  // Menu highlight – first favourite or first item
  const favourite = data.menu.find(m => m.favourite) || data.menu[0];
  if (menuHighlightEl) {
    menuHighlightEl.textContent = favourite
      ? `${favourite.name} (${favourite.price})`
      : 'No menu items';
  }
}

/* --------------------------
 * Init
 * -------------------------- */

function init() {
  renderBookings();
  renderVisitors();
  renderMeetings();

  initMenuState();
  initMenuControls();
  initMealModal();
  renderMenu();

  updateHeroSummary();
}

window.addEventListener('DOMContentLoaded', init);
