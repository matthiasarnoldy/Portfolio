/**
 * Initializes all field error states.
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @returns {void}
 */
function initializeFieldErrors(formElements) {
	setFieldErrorState(formElements.contactName, formElements.contactNameError, true, false);
	setFieldErrorState(formElements.contactEmail, formElements.contactEmailError, true, false);
	setFieldErrorState(formElements.contactMessage, formElements.contactMessageError, true, false);
	setFieldErrorState(formElements.contactPrivacy, formElements.contactPrivacyError, true, false);
}

/**
 * Updates all field error states.
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @param {{contactName: boolean, contactEmail: boolean, contactMessage: boolean, contactPrivacy: boolean}} touchedFields
 * @returns {void}
 */
function updateFieldErrors(formElements, touchedFields) {
	const isNameFieldValid = isNameValid(formElements.contactName.value);
	const isEmailFieldValid = isEmailValid(formElements.contactEmail.value);
	const isMessageFieldValid = isMessageValid(formElements.contactMessage.value);
	const isPrivacyFieldValid = isPrivacyValid(formElements.contactPrivacy.checked);
	updateSingleFieldError(formElements.contactName, formElements.contactNameError, isNameFieldValid, touchedFields.contactName);
	updateSingleFieldError(formElements.contactEmail, formElements.contactEmailError, isEmailFieldValid, touchedFields.contactEmail);
	updateSingleFieldError(formElements.contactMessage, formElements.contactMessageError, isMessageFieldValid, touchedFields.contactMessage);
	updateSingleFieldError(formElements.contactPrivacy, formElements.contactPrivacyError, isPrivacyFieldValid, touchedFields.contactPrivacy);
}

/**
 * Updates one field error display state.
 * @param {HTMLElement} fieldElement
 * @param {HTMLElement} errorElement
 * @param {boolean} isValid
 * @param {boolean} isTouched
 * @returns {void}
 */
function updateSingleFieldError(fieldElement, errorElement, isValid, isTouched) {
	const shouldShowError = isTouched ? isValid : true;
	setFieldErrorState(fieldElement, errorElement, shouldShowError, isTouched);
}

/**
 * Sets aria and visual state for a field error.
 * @param {HTMLElement} fieldElement
 * @param {HTMLElement} errorElement
 * @param {boolean} isValid
 * @param {boolean} isTouched
 * @returns {void}
 */
function setFieldErrorState(fieldElement, errorElement, isValid, isTouched) {
	fieldElement.setAttribute("aria-invalid", String(!isValid));
	fieldElement.classList.toggle("is-validated", isTouched);
	errorElement.style.opacity = isValid ? "0" : "1";
}

/**
 * Evaluates form validity and updates submit button state.
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @returns {boolean}
 */
function updateSubmitState(formElements) {
	const isFormValid =
		isNameValid(formElements.contactName.value) &&
		isEmailValid(formElements.contactEmail.value) &&
		isMessageValid(formElements.contactMessage.value) &&
		isPrivacyValid(formElements.contactPrivacy.checked);
	formElements.contactSubmitButton.disabled = !isFormValid;
	formElements.contactSubmitButton.setAttribute("aria-disabled", String(!isFormValid));
	return isFormValid;
}

/**
 * Updates form-wide state (validity and errors).
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @param {{contactName: boolean, contactEmail: boolean, contactMessage: boolean, contactPrivacy: boolean}} touchedFields
 * @returns {boolean}
 */
function updateFormState(formElements, touchedFields) {
	const isFormValid = updateSubmitState(formElements);
	updateFieldErrors(formElements, touchedFields);
	return isFormValid;
}

/**
 * Marks all contact fields as touched.
 * @param {{contactName: boolean, contactEmail: boolean, contactMessage: boolean, contactPrivacy: boolean}} touchedFields
 * @returns {void}
 */
function setAllFieldsTouched(touchedFields) {
	touchedFields.contactName = true;
	touchedFields.contactEmail = true;
	touchedFields.contactMessage = true;
	touchedFields.contactPrivacy = true;
}

