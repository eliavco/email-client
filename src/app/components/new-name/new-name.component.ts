import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { BabiesService } from './../../services/babies/babies.service';
import { AlertsService } from './../../services/alerts/alerts.service';

const validate = require('validate.js');

@Component({
	selector: 'bk-new-name',
	templateUrl: './new-name.component.html',
	styleUrls: ['./new-name.component.scss']
})
export class NewNameComponent implements OnInit {
	result;
	baby = {
		name: '',
		author: '',
		reason: '',
		group: ''
	};

	constructor(
		private titleService: Title,
		private babiesService: BabiesService,
		private alertsService: AlertsService,
		private router: Router,
	) { }

	ngOnInit(): void {
		this.titleService.setTitle(`${(window as any).bkBaseTitle} | הצע שם`);
	}

	createBaby(name, author, reason, group) {
		this.babiesService.create(name, author, reason, group).subscribe((result: any) => {
			this.result = result;
			if (!localStorage.cy) { localStorage.cy = JSON.stringify([]); }
			const mcy = JSON.parse(localStorage.cy);
			mcy.push(this.result.data.id);
			localStorage.cy = JSON.stringify(mcy);
			this.alertCreated();
			this.router.navigate(['/discover']);
		}, (error: any) => {
			this.result = error;
			this.alertCreated();
		});
	}

	alertCreated() {
		if (this.result.status === 'success') {
			this.alertsService.addToast(`השם ${this.result.data.name} הוסף בהצלחה!`);
		} else {
			this.alertsService.addToast('יש בעייה בחיבור שלך או שהשם כבר קיים', true);
		}
	}

	validationAlert(message: string): void {
		this.alertsService.addToast(message, true);
	}

	validated(): boolean {
		const constraints = {
			name: {
				presence: true,
				length: {
					minimum: 2,
					maximum: 12,
					message: 'חייב להיות בין 2  תווים ל12'
				}
			},
			author: {
				presence: true,
				length: {
					minimum: 6,
					maximum: 15,
					message: 'חייב להיות בין 6 תווים ל15'
				}
			},
			reason: {
				presence: true,
				length: {
					minimum: 0,
					maximum: 30,
					message: 'עד 30 תווים'
				}
			},
			group: {
				presence: true,
				inclusion: ['2018', '2019', '2020', 'other'],
			},
		};
		const errors = validate(this.baby, constraints, { format: 'flat' });
		if (typeof errors === 'undefined') { return true; }
		errors.forEach(error => {
			this.validationAlert(error);
		});
		return false;
	}

	onSubmit(): void {
		if (this.validated()) {
			this.createBaby(this.baby.name, this.baby.author, this.baby.reason, this.baby.group);
			this.baby = {
				name: '',
				author: '',
				reason: '',
				group: ''
			};
		}
	}

}
