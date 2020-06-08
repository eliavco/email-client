import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosParentsComponent } from './photos-parents.component';

describe('PhotosParentsComponent', () => {
	let component: PhotosParentsComponent;
	let fixture: ComponentFixture<PhotosParentsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PhotosParentsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PhotosParentsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
