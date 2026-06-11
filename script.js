/* ============================================================
   Двойной Я-эффект — main script
   ============================================================ */

// ── Sticky header ──────────────────────────────────────────
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ── Mobile burger menu ─────────────────────────────────────
const burger = document.getElementById('burger');
const nav    = document.getElementById('nav');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  nav.classList.toggle('open');
});

// Close nav when a link is clicked
nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    nav.classList.remove('open');
  });
});

// ── Fade-in on scroll ──────────────────────────────────────
const fadeEls = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings inside the same parent
      const siblings = entry.target.parentElement.querySelectorAll('.fade-up:not(.visible)');
      let delay = 0;
      siblings.forEach(el => {
        if (el === entry.target || entry.target.contains(el)) return;
      });

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 0);

      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

// Staggered reveal for grid children
document.querySelectorAll('.services__grid, .about__features, .contacts__grid').forEach(grid => {
  const items = grid.querySelectorAll('.fade-up');
  items.forEach((item, idx) => {
    item.style.transitionDelay = `${idx * 80}ms`;
  });
});

fadeEls.forEach(el => observer.observe(el));

// ── Car make → model dynamic dropdown ─────────────────────
const CAR_MODELS = {
  'Lada (ВАЗ)':    ['Granta', 'Vesta', 'XRAY', 'Largus', 'Niva Travel', 'Niva Legend', '2114', '2115', '2107', '2106', '2105', '2104', 'Другая'],
  'BMW':           ['1 серия', '2 серия', '3 серия', '5 серия', '7 серия', 'X1', 'X2', 'X3', 'X5', 'X6', 'X7', 'M3', 'M5', 'Другая'],
  'Mercedes-Benz': ['A-Class', 'B-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'CLA', 'AMG GT', 'Другая'],
  'Audi':          ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'RS3', 'RS6', 'Другая'],
  'Volkswagen':    ['Polo', 'Golf', 'Passat', 'Tiguan', 'Touareg', 'Jetta', 'Arteon', 'T-Cross', 'T-Roc', 'ID.4', 'Другая'],
  'Porsche':       ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', 'Boxster', 'Другая'],
  'Skoda':         ['Octavia', 'Superb', 'Karoq', 'Kodiaq', 'Fabia', 'Rapid', 'Другая'],
  'Volvo':         ['S60', 'S90', 'V60', 'V90', 'XC40', 'XC60', 'XC90', 'Другая'],
  'Land Rover':    ['Discovery', 'Discovery Sport', 'Defender', 'Range Rover', 'Range Rover Sport', 'Range Rover Evoque', 'Другая'],
  'Toyota':        ['Camry', 'Corolla', 'RAV4', 'Land Cruiser', 'Land Cruiser Prado', 'Highlander', 'Yaris', 'C-HR', 'Другая'],
  'Lexus':         ['ES', 'IS', 'LS', 'GS', 'NX', 'RX', 'GX', 'LX', 'UX', 'Другая'],
  'Nissan':        ['Qashqai', 'X-Trail', 'Murano', 'Pathfinder', 'Juke', 'Almera', 'Teana', 'Другая'],
  'Mazda':         ['Mazda 3', 'Mazda 6', 'CX-3', 'CX-5', 'CX-7', 'CX-9', 'MX-5', 'Другая'],
  'Honda':         ['Civic', 'Accord', 'CR-V', 'HR-V', 'Pilot', 'Jazz', 'Другая'],
  'Kia':           ['Rio', 'Ceed', 'K5 (Optima)', 'Sportage', 'Sorento', 'Stinger', 'Seltos', 'Soul', 'Другая'],
  'Hyundai':       ['Solaris', 'Elantra', 'i30', 'Tucson', 'Santa Fe', 'Creta', 'Palisade', 'Другая'],
  'Chery':         ['Tiggo 4', 'Tiggo 4 Pro', 'Tiggo 7 Pro', 'Tiggo 7 Pro Max', 'Tiggo 8 Pro', 'Tiggo 8 Pro Max', 'Arrizo 8', 'Другая'],
  'Haval':         ['F7', 'F7x', 'Jolion', 'H6', 'Dargo', 'Другая'],
  'Geely':         ['Atlas', 'Atlas Pro', 'Coolray', 'Emgrand', 'Monjaro', 'Другая'],
  'BYD':           ['Atto 3', 'Han', 'Tang', 'Song Plus', 'Seal', 'Другая'],
  'Changan':       ['CS35 Plus', 'CS55 Plus', 'CS75 Plus', 'UNI-T', 'UNI-K', 'Другая'],
  'Omoda':         ['C5', 'S5', 'Другая'],
  'Exeed':         ['LX', 'TX', 'TXL', 'VX', 'Другая'],
  'Jetour':        ['Dashing', 'X70', 'X70 Plus', 'X90 Plus', 'Другая'],
  'Jaecoo':        ['J7', 'J8', 'Другая'],
  'Tank':          ['300', '400', '500', 'Другая'],
};

const carMakeSelect  = document.getElementById('carMake');
const carModelSelect = document.getElementById('carModel');

