import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { first } from 'rxjs/operators';

import { User } from './../../models/user';
import { UserService } from './../../services/user/user.service';
import { AuthenticationService } from './../../services/authentication/authentication.service';

@Component({
	selector: 'bk-home',
	styleUrls: ['./home.component.scss'],
	templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {
	loading = false;
	users: User[];

	constructor(private userService: UserService, private titleService: Title) { }

	ngOnInit() {
		this.titleService.setTitle(`${(window as any).bkBaseTitle} | Home`);
		this.loading = true;
		this.userService.getAll().pipe(first()).subscribe(users => {
			this.loading = false;
			this.users = (users as any).data.documents;
		});
	}
}
