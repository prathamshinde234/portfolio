(() => {
  const form = document.getElementById('contact-form');
  const summary = document.getElementById('error-summary');
  const status = document.getElementById('form-status');
  const rules = {
    name: v => v.trim() ? '' : 'Enter your name.',
    email: v => !v.trim() ? 'Enter your email address.' : /^\S+@\S+\.\S+$/.test(v) ? '' : 'Enter an email address in the format name@example.com.',
    message: v => v.trim().length >= 10 ? '' : 'Enter a message of at least 10 characters.'
  };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    status.textContent = '';
    const errors = [];
    Object.keys(rules).forEach(id => {
      const input = form.elements[id];
      const msg = rules[id](input.value);
      document.getElementById(id + '-err').textContent = msg;
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg) errors.push({ id, msg });
    });
    if (errors.length) {
      summary.hidden = false;
      summary.innerHTML = '<h3>There is a problem</h3><ul></ul>';
      errors.forEach(({ id, msg }) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + id; a.textContent = msg;
        a.addEventListener('click', ev => { ev.preventDefault(); form.elements[id].focus(); });
        li.append(a); summary.querySelector('ul').append(li);
      });
      summary.focus();
      return;
    }
    summary.hidden = true;
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error();
      form.reset();
      status.textContent = 'Thanks. Your message was sent.';
    } catch {
      status.textContent = 'Your message could not be sent. Check your connection and try again.';
    }
  });
})();
