// 1) 스크롤하면 요소가 부드럽게 나타납니다.
document.documentElement.classList.add('js');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const targets = document.querySelectorAll(
  '.hero__title, .hero__row, .hero__media, .products__head, .card, .principles__title, .pledge, .news h2, .news__sub, .form'
);
targets.forEach((el) => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  targets.forEach((el) => io.observe(el));
} else {
  targets.forEach((el) => el.classList.add('is-in'));
}

// 2) 이야기 문장: 스크롤에 따라 단어가 하나씩 켜집니다.
const lit = document.querySelector('[data-lit]');
if (lit) {
  const words = lit.textContent.trim().split(/\s+/);
  lit.setAttribute('aria-label', words.join(' '));
  lit.innerHTML = words.map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
  const spans = [...lit.querySelectorAll('.w')];
  const update = () => {
    const r = lit.getBoundingClientRect();
    const p = reduce ? 1 : Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (innerHeight * 0.55 + r.height)));
    const n = Math.round(p * spans.length);
    spans.forEach((s, i) => s.classList.toggle('on', i < n));
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
}

// 3) 이메일 신청 폼: 비었을 때, 형식이 틀렸을 때, 성공했을 때를 각각 안내합니다.
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
