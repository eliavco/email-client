import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from './../../../environments/environment';
import { Page } from './../../interfaces/page';
import { User } from './../../interfaces/user';
import { AuthenticationService } from './../../services/authentication/authentication.service';
import { UserService } from './../../services/user/user.service';

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
	user: User;
	accountActive = false;

	constructor(private router: Router, private userService: UserService, private authenticationService: AuthenticationService) {
		this.router.events.subscribe(val => {
			if (val instanceof NavigationEnd) {
				this.makeActive();
				if (this.authenticationService.currentUserValue) {
					this.login = true; this.refreshUser();
				}
				else { this.login = false; this.user = undefined; }
			}
		});
	}

	makeActive(): void {
		const path = window.location.pathname;
		this.pages.forEach(page => {
			page.active = page.link === path;
		});
		this.accountActive = (path === '/account');
	}

	ngOnInit(): void {
	}

	logout() {
		this.authenticationService.logout();
		this.router.navigate(['/login']);
	}

	refreshUser() {
		if ((this.authenticationService.currentUserValue as any).data.user) {
			this.user = (this.authenticationService.currentUserValue as any).data.user;
			this.user.photo = this.user.photo === 'default' ? `${environment.apiUrl}/img/users/default.jpg` : this.user.photo;
		}
	}

}
