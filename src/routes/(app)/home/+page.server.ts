import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { BookInfo } from '$lib/server/models/BookInfo';

export const load = (async ({ fetch }) => {
  //直近で読んだ書誌データを取得
  const response = await fetch('/api/bookinfo?recentbook=true');
  if (!response.ok) {
    throw error(response.status);
  }
  
  let bookInfos: BookInfo[] = await response.json();

  return { bookInfos };
}) satisfies PageServerLoad;