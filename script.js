const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  navigation.classList.toggle('is-open', open);
}

menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();

const revealTargets = document.querySelectorAll('.about-content, .service-card, .principle, .process-step, .contact-form');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
  revealTargets.forEach((target) => {
    target.classList.add('reveal');
    observer.observe(target);
  });
}

const form = document.querySelector('#form-contato');
const status = document.querySelector('#form-status');
const requiredFields = [...form.querySelectorAll('[required]')];

function fieldIsValid(field) {
  const value = field.value.trim();
  if (!value) return false;
  if (field.type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  return true;
}

requiredFields.forEach((field) => {
  field.addEventListener('input', () => {
    const valid = fieldIsValid(field);
    field.setAttribute('aria-invalid', String(!valid));
    if (valid && requiredFields.every(fieldIsValid)) {
      status.textContent = 'Campos obrigatórios preenchidos. O envio ainda precisa ser conectado a um serviço para que a mensagem seja recebida.';
      status.dataset.state = 'info';
    }
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const invalid = requiredFields.filter((field) => !fieldIsValid(field));
  requiredFields.forEach((field) => field.setAttribute('aria-invalid', String(invalid.includes(field))));
  if (invalid.length) {
    status.textContent = 'Revise os campos obrigatórios e informe um e-mail válido.';
    status.dataset.state = 'error';
    invalid[0].focus();
    return;
  }
  status.textContent = 'Validação concluída. Esta página ainda não envia mensagens: configure um serviço de formulário para receber este contato.';
  status.dataset.state = 'info';
});
