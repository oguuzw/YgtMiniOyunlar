// Page Loader Script - Hide loader when page is fully loaded
window.addEventListener('load', function() {
  const pageLoader = document.getElementById('page-loader');
  if (pageLoader) {
    setTimeout(() => {
      pageLoader.classList.add('hidden');
      // Remove from DOM after animation
      setTimeout(() => {
        pageLoader.remove();
      }, 500);
    }, 300);
  }
});
