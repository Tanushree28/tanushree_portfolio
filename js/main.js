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

  // Keyword Matching Logic (Acts as a fast, simple intent classifier)
  function processMessage(msg) {
    const text = msg.toLowerCase();
    let reply = responses['default'];
    
    // Check intents
    if (text.includes('exp') || text.includes('work') || text.includes('job') || text.includes('intern') || text.includes('analyst')) {
      reply = responses['experience'];
    } else if (text.includes('skill') || text.includes('tech') || text.includes('tool') || text.includes('python') || text.includes('ai')) {
      reply = responses['skills'];
    } else if (text.includes('project') || text.includes('portfolio') || text.includes('build') || text.includes('github') || text.includes('kalshi') || text.includes('rag')) {
      reply = responses['projects'];
    } else if (text.includes('contact') || text.includes('email') || text.includes('hire') || text.includes('reach') || text.includes('linkedin')) {
      reply = responses['contact'];
    } else if (text.includes('thesis') || text.includes('research') || text.includes('publication') || text.includes('study')) {
      reply = responses['thesis'];
    } else if (text.includes('edu') || text.includes('school') || text.includes('degree') || text.includes('university') || text.includes('college') || text.includes('ucm')) {
      reply = responses['education'];
    } else if (text.includes('hello') || text.includes('hi') || text.includes('hey') || text.includes('greetings')) {
      reply = "Hello! 👋 I can tell you all about Tanushree's incredible work. What would you like to know?";
    } else if (text.includes('who are you') || text.includes('bot')) {
      reply = "I'm Tanushree's personal portfolio assistant! I can speed up your review by instantly summarizing her background.";
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
