import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AuthenticationService } from './../../services/authentication/authentication.service';
import { UserService } from './../../services/user/user.service';

@Component({
	selector: 'bk-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

	constructor(
		private titleService: Title,
		private userService: UserService,
		private router: Router,
		private authenticationService: AuthenticationService) { }

	ngOnInit(): void {
		this.titleService.setTitle(`${(window as any).bkBaseTitle} | Account`);
	}

	getUser() {
		const user = this.authenticationService.refresh();
		if (user) { user.subscribe(() => { location.reload(); }); }
	}

	deleteAccount() {
		this.userService.deleteSelf().subscribe(() => {
			this.router.navigate(['/login']);
			this.authenticationService.logout();
		});
	}

	get user() { return (this.authenticationService.currentUserValue as any).data.user; }

}
