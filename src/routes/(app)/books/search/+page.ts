import type { PageLoad } from './$types';
import { getBookInfosByQueries } from '$lib/GoogleBooksAPI/RequestManage';
import type { books_v1 } from 'googleapis';

export const load = (async (params) => {
  const bookTitle = params.url.searchParams.get('booktitle');
  const author = params.url.searchParams.get('author');
  const isbn = params.url.searchParams.get('isbn');

  //パラメータを条件に検索を行う関数を作成し、クライアント側に渡して実行
  const getBookInfo = async (startIndex = 0) => getBookInfosByQueries(bookTitle!, author!, isbn!, 10, startIndex) as books_v1.Schema$Volumes;
  return { getBookInfo, bookTitle, author, isbn };
}) satisfies PageLoad;