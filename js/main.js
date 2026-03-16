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
      
      // Initialize module specific scripts
      if (url.includes('skills')) {
        setTimeout(initSkillsChart, 100);
      }
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

// Preload images so they render instantly when swapped
images.forEach(src => {
  const img = new Image();
  img.src = src;
});

let currentImageIndex = 0;
const slideshowImg = document.getElementById('profile-slideshow');

if (slideshowImg) {
  // Rotate every 5 seconds (5000 ms)
  setInterval(() => {
    // 1. Fade out by dropping opacity
    slideshowImg.style.opacity = '0';
    
    // 2. Wait for fade out to finish
    setTimeout(() => {
      // 3. Swap the image source
      currentImageIndex = (currentImageIndex + 1) % images.length;
      slideshowImg.src = images[currentImageIndex];
      
      // 4. Wait for the image to logically load (or just force reflow), then fade back in
      slideshowImg.style.opacity = '1';
    }, 800); 
  }, 5000);
}

// -------------------------------------------------------------
// CHATBOT ASSISTANT LOGIC (Simulated NLP / Keyword Matching)
// -------------------------------------------------------------
const chatToggle = document.getElementById('chatbot-toggle');
const chatWindow = document.getElementById('chatbot-window');
const chatClose = document.getElementById('chatbot-close');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');

