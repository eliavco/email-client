import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from './../../services/authentication/authentication.service';

@Component({
	selector: 'bk-login',
	styleUrls: ['./login.component.scss'],
	templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	loginFormNew: FormGroup;
	loading = false;
	submitted = false;
	returnUrl: string;
	error = '';
	newUser = false;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService
	) {
		// redirect to home if already logged in
		if (this.authenticationService.currentUserValue) {
			this.router.navigate(['/']);
		}
	}

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			email: ['', Validators.required],
			password: ['', Validators.required]
		});
		this.loginFormNew = this.formBuilder.group({
			nname: ['', Validators.required],
			nemail: ['', Validators.required],
			npassword: ['', Validators.required],
			npasswordConfirm: ['', Validators.required]
		});

		// get return url from route parameters or default to '/'
		// tslint:disable-next-line: no-string-literal
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
	}

	// convenience getter for easy access to form fields
	get f() { return this.loginForm.controls; }
	get fn() { return this.loginFormNew.controls; }

	onSubmit() {
		this.submitted = true;

		if (this.newUser) {
			// stop here if form is invalid
			if (this.loginFormNew.invalid) {
				return;
			}

			this.loading = true;
			this.authenticationService.signup(this.fn.nname.value, this.fn.nemail.value, this.fn.npassword.value, this.fn.npasswordConfirm.value)
				.pipe(first())
				.subscribe(
					data => {
						this.router.navigate([this.returnUrl]);
					},
					error => {
						this.error = error;
						this.loading = false;
					});
		} else {
			// stop here if form is invalid
			if (this.loginForm.invalid) {
				return;
			}

			this.loading = true;
			this.authenticationService.login(this.f.email.value, this.f.password.value)
				.pipe(first())
				.subscribe(
					data => {
						this.router.navigate([this.returnUrl]);
					},
					error => {
						this.error = error;
						this.loading = false;
					});
		}
	}
}
