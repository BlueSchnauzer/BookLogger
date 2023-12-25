import type { PageLoad } from './$types';
import { requestBookInfosByQueries } from '$lib/GoogleBooksAPI/RequestManage';
import type { books_v1 } from 'googleapis';

export const load = (async (params) => {
  const bookTitle = params.url.searchParams.get('booktitle');
  const author = params.url.searchParams.get('author');
  const isbn = params.url.searchParams.get('isbn');
  const page = Number(params.url.searchParams.get('page'));
  const startIndex = page > 0 ? page : 1;

  //パラメータを条件に検索を行う関数を作成し、クライアント側に渡して実行
  const requestBookInfo = async (startIndex = 0) => requestBookInfosByQueries(bookTitle!, author!, isbn!, 10, startIndex) as books_v1.Schema$Volumes;
  return { requestBookInfo, bookTitle, author, isbn };
}) satisfies PageLoad;