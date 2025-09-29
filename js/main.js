// year
document.getElementById('year').textContent = new Date().getFullYear();

// theme toggle with persistence
const root = document.documentElement;
const saved = localStorage.getItem('theme');
if (saved === 'light') root.classList.add('light');

const btn = document.getElementById('themeToggle');
function setIcon(){ btn.textContent = root.classList.contains('light') ? '🌞' : '🌙'; }
setIcon();

btn.addEventListener('click', () => {
  root.classList.toggle('light');
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
  setIcon();
});

// lightweight HTML includes (e.g., experience timeline)
document.querySelectorAll('[data-include]').forEach((placeholder) => {
  const url = placeholder.getAttribute('data-include');
  if (!url) return;

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`Failed to load ${url}`);
      return response.text();
    })
    .then((html) => {
      placeholder.insertAdjacentHTML('afterend', html);
      placeholder.remove();
    })
    .catch((error) => {
      console.error(error);
      const fallback = placeholder.querySelector('.include-fallback');
      if (fallback) {
        fallback.textContent = "We couldn't load this section right now. Please refresh the page.";
      } else {
        placeholder.insertAdjacentHTML(
          'beforeend',
          '<p class="muted">We couldn\'t load this section right now. Please refresh the page.</p>'
        );
      }
    });
});
