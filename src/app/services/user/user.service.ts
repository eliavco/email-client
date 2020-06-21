import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../../../environments/environment';
import { User } from './../../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
	constructor(private http: HttpClient) { }

	getAll() {
		return this.http.get(`${environment.apiUrl}/api/v${environment.apiVersion}/users`);
	}

	getOne(id: string) {
		return this.http.get(`${environment.apiUrl}/api/v${environment.apiVersion}/users${id}`);
	}

	updateSelf(data) {
		return this.http.patch(`${environment.apiUrl}/api/v${environment.apiVersion}/users/updateInfo`, data);
	}

	updatePassword(data) {
		return this.http.patch(`${environment.apiUrl}/api/v${environment.apiVersion}/users/updatePassword`, data);
	}

	forgotPassword(email: string) {
		return this.http.post(`${environment.apiUrl}/api/v${environment.apiVersion}/users/forgotPassword`, { email, url: `${location.origin}/reset-password` });
	}

	resetPassword(token, data) {
		return this.http.patch<any>(`${environment.apiUrl}/api/v${environment.apiVersion}/users/resetPassword/${token}`, data);
	}

	removeProfile() {
		return this.http.patch(`${environment.apiUrl}/api/v${environment.apiVersion}/users/removeProfile`, null);
	}

	deleteSelf() {
		return this.http.delete(`${environment.apiUrl}/api/v${environment.apiVersion}/users/deleteMe`);
	}

	addSubscription(alias: string, remove = false) {
		return this.http.patch(
			`${environment.apiUrl}/api/v${environment.apiVersion}/users/sub?alias=${alias}${remove ? '&act=remove' : ''}`, null);
	}

}
