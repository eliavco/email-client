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
}
