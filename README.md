# Basic HTML/CSS/JS Blogging Framework
This is a basic blogging/portfolio website built from HTML, CSS, and JavaScript. You can see how it looks [here](https://cod-salmon.github.io/blog-template). It can be used for writing posts about things one may learn or find interesting, showcasing projects (e.g., as a GitHub portfolio), or simply as a personal website. The code has been commented (heavily) for didactic purposes, and meant to be either used directly as it is, or extended and customized as a starting framework for any ideas one may have in mind. 

The project is organized into three main parts:
- `index.html` – The primary HTML file and entry point of the website. This file remains constant and serves as the main layout container.
- `pages/` – Contains the additional HTML files that are dynamically rendered inside the `content-area` section of `index.html`.
- `assets/` – Stores all static resources, including images, CSS stylesheets, and JavaScript files that handle the website’s styling and interactivity.

# The `index.html` file
Apart from the JavaScript functionality we bring in with `sidebar.js`, `readingtime.js` and `darkmode.js`, two CDN libraries are included:
- MathJax – for rendering mathematical equations.  
- Highlight.js – for syntax highlighting in `<pre><code>` blocks.

MathJax is configured inside the `<head>` to support inline math (`$...$`), display math (`$$...$$`) and custom font behavior. Highlight.js is loaded at the bottom of the `<body>`.

## The Theme System (Light/Dark Mode)
In `index.html`, there is a button with the ID `theme-switch`. Inside this button are two `<svg>` icons: a sun icon representing light mode and a moon icon representing dark mode.

In `assets/css/style.css`, the theme system is implemented using CSS custom properties (variables). The default theme is defined under `:root`, while the alternative dark theme is defined under the `.darkmode` class.

Both `:root` and `.darkmode` declare the same set of variables (such as `--base-color`, `--text-color`, `--primary-color`, etc.), but with different color values. The `:root` section contains the light color palette, and `.darkmode` overrides those variables with darker equivalents. These variables are then used throughout the stylesheet using (for instance) `var(--variable-name)` to control text colors, background colors, code styling... This approach is what allows the entire site’s appearance to change simply by switching to the `.darkmode` class.

The `#theme-switch` button itself is styled to be a small circular button positioned in the top-right corner of the page. It uses Flexbox to center its content and removes the default button padding. Both SVG icons inside the button inherit their color from `var(--secondary-text)`.

By default (light mode), the moon icon (the last SVG child) is hidden. When the `.darkmode` class is applied to an ancestor element (`<body>`) -see `darkmode.js`-, the visibility of the icons is swapped: the sun icon is hidden and the moon icon is shown. 

## The Navigation System
The `<nav>` element contains two main components:
- Close button (`#close-sidebar-button`). This button is only visible when the nav bar is shown on the side (mobile mode), and it is used to close the sidebar. When clicked, it calls the `closeSidebar()` function defined in `sidebar.js`.
- Navigation list (`<ul>`). Un unordered list containing four links: Home, Posts, Projects, and About. Each link calls the `loadContent()` function with the path to its corresponding HTML file.

The layout of `navbar` adapts based on screen width. On desktop screens (wider than 700px), the `#close-sidebar-button` and the navigation list (`<ul>`) are displayed horizontally at the top center of the page. On mobile screens (700px or narrower), the navigation switches to a vertical layout positioned along the right side, as a sidebar. In mobile mode, a hamburger-style button (`#open-sidebar-button`) appears in the top-right corner of the page. This button is used to open the sidebar. It is only visible on smaller screens and serves as the counterpart to the `#close-sidebar-button`, which closes the sidebar once it is open.

### Dynamic Content Loading
Unlike other JavaScript functionality (which is placed in separate files), the `loadContent()` function is defined directly inside `index.html`. The `loadContent(page, clickedLink)` function dynamically loads content into the page and runs a series of actions:
1. Updates the navigation state. It removes the `active-link` class from all navigation links and then adds the `active-link` class to the clicked link to visually highlight the currently selected page.
2. Fetches content from the input `page` and injects it into the <main id="content-area"> element.
3. It calls `calculatePostCardReadingTimes()` from `readingtime.js`. This function looks for elements with the classes `.post-card` or `.project-card` inside the loaded content. For each card, it estimates the reading time of the linked article (via the “Read More” link) and inserts the calculated value into the element with the class `.reading-time`. If the loaded page does not contain any `.post-card` or `.project-card` elements, the function simply does nothing.
4. It calls `MathJax.typesetPromise()` to make sure that any mathematical expressions in the newly loaded content are properly rendered.
5. Takes all `<pre><code>` blocks in the loaded content and applies `highlight.js` to enable syntax highlighting.

# The `pages/` folder
The `pages/` directory contains the HTML files for the four main navigation sections (Home, Posts, Projects, and About), along with two subfolders: `posts/` and `projects/`, which contain the full content pages.

The Posts page displays a grid of `post-card` elements. Each `post-card` consists of a thumbnail image, a short summary, a “Read More” link that leads to the full post, and an estimated reading time for the linked content. The Projects page follows a similar structure, using `project-card` elements instead. 