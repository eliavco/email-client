import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { faCoffee } from '@fortawesome/free-solid-svg-icons';

import { GoogleAnalyticsEventsService } from './../../services/GoogleAnalyticsEvents/GoogleAnalyticsEvents.service';
import { BabiesService } from './../../services/babies/babies.service';
import { AlertsService } from './../../services/alerts/alerts.service';

@Component({
	selector: 'bk-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	faCoffee = faCoffee;
	info;

	constructor(
		private googleAnalyticsEventsService: GoogleAnalyticsEventsService,
		private titleService: Title,
		private babiesService: BabiesService,
		private alertsService: AlertsService
	) { }

	ngOnInit() {
		// this.titleService.setTitle(`${(window as any).bkBaseTitle} | בית`);
		// this.babiesService.getInfoRating().subscribe((info: any) => {
		// 	this.info = JSON.stringify(info);
			// this.babiesService.increaseRating(JSON.parse(this.info).documents[0].id, -1).subscribe();
			// this.babiesService.create('jaajkh', 'akd', 'as', '2020').subscribe((result: any) => {
			// 	console.log(result);
			// });
		// });
	}

	addEvent(eventName: string, eventCategory: string, eventAction: string, eventLabel?: string, eventValue?: number) {
		// this.googleAnalyticsEventsService.eventEmmiter(eventName, eventCategory, eventAction, eventLabel, eventValue);
		// this.alertsService.addToast('מה ניש');
	}

}