/**
 * Focuses the first invalid contact field.
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @returns {void}
 */
function focusFirstInvalidContactField(formElements) {
	const validationTargets = getContactValidationTargets(formElements);
	const firstInvalidTarget = validationTargets.find((target) => !target.isValid());
	firstInvalidTarget?.field.focus();
}

/**
 * Returns validation target descriptors for each contact field.
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @returns {{field: HTMLElement, isValid: () => boolean}[]}
 */
function getContactValidationTargets(formElements) {
	return [
		{ field: formElements.contactName, isValid: () => isNameFieldValid(formElements) },
		{ field: formElements.contactEmail, isValid: () => isEmailFieldValid(formElements) },
		{ field: formElements.contactMessage, isValid: () => isMessageFieldValid(formElements) },
		{ field: formElements.contactPrivacy, isValid: () => isPrivacyFieldValid(formElements) },
	];
}

/**
 * Resets the contact form UI and state.
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @param {{contactName: boolean, contactEmail: boolean, contactMessage: boolean, contactPrivacy: boolean}} touchedFields
 * @returns {void}
 */
function resetContactFormState(formElements, touchedFields) {
	formElements.contactName.value = "";
	formElements.contactEmail.value = "";
	formElements.contactMessage.value = "";
	formElements.contactPrivacy.checked = false;
	touchedFields.contactName = false;
	touchedFields.contactEmail = false;
	touchedFields.contactMessage = false;
	touchedFields.contactPrivacy = false;
	initializeFieldErrors(formElements);
	hideContactStatusMessage(formElements);
	updateSubmitState(formElements);
}

/**
 * Validates the contact name.
 * @param {string} nameValue
 * @returns {boolean}
 */
function isNameValid(nameValue) {
	if (typeof nameValue !== "string") return false;
	const trimmedName = nameValue.trim();
	if (trimmedName.length < 2) return false;
	const namePattern = /^[a-zA-ZäöüßÄÖÜ\s]+$/;
	return namePattern.test(trimmedName);
}

/**
 * Validates the email address.
 * @param {string} emailValue
 * @returns {boolean}
 */
