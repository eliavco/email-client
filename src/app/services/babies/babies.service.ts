import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

declare let backendUrl: string;

@Injectable({
	providedIn: 'root'
})
export class BabiesService {

	constructor(private httpClient: HttpClient) { }

	getInfo() {
		return this.httpClient.get(`${backendUrl}/webApi/api/v1/babies`);
	}

	getInfoRating() {
		return this.httpClient.get(`${backendUrl}/webApi/api/v1/babies?order=-rating`);
	}

	// using put and delta
	increaseRating(id, delta = 1) {
		return this.httpClient.put(`${backendUrl}/webApi/api/v1/babies/${id}?delta=${delta}`, null);
	}

	delete(id) {
		return this.httpClient.delete(`${backendUrl}/webApi/api/v1/babies/${id}`);
	}

	create(name, author = '', reason = '', group = '') {
		return this.httpClient.post(`${backendUrl}/webApi/api/v1/babies/`, { name, author, reason, group, rating: 0 });
	}

}
