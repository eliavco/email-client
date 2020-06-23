import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AlertsService } from './../../services/alerts/alerts.service';
import { EmailsService } from './../../services/emails/emails.service';
import { AuthenticationService } from './../../services/authentication/authentication.service';
import { environment } from './../../../environments/environment';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
const Quill = require('quill');

@Component({
	selector: 'bk-compose',
	templateUrl: './compose.component.html',
	styleUrls: ['./compose.component.scss']
})
export class ComposeComponent implements OnInit {
	form = new FormGroup({
		from: new FormControl('', [Validators.required]),
		to: new FormControl('', [Validators.required]),
		name: new FormControl(localStorage.name, [Validators.required]),
		subject: new FormControl('', [Validators.required]),
		html: new FormControl(''),
		cc: new FormControl(''),
		bcc: new FormControl(''),
		headers: new FormControl(''),
	});
	error = '';
	icons = {
		faPaperPlane,
	};
	manualHeaders = false;
	fields = [
		{
			title: 'To Address',
			comment: 'separate addresses with a comma', id: 'compose-to', type: 'text', multi: false, control: 'to', display: true, required: true,
		},
		{ title: 'Full Name', id: 'compose-name', type: 'text', multi: false, control: 'name', display: true, required: true, },
		{ title: 'Subject', id: 'compose-subject', type: 'text', multi: false, control: 'subject', display: true, required: true, },
		{ title: 'Copies (cc)', id: 'compose-cc', type: 'text', multi: false, control: 'cc', display: true, },
		{ title: 'Blind Copies (bcc)', id: 'compose-bcc', type: 'text', multi: false, control: 'bcc', display: true, },
		{
			title: 'Headers', comment: 'Your-Custom-Key: Your Value<br/>Another-Custom-Key: Another Value',
			id: 'compose-headers', type: 'text', multi: true, control: 'headers', display: true, upon: 'manualHeaders'
		},
	];
	editor;
	associatedEmails;

	constructor(
		private titleService: Title,
		private alertsService: AlertsService,
		private authenticationService: AuthenticationService,
		private emailsService: EmailsService) {
		if (localStorage.sent) {
			this.alertsService.addToast(`Email ${localStorage.sent} sent!`);
			delete localStorage.sent;
		}
	}

	ngOnInit(): void {
		this.titleService.setTitle(`${(window as any).bkBaseTitle} - Compose`);
		this.editorInit();
		this.associatedEmails = (this.authenticationService.currentUserValue as any).data.user.subscriptions.map(subscription => `${subscription}@${environment.baseMail}`);
	}

	editorInit() {
		const ColorClass = Quill.import('attributors/class/color');
		const SizeStyle = Quill.import('attributors/style/size');
		Quill.register(ColorClass, true);
		Quill.register(SizeStyle, true);
		this.editor = new Quill('#editor', {
			modules: {
				toolbar: ['bold', 'italic', 'underline', 'strike', ]
			},
			placeholder: 'Compose your e-mail...',
			theme: 'snow',
			// formats: ['color'],
		});
		this.editor.getModule('toolbar').addHandler('color', (value) => {

			// if the user clicked the custom-color option, show a prompt window to get the color
			if (value === 'custom-color') {
				value = prompt('Enter Hex/RGB/RGBA');
			}

			this.editor.format('color', value);
		});
	}

	parseHeaders(headers) {
		const newHeaders = {};
		headers.split('\n').forEach(header => {
			const keys = header.split(': ');
			newHeaders[keys[0]] = keys[1];
		});
		return JSON.stringify(newHeaders);
	}

	onSubmit() {
		this.form.get('html').setValue(this.editor.root.innerHTML);
		this.form.get('headers').setValue(this.parseHeaders(this.form.value.headers));
		const formData = new FormData();
		const formVals = this.form.value;
		Object.keys(formVals).forEach(key => {
			if (formVals[key]) { formData.append(key, formVals[key]); }
		});
		this.emailsService.sendEmail(formData).subscribe(() => {
			localStorage.sent = formVals.subject;
			localStorage.name = formVals.name;
			location.reload();
		}, err => {
			this.error = err;
		});
	}

}
