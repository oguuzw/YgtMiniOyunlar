// Page Loader Script - Hide loader when page is fully loaded
window.addEventListener('load', function() {
  const pageLoader = document.getElementById('page-loader');
  if (pageLoader) {
    // Sayfa yüklenince hemen gizle (index.html'de sadece link tıklamalarında gösterilecek)
    pageLoader.classList.add('hidden');
    pageLoader.style.display = 'none';
  }
});
