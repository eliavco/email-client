import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../../../environments/environment';
import { User } from './../../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
	constructor(private http: HttpClient) { }

	getAll() {
		return this.http.get<User[]>(`${environment.apiUrl}/api/v${environment.apiVersion}/users`);
	}

	getOne(id: string) {
		return this.http.get<User[]>(`${environment.apiUrl}/api/v${environment.apiVersion}/users${id}`);
	}

	updateSelf(data) {
		return this.http.patch<User[]>(`${environment.apiUrl}/api/v${environment.apiVersion}/users/updateInfo`, data);
	}

	updatePassword(data) {
		return this.http.patch<User[]>(`${environment.apiUrl}/api/v${environment.apiVersion}/users/updatePassword`, data);
	}

}
