import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from './../../../environments/environment';
import { User } from './../../models/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	private currentUserSubject: BehaviorSubject<User>;
	public currentUser: Observable<User>;

	constructor(private http: HttpClient) {
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
			.pipe(map(user => {
				// store user details and jwt token in local storage to keep user logged in between page refreshes
				localStorage.setItem('currentUser', JSON.stringify(user));
				this.currentUserSubject.next(user);
				return user;
			}));
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
	}
}
