/* ==========================================================================
   APP STATE & STATIC DATA FALLBACK
   ========================================================================== */
let extensions = [];
let currentFilter = 'all';

// Fallback data if local data.json cannot be fetched (e.g. file:// protocol restriction)
const FALLBACK_DATA = [
  {
    "logo": "./assets/images/logo-devlens.svg",
    "name": "DevLens",
    "description": "Quickly inspect page layouts and visualize element boundaries.",
    "isActive": true
  },
  {
    "logo": "./assets/images/logo-style-spy.svg",
    "name": "StyleSpy",
    "description": "Instantly analyze and copy CSS from any webpage element.",
    "isActive": true
  },
  {
    "logo": "./assets/images/logo-speed-boost.svg",
    "name": "SpeedBoost",
    "description": "Optimizes browser resource usage to accelerate page loading.",
    "isActive": false
  },
  {
    "logo": "./assets/images/logo-json-wizard.svg",
    "name": "JSONWizard",
    "description": "Formats, validates, and prettifies JSON responses in-browser.",
    "isActive": true
  },
  {
    "logo": "./assets/images/logo-tab-master-pro.svg",
    "name": "TabMaster Pro",
    "description": "Organizes browser tabs into groups and sessions.",
    "isActive": true
  },
  {
    "logo": "./assets/images/logo-viewport-buddy.svg",
    "name": "ViewportBuddy",
    "description": "Simulates various screen resolutions directly within the browser.",
    "isActive": false
  },
  {
    "logo": "./assets/images/logo-markup-notes.svg",
    "name": "Markup Notes",
    "description": "Enables annotation and notes directly onto webpages for collaborative debugging.",
    "isActive": true
  },
  {
    "logo": "./assets/images/logo-grid-guides.svg",
    "name": "GridGuides",
    "description": "Overlay customizable grids and alignment guides on any webpage.",
    "isActive": false
  },
  {
    "logo": "./assets/images/logo-palette-picker.svg",
    "name": "Palette Picker",
    "description": "Instantly extracts color palettes from any webpage.",
    "isActive": true
  },
  {
    "logo": "./assets/images/logo-link-checker.svg",
    "name": "LinkChecker",
    "description": "Scans and highlights broken links on any page.",
    "isActive": true
  },
  {
    "logo": "./assets/images/logo-dom-snapshot.svg",
    "name": "DOM Snapshot",
    "description": "Capture and export DOM structures quickly.",
    "isActive": false
  },
  {
    "logo": "./assets/images/logo-console-plus.svg",
    "name": "ConsolePlus",
    "description": "Enhanced developer console with advanced filtering and logging.",
    "isActive": true
  }
];

/* ==========================================================================
   SVG THEME ICONS (Styled using currentColor)
   ========================================================================== */
const SUN_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 22 22">
    <g clip-path="url(#sun-clip)">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.98" d="M11 1.833v1.834m0 14.666v1.834M3.667 11H1.833m3.955-5.212L4.492 4.492m11.72 1.296 1.297-1.296M5.788 16.215l-1.296 1.296m11.72-1.296 1.297 1.296M20.167 11h-1.834m-2.75 0a4.583 4.583 0 1 1-9.167 0 4.583 4.583 0 0 1 9.167 0Z"/>
    </g>
    <defs>
      <clipPath id="sun-clip">
        <path fill="#fff" d="M0 0h22v22H0z"/>
      </clipPath>
    </defs>
  </svg>
`;

const MOON_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 22 22">
    <g clip-path="url(#moon-clip)">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.98" d="M20.125 11.877A7.333 7.333 0 1 1 10.124 1.875a9.168 9.168 0 1 0 10.001 10.002Z"/>
    </g>
    <defs>
      <clipPath id="moon-clip">
        <path fill="#fff" d="M0 0h22v22H0z"/>
      </clipPath>
    </defs>
  </svg>
`;

/* ==========================================================================
   DOM ELEMENTS
   ========================================================================== */
