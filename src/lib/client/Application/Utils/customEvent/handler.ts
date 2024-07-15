import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";
import type { bookInfoDispatchParameter } from "$lib/client/Application/Utils/customEvent/dispatcher";
import { pushSuccessToast, pushErrorToast } from "$lib/client/Application/Utils/toast";
import { BookInfoView } from "$lib/client/Application/Views/BookInfo";

export const handleSuccess = (bookInfoViews: BookInfoView[], detail: bookInfoDispatchParameter, target: string, isBooksRoute = false) => {
  const appliedItems = applyChange(bookInfoViews, detail, isBooksRoute);
  pushSuccessToast(detail.message, target);

  return appliedItems;
}

export const handleFailure = (message: string, target: string) => {
  pushErrorToast(message, target);
}

const applyChange = (bookInfoViews: BookInfoView[], detail: bookInfoDispatchParameter, isBooksRoute: boolean) => {
  //一旦、viewの中身を取り出して新しく操作する、上手くいくか確認
  let bookInfos = bookInfoViews.map(item => item.bookInfo);
  let appliedItems: BookInfo[] = [];

  if (detail.updatedItem) {
    const oldItem = bookInfos.find(item => item.getId()?.equals(detail.updatedItem?.getId()!));

    if (!isBooksRoute && !oldItem?.getStatus().equals(detail.updatedItem.getStatus())) {
      //全データ表示時以外で、ステータスが変わった場合は一覧から削除して、現在の表示から削除する
      appliedItems = bookInfos.filter(item => item.getId()?.equals(detail.updatedItem?.getId()!));
    }
    else {
      //編集したアイテムを一覧に反映する
      const index = bookInfos.findIndex(item => item.getId()?.equals(detail.updatedItem?.getId()!));
      appliedItems = [...bookInfos.slice(0, index), detail.updatedItem, ...bookInfos.slice(index + 1)];
    }
  }
  if (detail.deletedId) {
    //削除したアイテムを一覧からも削除する
    appliedItems = bookInfos.filter(item => item.getId()?.equals(detail.deletedId!));
  }

  return appliedItems.map(item => new BookInfoView(item));
}