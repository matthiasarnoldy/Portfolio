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
	updateSubmitState(formElements);
	updateFieldErrors(formElements, touchedFields);
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