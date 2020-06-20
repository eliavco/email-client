import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAliasComponent } from './update-alias.component';

describe('UpdateAliasComponent', () => {
	let component: UpdateAliasComponent;
	let fixture: ComponentFixture<UpdateAliasComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UpdateAliasComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UpdateAliasComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
