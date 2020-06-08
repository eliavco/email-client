import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { BabiesService } from './../../services/babies/babies.service';
import { AlertsService } from './../../services/alerts/alerts.service';

import { faThumbsUp, faThumbsDown, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'bk-discover',
	templateUrl: './discover.component.html',
	styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {
	info;
	faThumbsUp = faThumbsUp;
	faThumbsDown = faThumbsDown;
	faTrashAlt = faTrashAlt;

	constructor(
		private titleService: Title,
		private alertsService: AlertsService,
		private babiesService: BabiesService,
	) { }

	ngOnInit(): void {
		this.titleService.setTitle(`${(window as any).bkBaseTitle} | טבלת מובילים`);
		this.babiesService.getInfoRating().subscribe((info: any) => {
			this.info = info.documents;
		});
		this.launchTimer();
	}

	alertVoted() {
		if (!localStorage.vL) { localStorage.vL = 4; localStorage.ul = Date.now(); }
		else if (+localStorage.vL <= 0) {}
		else { localStorage.vL = +localStorage.vL - 1; }
		this.alertsService.addToast(`הצבעתך התקבלה!`, false, 5);
	}

	alertUnvoted() {
		if (!localStorage.vL) { localStorage.vL = 4; localStorage.ul = Date.now(); }
		else { localStorage.vL = +localStorage.vL + 1; }
		this.alertsService.addToast(`הצבעתך בוטלה!`, false, 5);
		// this.alertsService.addToast(`הצבעתך בוטלה! נותרו ${localStorage.vL} הצבעות`, false, 5);
	}

	alertVotedComplete() {
		this.alertsService.addToast('סורי, נגמרו לך ההצבעות להיום', true, 5);
	}

	vote(id) {
		// if (+localStorage.vL > 0 || !localStorage.vL) {
			this.babiesService.increaseRating(id).subscribe((val: any) => {
				if (!localStorage.vv) { localStorage.vv = JSON.stringify([]); }
				const mvv = JSON.parse(localStorage.vv);
				mvv.push(id);
				localStorage.vv = JSON.stringify(mvv);
				this.alertVoted();
				this.babiesService.getInfoRating().subscribe((info: any) => {
					this.info = info.documents;
				});
			});
		// } else {
			// this.alertVotedComplete();
		// }
	}

	unvote(id) {
		if (+localStorage.vL >= 0 || !localStorage.vL) {
			this.babiesService.increaseRating(id, -1).subscribe((val: any) => {
				if (!localStorage.vv) { localStorage.vv = JSON.stringify([]); }
				const mvv = JSON.parse(localStorage.vv);
				mvv.splice(mvv.indexOf(id));
				localStorage.vv = JSON.stringify(mvv);
				this.alertUnvoted();
				this.babiesService.getInfoRating().subscribe((info: any) => {
					this.info = info.documents;
				});
			});
		}
	}

	checkNotSelf(id) {
		if (!localStorage.cy) { localStorage.cy = JSON.stringify([]); }
		const mcy = JSON.parse(localStorage.cy);
		return (!mcy.includes(id));
	}

	checkNotVoted(id) {
		if (!localStorage.vv) { localStorage.vv = JSON.stringify([]); }
		const mvv = JSON.parse(localStorage.vv);
		return (!mvv.includes(id));
	}

	delete(id) {
		this.babiesService.delete(id).subscribe(() => {
			if (!localStorage.cy) { localStorage.cy = JSON.stringify([]); }
			const mcy = JSON.parse(localStorage.cy);
			mcy.splice(mcy.indexOf(id));
			localStorage.cy = JSON.stringify(mcy);
			this.alertsService.addToast('נמחק');
			this.babiesService.getInfoRating().subscribe((info: any) => {
				this.info = info.documents;
			});
		});
	}

	launchTimer() {
		// Set the date we're counting down to
		const countDownDate = new Date('Jun 12, 2020 10:00:00').getTime();

		// Update the count down every 1 second
		const x = setInterval(() => {

			// Get today's date and time
			const now = new Date().getTime();

			// Find the distance between now and the count down date
			const distance = countDownDate - now;

			// Time calculations for days, hours, minutes and seconds
			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((distance % (1000 * 60)) / 1000);

			// Display the result in the element with id="demo"
			document.getElementById('timer').innerHTML = `נותרו ${days} ימים, ${hours} שעות, ${minutes} דקות, ${seconds} שניות.`;

			// If the count down is finished, write some text
			if (distance < 0) {
				clearInterval(x);
				document.getElementById('timer').innerHTML = 'התחרות נגמרה';
			}
		}, 1000);
	}

}
