/**
 * Initializes all UI modules on the page.
 * @returns {void}
 */
function init() {
	initBurgerButtonToggle();
	initDialogLinks();
	initArrowViewportAnimations();
	initContactFormValidation();
	const currentLanguage = initLanguageToggle();
	applyTranslations(currentLanguage);
}

/**
 * Sets up viewport-driven animation behavior for section arrows.
 * @returns {void}
 */
function initArrowViewportAnimations() {
	const arrows = document.querySelectorAll(".arrow");
	if (!arrows.length) return;
	if (!("IntersectionObserver" in window)) {
		arrows.forEach((arrow) => arrow.classList.add("is-in-view"));
		return;
	}
	const observer = createArrowViewportObserver();
	arrows.forEach((arrow) => observer.observe(arrow));
}

/**
 * Creates an IntersectionObserver for arrow animations.
 * @returns {IntersectionObserver}
 */
function createArrowViewportObserver() {
	return new IntersectionObserver((entries, currentObserver) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;
			entry.target.classList.add("is-in-view");
			currentObserver.unobserve(entry.target);
		});
	}, {
		threshold: 1,
	});
}

/**
 * Registers click handlers for burger menu buttons.
 * @returns {void}
 */
function initBurgerButtonToggle() {
	const burgerButtons = document.querySelectorAll(".burgermenu__button");
	if (!burgerButtons.length) return;
	burgerButtons.forEach((button) => {
		button.addEventListener("click", () => {
			handleDialog(burgerButtons);
		});
	});
}

/**
 * Toggles dialog open and close state across burger buttons.
 * @param {NodeListOf<Element>} burgerButtons
 * @returns {void}
 */
function handleDialog(burgerButtons) {
	const shouldOpen = !burgerButtons[0].classList.contains("is-open");
	const translationKey = shouldOpen ? "header.closeMenu" : "header.openMenu";
	burgerButtons.forEach((button) => {
		button.classList.toggle("is-open", shouldOpen);
		button.setAttribute("aria-expanded", String(shouldOpen));
		button.setAttribute("aria-label", getTranslationText(translationKey));
	});
	if (shouldOpen) {
		openDialog();
		return;
	}
	closeDialog();
}

/**
 * Registers close behavior for quick links inside the dialog.
 * @returns {void}
 */
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

/**
 * Opens the burger dialog.
 * @returns {void}
 */
function openDialog() {
	const dialog = document.querySelector(".burger-dialog");
	if (!(dialog instanceof HTMLDialogElement)) return;
	dialog.classList.remove("is-closing");
	if (!dialog.open) {
		dialog.showModal();
		document.body.style.overflow = "hidden";
	}
}

/**
 * Closes the burger dialog with exit animation.
 * @returns {void}
 */
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

/**
 * Initializes language radios and returns current language.
 * @returns {string}
 */
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

/**
 * Registers language change listeners.
 * @param {NodeListOf<HTMLInputElement>} languageRadios
 * @returns {void}
 */
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

/**
 * Synchronizes checked state across language radio groups.
 * @param {NodeListOf<HTMLInputElement>} languageRadios
 * @param {string} language
 * @returns {void}
 */
function setLanguageRadiosChecked(languageRadios, language) {
	languageRadios.forEach((radio) => {
		radio.checked = radio.value === language;
	});
}

/**
 * Resolves translation text with language fallback.
 * @param {string} translationKey
 * @returns {string}
 */
function getTranslationText(translationKey) {
	const currentLanguage = document.documentElement.lang || "en";
	return translations?.[currentLanguage]?.[translationKey] || translations?.en?.[translationKey] || "";
}

/**
 * Applies all translation layers for the active language.
 * @param {string} currentLanguage
 * @returns {void}
 */
function applyTranslations(currentLanguage) {
	const languageMap = translations?.[currentLanguage] || translations?.en || {};
	applyTextTranslations(languageMap);
	applyAltTranslations(languageMap);
	applyAriaLabelTranslations(languageMap);
	applyPlaceholderTranslations(languageMap);
	applyDataTextTranslations(languageMap);
}

/**
 * Applies text-content translations.
 * @param {Record<string, string>} languageMap
 * @returns {void}
 */
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

/**
 * Applies alt attribute translations.
 * @param {Record<string, string>} languageMap
 * @returns {void}
 */
function applyAltTranslations(languageMap) {
	document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
		const key = element.getAttribute("data-i18n-alt");
		const value = languageMap[key];
		if (typeof value === "string") {
			element.setAttribute("alt", value);
		}
	});
}

/**
 * Applies aria-label translations.
 * @param {Record<string, string>} languageMap
 * @returns {void}
 */
function applyAriaLabelTranslations(languageMap) {
	document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
		const key = element.getAttribute("data-i18n-aria-label");
		const value = languageMap[key];
		if (typeof value === "string") {
			element.setAttribute("aria-label", value);
		}
	});
}

/**
 * Applies placeholder translations.
 * @param {Record<string, string>} languageMap
 * @returns {void}
 */
function applyPlaceholderTranslations(languageMap) {
	document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
		const key = element.getAttribute("data-i18n-placeholder");
		const value = languageMap[key];
		if (typeof value === "string") {
			element.setAttribute("placeholder", value);
		}
	});
}

/**
 * Applies data-text attribute translations.
 * @param {Record<string, string>} languageMap
 * @returns {void}
 */
function applyDataTextTranslations(languageMap) {
	document.querySelectorAll("[data-i18n-data-text]").forEach((element) => {
		const key = element.getAttribute("data-i18n-data-text");
		const value = languageMap[key];
		if (typeof value === "string") {
			element.setAttribute("data-text", value);
		}
	});
}