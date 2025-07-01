const slider = document.querySelector('.slider');

function activate(e) {
  const items = document.querySelectorAll('.item');
  // Check if clicked element is a next button or contains next class
  if (e.target.matches('.next') || e.target.closest('.next-btn')) {
    slider.append(items[0]);
  }
  // Check if clicked element is a prev button or contains prev class
  if (e.target.matches('.prev') || e.target.closest('.prev-btn')) {
    slider.prepend(items[items.length-1]);
  }
}

document.addEventListener('click', activate, false);