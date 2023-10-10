import { PUBLIC_BOOKSAPI_DISCOVERY_URL, PUBLIC_BOOKSAPI_LIST } from "$env/static/public";
import type { IBookInfo } from "$lib/server/models/BookInfo";
import type { books_v1 } from "googleapis";

/**クライアント側GoogleBooksAPIのリクエスト用データを取得する */
export async function preparingGapi() {
    //JavaScript用のGoogleAPIライブラリをロードする
    await gapi.load('client', () => {});
    //GoogleBooksAPI v1を使用する
    await gapi.client.init({'discoveryDocs': [PUBLIC_BOOKSAPI_DISCOVERY_URL]});
}

async function requestBookInfo(query: string): Promise<books_v1.Schema$Volumes> {
    const response = await gapi.client.request({
        path: PUBLIC_BOOKSAPI_LIST,
        params: {
            q: query
        }
    });
    // レスポンスのボディをbooks_v1.Schema$Volumes型として返す
    return response.result as books_v1.Schema$Volumes;
}

/**GoogleBooksAPIに書影をリクエストする*/
export async function getBookInfo(bookInfo: IBookInfo): Promise<string> {
    if (bookInfo.imageUrl) { return bookInfo.imageUrl; }
    if (!bookInfo.isbn_13) { throw new Error('ISBN is empty'); }

    const result = await requestBookInfo(`isbn:${bookInfo.isbn_13}`);
    if (result.items?.length === 0 || !result.items) { throw new Error('This books image was not found in GoogleBooksAPI'); }

    const volumeInfo = result.items[0].volumeInfo;
    bookInfo.imageUrl = volumeInfo?.imageLinks?.thumbnail!;
    bookInfo.pageCount = volumeInfo?.pageCount!;

    if (!bookInfo.imageUrl) { throw new Error('This books image was not found in GoogleBooksAPI'); }

    return bookInfo.imageUrl;
}
