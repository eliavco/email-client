import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { faBackward, faTrash, faArchive } from '@fortawesome/free-solid-svg-icons';

import { Email } from './../../interfaces/email';
import { EmailsService } from './../../services/emails/emails.service';

@Component({
	selector: 'bk-email',
	templateUrl: './email.component.html',
	styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
	id: string;
	email: Email;
	icons = { faBackward, faTrash, faArchive};

	constructor(private route: ActivatedRoute, private emailsService: EmailsService, private titleService: Title) { }

	ngOnInit(): void {
		this.route.paramMap.subscribe(params => {
			this.id = params.get('emailId');
			this.refreshEmail();
		});
	}

	refreshEmail(): void {
		this.emailsService.getEmail(this.id).subscribe(email => {
			this.email = this.parseEmail((email as any).data.doc);
			this.titleService.setTitle(`${(window as any).bkBaseTitle} | ${this.email.subject}`);
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