if (chatToggle && chatWindow) {
  // Open / Close Handlers
  chatToggle.addEventListener('click', () => {
    chatWindow.classList.add('open');
    chatInput.focus();
  });
  
  chatClose.addEventListener('click', () => {
    chatWindow.classList.remove('open');
  });

  // Simulated AI Knowledge Base
  const responses = {
    'experience': "Tanushree is currently a Graduate Research Assistant at UCM building RAG pipelines for BioASQ. Previously, she was a Financial Data Analyst where she built LLM-driven AWS automation, and a High School CS Teacher!",
    'skills': "Her core skills include Python, R, Deep Learning (LLMs, RAG, DQN), AWS Cloud Engineering, and Quantitative Modeling. She's also an AWS Certified AI Practitioner!",
    'projects': "Her top projects include a Stress-Test RAG pipeline for Biomedical QA, a high-frequency Rust crypto arbitrage bot leveraging DQN, and an Agentic Web-Retrieval Engine.",
    'contact': "You can connect with her on LinkedIn, check her GitHub, or reach out directly at tanu.nepal1@gmail.com. Head over to the contact section at the bottom!",
    'thesis': "She has two! Her Master's thesis at UCM is on Stress-Testing RAG in Biomedical QA. Her MBA thesis focused on the impact of GenAI on student learning.",
    'education': "She is pursuing an MSc in Data Science & AI at Univ. of Central Missouri, holds an MBA from Asia e University, and a B.E. in Computer Engineering from TU, Nepal.",
    'default': "Ah, I'm just a simple automated assistant right now! 🤖 Try asking me about Tanushree's <strong>experience</strong>, <strong>skills</strong>, <strong>education</strong>, or <strong>projects</strong>."
  };

  // Advanced Keyword Matching (Handles Misspellings & Broad Context)
  const intentMap = {
    'experience': ['experience', 'experiance', 'work', 'job', 'intern', 'analyst', 'experince', 'worked'],
    'skills': ['skill', 'tech', 'tool', 'python', 'ai', 'skils', 'stack', 'framework', 'skil', 'language'],
    'projects': ['project', 'portfolio', 'build', 'github', 'kalshi', 'rag', 'projets', 'projct', 'made', 'created'],
    'contact': ['contact', 'email', 'hire', 'reach', 'linkedin', 'message', 'msg'],
    'thesis': ['thesis', 'research', 'publication', 'study', 'paper', 'publish'],
    'education': ['edu', 'school', 'degree', 'university', 'college', 'ucm', 'educasion', 'study']
  };

  function processMessage(msg) {
    // Normalize string: lowercase and remove most punctuation for robust fuzzy matching
    const text = msg.toLowerCase().replace(/[^\w\s]/g, '');
    let matchedIntent = null;
    
    for (const [intent, keywords] of Object.entries(intentMap)) {
      if (keywords.some(kw => text.includes(kw))) {
        matchedIntent = intent;
        break;
      }
    }

    let reply = '';
    
    if (matchedIntent) {
      reply = responses[matchedIntent];
    } else {
      // Conversational Fallbacks
      if (text.includes('hello') || text.includes('hi ') || text.trim() === 'hi' || text.includes('hey')) {
        reply = "Hello! 👋 I can tell you all about Tanushree's incredible work. What would you like to know?";
      } else if (text.includes('who are you') || text.includes('bot')) {
        reply = "I'm an AI assistant built specifically to summarize Tanushree's resume and portfolio. Think of me as your interactive navigator!";
      } else {
        reply = "I’m an AI trained on Tanushree’s portfolio, but I didn't quite catch that. You can ask me about her <strong>experience</strong>, <strong>skills</strong>, <strong>projects</strong>, or directly <a href='mailto:tanu.nepal1@gmail.com' style='color:#A855F7'>email her</a> for complex questions!";
      }
    }

    // Simulate typing delay for realism
    setTimeout(() => {
      addMessage(reply, 'bot');
    }, 600 + Math.random() * 400); 
  }

  // Render message in UI
  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.innerHTML = `<div class="msg-bubble">${text}</div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll down
  }

  // Handle Input Submission
  function handleSend() {
    const val = chatInput.value.trim();
    if (!val) return;
    
    addMessage(val, 'user');
    chatInput.value = '';
    
    // Show temporary typing indicator if desired, or just process
    processMessage(val);
  }

  chatSend.addEventListener('click', handleSend);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });
}

// -------------------------------------------------------------
// LAST UPDATED INDICATOR
// -------------------------------------------------------------
function updateLastModified() {
  const el = document.getElementById('last-update-time');
  if (el) {
    // Check if we have a locally stored last modified, otherwise use document.lastModified
    const date = new Date(document.lastModified);
    if (date.toString() !== 'Invalid Date') {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      el.textContent = date.toLocaleDateString(undefined, options);
    } else {
      el.textContent = "Today";
    }
  }
}
updateLastModified();

// -------------------------------------------------------------
// LIVE TRAFFIC / VISITOR MAP SIMULATION
// -------------------------------------------------------------
const cities = [
  "New York, USA", "San Francisco, USA", "London, UK", "Berlin, DE", 
  "Toronto, CA", "Sydney, AUS", "Tokyo, JP", "Mumbai, IN", 
  "Singapore, SG", "Paris, FR", "Austin, USA", "Seattle, USA"
];
const actions = [
  "viewed Projects", "checked Experience", "downloaded Resume", 
  "viewed Skills Graph", "asked AI Assistant", "viewed BioASQ Thesis"
];

function initTrafficMonitor() {
  const countEl = document.getElementById('visit-count');
  const feedEl = document.getElementById('activity-feed');
  if (!countEl || !feedEl) return;

  // Retrieve or initialize total visits in localStorage
  let visits = parseInt(localStorage.getItem('tn_visits') || '14052', 10);
  
  // Initially increase based on elapsed days maybe, but for now just bump it
  visits += Math.floor(Math.random() * 5) + 1;
  localStorage.setItem('tn_visits', visits.toString());
  countEl.textContent = visits.toLocaleString();

  // Remove placeholder
  feedEl.innerHTML = '';

  // Function to add a fake event
  function addEvent() {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    // Add to feed
    const div = document.createElement('div');
    div.className = 'activity-item';
    
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    
    div.innerHTML = `<span class="pulse-dot" style="width:6px; height:6px; margin:0; animation-duration:3s;"></span> <span class="time">[${timeStr}]</span> User from <span class="country">${city}</span> ${action}`;
    
    feedEl.prepend(div);
    
    // Keep max 4 items
    if (feedEl.children.length > 4) {
      feedEl.removeChild(feedEl.lastChild);
    }

    // Bump counter slightly sometimes
    if (Math.random() > 0.5) {
      visits++;
      localStorage.setItem('tn_visits', visits.toString());
      countEl.textContent = visits.toLocaleString();
    }
    
    // Next event in 3 to 12 secs
    const nextWait = 3000 + Math.random() * 9000;
    setTimeout(addEvent, nextWait);
  }

  // Pre-fill a couple of events
  addEvent();
  setTimeout(addEvent, 1500);
}
initTrafficMonitor();

// -------------------------------------------------------------
// INTERACTIVE SKILLS CHART
// -------------------------------------------------------------
function initSkillsChart() {
  const canvas = document.getElementById('skillsChart');
  if (!canvas) return; // Might not be inserted yet or removed
  
  // Prevent re-initialization
  if (window.skillsChartInstance) return;

  const ctx = canvas.getContext('2d');
  const isDark = !document.documentElement.classList.contains('light');
  
  const textColor = isDark ? '#F3E8FF' : '#2B0548';
  const gridColor = isDark ? 'rgba(168, 85, 247, 0.2)' : 'rgba(147, 51, 234, 0.2)';
  const accentColor = isDark ? 'rgba(168, 85, 247, 0.8)' : 'rgba(147, 51, 234, 0.8)';
  const bgColor = isDark ? 'rgba(168, 85, 247, 0.2)' : 'rgba(147, 51, 234, 0.2)';

  window.skillsChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Deep Learning', 'RAG / NLP', 'Trading Bots / DRL', 'Cloud & AWS', 'Statistical Modeling', 'Software Eng.'],
      datasets: [{
        label: 'Skill Competency',
        data: [90, 95, 85, 80, 88, 82],
        backgroundColor: bgColor,
        borderColor: accentColor,
        pointBackgroundColor: accentColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: accentColor,
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: gridColor },
          grid: { color: gridColor },
          pointLabels: {
            color: textColor,
            font: { family: 'Inter', size: 12, weight: '600' }
          },
          ticks: { display: false, min: 50, max: 100 }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? 'rgba(15, 10, 25, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          titleColor: isDark ? '#FFF' : '#000',
          bodyColor: isDark ? '#CCC' : '#333',
          borderColor: accentColor,
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return ` ${context.raw}% `;
            }
          }
        }
      }
    }
  });
}
initSkillsChart();