if (carMakeSelect && carModelSelect) {
  carMakeSelect.addEventListener('change', () => {
    const make   = carMakeSelect.value;
    const models = CAR_MODELS[make];
    carModelSelect.innerHTML = '';

    if (!models) {
      carModelSelect.innerHTML = '<option value="">— Введите вручную —</option>';
      carModelSelect.disabled = true;
      return;
    }

    carModelSelect.disabled = false;
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = '— Выберите модель —';
    carModelSelect.appendChild(placeholder);

    models.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      carModelSelect.appendChild(opt);
    });
  });
}

// ── Phone mask ─────────────────────────────────────────────
const phoneInput = document.getElementById('phone');
if (phoneInput) {
  phoneInput.addEventListener('input', () => {
    let val = phoneInput.value.replace(/\D/g, '');
    if (val.startsWith('8')) val = '7' + val.slice(1);
    if (!val.startsWith('7') && val.length > 0) val = '7' + val;
    let formatted = '';
    if (val.length > 0)  formatted = '+7';
    if (val.length > 1)  formatted += ' (' + val.slice(1, 4);
    if (val.length >= 4) formatted += ') ' + val.slice(4, 7);
    if (val.length >= 7) formatted += '-' + val.slice(7, 9);
    if (val.length >= 9) formatted += '-' + val.slice(9, 11);
    phoneInput.value = formatted;
  });
}

// ── Form validation & Telegram submit ─────────────────────

/*
  To enable Telegram notifications:
  1. Create a bot via @BotFather → get BOT_TOKEN
  2. Send any message to your bot, then open:
     https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
     Copy your chat_id from the response.
  3. Replace the placeholders below.
*/
const TG_BOT_TOKEN = '8698821256:AAEI24UBNdAmzv5k0dKu6vV5EfB456C0rHw';   // ← вставьте токен бота
const TG_CHAT_ID   = '7676497885';     // ← вставьте chat_id

const form         = document.getElementById('bookingForm');
const successBlock = document.getElementById('bookingSuccess');
const submitBtn    = document.getElementById('submitBtn');

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; }
}
function clearErrors() {
  ['nameError','phoneError','carMakeError','serviceError','privacyError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
  form.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
}

function validateForm(data) {
  let valid = true;
  if (!data.name.trim() || data.name.trim().length < 2) {
    showError('nameError', 'Введите ваше имя (минимум 2 символа)');
    document.getElementById('name').classList.add('error');
    valid = false;
  }
  const phone = data.phone.replace(/\D/g, '');
  if (phone.length < 11) {
    showError('phoneError', 'Введите корректный номер телефона');
    document.getElementById('phone').classList.add('error');
    valid = false;
  }
  if (!data.carMake) {
    showError('carMakeError', 'Выберите марку автомобиля');
    document.getElementById('carMake').classList.add('error');
    valid = false;
  }
  if (!data.service) {
    showError('serviceError', 'Выберите услугу');
    document.getElementById('service').classList.add('error');
    valid = false;
  }
  if (!document.getElementById('privacy').checked) {
    showError('privacyError', 'Необходимо согласие на обработку данных');
    valid = false;
  }
  return valid;
}

function buildTelegramMessage(data) {
  return [
    '🚗 *Новая заявка с сайта — Двойной Я-эффект*',
    '',
    `👤 *Имя:* ${data.name}`,
    `📞 *Телефон:* ${data.phone}`,
    data.email ? `📧 *Email:* ${data.email}` : '',
    `🚙 *Марка:* ${data.carMake}`,
    data.carModel ? `📋 *Модель:* ${data.carModel}` : '',
    `🔧 *Услуга:* ${data.service}`,
    data.comment ? `💬 *Комментарий:* ${data.comment}` : '',
    '',
    `🕐 _${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Samara' })}_`,
  ].filter(l => l !== null && l !== undefined && !(l === '')).join('\n');
}

async function sendToTelegram(message) {
  if (TG_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE' || TG_CHAT_ID === 'YOUR_CHAT_ID_HERE') {
    // Dev mode: log and simulate success
    console.log('[Telegram] Dev mode — message that would be sent:\n', message);
    return true;
  }
  const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TG_CHAT_ID,
      text: message,
      parse_mode: 'Markdown',
    }),
  });
  return res.ok;
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const data = {
      name:     document.getElementById('name').value,
      phone:    document.getElementById('phone').value,
      email:    document.getElementById('email').value,
      carMake:  document.getElementById('carMake').value,
      carModel: document.getElementById('carModel').value,
      service:  document.getElementById('service').value,
      comment:  document.getElementById('comment').value,
    };

    if (!validateForm(data)) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем...';

    try {
      const msg = buildTelegramMessage(data);
      await sendToTelegram(msg);

      form.style.display = 'none';
      successBlock.classList.add('show');
      successBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      console.error('Send error:', err);
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Отправить заявку`;
      showError('privacyError', 'Ошибка отправки. Пожалуйста, позвоните нам напрямую.');
    }
  });
}

// ── Smooth anchor scroll ───────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Active nav highlight ───────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'nav__link--active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));
