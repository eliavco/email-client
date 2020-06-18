import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Page } from './../../interfaces/page';
import { AuthenticationService } from './../../services/authentication/authentication.service';

@Component({
	selector: 'bk-global-navbar',
	templateUrl: './global-navbar.component.html',
	styleUrls: ['./global-navbar.component.scss']
})
export class GlobalNavbarComponent implements OnInit {
	pages: Page[] = [
		{ title: 'Inbox', link: '/' },
		{ title: 'Compose', link: '/compose' },
	];
	login = false;

	constructor(private router: Router, private authenticationService: AuthenticationService) {
		this.router.events.subscribe(val => {
			if (val instanceof NavigationEnd) {
				this.makeActive();
				if (this.authenticationService.currentUserValue) { this.login = true; } else { this.login = false; }
			}
		});
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

	logout() {
		this.authenticationService.logout();
		this.router.navigate(['/login']);
	}

}
