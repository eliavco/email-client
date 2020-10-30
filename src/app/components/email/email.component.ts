import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { faBackward, faTrash, faArchive, faCaretRight } from '@fortawesome/free-solid-svg-icons';

import { Email } from './../../interfaces/email';
import { EmailsService } from './../../services/emails/emails.service';
import { AuthenticationService } from './../../services/authentication/authentication.service';
import { User } from './../../models/user';

@Component({
	selector: 'bk-email',
	templateUrl: './email.component.html',
	styleUrls: ['./email.component.scss'],
	// encapsulation: ViewEncapsulation.None,
})
export class EmailComponent implements OnInit {
	id: string;
	email: Email;
	icons = { faBackward, faTrash, faArchive, faCaretRight };
	fromPage = 1;
	ok: boolean;
	user: User;

	constructor(
		private route: ActivatedRoute,
		private emailsService: EmailsService,
		private authenticationService: AuthenticationService,
		private titleService: Title) { }

	ngOnInit(): void {
		this.route.paramMap.subscribe(params => {
			this.id = params.get('emailId');
			this.authenticationService.currentUser.subscribe(user => {
				this.user = user;
				this.refreshEmail();
			});
			this.route.queryParams
				.subscribe(qparams => {
					if (qparams.fromPage > 0) {
						this.fromPage = qparams.fromPage;
					}
				});
			});
		}

	refreshEmail(): void {
		this.emailsService.getEmail(this.id).subscribe(email => {
			const subscriptions = this.user.subscriptions;
			const parsedEmail = this.parseEmail((email as any).data.doc);
			subscriptions.forEach(user => {
				if (parsedEmail.toUser.indexOf(user) > -1) {
					this.ok = true;
				}
			});
			if (!this.ok) { this.ok = false; }
			this.email = parsedEmail;
			this.titleService.setTitle(`${(window as any).bkBaseTitle} - ${this.email.subject}`);
			if (!this.email.read) { this.emailsService.makeReadEmail(this.id).subscribe(); }
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

	formatDate(date: Date): string {
		return date.toLocaleString();
	}

}
