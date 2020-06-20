import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from './../../interfaces/user';
import { UserService } from './../../services/user/user.service';
import { AlertsService } from './../../services/alerts/alerts.service';
import { AuthenticationService } from './../../services/authentication/authentication.service';

@Component({
	selector: 'bk-update-alias',
	templateUrl: './update-alias.component.html',
	styleUrls: ['./update-alias.component.scss']
})
export class UpdateAliasComponent implements OnInit {
	@Input() user: User;
	alias = '';
	@Output() refresh = new EventEmitter<void>();
	err: string;

	constructor(
		private userService: UserService,
		private authenticationService: AuthenticationService,
		private alertsService: AlertsService) { }

	ngOnInit(): void {
	}

	onSubmit() {
		this.userService.addSubscription(this.alias).subscribe(() => {
			this.refresh.emit();
		}, err => {
			this.err = err;
		});
	}

}
