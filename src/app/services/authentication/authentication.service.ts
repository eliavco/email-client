import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from './../../../environments/environment';
import { User } from './../../models/user';

import { UserService } from './../user/user.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	private currentUserSubject: BehaviorSubject<User>;
	public currentUser: Observable<User>;

	constructor(
		private http: HttpClient,
		private router: Router,
		private userService: UserService
	) {
		this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
		this.currentUser = this.currentUserSubject.asObservable();
	}

	public get currentUserValue(): User {
		return this.currentUserSubject.value;
	}

	isRole(role: string): boolean {
		const roles = ['user', 'guide', 'lead-guide', 'admin'];
		const userRole = (this.currentUserSubject.value as any).data.user.role;
		return roles.indexOf(userRole) >= roles.indexOf(role);
	}

	isAuthenticated(): boolean {
		return this.currentUserSubject.value ? true : false;
	}

	login(email: string, password: string) {
		return this.http.post<any>(`${environment.apiUrl}/api/v${environment.apiVersion}/users/login`, { email, password })
			.pipe(this.newUser());
	}

	reset(token: string, password: string, passwordConfirm: string) {
		return this.userService.resetPassword(token, { password, passwordConfirm })
			.pipe(this.newUser());
	}

	private newUser() {
		return map(data => {
			let final;
			if (!(!data || !(data as any).data)) {
				const newData: any = (data as any).data;
				if (newData.user) {
					final = newData.user;
				} else if (newData.doc) {
					final = newData.doc;
				}

				if (!!final) {
					final.token = (data as any).token;
					final.success = (data as any).success;
					Object.keys(final).forEach(key => {
						if (key.startsWith('password')) {
							delete final[key];
						}
					});
					final.photo = final.photo === 'default' ? `${environment.apiUrl}/img/users/default.jpg` : final.photo;
				}
			}
			// store user details and jwt token in local storage to keep user logged in between page refreshes
			localStorage.setItem('currentUser', JSON.stringify(final));
			this.currentUserSubject.next(final);
			return final;
		});
	}

	refresh() {
		if (!(this.currentUserValue as any) || !(this.currentUserValue as any).data || !(this.currentUserValue as any).data.user) { return; }
		return this.http.get<any>(`${environment.apiUrl}/api/v${environment.apiVersion}/users/${(this.currentUserValue as any).data.user._id}`)
			.pipe(this.newUser());
	}

	signup(name: string, email: string, password: string, passwordConfirm: string) {
		return this.http.post<any>(`${environment.apiUrl}/api/v${environment.apiVersion}/users/signup`,
			{ name, email, password, passwordConfirm })
			.pipe(map(user => {
				// store user details and jwt token in local storage to keep user logged in between page refreshes
				localStorage.setItem('currentUser', JSON.stringify(user));
				this.currentUserSubject.next(user);
				return user;
			}));
	}

	logout() {
		// remove user from local storage to log user out
		localStorage.removeItem('currentUser');
		this.currentUserSubject.next(null);
		this.router.navigate(['/login']);
	}
}
