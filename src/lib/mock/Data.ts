import type { BookShelf } from '$lib/client/Feature/Collections/Domain/Entities/BookShelf';
import type { BookInfo } from '$lib/client/Feature/Contents/Domain/Entities/BookInfo';
import { Id } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Id';
import { Identifiers } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Identifier';
import { PageHistory } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/PageHistory';
import { Status } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Status';
import { UserId } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/UserId';
import { type BookSearch } from '$lib/client/Feature/Search/BookSearch';
import type { books_v1 } from 'googleapis';

const firstId_test = '651451ed67241f439ce8a1af';
const secondId_test = '651451ed67241f439ce8a1b0';
const thirdId_test = '651451ed67241f439ce8a1b1';

export const testUserId1 = 'testUserId1';
export const testUserId2 = 'testUserId2';
export const testUserId3 = 'testUserId3';

/**書棚データEntityのテストデータ(1件) */
export const bookShelfInterfaceMock: BookShelf = {
	id: new Id(firstId_test),
	userId: new UserId(testUserId1),
	shelfName: 'testShelf',
	createDate: new Date(),
	updateDate: new Date(),
	contentsIds: [new Id(secondId_test), new Id(thirdId_test)]
};

/**書棚データEntityのテストデータ(1件) */
export const bookShelfInterfaceMocks: BookShelf[] = [
	{
		id: new Id(firstId_test),
		userId: new UserId(testUserId1),
		shelfName: 'testShelfA',
		createDate: new Date(),
		updateDate: new Date(),
		contentsIds: [new Id(secondId_test), new Id(thirdId_test)]
	},
	{
		id: new Id(secondId_test),
		userId: new UserId(testUserId1),
		shelfName: 'testShelfB',
		createDate: new Date(),
		updateDate: new Date(),
		contentsIds: [new Id(secondId_test), new Id(thirdId_test)]
	},
	{
		id: new Id(thirdId_test),
		userId: new UserId(testUserId1),
		shelfName: 'testShelfC',
		createDate: new Date(),
		updateDate: new Date(),
		contentsIds: [new Id(secondId_test), new Id(thirdId_test)]
	}
];

/**書誌データEntityのテストデータ(1件) */
export const bookInfoInterfaceMock: BookInfo = {
	id: new Id(firstId_test),
	userId: new UserId(testUserId1),
	title: 'わたしを離さないで',
	author: ['イシグロカズオ'],
	thumbnail: '',
	createDate: new Date(),
	updateDate: new Date(),
	pageCount: 300,
	isFavorite: false,
	status: new Status('wish'),
	memorandum: 'memo1',
	isVisible: true,
	completeDate: undefined,
	pageHistories: [
		new PageHistory({
			id: crypto.randomUUID(),
			date: new Date(),
			pageCount: 0
		}),
		new PageHistory({
			id: crypto.randomUUID(),
			date: new Date(),
			pageCount: 10
		})
	],
	identifiers: new Identifiers({
		isbn_13: '978-4-15-120051-9'
	}),
	shelfCategories: undefined,
	gapiId: 'firstData'
};

/**書誌データEntityのテストデータ(3件) */
export const bookInfoInterfaceMocks: BookInfo[] = [
	{
		id: new Id(firstId_test),
		userId: new UserId(testUserId1),
		title: 'わたしを離さないで',
		author: ['イシグロカズオ'],
		thumbnail: '',
		createDate: new Date(),
		updateDate: new Date(),
		pageCount: 300,
		isFavorite: false,
		status: new Status('wish'),
		memorandum: 'memo1',
		isVisible: true,
		completeDate: undefined,
		pageHistories: [
			new PageHistory({
				id: crypto.randomUUID(),
				date: new Date(),
				pageCount: 0
			}),
			new PageHistory({
				id: crypto.randomUUID(),
				date: new Date(),
				pageCount: 10
			})
		],
		identifiers: new Identifiers({
			isbn_13: '978-4-15-120051-9'
		}),
		shelfCategories: undefined,
		gapiId: 'firstData'
	},
	{
		id: new Id(secondId_test),
		userId: new UserId(testUserId2),
		title: 'エピローグ',
		author: ['円城塔'],
		thumbnail: '',
		createDate: new Date(),
		updateDate: new Date(),
		pageCount: -1,
		isFavorite: false,
		status: new Status('reading'),
		memorandum: 'memo2',
		isVisible: true,
		completeDate: undefined,
		pageHistories: [
			new PageHistory({
				id: crypto.randomUUID(),
				date: new Date(),
				pageCount: 0
			})
		],
		identifiers: new Identifiers({
			isbn_13: '978-4-15-031316-6'
		}),
		shelfCategories: undefined,
		gapiId: 'secondData'
	},
	{
		id: new Id(thirdId_test),
		userId: new UserId(testUserId3),
		title: 'プロローグ',
		author: ['円城塔'],
		thumbnail: '',
		createDate: new Date(),
		updateDate: new Date(),
		pageCount: -1,
		isFavorite: false,
		status: new Status('complete'),
		memorandum: 'memo3',
		isVisible: true,
		completeDate: undefined,
		pageHistories: [],
		identifiers: new Identifiers({
			isbn_13: '978-4-16-791019-8'
		}),
		shelfCategories: undefined,
		gapiId: 'thirdData'
	}
];

