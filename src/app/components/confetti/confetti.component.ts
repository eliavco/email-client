import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'bk-confetti',
	templateUrl: './confetti.component.html',
	styleUrls: ['./confetti.component.scss']
})
export class ConfettiComponent implements OnInit {
	confetti = [];

	constructor() {
		for (let i = 149; i > -1; i--) {
			this.confetti.push(`confetti-${i}`);
		}
	}

	ngOnInit(): void {
	}

}
