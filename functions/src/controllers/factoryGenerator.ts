const catchAsync = require('./../utils/catchAsync');
const AppErrorF = require('./../utils/appError');

const makeQuery = (req: any) => (reference: any) => {
	let ref = reference

	let query = req.body;
	if (Object.entries(query).length === 0) query = req.query;
	const filter = (obj: any, args: {[key: string]: any}) => {
		const filtered = {};
		for (const key in obj) {
			if (args.indexOf(key) < 0) (filtered as any)[key] = obj[key];
		}
		return filtered;
	};
	const q = filter(query, ['limit', 'order', 'page']);
	const qa: [[string, string, any]?] = [];
	for (const key in q) {
		const value = (q as any)[key];
		if (typeof value === 'string') {
			qa.push([key, '==', value]);
		} else {
			qa.push([key, value.operator, value.value]);
		}
	}

	qa.forEach(qas => {
		ref = ref.where(qas![0], qas![1], qas![2]);
	});

	const orderByParam = req.query.order;
	if (orderByParam) {
		if (typeof orderByParam !== 'string') {
			orderByParam.forEach((orderByParamSingle: any) => {
				const desc = orderByParamSingle.startsWith('-');
				const orderByParamFormatted = desc ? orderByParamSingle.replace('-', '') : orderByParamSingle;
				ref = ref.orderBy(orderByParamFormatted, desc ? 'desc' : 'asc');
			});
		}
		else {
			const desc = orderByParam.startsWith('-');
			const orderByParamFormatted = desc ? orderByParam.replace('-', '') : orderByParam;
			ref = ref.orderBy(orderByParamFormatted, desc ? 'desc' : 'asc');
		}
	}
	let limitNum = 10000, page;
	if (+req.query.limit) limitNum = +req.query.limit;
	if (req.query.page) page = req.query.page;
	if (+req.query.page) page = +req.query.page;
	if (page) ref = ref.startAfter(page);
	ref = ref.limit(limitNum);
	return ref;
};

exports.makeQueries = (queryObject: object) => {
	return catchAsync((async (req: any, res: any, next: any) => {
		req.makeQuery = makeQuery(req);
		next();
	}));
};

exports.getAll = (resource: string) => {
	return catchAsync((async (req: any, res: any, next: any) => {
		const ref = await req.db.collection(resource);
		let query;
		query = ref;
		if (req.makeQuery)
			query = req.makeQuery(ref);
		const snapshot = await query.get();
		const documents: [any?] = [];
		snapshot.forEach((doc: any) => documents.push(doc.data()));
		let currentDoc;
		for (const document of documents) {
			currentDoc = (await req.dbm[resource].getByName(document.name)).toJSON();
			document.id = currentDoc.id;
			document.createdAt = currentDoc.createdAt;
			document.updatedAt = currentDoc.updatedAt;
		}
		res.status(200).json({
			status: 'success',
			resource,
			length: documents.length,
			documents
		});
	}));
};

exports.create = (resource: string) => {
	return catchAsync((async (req: any, res: any, next: any) => {
		const info = await req.dbm[resource].create(req.body);
		res.status(201).json({
			status: 'success',
			resource,
			data: info.toJSON()
		});
	}));
};

exports.getById = (resource: string) => {
	return catchAsync((async (req: any, res: any, next: any) => {
		const id = req.params.id;
		const document = await req.dbm[resource].getById(id);
		if (!document) return next(new AppErrorF(`Could not find document with id: ${id}`));
		res.status(200).json({
			status: 'success',
			resource,
			data: document.toJSON()
		});
	}));
};

exports.getByName = (resource: string) => {
	return catchAsync((async (req: any, res: any, next: any) => {
		const name = req.params.name;
		const document = await req.dbm[resource].getByName(name);
		if (!document) return next(new AppErrorF(`Could not find document with name: ${name}`));
		res.status(200).json({
			status: 'success',
			resource,
			data: document.toJSON()
		});
	}));
};

exports.update = (resource: string) => {
	return catchAsync((async (req: any, res: any, next: any) => {
		const id = req.params.id;
		const document = await req.dbm[resource].getById(id);
		if (!document) return next(new AppErrorF(`Could not find document with id: ${id}`));
		Object.keys(req.body).forEach((entry: any) => { 
			document[entry] = req.body[entry];
		});
		await document.save();
		res.status(200).json({
			status: 'success',
			resource,
			data: document.toJSON()
		});
	}));
};

exports.updateRating = (resource: string) => {
	return catchAsync((async (req: any, res: any, next: any) => {
		const id = req.params.id;
		const document = await req.dbm[resource].getById(id);
		if (!document) return next(new AppErrorF(`Could not find document with id: ${id}`));
		let number = 1;
		if (req.query.delta) number = req.query.delta * 1;
		document.rating += number;
		await document.save();
		res.status(200).json({
			status: 'success',
			resource,
			data: document.toJSON()
		});
	}));
};

exports.delete = (resource: string) => {
	return catchAsync((async (req: any, res: any, next: any) => {
		const id = req.params.id;
		const document = await req.dbm[resource].getById(id);
		if (!document) return next(new AppErrorF(`Could not find document with id: ${id}`));
		await document.delete();
		res.status(204).json();
	}));
};

exports.getDownloadableLink = (resource: string) => {
	return catchAsync((async (req: any, res: any, next: any) => {
		const id = req.params.id;
		const document = await req.dbm[resource].getById(id);
		if (!document) return next(new AppErrorF(`Could not find document with id: ${id}`));
		const image = document.image;
		const url = (await req.st.file(`babies/${image}.jpg`).getSignedUrl({
			action: 'read',
			expires: (new Date().getTime()) + 5 * 24 * 60 * 60 * 1000,
			virtualHostedStyle: true,
		}))[0];
		res.status(200).json({
			status: 'success',
			url
		});
	}));
};