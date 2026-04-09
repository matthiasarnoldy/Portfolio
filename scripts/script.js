function init() {
	initBurgerButtonToggle();
	initDialogLinks();
	initContactFormValidation();
	const currentLanguage = initLanguageToggle();
	applyTranslations(currentLanguage);
}

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

function setupNameFieldListeners(contactName, formElements, touchedFields) {
	contactName.addEventListener("input", () => {
		updateFormState(formElements, touchedFields);
	});
	contactName.addEventListener("blur", () => {
		touchedFields.contactName = true;
		updateFormState(formElements, touchedFields);
	});
}

function setupEmailFieldListeners(contactEmail, formElements, touchedFields) {
	contactEmail.addEventListener("input", () => {
		updateFormState(formElements, touchedFields);
	});
	contactEmail.addEventListener("blur", () => {
		touchedFields.contactEmail = true;
		updateFormState(formElements, touchedFields);
	});
}

function setupMessageFieldListeners(contactMessage, formElements, touchedFields) {
	contactMessage.addEventListener("input", () => {
		updateFormState(formElements, touchedFields);
	});
	contactMessage.addEventListener("blur", () => {
		touchedFields.contactMessage = true;
		updateFormState(formElements, touchedFields);
	});
}

function setupPrivacyFieldListeners(contactPrivacy, formElements, touchedFields) {
	contactPrivacy.addEventListener("change", () => {
		touchedFields.contactPrivacy = true;
		updateFormState(formElements, touchedFields);
	});
}

function setupKeyboardFocusIndicators(formElements) {
	const contactInputs = getContactInputs(formElements);
	contactInputs.forEach(input => {
		setupInputFocusIndicators(input);
	});
}

function setupInputFocusIndicators(input) {
	let isMouseActive = false;
	input.addEventListener("mousedown", () => {
		isMouseActive = true;
	});
	input.addEventListener("focus", () => {
		if (!isMouseActive) {
			input.classList.add("is-keyboard-focus");
		}
		isMouseActive = false;
	});
	input.addEventListener("blur", () => {
		input.classList.remove("is-keyboard-focus");
	});
}

function getContactInputs(formElements) {
	return [formElements.contactName, formElements.contactEmail, formElements.contactMessage, formElements.contactPrivacy];
}

function isNameValid(nameValue) {
	if (typeof nameValue !== "string") return false;
	const trimmedName = nameValue.trim();
	if (trimmedName.length < 2) return false;
	const namePattern = /^[a-zA-ZäöüßÄÖÜ\s]+$/;
	return namePattern.test(trimmedName);
}

