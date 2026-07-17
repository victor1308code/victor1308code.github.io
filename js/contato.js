document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const successModalOverlay = document.getElementById('success-modal');
  const modalCloseButton = document.getElementById('modal-close-btn');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInputField = document.getElementById('name');
    const emailInputField = document.getElementById('email');
    const messageInputField = document.getElementById('message');

    let isFormValid = true;

    if (nameInputField.value.trim() === '') {
      applyInputError(nameInputField, 'Por favor, insira o seu nome.');
      isFormValid = false;
    } else {
      clearInputError(nameInputField);
    }

    const emailValueString = emailInputField.value.trim();
    if (emailValueString === '') {
      applyInputError(emailInputField, 'Por favor, insira o seu e-mail.');
      isFormValid = false;
    } else if (!isEmailFormatValid(emailValueString)) {
      applyInputError(emailInputField, 'Por favor, insira um e-mail com formato válido (usuario@dominio.com).');
      isFormValid = false;
    } else {
      clearInputError(emailInputField);
    }

    if (messageInputField.value.trim() === '') {
      applyInputError(messageInputField, 'Por favor, digite sua mensagem.');
      isFormValid = false;
    } else {
      clearInputError(messageInputField);
    }

    if (isFormValid) {
      nameInputField.value = '';
      emailInputField.value = '';
      messageInputField.value = '';
      toggleSuccessModal(true);
    }
  });

  // Exibe erro visual
  function applyInputError(inputElement, errorMessageText) {
    const inputContainerGroup = inputElement.parentElement;
    const errorFeedbackElement = inputContainerGroup.querySelector('.error-message');
    inputContainerGroup.classList.add('has-error');
    if (errorFeedbackElement) {
      errorFeedbackElement.textContent = errorMessageText;
    }
  }

  // Remove erro visual
  function clearInputError(inputElement) {
    const inputContainerGroup = inputElement.parentElement;
    inputContainerGroup.classList.remove('has-error');
  }

  // Valida formato email
  function isEmailFormatValid(emailAddress) {
    const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegexPattern.test(emailAddress);
  }

  // Controla modal sucesso
  function toggleSuccessModal(shouldShow) {
    if (successModalOverlay) {
      if (shouldShow) {
        successModalOverlay.classList.add('is-visible');
      } else {
        successModalOverlay.classList.remove('is-visible');
      }
    }
  }

  if (modalCloseButton) {
    modalCloseButton.addEventListener('click', () => toggleSuccessModal(false));
  }

  if (successModalOverlay) {
    successModalOverlay.addEventListener('click', (event) => {
      if (event.target === successModalOverlay) {
        toggleSuccessModal(false);
      }
    });
  }
});
