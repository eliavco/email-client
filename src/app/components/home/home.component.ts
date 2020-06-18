import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
export class HomeComponent implements OnInit {
	loading = false;
	emails: Email[];
	displayEmails: Email[];
	tabs = [
		{ title: 'Inbox', action: this.filterInbox.bind(this), icon: faInbox },
		{ title: 'Archive', action: this.filterArchive.bind(this), icon: faBoxOpen },
		{ title: 'Trash', action: this.filterTrash.bind(this), icon: faTrash },
	];
	icons = { faTrash, faArchive, faTrashRestore, faBoxOpen };
	tabActive = 'success';

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
		this.setTabActive(0);
		this.tabActive = 'success';
		this.displayEmails = this.emails.filter((email) => (!email.archived) && (!email.deleted));
	}

	filterArchive() {
		this.setTabActive(1);
		this.tabActive = 'primary';
		this.displayEmails = this.emails.filter((email) => (email.archived) && (!email.deleted));
	}

	filterTrash() {
		this.setTabActive(2);
		this.tabActive = 'danger';
		this.displayEmails = this.emails.filter((email) => (email.deleted));
	}

	constructor(
		private emailsService: EmailsService,
		private titleService: Title,
		private authenticationService: AuthenticationService,
		private alertsService: AlertsService,
		private socket: Socket) { }

	ngOnInit() {
		this.titleService.setTitle(`${(window as any).bkBaseTitle} | Inbox`);
		this.refreshEmails();
		this.socket.on('refresh_emails', () => { this.refreshEmails(); this.alertsService.addToast('You\'ve got Mail!'); });
	}

	refreshEmails() {
		this.emailsService.getMyEmails().subscribe((emails) => {
			this.emails = (emails as any).data.documents.map(this.parseEmail);
			this.sortEmails();
			this.filterInbox();
		});
	}

	parseEmail(email) {
		email.createdAt = new Date(email.createdAt);
		email.attachments = +email.attachments;
		email.envelope = JSON.parse(email.envelope);
		email.charsets = JSON.parse(email.charsets);
		email.files = JSON.parse(email.files);
		email.files.forEach((file) => {
			const info = JSON.parse(email['attachment-info'])[file.fieldname];
			if (info) {
				if (info['content-id']) { file['content-id'] = info['content-id']; }
				if (info.charset) { file.charset = info.charset; }
			}
		});
		delete email['attachment-info'];
		delete email['content-ids'];
		email.headers = email.headers.split('\n').filter(header => header !== '');
		return email;
	}

	deleteEmail(id: string, subject: string) {
		this.emailsService.deleteEmail(id).subscribe(() => {
			this.refreshEmails();
			this.alertsService.addToast(`'${subject}' deleted`);
		});
	}

	archiveEmail(id: string, subject: string) {
		this.emailsService.archiveEmail(id).subscribe(() => {
			this.refreshEmails();
			this.alertsService.addToast(`'${subject}' archived`);
		});
	}

	unarchiveEmail(id: string, subject: string) {
		this.emailsService.unarchiveEmail(id).subscribe(() => {
			this.refreshEmails();
			this.alertsService.addToast(`'${subject}' unarchived`);
		});
	}

	restoreEmail(id: string, subject: string) {
		this.emailsService.restoreEmail(id).subscribe(() => {
			this.refreshEmails();
			this.alertsService.addToast(`'${subject}' restored`);
		});
	}

}
