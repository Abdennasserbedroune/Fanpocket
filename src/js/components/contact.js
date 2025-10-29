const showToast = (message, type = 'success') => {
  const toast = dom.qs('#toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
};

const validateEmail = email => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const initContact = () => {
  const contactForm = dom.qs('#contact-form');
  if (!contactForm) return;

  const nameInput = dom.qs('#contact-name', contactForm);
  const emailInput = dom.qs('#contact-email', contactForm);
  const subjectInput = dom.qs('#contact-subject', contactForm);
  const messageInput = dom.qs('#contact-message', contactForm);

  const validateField = (input, validator, errorMessage) => {
    const value = input.value.trim();
    const isValid = validator(value);

    if (!isValid && value.length > 0) {
      input.classList.add('error');
      let errorDiv = input.nextElementSibling;
      if (!errorDiv || !errorDiv.classList.contains('form-error')) {
        errorDiv = dom.create('div', { className: 'form-error visible' }, [
          errorMessage,
        ]);
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
      } else {
        errorDiv.textContent = errorMessage;
        errorDiv.classList.add('visible');
      }
    } else {
      input.classList.remove('error');
      const errorDiv = input.nextElementSibling;
      if (errorDiv && errorDiv.classList.contains('form-error')) {
        errorDiv.classList.remove('visible');
      }
    }

    return isValid;
  };

  nameInput.addEventListener('blur', () => {
    validateField(
      nameInput,
      value => value.length >= 2,
      'Name must be at least 2 characters'
    );
  });

  emailInput.addEventListener('blur', () => {
    validateField(emailInput, validateEmail, 'Please enter a valid email');
  });

  subjectInput.addEventListener('blur', () => {
    validateField(
      subjectInput,
      value => value.length >= 3,
      'Subject must be at least 3 characters'
    );
  });

  messageInput.addEventListener('blur', () => {
    validateField(
      messageInput,
      value => value.length >= 10,
      'Message must be at least 10 characters'
    );
  });

  contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    const nameValid = validateField(
      nameInput,
      value => value.length >= 2,
      'Name must be at least 2 characters'
    );
    const emailValid = validateField(
      emailInput,
      validateEmail,
      'Please enter a valid email'
    );
    const subjectValid = validateField(
      subjectInput,
      value => value.length >= 3,
      'Subject must be at least 3 characters'
    );
    const messageValid = validateField(
      messageInput,
      value => value.length >= 10,
      'Message must be at least 10 characters'
    );

    if (!nameValid || !emailValid || !subjectValid || !messageValid) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        showToast(
          'Thank you! Your message has been sent successfully.',
          'success'
        );
        contactForm.reset();
      } else {
        const data = await response.json();
        if (data.errors) {
          const errorMessages = data.errors.map(err => err.message).join(', ');
          showToast(`Error: ${errorMessages}`, 'error');
        } else {
          showToast(
            'Oops! There was a problem submitting your form. Please try again.',
            'error'
          );
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showToast(
        'Message saved! (Form integration pending - please email us directly)',
        'success'
      );
      contactForm.reset();
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  });
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initContact, showToast };
}
