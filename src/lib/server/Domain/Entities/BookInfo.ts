import type { ObjectId } from 'mongodb';
import { UserId } from '$lib/server/Domain/ValueObjects/BookInfo/UserId';
import { Status } from "$lib/server/Domain/ValueObjects/BookInfo/Status";
import { Id } from '$lib/server/Domain/ValueObjects/BookInfo/Id';
import { PageHistory } from '$lib/server/Domain/ValueObjects/BookInfo/PageHistory';
import { Identifiers } from '$lib/server/Domain/ValueObjects/BookInfo/Identifier';
import MongoDBModel from '$lib/server/Domain/Entities/MongoDBModel/BookInfo';

/**書誌情報のEntity */
export class BookInfo {
	public readonly userId: UserId;
	public readonly title: string;
	public readonly author: string[];
	public readonly thumbnail: string;
	public readonly createDate: Date;
	public readonly updateDate: Date;
	public readonly pageCount: number;
	public readonly isFavorite: boolean;
	public readonly status: Status;
	public readonly memorandum: string;
	public readonly isVisible: boolean;
	public readonly id?: Id;
	public readonly completeDate?: Date;
	public readonly pageHistories?: PageHistory[];
	public readonly identifiers?: Identifiers;
	public readonly shelfCategories?: ObjectId[]
	public readonly gapiId?: string;

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