function isEmailValid(emailValue) {
	if (typeof emailValue !== "string") return false;
	const normalizedEmail = emailValue.trim();
	const emailPattern = /^(?!.*\.\.)(?!\.)(?!.*\.$)[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@[A-Za-z0-9-]+(?:\.[A-Za-z]{2,24}|\.(?:co|com|org|net|gov|edu|ac)\.[A-Za-z]{2})$/i;
	return emailPattern.test(normalizedEmail);
}

/**
 * Validates the message content.
 * @param {string} messageValue
 * @returns {boolean}
 */
function isMessageValid(messageValue) {
	if (typeof messageValue !== "string") return false;
	if (messageValue.length < 10) return false;
	const uniqueCharacters = new Set(messageValue);
	return uniqueCharacters.size >= 5;
}

/**
 * Validates the privacy checkbox state.
 * @param {boolean} isChecked
 * @returns {boolean}
 */
function isPrivacyValid(isChecked) {
	return isChecked === true;
}

/**
 * Validates the name field from form elements.
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @returns {boolean}
 */
function isNameFieldValid(formElements) {
	return isNameValid(formElements.contactName.value);
}

/**
 * Validates the email field from form elements.
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @returns {boolean}
 */
function isEmailFieldValid(formElements) {
	return isEmailValid(formElements.contactEmail.value);
}

/**
 * Validates the message field from form elements.
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @returns {boolean}
 */
function isMessageFieldValid(formElements) {
	return isMessageValid(formElements.contactMessage.value);
}

/**
 * Validates the privacy field from form elements.
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @returns {boolean}
 */
function isPrivacyFieldValid(formElements) {
	return isPrivacyValid(formElements.contactPrivacy.checked);
}

/**
 * Registers input and blur listeners for the name field.
 * @param {HTMLInputElement} contactName
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @param {{contactName: boolean, contactEmail: boolean, contactMessage: boolean, contactPrivacy: boolean}} touchedFields
 * @returns {void}
 */
function setupNameFieldListeners(contactName, formElements, touchedFields) {
	contactName.addEventListener("input", () => {
		updateFormState(formElements, touchedFields);
	});
	contactName.addEventListener("blur", () => {
		touchedFields.contactName = true;
		updateFormState(formElements, touchedFields);
	});
}

/**
 * Registers input and blur listeners for the email field.
 * @param {HTMLInputElement} contactEmail
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @param {{contactName: boolean, contactEmail: boolean, contactMessage: boolean, contactPrivacy: boolean}} touchedFields
 * @returns {void}
 */
function setupEmailFieldListeners(contactEmail, formElements, touchedFields) {
	contactEmail.addEventListener("input", () => {
		updateFormState(formElements, touchedFields);
	});
	contactEmail.addEventListener("blur", () => {
		touchedFields.contactEmail = true;
		updateFormState(formElements, touchedFields);
	});
}

/**
 * Registers input and blur listeners for the message field.
 * @param {HTMLTextAreaElement} contactMessage
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @param {{contactName: boolean, contactEmail: boolean, contactMessage: boolean, contactPrivacy: boolean}} touchedFields
 * @returns {void}
 */
function setupMessageFieldListeners(contactMessage, formElements, touchedFields) {
	contactMessage.addEventListener("input", () => {
		updateFormState(formElements, touchedFields);
	});
	contactMessage.addEventListener("blur", () => {
		touchedFields.contactMessage = true;
		updateFormState(formElements, touchedFields);
	});
}

/**
 * Registers the change listener for the privacy checkbox.
 * @param {HTMLInputElement} contactPrivacy
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @param {{contactName: boolean, contactEmail: boolean, contactMessage: boolean, contactPrivacy: boolean}} touchedFields
 * @returns {void}
 */
function setupPrivacyFieldListeners(contactPrivacy, formElements, touchedFields) {
	contactPrivacy.addEventListener("change", () => {
		touchedFields.contactPrivacy = true;
		updateFormState(formElements, touchedFields);
	});
}

/**
 * Enables keyboard focus indicators for all contact fields.
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @returns {void}
 */
function setupKeyboardFocusIndicators(formElements) {
	let isKeyboardNavigation = false;
	setupKeyboardNavigationListeners(
		() => isKeyboardNavigation = true,
		() => isKeyboardNavigation = false,
	);
	const contactInputs = getContactInputs(formElements);
	contactInputs.forEach(input => {
		setupInputFocusIndicators(input, () => isKeyboardNavigation);
	});
}

/**
 * Registers listeners to detect keyboard vs. pointer navigation.
 * @param {() => void} onKeyboardNavigation
 * @param {() => void} onPointerNavigation
 * @returns {void}
 */
function setupKeyboardNavigationListeners(onKeyboardNavigation, onPointerNavigation) {
	document.addEventListener("keydown", (event) => {
		if (event.key === "Tab") {
			onKeyboardNavigation();
		}
	});
	document.addEventListener("mousedown", () => {
		onPointerNavigation();
	});
	document.addEventListener("touchstart", () => {
		onPointerNavigation();
	}, { passive: true });
	document.addEventListener("pointerdown", () => {
		onPointerNavigation();
	});
}

/**
 * Adds or removes keyboard focus state on an input element.
 * @param {HTMLInputElement|HTMLTextAreaElement} input
 * @param {() => boolean} isKeyboardNavigation
 * @returns {void}
 */
function setupInputFocusIndicators(input, isKeyboardNavigation) {
	input.addEventListener("focus", () => {
		if (isKeyboardNavigation()) {
			input.classList.add("is-keyboard-focus");
		}
	});
	input.addEventListener("blur", () => {
		input.classList.remove("is-keyboard-focus");
	});
}

/**
 * Returns all contact inputs that should receive focus handling.
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @returns {(HTMLInputElement|HTMLTextAreaElement)[]}
 */
function getContactInputs(formElements) {
	return [formElements.contactName, formElements.contactEmail, formElements.contactMessage, formElements.contactPrivacy];
}