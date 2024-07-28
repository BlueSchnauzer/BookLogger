import {
	BookInfo as BookInfoEntity,
	type bookInfoProperties
} from '$lib/client/Domain/Entities/BookInfo';

const firstId_test = '651451ed67241f439ce8a1af';
const secondId_test = '651451ed67241f439ce8a1b0';
const thirdId_test = '651451ed67241f439ce8a1b1';

export const testUserId1 = 'testUserId1';
export const testUserId2 = 'testUserId2';
export const testUserId3 = 'testUserId3';

/**テスト用書誌データのEntity(1件) */
export const getEntityTestData = (userId = testUserId1) => {
	return new BookInfoEntity({ ...bookInfoPropertiesMock, userId });
};

/**テスト用書誌データのEntity(3件)
 * デフォルトでは全て同じUserIdを持つ
 */
export const getEntityTestDatas = (
	userId1 = testUserId1,
	userId2 = testUserId1,
	userId3 = testUserId1
): BookInfoEntity[] => {
	bookInfoPropertiesMocks[0].userId = userId1;
	bookInfoPropertiesMocks[1].userId = userId2;
	bookInfoPropertiesMocks[2].userId = userId3;

	return bookInfoPropertiesMocks.map((item) => new BookInfoEntity(item));
};

/**書誌データのEntityの作成プロパティ(1件) */
export const bookInfoPropertiesMock: bookInfoProperties = {
	id: firstId_test,
	userId: testUserId1,
	title: 'わたしを離さないで',
	author: ['イシグロカズオ'],
	thumbnail: '',
	createDate: new Date(),
	updateDate: new Date(),
	pageCount: 300,
	isFavorite: false,
	status: 'wish',
	memorandum: 'memo1',
	isVisible: true,
	completeDate: undefined,
	pageHistories: [
		{
			id: crypto.randomUUID(),
			date: new Date(),
			pageCount: 0
		},
		{
			id: crypto.randomUUID(),
			date: new Date(),
			pageCount: 10
		}
	],
	identifiers: {
		isbn_13: '978-4-15-120051-9'
	},
	shelfCategories: undefined,
	gapiId: 'firstData'
};

/**書誌データのEntityの作成プロパティ(3件) */
export const bookInfoPropertiesMocks: bookInfoProperties[] = [
	{
		id: firstId_test,
		userId: testUserId1,
		title: 'わたしを離さないで',
		author: ['イシグロカズオ'],
		thumbnail: '',
		createDate: new Date(),
		updateDate: new Date(),
		pageCount: 300,
		isFavorite: false,
		status: 'wish',
		memorandum: 'memo1',
		isVisible: true,
		completeDate: undefined,
		pageHistories: [
			{
				id: crypto.randomUUID(),
				date: new Date(),
				pageCount: 0
			},
			{
				id: crypto.randomUUID(),
				date: new Date(),
				pageCount: 10
			}
		],
		identifiers: {
			isbn_13: '978-4-15-120051-9'
		},
		shelfCategories: undefined,
		gapiId: 'firstData'
	},
	{
		id: secondId_test,
		userId: testUserId2,
		title: 'エピローグ',
		author: ['円城塔'],
		thumbnail: '',
		createDate: new Date(),
		updateDate: new Date(),
		pageCount: -1,
		isFavorite: false,
		status: 'reading',
		memorandum: 'memo2',
		isVisible: true,
		completeDate: undefined,
		pageHistories: [
			{
				id: crypto.randomUUID(),
				date: new Date(),
				pageCount: 0
			}
		],
		identifiers: {
			isbn_13: '978-4-15-031316-6'
		},
		shelfCategories: undefined,
		gapiId: 'secondData'
	},
	{
		id: thirdId_test,
		userId: testUserId3,
		title: 'プロローグ',
		author: ['円城塔'],
		thumbnail: '',
		createDate: new Date(),
		updateDate: new Date(),
		pageCount: -1,
		isFavorite: false,
		status: 'complete',
		memorandum: 'memo3',
		isVisible: true,
		completeDate: undefined,
		pageHistories: [],
		identifiers: {
			isbn_13: '978-4-16-791019-8'
		},
		shelfCategories: undefined,
		gapiId: 'thirdData'
	}
];
