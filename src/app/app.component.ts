import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

// tslint:disable-next-line: ban-types
declare let gtag: Function;
declare let mgaids: Array<string>;

@Component({
	selector: 'bk-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
	title = 'michalsfirstborn';

	constructor(public router: Router) {
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
	}

	ngOnInit(): void {
		(window as any).bkBaseTitle = 'התינוק של מיכל';
	}

}