function isEmailValid(emailValue) {
	if (typeof emailValue !== "string") return false;
	const normalizedEmail = emailValue.trim();
	const emailPattern = /^(?!.*\.\.)(?!\.)(?!.*\.$)[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@[A-Za-z0-9-]+(?:\.[A-Za-z]{2,24}|\.(?:co|com|org|net|gov|edu|ac)\.[A-Za-z]{2})$/i;
	return emailPattern.test(normalizedEmail);
}

function isMessageValid(messageValue) {
	if (typeof messageValue !== "string") return false;
	if (messageValue.length < 10) return false;
	const uniqueCharacters = new Set(messageValue);
	return uniqueCharacters.size >= 5;
}

function isPrivacyValid(isChecked) {
	return isChecked === true;
}

function initializeFieldErrors(formElements) {
	setFieldErrorState(formElements.contactName, formElements.contactNameError, true);
	setFieldErrorState(formElements.contactEmail, formElements.contactEmailError, true);
	setFieldErrorState(formElements.contactMessage, formElements.contactMessageError, true);
	setFieldErrorState(formElements.contactPrivacy, formElements.contactPrivacyError, true);
}

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

function updateSingleFieldError(fieldElement, errorElement, isValid, isTouched) {
	const shouldShowError = isTouched ? isValid : true;
	setFieldErrorState(fieldElement, errorElement, shouldShowError);
}

function setFieldErrorState(fieldElement, errorElement, isValid) {
	fieldElement.setAttribute("aria-invalid", String(!isValid));
	errorElement.style.opacity = isValid ? "0" : "1";
}

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

function updateFormState(formElements, touchedFields) {
	const isFormValid = updateSubmitState(formElements);
	updateFieldErrors(formElements, touchedFields);
	return isFormValid;
}

function setupContactSubmitListener(formElements, touchedFields) {
	formElements.contactSubmitButton.addEventListener("click", async (event) => {
		await handleContactSubmit(event, formElements, touchedFields);
	});
}

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

async function processContactSubmitRequest(formElements, touchedFields) {
	setSubmitButtonPendingState(formElements, true);
	hideContactStatusMessage(formElements);
	try {
		await sendContactMessage(formElements);
		resetContactFormState(formElements, touchedFields);
		showContactStatusMessage(formElements, "contact.form.status.success", "success");
	} catch (error) {
		showContactStatusMessage(formElements, "contact.form.status.error", "error");
	} finally {
		setSubmitButtonPendingState(formElements, false);
	}
}

function setAllFieldsTouched(touchedFields) {
	touchedFields.contactName = true;
	touchedFields.contactEmail = true;
	touchedFields.contactMessage = true;
	touchedFields.contactPrivacy = true;
}

function focusFirstInvalidContactField(formElements) {
	const validationTargets = getContactValidationTargets(formElements);
	const firstInvalidTarget = validationTargets.find((target) => !target.isValid());
	firstInvalidTarget?.field.focus();
}

function getContactValidationTargets(formElements) {
	return [
		{ field: formElements.contactName, isValid: () => isNameFieldValid(formElements) },
		{ field: formElements.contactEmail, isValid: () => isEmailFieldValid(formElements) },
		{ field: formElements.contactMessage, isValid: () => isMessageFieldValid(formElements) },
		{ field: formElements.contactPrivacy, isValid: () => isPrivacyFieldValid(formElements) },
	];
}

function isNameFieldValid(formElements) {
	return isNameValid(formElements.contactName.value);
}

function isEmailFieldValid(formElements) {
	return isEmailValid(formElements.contactEmail.value);
}

function isMessageFieldValid(formElements) {
	return isMessageValid(formElements.contactMessage.value);
}

function isPrivacyFieldValid(formElements) {
	return isPrivacyValid(formElements.contactPrivacy.checked);
}

async function sendContactMessage(formElements) {
	const payload = {
		name: formElements.contactName.value,
		email: formElements.contactEmail.value,
		message: formElements.contactMessage.value,
	};
	const response = await sendContactRequest(payload);
	const result = await response.json().catch(() => ({}));
	if (!response.ok || !result.success) {
		throw new Error(result.error || "Senden fehlgeschlagen");
	}
	return result;
}

async function sendContactRequest(payload) {
	return fetch("./php/sendEmail.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
}

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

function hideContactStatusMessage(formElements) {
	const statusElement = formElements.contactStatusMessage;
	if (!statusElement) return;
	statusElement.textContent = "";
	statusElement.classList.remove("is-visible", "is-success", "is-error");
}

function setupContactStatusMessageListener(formElements) {
	const statusElement = formElements.contactStatusMessage;
	if (!statusElement) return;
	statusElement.addEventListener("animationend", () => {
		hideContactStatusMessage(formElements);
	});
}

function getTranslationText(translationKey) {
	const currentLanguage = document.documentElement.lang || "en";
	return translations?.[currentLanguage]?.[translationKey] || translations?.en?.[translationKey] || "";
}

function setSubmitButtonPendingState(formElements, isPending) {
	const submitButton = formElements.contactSubmitButton;
	if (isPending) {
		submitButton.disabled = true;
		submitButton.setAttribute("aria-disabled", "true");
		return;
	}
	updateSubmitState(formElements);
}

function initBurgerButtonToggle() {
	const burgerButtons = document.querySelectorAll(".burgermenu__button");
	if (!burgerButtons.length) return;
	burgerButtons.forEach((button) => {
		button.addEventListener("click", () => {
			handleDialog(burgerButtons);
		});
	});
}

function handleDialog(burgerButtons) {
	const shouldOpen = !burgerButtons[0].classList.contains("is-open");
	burgerButtons.forEach((button) => {
		button.classList.toggle("is-open", shouldOpen);
	});
	if (shouldOpen) {
		openDialog();
		return;
	}
	closeDialog();
}

function initDialogLinks() {
	const links = document.querySelectorAll(".dialog__quicklink");
	links.forEach((link) => {
		link.addEventListener("click", () => {
			const burgerButtons = document.querySelectorAll(".burgermenu__button");
			burgerButtons.forEach((button) => button.classList.remove("is-open"));
			closeDialog();
		});
	});
}

function openDialog() {
	const dialog = document.querySelector(".burger-dialog");
	if (!(dialog instanceof HTMLDialogElement)) return;
	dialog.classList.remove("is-closing");
	if (!dialog.open) {
		dialog.showModal();
		document.body.style.overflow = "hidden";
	}
}

function closeDialog() {
	const dialog = document.querySelector(".burger-dialog");
	if (!(dialog instanceof HTMLDialogElement)) return;
	if (!dialog.open || dialog.classList.contains("is-closing")) return;
	dialog.classList.add("is-closing");
	window.setTimeout(() => {
		if (!dialog.classList.contains("is-closing")) return;
		dialog.close();
		dialog.classList.remove("is-closing");
		document.body.style.overflow = "";
	}, 560);
}

function initLanguageToggle() {
	const languageRadios = document.querySelectorAll(".language__radio");
	const fallbackLanguage = document.documentElement.lang || "en";
	if (!languageRadios.length) return fallbackLanguage;
	const savedLanguage = localStorage.getItem("language");
	const currentLanguage = savedLanguage || fallbackLanguage;
	document.documentElement.lang = currentLanguage;
	setLanguageRadiosChecked(languageRadios, currentLanguage);
	setupLanguageRadios(languageRadios);
	return currentLanguage;
}

function setupLanguageRadios(languageRadios) {
	languageRadios.forEach((radio) => {
		radio.addEventListener("change", () => {
			document.documentElement.lang = radio.value;
			localStorage.setItem("language", radio.value);
			setLanguageRadiosChecked(languageRadios, radio.value);
			applyTranslations(radio.value);
		});
	});
}

function setLanguageRadiosChecked(languageRadios, language) {
	languageRadios.forEach((radio) => {
		radio.checked = radio.value === language;
	});
}

function applyTranslations(currentLanguage) {
	const languageMap = translations?.[currentLanguage] || translations?.en || {};
	applyTextTranslations(languageMap);
	applyAltTranslations(languageMap);
	applyAriaLabelTranslations(languageMap);
	applyPlaceholderTranslations(languageMap);
	applyDataTextTranslations(languageMap);
}

function applyTextTranslations(languageMap) {
	document.querySelectorAll("[data-i18n]").forEach((element) => {
		const key = element.getAttribute("data-i18n");
		const value = languageMap[key];
		if (element.getAttribute("data-i18n-mode") === "html") {
			element.innerHTML = value;
			return;
		}
		element.textContent = value;
	});
}

function applyAltTranslations(languageMap) {
	document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
		const key = element.getAttribute("data-i18n-alt");
		const value = languageMap[key];
		if (typeof value === "string") {
			element.setAttribute("alt", value);
		}
	});
}

function applyAriaLabelTranslations(languageMap) {
	document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
		const key = element.getAttribute("data-i18n-aria-label");
		const value = languageMap[key];
		if (typeof value === "string") {
			element.setAttribute("aria-label", value);
		}
	});
}

function applyPlaceholderTranslations(languageMap) {
	document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
		const key = element.getAttribute("data-i18n-placeholder");
		const value = languageMap[key];
		if (typeof value === "string") {
			element.setAttribute("placeholder", value);
		}
	});
}

function applyDataTextTranslations(languageMap) {
	document.querySelectorAll("[data-i18n-data-text]").forEach((element) => {
		const key = element.getAttribute("data-i18n-data-text");
		const value = languageMap[key];
		if (typeof value === "string") {
			element.setAttribute("data-text", value);
		}
	});
}