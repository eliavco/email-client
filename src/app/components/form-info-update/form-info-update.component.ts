import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from './../../interfaces/user';
import { UserService } from './../../services/user/user.service';
import { AlertsService } from './../../services/alerts/alerts.service';
import { AuthenticationService } from './../../services/authentication/authentication.service';

@Component({
	selector: 'bk-form-info-update',
	templateUrl: './form-info-update.component.html',
	styleUrls: ['./form-info-update.component.scss']
})
export class FormInfoUpdateComponent implements OnInit {
	@Input() user: User;
	form = new FormGroup({
		name: new FormControl(''),
		email: new FormControl(''),
		photo: new FormControl(''),
	});
	selectorTitle = '';
	selectorTitleMin = '';

	constructor(
		private userService: UserService,
		private authenticationService: AuthenticationService,
		private alertsService: AlertsService
	) { }

	ngOnInit(): void {
		if (localStorage.updated) {
			delete localStorage.updated;
			this.alertsService.addToast(`User ${this.user.name} updated`);
		}
	}

	onFileSelect(event) {
		const file = event.target.files[0];
		this.selectorTitle = file.name;
		this.selectorTitleMin = `${file.name.substring(0, 14).trim()}...`;
		this.form.get('photo').setValue(file);
	}

	removeProfile() {
		this.userService.removeProfile().subscribe(() => {
			localStorage.updated = true;
			this.refreshUser();
		});
	}

	refreshUser() {
		this.authenticationService.refresh().subscribe();
	}

	onSubmit() {
		const formData = new FormData();
		const formVals = this.form.value;
		Object.keys(formVals).forEach(key => {
			if (formVals[key]) { formData.append(key, formVals[key]); }
		});
		this.userService.updateSelf(formData).subscribe(() => {
			localStorage.updated = true;
			this.refreshUser();
		});
	}

}
