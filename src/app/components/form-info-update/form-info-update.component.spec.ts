import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInfoUpdateComponent } from './form-info-update.component';

describe('FormInfoUpdateComponent', () => {
	let component: FormInfoUpdateComponent;
	let fixture: ComponentFixture<FormInfoUpdateComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [FormInfoUpdateComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FormInfoUpdateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
