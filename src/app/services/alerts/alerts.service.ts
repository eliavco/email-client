import { Injectable } from '@angular/core';
import { Toast } from './../../interfaces/toast';

@Injectable({
	providedIn: 'root'
})
export class AlertsService {
	toasts: Toast[] = [];

	constructor() { }

	private initToasts(): void {
		setTimeout(() => {
			($('.toast') as any).toast('show');
		}, 0);
	}

	private generateId(): number {
		let biggestId = 0;
		this.toasts.forEach(toast => {
			if (toast.id > biggestId) { biggestId = toast.id; }
		});
		return biggestId + 1;
	}

	addToast(message: string, alert: boolean = false, delay: number = 15): void {
		const generatedId = this.generateId();
		this.toasts.push({ id: generatedId, message, alert, time: new Date() });
		this.initToasts();
		setTimeout(() => {
			this.removeToast(generatedId);
		}, delay * 1000);
	}

	private findIndexToast(id: number): number {
		let myIndex = -1;
		this.toasts.forEach((toast, index) => {
			if (toast.id === id) { myIndex = index; }
		});
		return myIndex;
	}

	private removeToast(id: number): void {
		const index = this.findIndexToast(id);
		if (index >= 0) { this.toasts.splice(index, 1); }
	}

}
