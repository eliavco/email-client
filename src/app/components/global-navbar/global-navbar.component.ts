import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Page } from './../../interfaces/page';

@Component({
	selector: 'bk-global-navbar',
	templateUrl: './global-navbar.component.html',
	styleUrls: ['./global-navbar.component.scss']
})
export class GlobalNavbarComponent implements OnInit {
	pages: Page[] = [
		{ title: 'בית', link: '/' },
		{ title: 'מובילים', link: '/discover' },
		{ title: 'הוסף שם', link: '/new-name' },
	];

	constructor(private router: Router) {
		this.router.events.subscribe(val => { if (val instanceof NavigationEnd) { this.makeActive(); } });
	}

	makeActive(): void {
		const path = window.location.pathname;
		this.pages.forEach(page => {
			if (page.link === path) {
				page.active = true;
			} else {
				page.active = false;
			}
		});
	}

	ngOnInit(): void {
	}

}
