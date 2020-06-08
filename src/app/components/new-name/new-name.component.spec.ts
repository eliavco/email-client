import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNameComponent } from './new-name.component';

describe('NewNameComponent', () => {
	let component: NewNameComponent;
	let fixture: ComponentFixture<NewNameComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [NewNameComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NewNameComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
