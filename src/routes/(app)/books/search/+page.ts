import type { PageLoad } from './$types';
import { requestBookInfoByFuzzySearch, requestBookInfosByQueries } from '$lib/GoogleBooksAPI/RequestManage';
import type { books_v1 } from 'googleapis';

export const load = (async (params) => {
  //あいまい検索時のみ取得(form送信時にタグがdisabledに設定)
  const query = params.url.searchParams.get('query');

  //詳細検索時のみ取得
  const bookTitle = params.url.searchParams.get('booktitle');
  const author = params.url.searchParams.get('author');
  const isbn = params.url.searchParams.get('isbn');

  let page = Number(params.url.searchParams.get('page'));
  page = page >= 0 ? page : 0;

  const maxResults = 10;
  const startIndex = page > 0 ? page * maxResults : 0;


  //あいまい検索か
  let isFuzzy: boolean;

  //パラメータを条件に検索を行う関数を作成し、クライアント側に渡して実行
  let requestBookInfo: () => Promise<books_v1.Schema$Volumes>;
  if (query) {
    isFuzzy = true;
    requestBookInfo = async () => requestBookInfoByFuzzySearch(query!, maxResults, startIndex) as books_v1.Schema$Volumes;
  }
  else {
    isFuzzy = false;
    requestBookInfo = async () => requestBookInfosByQueries(bookTitle!, author!, isbn!, maxResults, startIndex) as books_v1.Schema$Volumes;
  }

  return { requestBookInfo, isFuzzy, query, bookTitle, author, isbn, page, startIndex };
}) satisfies PageLoad;