/**
 * Initializes contact form validation.
 * @returns {ReturnType<typeof getContactFormElements>}
 */
function initContactFormValidation() {
	const formElements = getContactFormElements();
	if (!formElements) return null;
	const touchedFields = {
		contactName: false,
		contactEmail: false,
		contactMessage: false,
		contactPrivacy: false,
	};
	setupContactFormListeners(formElements, touchedFields);
	return formElements;
}

/**
 * Collects and validates all required contact form elements.
 * @returns {{
 *  contactName: HTMLInputElement,
 *  contactEmail: HTMLInputElement,
 *  contactMessage: HTMLTextAreaElement,
 *  contactPrivacy: HTMLInputElement,
 *  contactSubmitButton: HTMLButtonElement,
 *  contactStatusMessage: HTMLElement,
 *  contactNameError: HTMLElement,
 *  contactEmailError: HTMLElement,
 *  contactMessageError: HTMLElement,
 *  contactPrivacyError: HTMLElement
 * } | null}
 */
function getContactFormElements() {
	const formElements = {
		contactName: document.getElementById("contactName"),
		contactEmail: document.getElementById("contactEmail"),
		contactMessage: document.getElementById("contact-message"),
		contactPrivacy: document.getElementById("contact-privacy"),
		contactSubmitButton: document.querySelector(".contact__send"),
		contactStatusMessage: document.getElementById("contactStatusMessage"),
		contactNameError: document.getElementById("contactNameError"),
		contactEmailError: document.getElementById("contactEmailError"),
		contactMessageError: document.getElementById("contactMessageError"),
		contactPrivacyError: document.getElementById("contactPrivacyError"),
	};
	const hasAllElements = Object.values(formElements).every(Boolean);
	return hasAllElements ? formElements : null;
}

/**
 * Registers all contact form listeners and initial state.
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @param {{contactName: boolean, contactEmail: boolean, contactMessage: boolean, contactPrivacy: boolean}} touchedFields
 * @returns {void}
 */
function setupContactFormListeners(formElements, touchedFields) {
	const { contactName, contactEmail, contactMessage, contactPrivacy } = formElements;
	initializeFieldErrors(formElements);
	setupNameFieldListeners(contactName, formElements, touchedFields);
	setupEmailFieldListeners(contactEmail, formElements, touchedFields);
	setupMessageFieldListeners(contactMessage, formElements, touchedFields);
	setupPrivacyFieldListeners(contactPrivacy, formElements, touchedFields);
	setupContactSubmitListener(formElements, touchedFields);
	setupContactStatusMessageListener(formElements);
	setupKeyboardFocusIndicators(formElements);
	updateSubmitState(formElements);
}

/**
 * Registers contact submit handling.
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @param {{contactName: boolean, contactEmail: boolean, contactMessage: boolean, contactPrivacy: boolean}} touchedFields
 * @returns {void}
 */
function setupContactSubmitListener(formElements, touchedFields) {
	formElements.contactSubmitButton.addEventListener("click", async (event) => {
		await handleContactSubmit(event, formElements, touchedFields);
	});
}

/**
 * Handles submit interaction and triggers validation.
 * @param {Event} event
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @param {{contactName: boolean, contactEmail: boolean, contactMessage: boolean, contactPrivacy: boolean}} touchedFields
 * @returns {Promise<void>}
 */
async function handleContactSubmit(event, formElements, touchedFields) {
	event.preventDefault();
	setAllFieldsTouched(touchedFields);
	const isFormValid = updateFormState(formElements, touchedFields);
	if (!isFormValid) {
		focusFirstInvalidContactField(formElements);
		return;
	}
	await processContactSubmitRequest(formElements, touchedFields);
}

/**
 * Sends the contact request and handles UI feedback.
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @param {{contactName: boolean, contactEmail: boolean, contactMessage: boolean, contactPrivacy: boolean}} touchedFields
 * @returns {Promise<void>}
 */
async function processContactSubmitRequest(formElements, touchedFields) {
	setSubmitButtonPendingState(formElements, true);
	hideContactStatusMessage(formElements);
	try {
		await sendContactMessage(formElements);
		resetContactFormState(formElements, touchedFields);
		showContactStatusMessage(formElements, "contact.form.status.success", "success");
	} catch (error) {
		resetContactFormState(formElements, touchedFields);
		showContactStatusMessage(formElements, "contact.form.status.error", "error");
	} finally {
		setSubmitButtonPendingState(formElements, false);
	}
}

/**
 * Builds and sends a contact payload.
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @returns {Promise<object>}
 */
async function sendContactMessage(formElements) {
	const payload = {
		name: formElements.contactName.value,
		email: formElements.contactEmail.value,
		message: formElements.contactMessage.value,
	};
	const response = await sendContactRequest(payload);
	const result = await response.json().catch(() => ({}));
	if (!response.ok || !result.success) {
		throw new Error(result.error || "Sending failed");
	}
	return result;
}

/**
 * Sends the contact request to the backend endpoint.
 * @param {{name: string, email: string, message: string}} payload
 * @returns {Promise<Response>}
 */
async function sendContactRequest(payload) {
	return fetch("./php/sendEmail.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
}

/**
 * Shows translated status feedback for the contact form.
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @param {string} translationKey
 * @param {"success"|"error"} statusType
 * @returns {void}
 */
function showContactStatusMessage(formElements, translationKey, statusType) {
	const statusElement = formElements.contactStatusMessage;
	if (!statusElement) return;
	hideContactStatusMessage(formElements);
	statusElement.textContent = getTranslationText(translationKey);
	statusElement.classList.toggle("is-success", statusType === "success");
	statusElement.classList.toggle("is-error", statusType === "error");
	void statusElement.offsetWidth;
	statusElement.classList.add("is-visible");
}

/**
 * Hides the contact status feedback element.
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @returns {void}
 */
function hideContactStatusMessage(formElements) {
	const statusElement = formElements.contactStatusMessage;
	if (!statusElement) return;
	statusElement.textContent = "";
	statusElement.classList.remove("is-visible", "is-success", "is-error");
}

/**
 * Registers cleanup when toast animation ends.
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @returns {void}
 */
function setupContactStatusMessageListener(formElements) {
	const statusElement = formElements.contactStatusMessage;
	if (!statusElement) return;
	statusElement.addEventListener("animationend", () => {
		hideContactStatusMessage(formElements);
	});
}

/**
 * Applies pending state to submit button.
 * @param {ReturnType<typeof getContactFormElements> extends infer T ? Exclude<T, null> : never} formElements
 * @param {boolean} isPending
 * @returns {void}
 */
function setSubmitButtonPendingState(formElements, isPending) {
	const submitButton = formElements.contactSubmitButton;
	if (isPending) {
		submitButton.disabled = true;
		submitButton.setAttribute("aria-disabled", "true");
		return;
	}
	updateSubmitState(formElements);
}