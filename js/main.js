/* JavaScript vanilla: alternar tema, menú accesible y caso de estudio. */
(() => {
	'use strict';
	const root = document.documentElement;
	const themeButton = document.querySelector('.theme-toggle');
	const themeLabel = themeButton?.querySelector('.theme-label');
	const themeIcon = themeButton?.querySelector('svg');
	const menuButton = document.querySelector('.menu-toggle');
	const menu = document.getElementById('mobile-nav');
	const header = document.querySelector('.site-header');
	const dialog = document.getElementById('case-mesa');
	let menuReturnFocus = null;

	// Preferencia del sistema, salvo que el visitante ya haya elegido manualmente.
	let savedTheme = null;
	try { savedTheme = localStorage.getItem('portfolio-theme'); } catch (_) { /* private mode */ }
	const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
	const initial = savedTheme === 'dark' || savedTheme === 'light'
		? savedTheme : (userPrefersDark.matches ? 'dark' : 'light');

	function applyTheme(theme, save = false) {
		const dark = theme === 'dark';
		root.dataset.theme = dark ? 'dark' : 'light';
		themeButton?.setAttribute('aria-label', dark ? 'Activar modo claro' : 'Activar modo oscuro');
		themeButton?.setAttribute('aria-pressed', String(dark));
		if (themeLabel) themeLabel.textContent = dark ? 'Modo claro' : 'Modo oscuro';
		if (themeIcon) themeIcon.innerHTML = dark
			? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>'
			: '<path d="M20.2 15.4A8.7 8.7 0 0 1 8.6 3.8 8.7 8.7 0 1 0 20.2 15.4Z"/>';
		document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#141820' : '#FAF9F6');
		if (save) { try { localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light'); } catch (_) {} }
	}
	applyTheme(initial);
	themeButton?.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));
	userPrefersDark.addEventListener?.('change', (event) => {
		let selected = null; try { selected = localStorage.getItem('portfolio-theme'); } catch (_) {}
		if (!selected) applyTheme(event.matches ? 'dark' : 'light');
	});

	function setMenu(open, restoreFocus = false) {
		if (!menu || !menuButton) return;
		menu.hidden = !open;
		menuButton.setAttribute('aria-expanded', String(open));
		menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
		header?.classList.toggle('menu-open', open);
		if (open) {
			menuReturnFocus = document.activeElement;
			menu.querySelector('a')?.focus();
		} else if (restoreFocus) (menuReturnFocus instanceof HTMLElement ? menuReturnFocus : menuButton).focus();
	}
	menuButton?.addEventListener('click', () => setMenu(menu.hidden));
	menu?.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
	document.addEventListener('keydown', event => {
		if (event.key === 'Escape' && menu && !menu.hidden) setMenu(false, true);
	});
	document.addEventListener('click', event => {
		if (menu && !menu.hidden && !header?.contains(event.target)) setMenu(false);
	});
	document.querySelectorAll('.desktop-nav a,.mobile-nav a').forEach(link => {
		link.addEventListener('click', () => setMenu(false));
	});
	window.addEventListener('resize', () => {
		if (window.innerWidth >= 1060 && menu && !menu.hidden) setMenu(false);
	});
	header?.classList.toggle('is-scrolled', window.scrollY > 12);
	window.addEventListener('scroll', () => header?.classList.toggle('is-scrolled', window.scrollY > 12), { passive: true });

	let caseReturnFocus = null;
	document.querySelector('[data-open-case="mesa"]')?.addEventListener('click', event => {
		caseReturnFocus = event.currentTarget;
		if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
	});
	dialog?.querySelector('.case-close')?.addEventListener('click', () => dialog.close());
	dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
	dialog?.addEventListener('close', () => caseReturnFocus?.focus());

	const year = document.getElementById('year');
	if (year) year.textContent = String(new Date().getFullYear());
})();
