(function () {
  var module = document.body.getAttribute('data-active-module');
  if (window.location.hash === '#prime-agency') {
    module = 'prime-agency';
  }
  if (module) {
    document.querySelectorAll('.global-nav-link[data-module="' + module + '"]').forEach(function (el) {
      el.classList.add('active');
    });
  }

  if (module === 'prime-agency' && document.body.getAttribute('data-active-module') === 'retention' && window.location.hash !== '#prime-agency') {
    window.location.hash = 'prime-agency';
  }

  var profile = document.querySelector('.global-profile');
  var profileBtn = document.querySelector('.global-profile-btn');
  if (profile && profileBtn) {
    profileBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      profile.classList.toggle('open');
    });
    document.addEventListener('click', function () {
      profile.classList.remove('open');
    });
  }
})();
