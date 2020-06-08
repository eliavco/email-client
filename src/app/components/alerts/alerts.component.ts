import { Component, OnInit } from '@angular/core';

import * as timeago from 'timeago.js';

import { AlertsService } from './../../services/alerts/alerts.service';

@Component({
	selector: 'bk-alerts',
	templateUrl: './alerts.component.html',
	styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
	constructor(public alertsService: AlertsService) { }

	ngOnInit(): void {}

	formatDate(date: Date): string {
		const formattedDate: string = timeago.format(date);
		return formattedDate;
	}

}
