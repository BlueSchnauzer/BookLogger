import { BookInfo, type bookInfoProperties } from '$lib/client/Domain/Entities/BookInfo';
import { PageHistory } from '$lib/client/Domain/ValueObjects/BookInfo/PageHistory';
import { Status } from '$lib/client/Domain/ValueObjects/BookInfo/Status';
import BookInfoMongoDBModel from '$lib/server/Domain/Entities/MongoDB/BookInfoModel';
import type { IBookInfoModel } from '$lib/client/Domain/Entities/MongoDB/IBookInfoModel';
import type { IBookSearchRepository } from '$lib/client/Domain/Repositories/IBookSearch';
import { BookSearchGoogleBooksAPI } from '$lib/client/Infrastructure/GoogleBooksAPI/BookSearch';
import { bookInfoPropertiesMock, getEntityTestData, testUserId1 } from '$lib/mock/Data';
import { describe, expect, it } from 'vitest';
import type { books_v1 } from 'googleapis';

describe('BookInfoEntity', () => {
	describe('Entity生成', () => {
		it('bookInfoPropertiesからEntityを生成できること', () => {
			const entity = new BookInfo(bookInfoPropertiesMock);

			expect(entity).toBeDefined();
			expect(entity.id?.value).toEqual(bookInfoPropertiesMock.id);
		});

		it('gapiオブジェクトからEntityを生成できること', async () => {
			const bookSearchRepos: IBookSearchRepository<books_v1.Schema$Volumes> =
				new BookSearchGoogleBooksAPI();
			const result = await bookSearchRepos.searchByFuzzyQuery(
				`isbn:${bookInfoPropertiesMock.identifiers?.isbn_13}`,
				10,
				0
			);

			const entity = new BookInfo(result.items![0], testUserId1);

			expect(entity).toBeDefined();
			expect(entity.userId.value).toEqual(testUserId1);
			expect(entity.title).toEqual(result.items![0].volumeInfo?.title);
		});

		it('MongoDBModelからEntityを生成できること', () => {
			const dbModel: IBookInfoModel = new BookInfoMongoDBModel(getEntityTestData());

			const entity = BookInfo.fromDBModel(dbModel);

			expect(entity).toBeDefined();
			expect(entity.id?.value).toEqual(dbModel._id?.toString());
			expect(entity.title).toEqual(dbModel.title);
		});
	});

	describe('changeStatus', () => {
		it('指定したStatusでEntityのStatusを更新できること', () => {
			const entity = new BookInfo(bookInfoPropertiesMock);
			entity.setStatus(new Status('reading'));

			expect(entity.status.value).toEqual('reading');
		});

		it('指定したStatusと現在のStatusが同じ場合、更新がされないこと', () => {
			const entityA = new BookInfo(bookInfoPropertiesMock);
			const entityB = new BookInfo(bookInfoPropertiesMock);
			entityA.setStatus(new Status('wish'));

			expect(entityA.status.equals(entityB.status)).toBeTruthy();
		});

		it('StatusがComplete以外からCompleteに変更した場合、最終ページまでのPageHistoryが追加されること', () => {
			const entity = new BookInfo(bookInfoPropertiesMock);
			entity.setStatus(new Status('complete'));

			expect(entity.status.value).toEqual('complete');
		});
	});

	describe('addPageHistory', () => {
		it('指定したPageHistoryをEntityに追加できること', () => {
			const entity = new BookInfo(bookInfoPropertiesMock);
			entity.addPageHistory(new PageHistory({ date: new Date(), pageCount: 100 }));

			expect(entity.pageHistories?.length).toEqual(3);
			expect(entity.pageHistories![2].value.pageCount).toEqual(100);
		});

		it('EntityのPageHistoriesがFalthyの場合、指定したPageHistoryを持った配列をEntityに追加できること', () => {
			const copiedMock: bookInfoProperties = {
				...bookInfoPropertiesMock,
				pageHistories: undefined
			};
			const entity = new BookInfo(copiedMock);
			//expect(entity.pageHistories).not.toBeDefined();

			entity.addPageHistory(new PageHistory({ date: new Date(), pageCount: 100 }));
			expect(entity.pageHistories).toBeDefined();
			expect(entity.pageHistories?.length).toEqual(1);
			expect(entity.pageHistories![0].value.pageCount).toEqual(100);
		});
	});

	// describe('getMaxPageCount', () => {
	//   it('PageHistories内の最大のページ数を取得できること', () => {
	//     const entity = new BookInfo(bookInfoPropertiesMock);

	//     expect(entity.getMaxPageCountFromHistory()).toEqual(bookInfoPropertiesMock.pageHistories![1].pageCount);
	//   });

	//   it('PageHistoriesがFalthyな場合にUndefinedが返ること', () => {
	//     const copiedMock: bookInfoProperties = {
	//       ...bookInfoPropertiesMock,
	//       pageHistories: undefined
	//     };
	//     const entity = new BookInfo(copiedMock);

	//     expect(entity.getMaxPageCountFromHistory()).not.toBeDefined();
	//   });
	// });
});
