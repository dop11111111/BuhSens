const form = document.querySelector('#signup-form');
const message = document.querySelector('#success-message');
const header = document.querySelector('.header');

// Clear anchors left by older versions so the landing page always opens at the top.
if (window.location.hash) {
  history.replaceState(null, '', window.location.pathname);
  window.scrollTo(0, 0);
}

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
      const easedProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, start + distance * easedProgress);

      if (progress < 1) requestAnimationFrame(animateScroll);
    };

    requestAnimationFrame(animateScroll);
    // Do not leave an anchor in the URL: otherwise a page refresh opens at that section.
    history.replaceState(null, '', window.location.pathname);
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  // MVP behavior: display confirmation locally. Connect this form to a CRM or email service before publishing.
  message.classList.add('show');
  form.reset();
});