export const bookInfoInterfaceMocksWithUserIds = (
	userId1 = testUserId1,
	userId2 = testUserId1,
	userId3 = testUserId1
) => [
	{
		id: new Id(firstId_test),
		userId: new UserId(userId1),
		title: 'わたしを離さないで',
		author: ['イシグロカズオ'],
		thumbnail: '',
		createDate: new Date(),
		updateDate: new Date(),
		pageCount: 300,
		isFavorite: false,
		status: new Status('wish'),
		memorandum: 'memo1',
		isVisible: true,
		completeDate: undefined,
		pageHistories: [
			new PageHistory({
				id: crypto.randomUUID(),
				date: new Date(),
				pageCount: 0
			}),
			new PageHistory({
				id: crypto.randomUUID(),
				date: new Date(),
				pageCount: 10
			})
		],
		identifiers: new Identifiers({
			isbn_13: '978-4-15-120051-9'
		}),
		shelfCategories: undefined,
		gapiId: 'firstData'
	},
	{
		id: new Id(secondId_test),
		userId: new UserId(userId2),
		title: 'エピローグ',
		author: ['円城塔'],
		thumbnail: '',
		createDate: new Date(),
		updateDate: new Date(),
		pageCount: -1,
		isFavorite: false,
		status: new Status('reading'),
		memorandum: 'memo2',
		isVisible: true,
		completeDate: undefined,
		pageHistories: [
			new PageHistory({
				id: crypto.randomUUID(),
				date: new Date(),
				pageCount: 0
			})
		],
		identifiers: new Identifiers({
			isbn_13: '978-4-15-031316-6'
		}),
		shelfCategories: undefined,
		gapiId: 'secondData'
	},
	{
		id: new Id(thirdId_test),
		userId: new UserId(userId3),
		title: 'プロローグ',
		author: ['円城塔'],
		thumbnail: '',
		createDate: new Date(),
		updateDate: new Date(),
		pageCount: -1,
		isFavorite: false,
		status: new Status('complete'),
		memorandum: 'memo3',
		isVisible: true,
		completeDate: undefined,
		pageHistories: [],
		identifiers: new Identifiers({
			isbn_13: '978-4-16-791019-8'
		}),
		shelfCategories: undefined,
		gapiId: 'thirdData'
	}
];

