import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';

import { faCoffee } from '@fortawesome/free-solid-svg-icons';

import { GoogleAnalyticsEventsService } from './../../services/GoogleAnalyticsEvents/GoogleAnalyticsEvents.service';
import { ExampleService } from './../../services/example/example.service';
import { AlertsService } from './../../services/alerts/alerts.service';

@Component({
	selector: 'bk-example',
	templateUrl: './example.component.html',
	styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit {
	faCoffee = faCoffee;
	info;

	constructor(
		private googleAnalyticsEventsService: GoogleAnalyticsEventsService,
		private titleService: Title,
		private exampleService: ExampleService,
		private alertsService: AlertsService
	) { }

	ngOnInit() {
		this.titleService.setTitle(`${(window as any).bkBaseTitle} | דוגמא`);
		this.exampleService.getInfo().subscribe((info: any) => {
			this.info = info.status;
		});
	}

	addEvent(eventName: string, eventCategory: string, eventAction: string, eventLabel?: string, eventValue?: number) {
		this.googleAnalyticsEventsService.eventEmmiter(eventName, eventCategory, eventAction, eventLabel, eventValue);
		this.alertsService.addToast('מה ניש');
	}

}
