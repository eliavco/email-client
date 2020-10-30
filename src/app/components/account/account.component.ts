import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { User } from './../../models/user';

import { AuthenticationService } from './../../services/authentication/authentication.service';
import { UserService } from './../../services/user/user.service';

@Component({
	selector: 'bk-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
	user: User;

	constructor(
		private titleService: Title,
		private userService: UserService,
		private router: Router,
		private authenticationService: AuthenticationService) { }

	ngOnInit(): void {
		this.titleService.setTitle(`${(window as any).bkBaseTitle} - Account`);
		this.refreshUser();
	}

	deleteAccount() {
		this.userService.deleteSelf().subscribe(() => {
			this.authenticationService.logout();
		});
	}

	refreshUser() {
		this.authenticationService.currentUser.subscribe(data => {
			this.user = (data as any);
		});
	}

}