/**GAPIのテスト用レスポンスデータ */
export const gapiTestDatas: books_v1.Schema$Volumes = {
	kind: 'books#volumes',
	totalItems: 2615,
	items: [
		{
			kind: 'books#volume',
			id: 'D5gvDQAAQBAJ',
			etag: 'jdYAnyj4Or4',
			selfLink: 'https://www.googleapis.com/books/v1/volumes/D5gvDQAAQBAJ',
			volumeInfo: {
				title: '短篇五芒星',
				authors: ['舞城王太郎'],
				publisher: '講談社',
				publishedDate: '2016-09-15',
				description:
					'「許せないんだよ」「りゅ、ふう、……っぐ、りゅう、流産が」。二十七歳の春、突然流産のことが気になりだした僕。理不尽な赤ちゃんの死が高頻度で起きることに怒り、妄執する男を描いた「美しい馬の地」。他「アユの嫁」「四点リレー怪談」「バーベル・ザ・バーバリアン」「あうだうだう」収録の奇跡の短篇集！',
				industryIdentifiers: [
					{
						type: 'OTHER',
						identifier: 'PKEY:BT000040075000100101900209'
					}
				],
				readingModes: {
					text: true,
					image: true
				},
				pageCount: 110,
				printType: 'BOOK',
				categories: ['Fiction'],
				maturityRating: 'NOT_MATURE',
				allowAnonLogging: true,
				contentVersion: '1.2.2.0.preview.3',
				panelizationSummary: {
					containsEpubBubbles: false,
					containsImageBubbles: false
				},
				imageLinks: {
					smallThumbnail:
						'http://books.google.com/books/content?id=D5gvDQAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
					thumbnail:
						'http://books.google.com/books/content?id=D5gvDQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
				},
				language: 'ja',
				previewLink:
					'http://books.google.co.jp/books?id=D5gvDQAAQBAJ&printsec=frontcover&dq=%E8%88%9E%E5%9F%8E%E7%8E%8B%E5%A4%AA%E9%83%8E&hl=&cd=1&source=gbs_api',
				infoLink: 'https://play.google.com/store/books/details?id=D5gvDQAAQBAJ&source=gbs_api',
				canonicalVolumeLink: 'https://play.google.com/store/books/details?id=D5gvDQAAQBAJ'
			}
		},
		{
			kind: 'books#volume',
			id: 'O6AnAAAACAAJ',
			etag: '+dPU3qEmOCs',
			selfLink: 'https://www.googleapis.com/books/v1/volumes/O6AnAAAACAAJ',
			volumeInfo: {
				title: '煙か土か食い物',
				subtitle: '',
				authors: ['舞城王太郎'],
				publishedDate: '2004-12',
				description:
					'腕利きの救命外科医・奈津川四郎に凶報が届く。連続主婦殴打生き埋め事件の被害者におふくろが?ヘイヘイヘイ、復讐は俺に任せろマザファッカー!故郷に戻った四郎を待つ血と暴力に彩られた凄絶なドラマ。破格の物語世界とスピード感あふれる文体で著者が衝撃デビューを飾った第19回メフィスト賞受賞作。',
				industryIdentifiers: [
					{
						type: 'ISBN_10',
						identifier: '406274936X'
					},
					{
						type: 'ISBN_13',
						identifier: '9784062749367'
					}
				],
				readingModes: {
					text: false,
					image: false
				},
				pageCount: 342,
				printType: 'BOOK',
				categories: ['Japanese fiction'],
				averageRating: 4,
				ratingsCount: 1,
				maturityRating: 'NOT_MATURE',
				allowAnonLogging: false,
				contentVersion: 'preview-1.0.0',
				imageLinks: {
					smallThumbnail:
						'http://books.google.com/books/content?id=O6AnAAAACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api',
					thumbnail:
						'http://books.google.com/books/content?id=O6AnAAAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api'
				},
				language: 'ja',
				previewLink:
					'http://books.google.co.jp/books?id=O6AnAAAACAAJ&dq=%E8%88%9E%E5%9F%8E%E7%8E%8B%E5%A4%AA%E9%83%8E&hl=&cd=2&source=gbs_api',
				infoLink:
					'http://books.google.co.jp/books?id=O6AnAAAACAAJ&dq=%E8%88%9E%E5%9F%8E%E7%8E%8B%E5%A4%AA%E9%83%8E&hl=&source=gbs_api',
				canonicalVolumeLink:
					'https://books.google.com/books/about/%E7%85%99%E3%81%8B%E5%9C%9F%E3%81%8B%E9%A3%9F%E3%81%84%E7%89%A9.html?hl=&id=O6AnAAAACAAJ'
			}
		},
		{
			kind: 'books#volume',
			id: 'WtarBQAAQBAJ',
			etag: 'ib15CK9Y56Q',
			selfLink: 'https://www.googleapis.com/books/v1/volumes/WtarBQAAQBAJ',
			volumeInfo: {
				title: '獣の樹',
				authors: ['舞城王太郎'],
				publisher: '講談社',
				publishedDate: '2012-08-10',
				description:
					'ある日ある朝、西暁町で、十四歳くらいの僕が馬から生まれる。記憶も名前もない。でも名前なんかいらない、と思う。自分が誰だってどうでもいい――のに、正彦が僕を弟にする。それからヒトとしての生活にようやく馴れてきたところに、蛇に乗る少女楡（にれ）が現れ、僕を殺人現場に誘う。冒険が始まる。失踪した父親。地下密室。殺人。獣の大革命。そして恋。混乱と騒動の中、僕は暗い森を駆ける駆ける駆け抜けていく。 （講談社文庫）',
				industryIdentifiers: [
					{
						type: 'OTHER',
						identifier: 'PKEY:BT000018668300100101900209'
					}
				],
				readingModes: {
					text: true,
					image: true
				},
				pageCount: 299,
				printType: 'BOOK',
				categories: ['Fiction'],
				maturityRating: 'NOT_MATURE',
				allowAnonLogging: false,
				contentVersion: '1.2.3.0.preview.3',
				panelizationSummary: {
					containsEpubBubbles: false,
					containsImageBubbles: false
				},
				imageLinks: {
					smallThumbnail:
						'http://books.google.com/books/content?id=WtarBQAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
					thumbnail:
						'http://books.google.com/books/content?id=WtarBQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
				},
				language: 'ja',
				previewLink:
					'http://books.google.co.jp/books?id=WtarBQAAQBAJ&printsec=frontcover&dq=%E8%88%9E%E5%9F%8E%E7%8E%8B%E5%A4%AA%E9%83%8E&hl=&cd=3&source=gbs_api',
				infoLink: 'https://play.google.com/store/books/details?id=WtarBQAAQBAJ&source=gbs_api',
				canonicalVolumeLink: 'https://play.google.com/store/books/details?id=WtarBQAAQBAJ'
			}
		}
	]
};

/**フロントでのGAPIレスポンスinterfaceのプロパティ */
export const bookSearchInterfaceMock: BookSearch = {
	keyId: 'D5gvDQAAQBAJ',
	title: '短篇五芒星',
	authors: ['舞城王太郎'],
	publisher: '講談社',
	publishedDate: '2016-09-15',
	pageCount: 110,
	thumbnail:
		'http://books.google.com/books/content?id=D5gvDQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
	description:
		'「許せないんだよ」「りゅ、ふう、……っぐ、りゅう、流産が」。二十七歳の春、突然流産のことが気になりだした僕。理不尽な赤ちゃんの死が高頻度で起きることに怒り、妄執する男を描いた「美しい馬の地」。他「アユの嫁」「四点リレー怪談」「バーベル・ザ・バーバリアン」「あうだうだう」収録の奇跡の短篇集！'
};
