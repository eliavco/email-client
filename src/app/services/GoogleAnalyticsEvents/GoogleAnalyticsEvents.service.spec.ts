/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GoogleAnalyticsEventsService } from './GoogleAnalyticsEvents.service';

describe('Service: GoogleAnalyticsEvents', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleAnalyticsEventsService]
    });
  });

  it('should ...', inject([GoogleAnalyticsEventsService], (service: GoogleAnalyticsEventsService) => {
    expect(service).toBeTruthy();
  }));
});
