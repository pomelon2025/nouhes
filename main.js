const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');

// 쿠팡 판매 페이지 주소를 여기에 넣으면 모든 "구매하기" 버튼이 새 창으로 연결됩니다.
// 비어 있는 동안에는 소식 받기 구역으로 이동합니다.
const COUPANG_URL = '';
document.querySelectorAll('.js-buy').forEach((a) => {
  if (!COUPANG_URL) return;
  a.href = COUPANG_URL;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
});

// 1) 첫 화면 영상: 일시정지 버튼, 움직임 줄이기 설정 존중
const video = document.getElementById('heroVideo');
const toggle = document.getElementById('heroToggle');
if (video && toggle) {
  const setLabel = () => {
    const playing = !video.paused;
    toggle.textContent = playing ? '일시정지' : '재생';
    toggle.setAttribute('aria-label', playing ? '영상 일시정지' : '영상 재생');
  };
  if (reduce) video.pause();
  toggle.addEventListener('click', () => {
    if (video.paused) video.play().catch(() => {}); else video.pause();
  });
  video.addEventListener('play', setLabel);
  video.addEventListener('pause', setLabel);
  setLabel();
}

// 2) 스크롤하면 요소가 부드럽게 나타납니다.
const targets = document.querySelectorAll(
  '.split__panel, .roadmap h2, .roadmap__sub, .steps li, .tile, .feature__text, .dark > *, .quote p, .news > *, .pdp__info, .story-hero h1'
);
targets.forEach((el) => el.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -6% 0px' });
  targets.forEach((el) => io.observe(el));
} else {
  targets.forEach((el) => el.classList.add('is-in'));
}

// 3) 이메일 신청 폼 (홈에만 있음): 비었을 때, 형식이 틀렸을 때, 성공했을 때를 각각 안내합니다.
const form = document.querySelector('.form');
if (form) {
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
}
