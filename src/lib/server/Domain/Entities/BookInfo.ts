import type { ObjectId } from 'mongodb';
import { UserId } from '$lib/server/Domain/ValueObjects/BookInfo/UserId';
import { Status } from "$lib/server/Domain/ValueObjects/BookInfo/Status";
import { Id } from '$lib/server/Domain/ValueObjects/BookInfo/Id';
import { PageHistory } from '$lib/server/Domain/ValueObjects/BookInfo/PageHistory';
import { Identifiers } from '$lib/server/Domain/ValueObjects/BookInfo/Identifier';
import MongoDBModel from '$lib/server/Domain/Entities/MongoDBModel/BookInfo';

/**書誌情報のEntity */
export class BookInfo {
	public userId: UserId;
	public title: string;
	public author: string[];
	public thumbnail: string;
	public createDate: Date;
	public updateDate: Date;
	public pageCount: number;
	public isFavorite: boolean;
	public status: Status;
	public memorandum: string;
	public isVisible: boolean;
	public id?: Id;
	public completeDate?: Date;
	public pageHistories?: PageHistory[];
	public identifiers?: Identifiers;
	public shelfCategories?: ObjectId[]
	public gapiId?: string;

	/**BookInfoのEntityを生成(MongoDBのモデルを渡して生成する) */
	constructor(mongoModel: MongoDBModel) {
		this.userId = new UserId(mongoModel.userId);
		this.title = mongoModel.title;
		this.author = mongoModel.author;
		this.thumbnail = mongoModel.thumbnail;
		this.createDate = mongoModel.createDate;
		this.updateDate = mongoModel.updateDate;
		this.pageCount = mongoModel.pageCount;
		this.isFavorite = mongoModel.isFavorite;
		this.status = new Status(mongoModel.status);
		this.memorandum = mongoModel.memorandum;
		this.isVisible = mongoModel.isVisible;
		this.id = new Id(mongoModel._id!);
		this.completeDate = mongoModel.completeDate;
		this.pageHistories = mongoModel.pageHistory?.map(item => new PageHistory(item));
		this.identifiers = new Identifiers(mongoModel.identifier!);
		this.shelfCategories = mongoModel.shelfCategory;
		this.gapiId = mongoModel.gapiId;
	}

	/**EntityをMongoDBのModelに変換する */
	public convertToMongoDBModel() {
		return new MongoDBModel(this);
	}
}