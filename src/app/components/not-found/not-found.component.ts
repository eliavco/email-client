import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'bk-not-found',
	templateUrl: './not-found.component.html',
	styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
	private base = '/';
	styleBgPurple;
	styleBgStars;

	constructor(private titleService: Title) {
		if (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1) { this.base = './'; }
		this.styleBgPurple = `background: url("${this.base}assets/404/bg_purple.png");`;
		this.styleBgStars = `background: url("${this.base}assets/404/overlay_stars.svg");`;
	}

	ngOnInit(): void {
		this.titleService.setTitle(`${(window as any).bkBaseTitle} | Not Found`);
	}

}
