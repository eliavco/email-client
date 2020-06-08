import { Injectable } from '@angular/core';

// tslint:disable-next-line: ban-types
declare let gtag: Function;

@Injectable({
	providedIn: 'root'
})
export class GoogleAnalyticsEventsService {

	constructor() { }

	public eventEmmiter(
		eventName: string,
		eventCategory: string,
		eventAction: string,
		eventLabel: string = null,
		eventValue: number = null): void {
		//
		gtag('event', eventName, {
			eventCategory,
			eventLabel,
			eventAction,
			eventValue
		});
	}

}
