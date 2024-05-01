import { describe, expect, it, vi } from "vitest";
import { BookInfoEntity } from "./BookInfoEntity";
import { getEntityTestData } from "$lib/vitest-setup";
import { json } from "@sveltejs/kit";
import BookInfoMongoDBModel from "$lib/server/Domain/Entities/MongoDBModel/BookInfo";

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
  it('statusにwishを指定してリクエストした際に、対応したレスポンスを戻り値で返すこと', () => {

  });

  it('statusにreadingを指定してリクエストした際に、対応したレスポンスを戻り値で返すこと', () => {

  });

  it('statusにcompleteを指定してリクエストした際に、対応したレスポンスを戻り値で返すこと', () => {

  });
});

describe('getRecent', () => {
  it('SvelteAPIへのリクエストが成功した際に、レスポンスをEntityに変換して戻り値で返すこと', () => {

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