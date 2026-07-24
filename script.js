const form = document.querySelector('#signup-form');
const message = document.querySelector('#success-message');
const header = document.querySelector('.header');

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));

    if (!target) return;

    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
    const start = window.scrollY;
    const distance = top - start;
    const duration = 650;
    const startedAt = performance.now();

    const animateScroll = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      // Ease in and out: the movement starts and ends gently.
      const easedProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, start + distance * easedProgress);

      if (progress < 1) requestAnimationFrame(animateScroll);
    };

    requestAnimationFrame(animateScroll);
    history.replaceState(null, '', link.getAttribute('href'));
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  // MVP behavior: display confirmation locally. Connect this form to a CRM or email service before publishing.
  message.classList.add('show');
  form.reset();
});
