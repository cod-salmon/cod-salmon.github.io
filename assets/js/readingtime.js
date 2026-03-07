function calculatePostCardReadingTimes() {
  const wordsPerMinute = 200; /* average reading speed?*/
  const postCards = document.querySelectorAll('.post-card, .project-card'); /*grab all
  elements with the class post-card or project-card*/ 

  /* and loop over each of those cards */
  postCards.forEach(card => {
    const link = card.querySelector('.read-more'); /* the link to the full article*/
    const readingTimeElement = card.querySelector('.reading-time'); /* place where
    the calculated reading time is displayed*/

    /* if don't have both, exit*/
    if (!link || !readingTimeElement) return;

    /*URL or path to the full article linked by Read More*/
    const articlePath = link.getAttribute('data-article');

    /* retrieve article's content, convert HTML response to string*/
    fetch(articlePath)
      .then(response => response.text())
      .then(html => {
        // Create temporary container to extract text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        // here is where we extract the text content from the temporaty div
        const text = tempDiv.textContent || tempDiv.innerText;
        // trim text, split into an array using whitespace, then count
        const wordCount = text.trim().split(/\s+/).length;
        // measure reading time using average
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        // update the .reading-time element
        readingTimeElement.textContent = readingTime;
      })
      .catch(err => {
        console.error('Error calculating reading time:', err);
      });
  });
}