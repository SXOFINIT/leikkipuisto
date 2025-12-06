
// Demo data – replace with live integrations to booking, visitor, and calendar systems
const data = {
  bookings: [
    { title: 'Omega Room',  start: '09:00', end: '10:00', location: 'Floor 3 – West' },
    { title: 'Atlas Room',  start: '13:00', end: '14:00', location: 'Floor 2 – East' }
  ],
  visitors: [
    { name: 'Guest A', eta: '10:30', host: 'You' },
    { name: 'Guest B', eta: '15:00', host: 'You' }
  ],
  meetings: [
    { title: 'Project Sync', start: '11:00', end: '11:45', room: 'Omega Room' },
    { title: 'Budget Review', start: '15:00', end: '16:00', room: null } // highlighted: no room booked
  ],
  menu: [
    { id: 1, name: 'Salmon Bowl',   description: 'With quinoa and greens', favourite: true,  price: '€12.50' },
    { id: 2, name: 'Veggie Pasta',  description: 'Tomato basil sauce',     favourite: false, price: '€9.90' },
    { id: 3, name: 'Chicken Wrap',  description: 'Spicy aioli',            favourite: false, price: '€8.50' },
    { id: 4, name: 'Berry Smoothie',description: 'Oat milk',               favourite: true,  price: '€4.90' }
  ]
};

function renderBookings() {
  const ul = document.getElementById('booking-list');
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
  let needsRoom = 0;
  data.meetings.forEach(m => {
    const li = document.createElement('li');
    const room = m.room ? m.room : 'Room —';
    li.innerHTML =
      `<div><strong>${m.title}</strong><br/><span>${m.start}–${m.end}</span> · <span>${room}</span></div>` +
      (m.room ? `<span class="badge success">Room booked</span>` : `<span class="badge warning">Room needed</span>`);
    if (!m.room) { li.classList.add('no-room'); needsRoom++; }
    ul.appendChild(li);
  });

  const alert = document.getElementById('meeting-alert');
  if (needsRoom > 0) {
    alert.hidden = false;
    alert.textContent = `You have ${needsRoom} meeting(s) without a room booking. Book now to avoid conflicts.`;
  }
}

function renderMenu() {
  const grid = document.getElementById('menu-grid');
  data.menu.forEach(item => {
    const card = document.createElement('article');
    card.className = 'menu-card';
    card.innerHTML = `
      <div class="image" role="img" aria-label="${item.name}"></div>
      <div class="content">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </div>
      <div class="actions">
        <span class="price">${item.price}</span>
        ${item.favourite ? '<span class="favourite">★ Favourite</span>' : '<span></span>'}
        <button class="pay" data-id="${item.id}">Pay now</button>
      </div>`;
    grid.appendChild(card);
  });

  grid.addEventListener('click', (e) => {
    if (e.target.matches('button.pay')) {
      const id = e.target.getAttribute('data-id');
      // TODO: replace alert with secure payment flow (e.g., Stripe SDK or corporate payment service)
      alert('Proceeding to secure payment for item #' + id);
    }
  });
}

function init() { renderBookings(); renderVisitors(); renderMeetings(); renderMenu(); }
window.addEventListener('DOMContentLoaded', init);
