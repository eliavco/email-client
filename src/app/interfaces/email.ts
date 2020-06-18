export interface Email {
	SPF: string;
	archived: boolean;
	attachments: number;
	charsets: {
		to: string;
		html: string;
		subject: string;
		from: string;
		text: string;
	};
	createdAt: Date;
	_id: string;
	to: string;
	from: string;
	fromUser: string;
	toUser: [string];
	headers: [string];
	read: boolean;
	deleted: boolean;
	dkim: string;
	envelope: {
		to: [string];
		from: string;
	};
	sender_ip: string;
	subject: string;
	text: string;
	html: string;

	files: [{
		fieldname: string;
		originalname: string;
		encoding: string;
		mimetype: string;
		filename: string;
		size: number;
		url: string;
		publicUrl: string;
		paramUrl: string;
		'content-id': string;
		charset: string;
	}];

}
