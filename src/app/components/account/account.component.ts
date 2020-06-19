import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AuthenticationService } from './../../services/authentication/authentication.service';

@Component({
	selector: 'bk-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

	constructor(private titleService: Title, private authenticationService: AuthenticationService) { }

	ngOnInit(): void {
		this.titleService.setTitle(`${(window as any).bkBaseTitle} | Account`);
	}

	getUser() {
		const user = this.authenticationService.refresh();
		if (user) { user.subscribe(() => { location.reload(); }); }
	}

	get user() { return (this.authenticationService.currentUserValue as any).data.user; }

}
