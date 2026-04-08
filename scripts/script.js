function init() {
	initBurgerButtonToggle();
	initDialogLinks();
	const currentLanguage = initLanguageToggle();
	applyTranslations(currentLanguage);
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
	if (!dialog.open) {
		dialog.showModal();
		document.body.style.overflow = "hidden";
	}
}

function closeDialog() {
	const dialog = document.querySelector(".burger-dialog");
	if (!(dialog instanceof HTMLDialogElement)) return;
	if (dialog.open) {
		dialog.close();
		document.body.style.overflow = "";
	}
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