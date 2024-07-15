const slider = document.querySelector('.slider');

function activate(e) {
    const items = document.querySelectorAll('.item');
    if (e.target.matches('.next')) {
        slider.append(items[0]);
    } else if (e.target.matches('.prev')) {
        slider.prepend(items[items.length-1]);
    }
    updateContentVisibility();
}

function updateContentVisibility() {
    const items = document.querySelectorAll('.item');
    items.forEach((item, index) => {
        const content = item.querySelector('.content');
        if (index === 1) {  // Changed from 0 to 1
            content.style.display = 'block';
            setTimeout(() => {
                content.style.opacity = '1';
            }, 10);
        } else {
            content.style.opacity = '0';
            setTimeout(() => {
                content.style.display = 'none';
            }, 750);
        }
    });
}

document.addEventListener('click', activate, false);

// Initialize content visibility on page load
updateContentVisibility();