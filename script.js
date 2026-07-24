const form = document.querySelector('#signup-form');
const message = document.querySelector('#success-message');
const header = document.querySelector('.header');

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));

    if (!target) return;

    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
    window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', link.getAttribute('href'));
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  // MVP behavior: display confirmation locally. Connect this form to a CRM or email service before publishing.
  message.classList.add('show');
  form.reset();
});
