import { beforeAll, describe, expect, it, vi } from "vitest";
import { BookInfoEntityResource } from "./BookInfoEntityResource";
import { getEntityTestData, getEntityTestDatas } from "$lib/vitest-setup";
import { json } from "@sveltejs/kit";
import BookInfoMongoDBModel from "$lib/server/Domain/Entities/MongoDBModel/BookInfo";
import type { books_v1 } from "googleapis";
import { PageHistory } from "$lib/server/Domain/ValueObjects/BookInfo/PageHistory";

describe('get', () => {
  it('SvelteAPIへのリクエストが成功した際に、レスポンスをEntityに変換して戻り値で返すこと', async () => {
    const mockFetch = vi.spyOn(global, 'fetch');
    const dbModels: BookInfoMongoDBModel[] = [];
    dbModels.push(new BookInfoMongoDBModel(getEntityTestData()));
    mockFetch.mockImplementation(async () => json(dbModels, {status: 200}));

    const repos = new BookInfoEntityResource();
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
    const repos = new BookInfoEntityResource();
    const response = await repos.getByStatus('wish');

    expect(response.length).toEqual(1);
    expect(response[0].status.value).toEqual('wish');
  });

  it('statusにreadingを指定してリクエストした際に、対応したレスポンスを戻り値で返すこと', async () => {
    const repos = new BookInfoEntityResource();
    const response = await repos.getByStatus('reading');

    expect(response.length).toEqual(1);
    expect(response[0].status.value).toEqual('reading');
  });

  it('statusにcompleteを指定してリクエストした際に、対応したレスポンスを戻り値で返すこと', async () => {
    const repos = new BookInfoEntityResource();
    const response = await repos.getByStatus('complete');

    expect(response.length).toEqual(1);
    expect(response[0].status.value).toEqual('complete');
  });
});

describe('getRecent', () => {
  const requestUrl = '/api/bookinfo';
  const data = getEntityTestData();
  const dbModel = new BookInfoMongoDBModel(data);

  //inputにurlが入るので、ifで分岐させて返すデータを変える。
  beforeAll(() => {
    const mockFetch = vi.spyOn(global, 'fetch');
    //inputにurlが入るので、ifで分岐させて返すデータを変える。
    mockFetch.mockImplementation(async input => {
      if (input === `${requestUrl}?type=recent`) {
        return json(dbModel, { status: 200 });
      } 

      return new Response('データが見つかりません', { status: 400 });
    });
  });
  
  it('SvelteAPIへのリクエストが成功した際に、レスポンスをEntityに変換して戻り値で返すこと', async () => {
    const repos = new BookInfoEntityResource();
    const response = await repos.getRecent();

    expect(response).not.toBeUndefined();
    expect(response!.pageHistories?.length).toEqual(2);
  });
});

describe('getPageHistory', () => {
  it('SvelteAPIへのリクエストが成功した際に、レスポンスをValueObjectに変換して戻り値で返すこと', async () => {
    const data = new BookInfoMongoDBModel(getEntityTestData());
    const mockFetch = vi.spyOn(global, 'fetch');

    const pageHistory = [data.pageHistories];
    mockFetch.mockImplementation(async () => json(pageHistory, { status: 200 }));

    const repos = new BookInfoEntityResource();
    const response = await repos.getPageHistory();
    
    expect(response[0].length).toEqual(2);
    expect(response[0][0].value.pageCount).toEqual(data.pageHistories![0].pageCount);
    expect(response[0][1].value.pageCount).toEqual(data.pageHistories![1].pageCount);
  });
});

describe('insert', () => {
  it('SvelteAPIへのリクエストが成功した際に、成功のレスポンスを返すこと', async () => {
    const mockFetch = vi.spyOn(global, 'fetch');
    mockFetch.mockImplementation(async () => new Response('書誌データの作成に成功しました。', {status: 201} ));

    const repos = new BookInfoEntityResource();
    const response = await repos.insert({} as books_v1.Schema$Volume);

    expect(response.ok).toBeTruthy();
  });

  it('SvelteAPIへのリクエストが失敗した際に、失敗のレスポンスを返すこと', async () => {
    const mockFetch = vi.spyOn(global, 'fetch');
    mockFetch.mockImplementation(async () => new Response('書誌データの作成に失敗しました。', {status: 500} ));

    const repos = new BookInfoEntityResource();
    const response = await repos.insert({} as books_v1.Schema$Volume);

    expect(response.ok).toBeFalsy();
  });
});

describe('update', () => {
  it('SvelteAPIへのリクエストが成功した際に、成功のレスポンスを返すこと', async () => {
    const mockFetch = vi.spyOn(global, 'fetch');
    mockFetch.mockImplementation(async () => new Response('書誌データの更新に成功しました。', {status: 200} ));

    const repos = new BookInfoEntityResource();
    const response = await repos.update(getEntityTestData(), true);

    expect(response.ok).toBeTruthy();
  });

  it('SvelteAPIへのリクエストが失敗した際に、失敗のレスポンスを返すこと', async () => {
    const mockFetch = vi.spyOn(global, 'fetch');
    mockFetch.mockImplementation(async () => new Response('書誌データの更新に失敗しました。', {status: 500} ));

    const repos = new BookInfoEntityResource();
    const response = await repos.update(getEntityTestData(), true);

    expect(response.ok).toBeFalsy();
  });
});

describe('delete', () => {
  it('SvelteAPIへのリクエストが成功した際に、成功のレスポンスを返すこと', async () => {
    const mockFetch = vi.spyOn(global, 'fetch');
    mockFetch.mockImplementation(async () => new Response('書誌データの削除に成功しました。', {status: 200} ));

    const repos = new BookInfoEntityResource();
    const response = await repos.delete('test');

    expect(response.ok).toBeTruthy();
  });

  it('SvelteAPIへのリクエストが失敗した際に、失敗のレスポンスを返すこと', async () => {
    const mockFetch = vi.spyOn(global, 'fetch');
    mockFetch.mockImplementation(async () => new Response('書誌データの削除に失敗しました。', {status: 500} ));

    const repos = new BookInfoEntityResource();
    const response = await repos.delete('test');

    expect(response.ok).toBeFalsy();
  });
});