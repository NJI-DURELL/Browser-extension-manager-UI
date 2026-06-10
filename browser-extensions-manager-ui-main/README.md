# Frontend Mentor - Browser extensions manager UI solution

This is a solution to the [Browser extensions manager UI challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/browser-extension-manager-ui-yNZnOfsMAp). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Key Technical Features](#key-technical-features)
  - [Useful resources](#useful-resources)
  - [AI Collaboration](#ai-collaboration)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- Toggle extensions between active and inactive states.
- Filter active and inactive extensions.
- Remove extensions from the list.
- Select their color theme (Light vs. Dark) with persistent caching.
- View the optimal layout for the interface depending on their device's screen size.
- See hover and focus states for all interactive elements on the page.

### Screenshot

Refer to the mockups in the `/design` folder for visual references of the implementation.

- Dark Mode Desktop: [desktop-design-dark.jpg](./design/desktop-design-dark.jpg)
- Light Mode Desktop: [desktop-design-light.jpg](./design/desktop-design-light.jpg)

### Links

- Repository URL: [GitHub Repository](https://github.com/durel/browser-extensions-manager-ui)
- Live Site URL: [Live Demo Page](https://durel.github.io/browser-extensions-manager-ui/)

---

## My process

### Built with

- Semantic HTML5 markup (Header, Main, Section, Article, Footer)
- CSS Custom Properties (Theme tokens for Light/Dark modes)
- CSS Flexbox (Aligning logo, header, card text, card actions)
- CSS Grid (Responsive multi-column grid layout)
- Vanilla JavaScript (Dynamic UI rendering, action handlers, event listener scopes)
- Accessibility Features (ARIA roles, custom checkbox buttons, focus outlines)

### What I learned

#### Flash-Free Theme Injection
By using an inline script in the `<head>` to check user preference before parsing the page body, and defining our CSS variables on `.light-theme`, we can avoid the "white flash" on page render if the user prefers dark mode.

```html
<script>
  (function () {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
      document.documentElement.classList.add('light-theme');
    }
  })();
</script>
```

#### CSS Grid Fluid Widths
Using `repeat(auto-fill, minmax(350px, 1fr))` creates a robust fluid grid that handles desktop, tablet, and mobile breakpoints without relying on excessive media queries.

```css
.extensions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media (max-width: 992px) {
  .extensions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 650px) {
  .extensions-grid {
    grid-template-columns: 1fr;
  }
}
```

#### Dual-Mode Data Provider
To make sure this app is easy to view locally (which normally fails `fetch('data.json')` due to CORS when using the `file://` protocol), the script attempts a fetch and automatically falls back to an embedded JSON copy.

```js
async function loadData() {
  try {
    const response = await fetch('./data.json');
    if (!response.ok) throw new Error();
    extensions = await response.json();
  } catch (error) {
    console.warn("Using fallback local dataset.");
    extensions = JSON.parse(JSON.stringify(FALLBACK_DATA));
  }
  renderExtensions();
}
```

### Key Technical Features

1. **Persistent Theme switching:** Toggles between light and dark backgrounds dynamically, changing the Sun / Moon icons via CSS variables and saving choice in `localStorage`.
2. **Dynamic list modification:** Removing extensions and toggling active status triggers a `.fade-out` class to allow exit animations to complete before updating DOM nodes.
3. **Keyboard Accessibility:** Filter tabs, switches, and remove buttons are fully keyboard-navigable and use a prominent custom outline focus ring.

### Useful resources

- [MDN Web Docs - ARIA Switches](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/switch_role) - Guided the implementation of the dynamic toggle controls.
- [CSS-Tricks - CSS Custom Properties](https://css-tricks.com/difference-between-types-of-css-variables/) - Explored scopes for inherited properties.

### AI Collaboration

This challenge was solved in collaboration with the **Antigravity AI pair programmer**.
- The AI helped architect the dark/light theme persistence layers.
- Designed key CSS variables and setup transition timings for cards.
- Structured accessibly labeled interactive items.

---

## Author

- Frontend Mentor - [@durel](https://www.frontendmentor.io/profile/durel)
