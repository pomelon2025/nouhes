// 스크롤하면 섹션이 부드럽게 나타나게 합니다.
document.documentElement.classList.add('js');

const targets = document.querySelectorAll(
  '.products h2, .products .section-sub, .tile, .principles h2, .rows li, .story figure, .story blockquote, .news__copy, .form'
);
targets.forEach((el) => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  targets.forEach((el) => io.observe(el));
} else {
  targets.forEach((el) => el.classList.add('is-in'));
}

// 이메일 신청 폼: 비었을 때, 형식이 틀렸을 때, 성공했을 때를 각각 안내합니다.
const form = document.querySelector('.form');
const email = document.getElementById('email');
const errorBox = document.getElementById('email-error');
const okBox = document.getElementById('email-ok');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = email.value.trim();
  okBox.hidden = true;

  let message = '';
  if (!value) message = '이메일 주소를 입력해 주세요.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = '이메일 형식이 올바르지 않아요. 예: name@example.com';

  if (message) {
    email.setAttribute('aria-invalid', 'true');
    errorBox.textContent = message;
    errorBox.hidden = false;
    email.focus();
    return;
  }

  email.removeAttribute('aria-invalid');
  errorBox.hidden = true;
  // 실제 신청 저장은 아직 연결되어 있지 않습니다 (화면 동작만 확인용).
  okBox.hidden = false;
  form.reset();
});
