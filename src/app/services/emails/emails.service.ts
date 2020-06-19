import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from './../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class EmailsService {

	constructor(private http: HttpClient) { }

	getMyEmails(min?: boolean, limit?: number, page?: number, deleted?: boolean, archived?: boolean){
		return this.http.get(`${environment.apiUrl}/api/v${environment.apiVersion}/emails?${min ? 'fields=attachments,subject,envelope,createdAt,read,archived,deleted&' : ''}${typeof archived === 'boolean' ? (archived === true ? 'archived=true&' : 'archived=false&') : ''}${deleted ? 'deleted=true&' : 'deleted=false&'}${page > 0 ? `page=${page}&limit=${limit}` : '' }`);
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
