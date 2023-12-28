import type { PageLoad } from './$types';
import { requestBookInfosByQueries } from '$lib/GoogleBooksAPI/RequestManage';
import type { books_v1 } from 'googleapis';

export const load = (async (params) => {
  const bookTitle = params.url.searchParams.get('booktitle');
  const author = params.url.searchParams.get('author');
  const isbn = params.url.searchParams.get('isbn');
  let page = Number(params.url.searchParams.get('page'));
  page = page >= 0 ? page : 0;

  const maxResults = 10;
  const startIndex = page > 0 ? page * maxResults : 0;

  //パラメータを条件に検索を行う関数を作成し、クライアント側に渡して実行
  const requestBookInfo = async () => requestBookInfosByQueries(bookTitle!, author!, isbn!, maxResults, startIndex) as books_v1.Schema$Volumes;
  return { requestBookInfo, bookTitle, author, isbn, page, startIndex };
}) satisfies PageLoad;