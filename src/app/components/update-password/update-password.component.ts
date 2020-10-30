import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from './../../interfaces/user';
import { UserService } from './../../services/user/user.service';
import { AlertsService } from './../../services/alerts/alerts.service';
import { AuthenticationService } from './../../services/authentication/authentication.service';

@Component({
	selector: 'bk-update-password',
	templateUrl: './update-password.component.html',
	styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
	@Input() user: User;
	form = new FormGroup({
		password: new FormControl(''),
		newPassword: new FormControl(''),
		newPasswordConfirm: new FormControl(''),
	});
	err: string;

	constructor(
		private userService: UserService,
		private authenticationService: AuthenticationService,
		private alertsService: AlertsService) { }

	ngOnInit(): void {
	}

	onSubmit() {
		const data = {
			email: this.user.email,
			oldPassword: this.form.value.password,
			newPassword: this.form.value.newPassword,
			newPasswordConfirm: this.form.value.newPasswordConfirm,
		};
		this.userService.updatePassword(data).subscribe(res => {
			this.authenticationService.logout();
		}, err => {
			this.err = err;
		});
	}

}
