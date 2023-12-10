import { goto } from '$app/navigation';
import { verifyAuthorisation } from '$lib/server/verification';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies }) => {
  //ログイン中の場合はホームに移動する。
  const idToken = cookies.get('idToken');
  if (await verifyAuthorisation(idToken!, false)){ goto('/home'); }

  return {};
}) satisfies LayoutServerLoad;