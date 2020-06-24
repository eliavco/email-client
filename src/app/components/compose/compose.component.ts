import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AlertsService } from './../../services/alerts/alerts.service';
import { EmailsService } from './../../services/emails/emails.service';
import { AuthenticationService } from './../../services/authentication/authentication.service';
import { environment } from './../../../environments/environment';
import { faPaperPlane, faWindowClose, faCalendarAlt, faSmileWink } from '@fortawesome/free-solid-svg-icons';
import Quill from 'quill';

import * as EmojiButton from '@joeattardi/emoji-button';
// import 'quill-emoji';

const shortid = require('shortid');

const styles = `
	@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap');
	.message {
		font-family: 'Lato', sans-serif;
	}
	blockquote {
		background: #f9f9f9;
		border-left: 10px solid #ccc;
		margin: 1.5em 10px;
		padding: 0.5em 10px;
		quotes: "\\201C""\\201D""\\2018""\\2019";
	}
	blockquote:before {
		color: #ccc;
		content: open-quote;
		font-size: 4em;
		line-height: 0.1em;
		margin-right: 0.25em;
		vertical-align: -0.4em;
	}
	blockquote p {
		display: inline;
	}
`;

const toolbarOptions = {
	container: [
		['bold', 'italic', 'underline', 'strike'],        // toggled buttons
		['blockquote', 'link'],

		[{ header: 1 }, { header: 2 }],               // custom button values
		[{ list: 'ordered' }, { list: 'bullet' }],
		[{ script: 'sub' }, { script: 'super' }],      // superscript/subscript
		[{ indent: '-1' }, { indent: '+1' }],          // outdent/indent
		[{ direction: 'rtl' }],                         // text direction

		// [{ size: ['small', false, 'large', 'huge'] }],  // custom dropdown
		[{ header: [1, 2, 3, 4, 5, 6, false] }],

		[{ color: [] }, { background: [] }],          // dropdown with defaults from theme
		[{ font: [] }],
		[{ align: [] }],
		// ['emoji'],

		['clean']                                         // remove formatting button
	],
	// handlers: { emoji() { }}
};

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
		guide: new FormControl(''),
	});
	error = '';
	icons = {
		faPaperPlane,
		faWindowClose,
		faSmileWink,
		faCalendarAlt
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
	files: [{
		file: File,
		field: string,
		name: string,
		calendar: boolean,
		id: number,
		image: string,
		ref: string
	}?] = [];
	calendar = false;
	calendarExists = false;
	ref = '';

	constructor(
		private titleService: Title,
		private alertsService: AlertsService,
		private authenticationService: AuthenticationService,
		private route: ActivatedRoute,
		private emailsService: EmailsService) {
		if (localStorage.sent) {
			this.alertsService.addToast(`Email ${localStorage.sent} sent!`);
			delete localStorage.sent;
		}
	}

	ngOnInit(): void {
		this.titleService.setTitle(`${(window as any).bkBaseTitle} - Compose`);
		this.editorInit();
		this.emojiInit();
		this.associatedEmails = (this.authenticationService.currentUserValue as any).data.user.subscriptions.map(subscription => `${subscription}@${environment.baseMail}`);
		this.route.queryParams
			.subscribe(qparams => {
				if (qparams.to) {
					this.form.get('to').setValue(qparams.to);
				}
			});
	}

	emojiInit() {
		const container = document.querySelector('.ql-toolbar'); const button = document.createElement('div');
		button.innerHTML = '☻'; button.style.display = 'inline-block'; button.id = 'emoji-button'; button.style.fontSize = '3.5rem';
		const spanFormat = document.createElement('span'); spanFormat.classList.add('ql-formats');
		spanFormat.insertAdjacentElement('beforeend', button); container.insertAdjacentElement('beforeend', spanFormat);
		const picker = new EmojiButton();

		picker.on('emoji', emoji => { this.editor.insertText(this.editor.getLength() - 1, emoji); });

		button.addEventListener('click', () => { picker.togglePicker(button as HTMLElement); });
	}

	registerStyle(path) {
		const style = Quill.import(path);
		Quill.register(style, true);
	}

	editorInit() {
		this.registerStyle('attributors/style/align');
		this.registerStyle('attributors/style/background');
		this.registerStyle('attributors/style/color');
		this.registerStyle('attributors/style/direction');
		this.registerStyle('attributors/style/font');
		this.registerStyle('attributors/style/size');

		this.editor = new Quill('#editor', {
			modules: {
				toolbar: toolbarOptions,
				// 'emoji-toolbar': true,
				// 'emoji-textarea': true,
				// 'emoji-shortname': true,
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

	getBiggestAttach() {
		let id = 0;
		this.files.forEach((file) => {
			if (file.id >= id) { id = file.id + 1; }
		});
		return id;
	}

	onFileSelect(event) {
		const file = event.target.files[0];
		this.files.push({
			file,
			name: file.name,
			image: file.type.startsWith('image/'),
			id: this.getBiggestAttach(),
			field: `attachment-${this.getBiggestAttach()}`,
			calendar: this.calendar,
			ref: shortid.generate()
		});
		if (this.calendar) { this.calendarExists = true; this.calendar = false; }
	}

	getEmbedCode(fileRef: string) {
		const el = document.createElement('textarea');
		el.value = `<img src="cid:${fileRef}"/>`;
		el.setAttribute('readonly', '');
		el.style.position = 'absolute';
		el.style.left = '-9999px';
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
		this.alertsService.addToast('Image code copied!');
	}

	removeFile(file) {
		const ind = this.files.indexOf(file);
		if (file.calendar) { this.calendarExists = false; this.calendar = false; }
		this.files.splice(ind, 1);
	}

	parseHeaders(headers) {
		const newHeaders = {};
		headers.split('\n').forEach(header => {
			const keys = header.split(': ');
			newHeaders[keys[0]] = keys[1];
		});
		return JSON.stringify(newHeaders);
	}

	setGuide() {
		const guide = [];
		this.files.forEach(file => {
			guide.push({
				field: file.field,
				ref: file.ref,
				calendar: file.calendar,
			});
		});
		return JSON.stringify(guide);
	}

	formatHtml(html: string) {
		return `<div><style>${styles}</style><div class="message">${html}</div></div>`;
	}

	onSubmit() {
		const html = this.editor.root.innerHTML
			.replace(new RegExp('&lt;img', 'g'), '<img')
			.replace(new RegExp('&gt;', 'g'), '>');
		const formattedHtml = this.formatHtml(html);
		this.form.get('html').setValue(formattedHtml);
		this.form.get('headers').setValue(this.parseHeaders(this.form.value.headers));
		this.form.get('guide').setValue(this.setGuide());
		const formData = new FormData();
		const formVals = this.form.value;
		this.files.forEach(fileData => {
			formData.append(fileData.field, fileData.file);
		});
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
