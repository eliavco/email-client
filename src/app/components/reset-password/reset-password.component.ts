import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from './../../services/authentication/authentication.service';
import { UserService } from './../../services/user/user.service';

@Component({
	selector: 'bk-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
	resetForm: FormGroup;
	loading = false;
	submitted = false;
	error = '';
	returnUrl: string;
	token: string;


	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService,
		private userService: UserService) {
		// redirect to home if already logged in
		if (this.authenticationService.currentUserValue) {
			this.router.navigate(['/']);
		}
	}

	ngOnInit(): void {
		this.resetForm = this.formBuilder.group({
			password: ['', Validators.required],
			passwordConfirm: ['', Validators.required],
		});
		// get return url from route parameters or default to '/'
		// tslint:disable-next-line: no-string-literal
		this.returnUrl = '/';
		this.route.paramMap.subscribe(params => {
			this.token = params.get('token');
		});
	}

	get f() { return this.resetForm.controls; }

	onSubmit() {
		this.loading = true;
		this.authenticationService.reset(this.token, this.f.password.value, this.f.passwordConfirm.value)
			.pipe(first())
			.subscribe(() => {
				this.router.navigate([this.returnUrl]);
			}, err => {
				this.error = err;
				this.loading = false;
			});
	}

}
