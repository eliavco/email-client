import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AlertsService } from './../../services/alerts/alerts.service';
import { EmailsService } from './../../services/emails/emails.service';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
const Quill = require('quill');

@Component({
	selector: 'bk-compose',
	templateUrl: './compose.component.html',
	styleUrls: ['./compose.component.scss']
})
export class ComposeComponent implements OnInit {
	form = new FormGroup({
		from: new FormControl(''),
		to: new FormControl(''),
		name: new FormControl(''),
		subject: new FormControl(''),
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
			comment: 'separate addresses with a comma', id: 'compose-to', type: 'text', multi: false, control: 'to', display: true
		},
		{ title: 'Full Name', id: 'compose-name', type: 'text', multi: false, control: 'name', display: true },
		{ title: 'Subject', id: 'compose-subject', type: 'text', multi: false, control: 'subject', display: true },
		{ title: 'Copies (cc)', id: 'compose-cc', type: 'text', multi: false, control: 'cc', display: true },
		{ title: 'Blind Copies (bcc)', id: 'compose-bcc', type: 'text', multi: false, control: 'bcc', display: true },
		{ title: 'Headers', id: 'compose-headers', type: 'text', multi: true, control: 'headers', display: true },
	];
	editor;

	constructor(
		private titleService: Title,
		private alertsService: AlertsService,
		private emailsService: EmailsService) {
		if (localStorage.sent) {
			delete localStorage.sent;
			this.alertsService.addToast('Email sent!');
		}
	}

	ngOnInit(): void {
		this.titleService.setTitle(`${(window as any).bkBaseTitle} | Compose`);
		this.editorInit();
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
		setTimeout(() => console.log(this.editor.root.innerHTML), 15000);
	}

	onSubmit() {
		this.form.get('html').setValue(this.editor.root.innerHTML);
		const formData = new FormData();
		const formVals = this.form.value;
		Object.keys(formVals).forEach(key => {
			if (formVals[key]) { formData.append(key, formVals[key]); }
		});
		this.emailsService.sendEmail(formData).subscribe(() => {
			localStorage.sent = true;
			location.reload();
		}, err => {
			this.error = err;
		});
	}

}
