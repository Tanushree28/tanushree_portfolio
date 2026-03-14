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

// Image Slideshow Logic
const images = [
  'assets/images/IMG_8682.jpeg',
  'assets/images/20241005_124402.jpeg',
  'assets/images/20250404_112919.jpeg',
  'assets/images/IMG_4554.jpeg',
  'assets/images/IMG_7545.jpeg',
  'assets/images/IMG_7568.jpeg',
  'assets/images/IMG_8670.jpeg',
  'assets/images/headshot.jpg'
];

let currentImageIndex = 0;
const slideshowImg = document.getElementById('profile-slideshow');

if (slideshowImg) {
  // Rotate every 60 seconds (60000 ms)
  setInterval(() => {
    // 1. Fade out by dropping opacity
    slideshowImg.style.opacity = '0';
    
    // 2. Wait for fade out to finish (e.g. 800ms to match the CSS transition)
    setTimeout(() => {
      // 3. Swap the image source
      currentImageIndex = (currentImageIndex + 1) % images.length;
      slideshowImg.src = images[currentImageIndex];
      
      // 4. Fade back in
      slideshowImg.style.opacity = '1';
    }, 800); 
  }, 60000);
}
