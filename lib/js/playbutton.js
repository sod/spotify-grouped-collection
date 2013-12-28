/**
 * disable link behind play button if the play button was pressed
 */
document.body.addEventListener('click', function(event) {
  if(event.target && /sp-button-play/.test(event.target.className)) {
    event.preventDefault();
  }
});