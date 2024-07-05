import { describe, it } from "vitest";

describe('BookInfoEntity', () => {
  describe('Entity生成', () => {
    it('bookInfoPropertiesからEntityを生成できること', () => {

    });
  
    it('gapiオブジェクトからEntityを生成できること', () => {
  
    });
  
    it('MongoDBModelからEntityを生成できること', () => {
  
    });  
  });

  describe('updatePageHistory', () => {
    it('指定したPageHistoryをEntityに追加できること', () => {

    });

    it('EntityのPageHistoriesがFalthyの場合、指定したPageHistoryを持った配列をEntityに追加できること', () => {

    });
  });

  describe('changeStatus', () => {
    it('指定したStatusでEntityのStatusを更新できること', () => {

    });

    it('指定したStatusと現在のStatusが同じ場合、更新がされないこと', () => {

    });

    it('StatusがComplete以外からCompleteに変更した場合、最終ページまでのPageHistoryが追加されること', () => {

    });
  });

  describe('hasCompleteHistory', () => {
    it('PageHistoriesに最終ページまでの記録がある場合、Truethyが返ること', () => {

    });

    it('PageHistoriesに最終ページまでの記録がない場合、Falthyが返ること', () => {

    });

    it('PageHistoriesがFalthyな場合でも、エラーが発生せずFalthyが返ること', () => {

    });
  });

  describe('getMaxPageCount', () => {
    it('PageHistories内の最大のページ数を取得できること', () => {

    });

    it('PageHistoriesがFalthyな場合にUndefinedが返ること', () => {

    });
  });
});