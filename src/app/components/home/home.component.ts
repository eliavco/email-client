import { Component, OnInit, OnChanges } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

import { Email } from './../../interfaces/email';
import { EmailsService } from './../../services/emails/emails.service';
import { AuthenticationService } from './../../services/authentication/authentication.service';
import { AlertsService } from './../../services/alerts/alerts.service';

import { faInbox, faBoxOpen, faTrash, faTrashRestore, faArchive } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'bk-home',
	styleUrls: ['./home.component.scss'],
	templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit, OnChanges {
	limit = 10;

	emails: Email[];
	displayEmails: Email[];
	tabs = [
		{ title: 'Inbox', action: this.filterInbox.bind(this), icon: faInbox },
		{ title: 'Archive', action: this.filterArchive.bind(this), icon: faBoxOpen },
		{ title: 'Trash', action: this.filterTrash.bind(this), icon: faTrash },
	];
	icons = { faTrash, faArchive, faTrashRestore, faBoxOpen };
	tabActive = 'success';
	page = 1;

	sortEmails() {
		this.emails.sort((a, b) => -(b.createdAt.getTime() - a.createdAt.getTime()));
		this.emails.reverse();
	}

	setTabActive(ind: number) {
		this.tabs.forEach((tab, index) => {
			if (index === ind) { (tab as any).active = true; }
			else { (tab as any).active = false; }

			if (tab.title === 'Inbox') {
				(tab as any).unread = this.emails.filter(email => (!email.read) && (!email.deleted) && (!email.archived)).length;
			} else if (tab.title === 'Archive') {
				(tab as any).unread = this.emails.filter(email => (!email.read) && (!email.deleted) && (email.archived)).length;
			} else {
				(tab as any).unread = this.emails.filter(email => (!email.read) && (email.deleted)).length;
			}
		});
	}

	filterInbox() {
		window.localStorage.active = 0;
		this.tabActive = 'success';
		this.refreshEmails((() => {
			this.setTabActive(0);
			if (+window.localStorage.active) { this.setTabActive(+window.localStorage.active); }
			this.displayEmails = this.emails.filter((email) => (!email.archived) && (!email.deleted));
		}).bind(this), false, false);
	}

	filterArchive() {
		window.localStorage.active = 1;
		this.tabActive = 'primary';
		this.refreshEmails((() => {
			this.setTabActive(1);
			if (+window.localStorage.active) { this.setTabActive(+window.localStorage.active); }
			this.displayEmails = this.emails.filter((email) => (email.archived) && (!email.deleted));
		}).bind(this), false, true);
	}

	filterTrash() {
		window.localStorage.active = 2;
		this.tabActive = 'danger';
		this.refreshEmails((() => {
			this.setTabActive(2);
			if (+window.localStorage.active) { this.setTabActive(+window.localStorage.active); }
			this.displayEmails = this.emails.filter((email) => email.deleted);
		}).bind(this), true);
	}

	constructor(
		private emailsService: EmailsService,
		private titleService: Title,
		private router: Router,
		private route: ActivatedRoute,
		private authenticationService: AuthenticationService,
		private alertsService: AlertsService,
		private socket: Socket) { }

	ngOnInit() {
		this.route.queryParams
			.subscribe(params => {
				if (params.page > 0) {
					this.page = params.page;
				}
				this.titleService.setTitle(`${(window as any).bkBaseTitle} | Inbox`);
				+window.localStorage.active ? this.tabs[+window.localStorage.active].action() : this.filterInbox();
				const toUser = (this.authenticationService.currentUserValue as any).data.user.subscriptions;
				this.socket.on('refresh_emails', (change: [string]) => {
					let refresh = false;
					toUser.forEach(user => {
						if (change.indexOf(user) > -1) {
							refresh = true;
						}
					});
					if (refresh) {
						this.filterInbox();
						this.alertsService.addToast('You\'ve got Mail!');
					}
				});
			});
	}

	ngOnChanges(): void {
		if (+window.localStorage.active) { this.setTabActive(+window.localStorage.active); }
	}

	refreshEmails(cb?, deleted?: boolean, archived?: boolean) {
		this.emailsService.getMyEmails(true, this.limit, this.page, deleted, archived).subscribe((emails) => {
			this.emails = (emails as any).data.documents.map(this.parseEmail);
			if (this.emails.length === 0 && this.page > 1) {
				this.router.navigate(['/'], { queryParams: { page: this.page - 1 } });
				this.alertsService.addToast('No More Mails for you over there!');
			}
			this.sortEmails();
			cb();
		});
	}

	parseEmail(email) {
		email.createdAt = new Date(email.createdAt);
		email.attachments = +email.attachments;
		email.envelope = JSON.parse(email.envelope);
		return email;
	}

	deleteEmail(id: string, subject: string) {
		this.emailsService.deleteEmail(id).subscribe(() => {
			this.alertsService.addToast(`'${subject}' deleted`);
		});
	}

	archiveEmail(id: string, subject: string) {
		this.emailsService.archiveEmail(id).subscribe(() => {
			this.alertsService.addToast(`'${subject}' archived`);
		});
	}

	unarchiveEmail(id: string, subject: string) {
		this.emailsService.unarchiveEmail(id).subscribe(() => {
			this.alertsService.addToast(`'${subject}' unarchived`);
		});
	}

	restoreEmail(id: string, subject: string) {
		this.emailsService.restoreEmail(id).subscribe(() => {
			this.alertsService.addToast(`'${subject}' restored`);
		});
	}

	formatDate(date: Date): string {
		return date.toLocaleString();
	}

	shorten(text: string, trim: number): string {
		return text.length > trim ? `${text.substring(0, trim).trim()}...` : text;
	}

}
