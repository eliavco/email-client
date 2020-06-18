import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Socket } from 'ngx-socket-io';

import { Email } from './../../interfaces/email';
import { EmailsService } from './../../services/emails/emails.service';
import { AuthenticationService } from './../../services/authentication/authentication.service';

@Component({
	selector: 'bk-home',
	styleUrls: ['./home.component.scss'],
	templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {
	loading = false;
	emails: Email[];

	sortEmails() {
		this.emails.sort((a, b) => -(b.createdAt.getTime() - a.createdAt.getTime()));
		this.emails.reverse();
	}

	constructor(
		private emailsService: EmailsService,
		private titleService: Title,
		private authenticationService: AuthenticationService,
		private socket: Socket) { }

	ngOnInit() {
		this.titleService.setTitle(`${(window as any).bkBaseTitle} | Inbox`);
		this.refreshEmails();
		this.socket.on('refresh_emails', () => { this.refreshEmails(); });
	}

	refreshEmails() {
		this.emailsService.getMyEmails().subscribe((emails) => {
			this.emails = (emails as any).data.documents.map(this.parseEmail);
			setTimeout(() => { this.sortEmails(); }, 2);
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

}
