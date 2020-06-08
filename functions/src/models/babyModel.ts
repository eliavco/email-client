const { Model, schema, field, ValidationError } = require('firestore-schema-validator');

const uniqueFields: string[] = ['name'];

const babySchema = schema({
	name: field('Name')
		.string()
		.trim(),
	author: field('Author')
		.string()
		.trim()
		.optional(),
	reason: field('Reason')
		.string()
		.trim()
		.optional(),
	group: field('Group')
		.oneOf(['2020', '2019', '2018', 'other']),
	rating: field('Rating')
		.number(),
});

class BabyModel extends Model {
	// Path to Cloud Firestore collection.
	static get _collectionPath() {
		return 'babies';
	}

	// Model Schema.
	static get _schema() {
		return babySchema;
	}

	static async getByName(name: string){
		return await this.getBy('name', name);
	}

	toJSON() {
		return {
			id: this._id, // ID of Document stored in Cloud Firestore
			createdAt: this._createdAt, // ISO String format date of Document's creation.
			updatedAt: this._updatedAt, // ISO String format date of Document's last update.
			name: this.name,
			author: this.author,
			reason: this.reason,
			rating: this.rating,
			group: this.group,
		};
	}
}

const checkExists = async (fieldType: string, value: any): Promise<boolean> => {
	const result = await BabyModel.getBy(fieldType, value);
	if (result) return true;
	return false;
};

uniqueFields.forEach(uniqueField => {
	BabyModel.prehook(uniqueField, async (data: any, bike: BabyModel) => {
		const result = await checkExists(uniqueField, data[uniqueField]);
		if (result) throw new ValidationError(`A doucment with that ${uniqueField}: ${data[uniqueField]} already exists`);
	});
});

exports.Baby = BabyModel;