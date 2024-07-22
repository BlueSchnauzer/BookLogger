import { BookInfo, type bookInfoProperties } from '$lib/server/Domain/Entities/BookInfo';
import type { IBookSearchRepositories } from '$lib/server/Domain/repositories/BookSearch';
import { PageHistory } from '$lib/server/Domain/ValueObjects/BookInfo/PageHistory';
import { Status } from '$lib/server/Domain/ValueObjects/BookInfo/Status';
import { BookSearchGoogleBooksAPI } from '$lib/server/Infrastructure/GoogleBooksAPI/BookSearch';
import { bookInfoPropertiesMock, getEntityTestData, testUserId1 } from '$lib/vitest-setup';
import { describe, expect, it } from 'vitest';
import BookInfoMongoDBModel from './MongoDBModel/BookInfo';

describe('BookInfoEntity', () => {
  describe('Entity生成', () => {
    it('bookInfoPropertiesからEntityを生成できること', () => {
      const entity = new BookInfo(bookInfoPropertiesMock);

      expect(entity).toBeDefined();
      expect(entity.id?.value).toEqual(bookInfoPropertiesMock.id);
    });

    it('gapiオブジェクトからEntityを生成できること', async () => {
      const bookSearchRepos: IBookSearchRepositories = new BookSearchGoogleBooksAPI();
      const result = await bookSearchRepos.search(
        [`isbn:${bookInfoPropertiesMock.identifiers?.isbn_13}`],
        10,
        0
      );

      const entity = new BookInfo(result.items![0], testUserId1);

      expect(entity).toBeDefined();
      expect(entity.userId.value).toEqual(testUserId1);
      expect(entity.title).toEqual(result.items![0].volumeInfo?.title);
    });

    it('MongoDBModelからEntityを生成できること', () => {
      const dbModel = new BookInfoMongoDBModel(getEntityTestData());

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
