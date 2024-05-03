import { beforeAll, describe, expect, it, vi } from "vitest";
import { BookInfoEntity } from "./BookInfoEntity";
import { getEntityTestData, getEntityTestDatas } from "$lib/vitest-setup";
import { json } from "@sveltejs/kit";
import BookInfoMongoDBModel from "$lib/server/Domain/Entities/MongoDBModel/BookInfo";
import { URLSearchParams } from "url";

describe('get', () => {
  it('SvelteAPIへのリクエストが成功した際に、レスポンスをEntityに変換して戻り値で返すこと', async () => {
    const mockFetch = vi.spyOn(global, 'fetch');
    const dbModels: BookInfoMongoDBModel[] = [];
    dbModels.push(new BookInfoMongoDBModel(getEntityTestData()));
    mockFetch.mockImplementation(async () => json(dbModels, {status: 200}));

    const repos = new BookInfoEntity();
    const response = await repos.get();

    expect(response.length).toEqual(1);
    expect(response[0].title).toEqual(dbModels[0].title);
  });

  it('エラーになった時に対応した戻り値を返すこと？', () => {

  });
});

describe('getByStatus', () => {
  const requestUrl = '/api/bookinfo';
  const datas = getEntityTestDatas();
  const dbModels = datas.map(item => new BookInfoMongoDBModel(item));

  beforeAll(() => {
    const mockFetch = vi.spyOn(global, 'fetch');
    //inputにurlが入るので、ifで分岐させて返すデータを変える。
    mockFetch.mockImplementation(async input => {
      if (input === `${requestUrl}?type=wish`) {
        return json([dbModels[0]], { status: 200 });
      } 
      else if (input === `${requestUrl}?type=reading`) {
        return json([dbModels[1]], { status: 200 });
      }
      else if (input === `${requestUrl}?type=complete`) {
        return json([dbModels[2]], { status: 200 });
      }
      else if (input === `${requestUrl}?type=recent`) {
        return json([dbModels[0]], { status: 200 });
      }

      return new Response('データが見つかりません', { status: 400 });
    });
  });

  it('statusにwishを指定してリクエストした際に、対応したレスポンスを戻り値で返すこと', async () => {
    const repos = new BookInfoEntity();
    const response = await repos.getByStatus('wish');

    expect(response.length).toEqual(1);
    expect(response[0].status.value).toEqual('wish');
  });

  it('statusにreadingを指定してリクエストした際に、対応したレスポンスを戻り値で返すこと', async () => {
    const repos = new BookInfoEntity();
    const response = await repos.getByStatus('reading');

    expect(response.length).toEqual(1);
    expect(response[0].status.value).toEqual('reading');
  });

  it('statusにcompleteを指定してリクエストした際に、対応したレスポンスを戻り値で返すこと', async () => {
    const repos = new BookInfoEntity();
    const response = await repos.getByStatus('complete');

    expect(response.length).toEqual(1);
    expect(response[0].status.value).toEqual('complete');
  });
});

describe('getRecent', () => {
  const requestUrl = '/api/bookinfo';
  const datas = getEntityTestDatas();
  const dbModels = datas.map(item => new BookInfoMongoDBModel(item));

  //inputにurlが入るので、ifで分岐させて返すデータを変える。
  beforeAll(() => {
    const mockFetch = vi.spyOn(global, 'fetch');
    //inputにurlが入るので、ifで分岐させて返すデータを変える。
    mockFetch.mockImplementation(async input => {
      if (input === `${requestUrl}?type=recent`) {
        return json([dbModels[0]], { status: 200 });
      } 

      return new Response('データが見つかりません', { status: 400 });
    });
  });
  
  it('SvelteAPIへのリクエストが成功した際に、レスポンスをEntityに変換して戻り値で返すこと', async () => {
    const repos = new BookInfoEntity();
    const response = await repos.getRecent();

    expect(response.length).toEqual(1);
    expect(response[0].pageHistories?.length).toEqual(2);
  });
});

describe('getPageHistory', () => {
  it('SvelteAPIへのリクエストが成功した際に、レスポンスをValueObjectに変換して戻り値で返すこと', () => {

  });
});

describe('insert', () => {
  it('SvelteAPIへのリクエストが成功した際に、成功のレスポンスを返すこと', () => {

  });

  it('SvelteAPIへのリクエストが失敗した際に、失敗のレスポンスを返すこと', () => {

  });
});

describe('update', () => {
  it('SvelteAPIへのリクエストが成功した際に、成功のレスポンスを返すこと', () => {

  });

  it('SvelteAPIへのリクエストが失敗した際に、失敗のレスポンスを返すこと', () => {

  });
});

describe('delete', () => {
  it('SvelteAPIへのリクエストが成功した際に、成功のレスポンスを返すこと', () => {

  });

  it('SvelteAPIへのリクエストが失敗した際に、失敗のレスポンスを返すこと', () => {

  });
});