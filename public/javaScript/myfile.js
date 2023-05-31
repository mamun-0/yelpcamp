const searchInput = document.querySelector('.campground-search');

if (searchInput) {
  searchInput.addEventListener('input', handleInput);
}

function handleInput(e) {
  let val = e.target.value.toLowerCase();
  const allCards = document.querySelectorAll('.card');
  allCards.forEach((element) => {
    const heading = element.querySelector('.card-title');
    if (!heading.innerText.toLowerCase().includes(val)) {
      element.parentElement.style.display = 'none';
    } else {
      element.parentElement.style.display = 'block';
    }
  });
}
