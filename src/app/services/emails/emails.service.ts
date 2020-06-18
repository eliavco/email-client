import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from './../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class EmailsService {

	constructor(private http: HttpClient) { }

	getMyEmails() {
		return this.http.get(`${environment.apiUrl}/api/v${environment.apiVersion}/emails`);
	}

	getEmail(id: string) {
		return this.http.get(`${environment.apiUrl}/api/v${environment.apiVersion}/emails/${id}`);
	}

	deleteEmail(id: string) {
		return this.http.patch(`${environment.apiUrl}/api/v${environment.apiVersion}/emails/${id}`, { deleted: true });
	}

	archiveEmail(id: string) {
		return this.http.patch(`${environment.apiUrl}/api/v${environment.apiVersion}/emails/${id}`, { archived: true });
	}

	restoreEmail(id: string) {
		return this.http.patch(`${environment.apiUrl}/api/v${environment.apiVersion}/emails/${id}`, { deleted: false });
	}

	unarchiveEmail(id: string) {
		return this.http.patch(`${environment.apiUrl}/api/v${environment.apiVersion}/emails/${id}`, { archived: false });
	}

	makeReadEmail(id: string) {
		return this.http.patch(`${environment.apiUrl}/api/v${environment.apiVersion}/emails/${id}`, { read: true });
	}
}
