/* =========================================================
   projects.js — loads projects from the backend API and
   renders them as cards, with category filtering.
   Falls back to sample data if the API isn't reachable yet,
   so the page still looks complete before you wire up MongoDB.
   ========================================================= */

const FALLBACK_PROJECTS = [
  {
    title: 'Travel Planner (Gen AI)',
    category: 'Full-Stack',
    description: 'A Spring Boot travel planner integrated with the Gemini API to generate day-wise trip itineraries based on user preferences, budget, and destination.',
    tech: ['Java', 'Spring Boot', 'HTML', 'CSS', 'Gemini API'],
    liveUrl: '',
    codeUrl: 'https://github.com/AakritiSaxena32/Trip-Planner'
  },
  {
    title: 'Smart Route Finder',
    category: 'Frontend',
    description: 'A hybrid Ant Colony Optimization + Genetic Algorithm model that finds optimal routes under real-time traffic conditions, solving an NP-hard TSP variant with an interactive visualizer.',
    tech: ['JavaScript', 'HTML', 'CSS'],
    liveUrl: '',
    codeUrl: 'https://github.com/AakritiSaxena32/Smart-Route-Finder'
  },
  {
    title: 'Credit Card Fraud Detection System',
    category: 'Backend',
    description: 'A machine learning system that flags fraudulent transactions using a Random Forest Classifier on unbalanced data — achieved an 86.96% F1-score and 99.95% accuracy.',
    tech: ['Python', 'Scikit-learn', 'Pandas'],
    liveUrl: '',
    codeUrl: 'https://github.com/AakritiSaxena32/Credit-Card-Fraud-Detection-System'
  }
];

function projectCardHTML(p) {
  const tech = (p.tech || []).map(t => `<span>${t}</span>`).join('');
  return `
    <article class="project-card reveal">
      <span class="tag">${p.category || 'Project'}</span>
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="tech-row">${tech}</div>
      <div class="project-links">
        ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" rel="noopener">Live demo →</a>` : ''}
        ${p.codeUrl ? `<a href="${p.codeUrl}" target="_blank" rel="noopener">Source code →</a>` : ''}
      </div>
    </article>`;
}

function renderProjects(list) {
  const grid = document.getElementById('project-grid');
  if (!grid) return;
  if (!list.length) {
    grid.innerHTML = `<p class="empty-msg">No projects in this category yet — check back soon!</p>`;
    return;
  }
  grid.innerHTML = list.map(projectCardHTML).join('');
  // re-run reveal observer on newly injected cards
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

let allProjects = [];

function applyFilter(category) {
  const filtered = category === 'all'
    ? allProjects
    : allProjects.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
  renderProjects(filtered);
}

async function loadProjects() {
  const grid = document.getElementById('project-grid');
  try {
    const res = await fetch(`${API_BASE_URL}/projects`);
    if (!res.ok) throw new Error('API not ready');
    const data = await res.json();
    allProjects = data.length ? data : FALLBACK_PROJECTS;
  } catch (err) {
    console.warn('Using fallback project data — backend not reachable yet:', err.message);
    allProjects = FALLBACK_PROJECTS;
  }
  renderProjects(allProjects);
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('project-grid')) return;
  loadProjects();

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });
});