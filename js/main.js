(function(){
const root = document.documentElement;
const YEAR_EL = document.getElementById('year');
if(YEAR_EL){ YEAR_EL.textContent = new Date().getFullYear(); }


// Handle both the nav toggle and the floating FAB so it works on mobile too
const toggles = [document.getElementById('themeToggle'), document.getElementById('themeFab')].filter(Boolean);


const saved = localStorage.getItem('theme');
if(saved === 'light'){ root.classList.add('light'); }


function iconFor(){ return root.classList.contains('light') ? '🌞' : '🌙'; }
function syncIcons(){ toggles.forEach(btn=> btn.textContent = iconFor()); }
function flip(){
root.classList.toggle('light');
localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
syncIcons();
}


toggles.forEach(btn => btn.addEventListener('click', flip));
syncIcons();
})();