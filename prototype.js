const clients = [
  { id: 1, name: 'ФОП Коваль', initials: 'ОК', type: 'ФОП · 3 група', status: 'ready' },
  { id: 2, name: 'ТОВ «Маяк»', initials: 'М', type: 'ТОВ · ПДВ', status: 'problem' },
  { id: 3, name: 'ФОП Петренко', initials: 'ПП', type: 'ФОП · 2 група', status: 'problem' },
  { id: 4, name: 'ФОП Соловей', initials: 'С', type: 'ФОП · 3 група', status: 'ready' },
];

let requests = [
  { id: 1, clientId: 2, document: 'Акт за липень', date: 'До 26 липня', status: 'urgent' },
  { id: 2, clientId: 3, document: 'Виписка з банку за липень', date: 'До 27 липня', status: 'waiting' },
  { id: 3, clientId: 2, document: 'Податкові накладні', date: 'До 30 липня', status: 'waiting' },
  { id: 4, clientId: 4, document: 'Реєстр оплат', date: 'Отримано', status: 'complete' },
];

const clientName = (id) => clients.find((client) => client.id === id).name;
const statusText = { urgent: 'Терміново', waiting: 'Чекаємо', complete: 'Отримано' };

function renderRequests() {
  const requestList = document.querySelector('#request-list');
  const priorityList = document.querySelector('#priority-list');
  const pending = requests.filter((request) => request.status !== 'complete');
  const allRows = requests.map((request) => `
    <article class="request-row">
      <i class="status-dot ${request.status}"></i>
      <p><strong>${request.document}</strong><br /><span>${clientName(request.clientId)} · ${statusText[request.status]}</span></p>
      <span class="request-date">${request.date}</span>
      ${request.status !== 'complete' ? `<button class="row-action" data-complete="${request.id}">Отримано</button>` : ''}
    </article>`).join('');
  requestList.innerHTML = allRows;
  priorityList.innerHTML = pending.length ? pending.map((request) => `
    <article class="priority-row"><i class="status-dot ${request.status}"></i><p><strong>${clientName(request.clientId)}</strong> — ${request.document}<br /><span>${request.date}</span></p><button class="row-action" data-complete="${request.id}">Відмітити</button></article>`).join('') : '<p class="view-description">Усі документи отримано. Гарна робота!</p>';
  document.querySelectorAll('[data-complete]').forEach((button) => button.addEventListener('click', () => {
    const request = requests.find((item) => item.id === Number(button.dataset.complete));
    request.status = 'complete';
    request.date = 'Отримано щойно';
    render();
  }));
}

function renderClients(query = '') {
  const visibleClients = clients.filter((client) => client.name.toLowerCase().includes(query.toLowerCase()));
  document.querySelector('#client-list').innerHTML = visibleClients.map((client) => {
    const incomplete = requests.filter((request) => request.clientId === client.id && request.status !== 'complete').length;
    const state = incomplete ? (requests.some((request) => request.clientId === client.id && request.status === 'urgent') ? 'problem' : 'pending') : 'ready';
    const label = incomplete ? `${incomplete} запит${incomplete > 1 ? 'и' : ''} очікується` : 'Готовий до звіту';
    return `<article class="client-row"><span class="avatar">${client.initials}</span><p class="client-name">${client.name}<br /><span>${client.type}</span></p><p class="client-status"><span class="status-pill ${state}">${label}</span></p></article>`;
  }).join('');
}

function updateStats() {
  const pending = requests.filter((request) => request.status !== 'complete');
  const urgentClients = new Set(requests.filter((request) => request.status === 'urgent').map((request) => request.clientId));
  const readyClients = clients.filter((client) => !requests.some((request) => request.clientId === client.id && request.status !== 'complete'));
  document.querySelector('#attention-count').textContent = urgentClients.size;
  document.querySelector('#waiting-count').textContent = pending.length;
  document.querySelector('#ready-count').textContent = readyClients.length;
  document.querySelector('#request-count').textContent = pending.length;
  document.querySelector('#readiness-percent').textContent = `${Math.round((readyClients.length / clients.length) * 100)}%`;
}

function render() { renderRequests(); renderClients(document.querySelector('#client-search').value); updateStats(); }

document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => {
  const view = button.dataset.view;
  document.querySelectorAll('.view').forEach((section) => section.classList.remove('active-view'));
  document.querySelector(`#${view}`).classList.add('active-view');
  document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.view === view));
  document.querySelector('#page-title').textContent = view === 'overview' ? 'Доброго дня, Олено' : view === 'clients' ? 'Клієнти' : 'Запити документів';
}));

document.querySelector('#client-search').addEventListener('input', (event) => renderClients(event.target.value));
const dialog = document.querySelector('#request-dialog');
document.querySelector('#new-request').addEventListener('click', () => dialog.showModal());
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
const clientSelect = document.querySelector('#new-client');
clientSelect.innerHTML = clients.map((client) => `<option value="${client.id}">${client.name}</option>`).join('');
document.querySelector('#request-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const deadline = new Date(document.querySelector('#new-deadline').value).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' });
  requests.unshift({ id: Date.now(), clientId: Number(clientSelect.value), document: document.querySelector('#new-document').value, date: `До ${deadline}`, status: 'waiting' });
  event.target.reset();
  dialog.close();
  render();
});

render();
