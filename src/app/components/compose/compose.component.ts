import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'bk-compose',
	templateUrl: './compose.component.html',
	styleUrls: ['./compose.component.scss']
})
export class ComposeComponent implements OnInit {

	constructor(private titleService: Title) { }

	ngOnInit(): void {
		this.titleService.setTitle(`${(window as any).bkBaseTitle} | Home`);
	}

}
