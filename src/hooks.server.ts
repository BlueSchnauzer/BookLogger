// import type { Handle } from "@sveltejs/kit";
// import { BASIC_AUTH } from "$env/static/private";

// //デプロイ後の簡易的なアクセス制限のため、Basic認証をかける
// //認証機能が実装できたり、ローカルで動かす際は削除する
// → Vercelにデプロイしたけど正しい情報を入れても認証が通らないのでコメントアウト

// export const handle: Handle = async ({ event, resolve }) => {
//   const auth = event.request.headers.get("Authorization");

//   if (auth !== `Basic ${btoa(BASIC_AUTH)}`) {
//     return new Response("Not authorized", {
//       status: 401,
//       headers: {
//         "WWW-Authenticate":
//           'Basic realm="User Visible Realm", charset="UTF-8"',
//       },
//     });
//   }

// 	return await resolve(event);
// };