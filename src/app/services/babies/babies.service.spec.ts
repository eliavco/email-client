/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BabiesService } from './babies.service';

describe('Service: Babies', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [BabiesService]
		});
	});

	it('should ...', inject([BabiesService], (service: BabiesService) => {
		expect(service).toBeTruthy();
	}));
});