const themeToggleBtn = document.getElementById('theme-toggle');
const extensionsGrid = document.getElementById('extensions-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const statusRegion = document.getElementById('extensions-status');

/* ==========================================================================
   LIVE REGION ANNOUNCEMENTS (Screen Reader Support)
   ========================================================================== */
function announceStatus(message) {
  if (!statusRegion) return;
  // Clear first so repeated identical messages still trigger a new announcement
  statusRegion.textContent = '';
  requestAnimationFrame(() => {
    statusRegion.textContent = message;
  });
}

/* ==========================================================================
   THEME SWITCHING LOGIC
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Apply light-theme if stored preference is 'light' or if system is light and no preference exists
  if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
    document.body.classList.add('light-theme');
    document.documentElement.classList.add('light-theme');
    themeToggleBtn.innerHTML = MOON_ICON;
    themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
  } else {
    document.body.classList.remove('light-theme');
    document.documentElement.classList.remove('light-theme');
    themeToggleBtn.innerHTML = SUN_ICON;
    themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
  }
}

function toggleTheme() {
  const isLight = document.body.classList.contains('light-theme');
  if (isLight) {
    document.body.classList.remove('light-theme');
    document.documentElement.classList.remove('light-theme');
    localStorage.setItem('theme', 'dark');
    themeToggleBtn.innerHTML = SUN_ICON;
    themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
  } else {
    document.body.classList.add('light-theme');
    document.documentElement.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
    themeToggleBtn.innerHTML = MOON_ICON;
    themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
  }
}

themeToggleBtn.addEventListener('click', toggleTheme);

/* ==========================================================================
   DATA FETCH & LOAD
   ========================================================================== */
async function loadData() {
  try {
    const response = await fetch('./data.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    extensions = await response.json();
  } catch (error) {
    console.warn("Could not fetch data.json. Falling back to local dataset.", error);
    // Deep copy fallback data so state modifications don't leak to references
    extensions = JSON.parse(JSON.stringify(FALLBACK_DATA));
  }
  renderExtensions();
}

/* ==========================================================================
   RENDERING ENGINE & EVENT ATTACHMENTS
   ========================================================================== */
function renderExtensions() {
  // Clear the existing grid content
  extensionsGrid.innerHTML = '';

  // Filter the items according to state
  const filteredExtensions = extensions.filter(item => {
    if (currentFilter === 'active') return item.isActive;
    if (currentFilter === 'inactive') return !item.isActive;
    return true;
  });

  // Handle empty state gracefully
  if (filteredExtensions.length === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'empty-state';
    
    let filterName = 'all';
    if (currentFilter === 'active') filterName = 'active';
    if (currentFilter === 'inactive') filterName = 'inactive';

    emptyDiv.innerHTML = `
      <h2>No extensions found</h2>
      <p>There are no extensions in the <strong>${filterName}</strong> category.</p>
    `;
    extensionsGrid.appendChild(emptyDiv);
    announceStatus(`No extensions found in the ${filterName} category.`);
    return;
  }

  // Announce the current count to screen readers
  const activeCount = filteredExtensions.filter(e => e.isActive).length;
  const inactiveCount = filteredExtensions.length - activeCount;
  if (currentFilter === 'all') {
    announceStatus(`Showing ${filteredExtensions.length} extensions. ${activeCount} active, ${inactiveCount} inactive.`);
  } else {
    announceStatus(`Showing ${filteredExtensions.length} ${currentFilter} extensions.`);
  }

  // Render cards in grid
  filteredExtensions.forEach((item) => {
    // Locate original index in the main arrays for operations
    const originalIndex = extensions.findIndex(ext => ext.name === item.name);
    
    const card = document.createElement('article');
    card.className = 'card fade-in';
    
    // Accessibility elements & switch controls
    const switchState = item.isActive ? 'true' : 'false';
    const switchLabel = `Toggle status of ${item.name}. Currently ${item.isActive ? 'active' : 'inactive'}`;

    card.innerHTML = `
      <div class="card-body">
        <img class="card-icon" src="${item.logo}" alt="${item.name} logo" width="60" height="60" onerror="this.src='./assets/images/logo.svg'">
        <div class="card-info">
          <h2 class="card-title">${item.name}</h2>
          <p class="card-description">${item.description}</p>
        </div>
      </div>
      <div class="card-footer">
        <button class="btn-remove" data-index="${originalIndex}" aria-label="Remove ${item.name}">Remove</button>
        <div class="switch-container">
          <button class="switch" role="switch" aria-checked="${switchState}" aria-label="${switchLabel}" data-index="${originalIndex}">
            <span class="switch-thumb"></span>
          </button>
        </div>
      </div>
    `;

    // Attach local interactions to the card elements
    const removeBtn = card.querySelector('.btn-remove');
    const switchBtn = card.querySelector('.switch');

    removeBtn.addEventListener('click', (e) => handleRemove(originalIndex, card));
    switchBtn.addEventListener('click', (e) => handleToggle(originalIndex, card));

    extensionsGrid.appendChild(card);
  });
}

/* ==========================================================================
   CARD INTERACTIONS
   ========================================================================== */
function handleToggle(index, cardElement) {
  // Toggle the state in the data array
  extensions[index].isActive = !extensions[index].isActive;
  
  const switchBtn = cardElement.querySelector('.switch');
  const newState = extensions[index].isActive;
  const extName = extensions[index].name;
  
  // Update screen-reader attributes immediately for assistive technologies
  switchBtn.setAttribute('aria-checked', newState ? 'true' : 'false');
  switchBtn.setAttribute('aria-label', `Toggle status of ${extName}. Currently ${newState ? 'active' : 'inactive'}`);

  // Announce the change to screen readers
  announceStatus(`${extName} is now ${newState ? 'active' : 'inactive'}.`);

  // Visual cues: if we are in a filtered list, we trigger a fade-out exit transition
  if ((currentFilter === 'active' && !newState) || (currentFilter === 'inactive' && newState)) {
    cardElement.classList.add('fade-out');
    // Wait for the exit animation to complete before re-rendering
    cardElement.addEventListener('animationend', () => {
      renderExtensions();
    }, { once: true });
  } else {
    // If the card remains on screen under current filter, just re-render to update switch animation
    renderExtensions();
  }
}

function handleRemove(index, cardElement) {
  const extName = extensions[index].name;
  
  // Play leaving transition
  cardElement.classList.add('fade-out');
  
  cardElement.addEventListener('animationend', () => {
    // Remove the extension from the main array
    extensions.splice(index, 1);
    // Announce removal to screen readers
    announceStatus(`${extName} has been removed. ${extensions.length} extensions remaining.`);
    // Re-render the grid
    renderExtensions();
  }, { once: true });
}

/* ==========================================================================
   FILTER EVENT LISTENERS
   ========================================================================== */
filterBtns.forEach(button => {
  button.addEventListener('click', (e) => {
    // Update active visual indicator
    filterBtns.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });
    
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    
    // Update active filter and re-render grid
    currentFilter = button.getAttribute('data-filter');
    
    // Apply smooth container fade when switching tabs
    extensionsGrid.style.opacity = '0.5';
    setTimeout(() => {
      renderExtensions();
      extensionsGrid.style.opacity = '1';
    }, 100);
  });
});

/* ==========================================================================
   APP INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadData();
});
