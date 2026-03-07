// Reference to the hamburger menu button that opens the sidebar
const openButton = document.getElementById('open-sidebar-button')
// Reference to the navbar
const navbar = document.getElementById('navbar')
// Create a media query for the viewport's width
const media = window.matchMedia("(max-width: 700px)")
// Function to enable/disable navbar 
// according to media 
function updateNavbar(e){
  // Are we below 700px?
  const isMobile = e.matches
  console.log(isMobile)
  if(isMobile){
    // then disable the navbar
    navbar.setAttribute('inert', '')
  }
  else{
    // enable the navbar
    navbar.removeAttribute('inert')
  }
}
// -------- Initialize navbar state
// (ensures the sidebar has the correct inert state 
// depending on screen size before any user interaction)
updateNavbar(media)

// -------- Re-evaluate navbar state
// Listen for changes to the media query
// i.e., detect when the viewport goes below or above the 700px threshold,
// and in such case, updateNavbar
media.addEventListener('change', (e) => updateNavbar(e))

// -------- Methods to call when hamburger button is clicked
// Function to enable navbar
function openSidebar(){
  navbar.classList.add('show') // show the sidebar
  openButton.setAttribute('aria-expanded', 'true') // set aria-expanded to true (navbar is visible)
  navbar.removeAttribute('inert') // remove inert attribute to enable interaction
}
// Function to disable navbar
function closeSidebar(){
  navbar.classList.remove('show') // hide the sidebar
  openButton.setAttribute('aria-expanded', 'false') // set aria-expanded to false (navbar is hidden)
  navbar.setAttribute('inert', '') // add inert attribute to disable interaction
}