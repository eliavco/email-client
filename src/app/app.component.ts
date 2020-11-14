import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';

import { AuthenticationService } from './services/authentication/authentication.service';
import { User } from './models/user';
import { environment } from 'src/environments/environment';

// tslint:disable-next-line: ban-types
declare let gtag: Function;
declare let mgaids: Array<string>;

@Component({
	selector: 'bk-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
	title = 'Email';
	currentUser: User;

	constructor(
		public router: Router,
		private authenticationService: AuthenticationService,
		private http: HttpClient,
		private updates: SwUpdate
	) {
		this.http.get(environment.apiUrl).subscribe();
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				mgaids.forEach(mgaid => {
					gtag('config', mgaid,
						{
							page_path: event.urlAfterRedirects
						}
					);
				});
			}
		});
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
		this.updates.available.subscribe(event => {
			this.updates.activateUpdate().then(() => document.location.reload());
		});
	}

	ngOnInit(): void {
		(window as any).bkBaseTitle = 'Email';
	}

}
