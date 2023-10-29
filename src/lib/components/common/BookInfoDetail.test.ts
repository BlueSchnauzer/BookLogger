import { getBookInfosByQueries } from '$lib/GoogleBooksAPI/RequestManage';
import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import type { books_v1 } from 'googleapis';
import { afterEach, describe, expect, it, vi, vitest } from 'vitest';
import BookInfoDetail from '$lib/components/common/BookInfoDetail.svelte';
import type { BookInfo } from '$lib/server/models/BookInfo';
import { ObjectId } from 'mongodb';

describe('BookInfoDetail(Seaching)', async () => {
	const isbn = '978-4-15-120051-9';
	const result: books_v1.Schema$Volumes = await getBookInfosByQueries('', '', isbn);
	const item: books_v1.Schema$Volume = result.items![0];

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('レンダリング', () => {
    render(BookInfoDetail, { isDisplay: true, item });

    expect(screen.getByText('書籍登録')).toBeInTheDocument();
		expect(screen.getByAltText('書影')).toBeInTheDocument();
    expect(screen.getByText('登録')).toBeInTheDocument();
    expect(screen.getByText('キャンセル')).toBeInTheDocument();
  });

  it('isDisplayがFaulthyな場合に非表示に変わること', async () => {
    const testId = 'layerZ30';
    const { component } = render(BookInfoDetail, { isDisplay: true, item });
    
    expect(screen.getByTestId(testId)).toBeInTheDocument();
    
    await component.$set({ isDisplay: false, item });
    expect(screen.getByTestId(testId)).toHaveClass('hidden');
  });
  
  it('閉じる・キャンセルボタンクリックで非表示に変わること', async () => {
    const testId = 'layerZ30';
    const { component } = render(BookInfoDetail, { isDisplay: true, item });
    
    const btnClose = screen.getByTestId('btnClose');
    const btnCancel = screen.getByText('キャンセル');
    
    await fireEvent.click(btnClose);
    expect(screen.getByTestId(testId)).toHaveClass('hidden');
 
    await component.$set({ isDisplay: true, item });
    await fireEvent.click(btnCancel);
    expect(screen.getByTestId(testId)).toHaveClass('hidden');
  });

  it('登録成功時に、イベントを発信できること', async () => {
    //fetchのモックを作成
    let mockFetch = vi.spyOn(global, 'fetch');
    mockFetch.mockImplementation(async () => new Response('成功しました。', {status: 201}));

    const { component } = render(BookInfoDetail, { isDisplay: true, item });
		const mockSuccess = vitest.fn();
		component.$on('success', mockSuccess);

    const btnRegister = screen.getByText('登録');
    await fireEvent.click(btnRegister);
    
    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalled();
    }, {timeout: 3000});
  });

  it('登録失敗時に、イベントを発信できること', async () => {
    let mockFetch = vi.spyOn(global, 'fetch');
    mockFetch.mockImplementation(async () => new Response('失敗しました', {status: 500}));

    const { component } = render(BookInfoDetail, { isDisplay: true, item });
		const mockFailure = vitest.fn();
		component.$on('failed', mockFailure);

    const btnRegister = screen.getByText('登録');
    await fireEvent.click(btnRegister);
    
    await waitFor(() => {
      expect(mockFailure).toHaveBeenCalled();
    }, {timeout: 3000});
  });
});

describe('BookInfoDetail(Registered)', async () => {
  const bookInfo: BookInfo = {
    _id: new ObjectId('651451ed67241f439ce8a1af'),
    userId: 1,
    isVisible: true,
    identifier: {
      isbn_13: '978-4-15-120051-9'
    },
    title: 'わたしを離さないで',
    author: ['イシグロカズオ'],
    thumbnail: '',
    createDate: new Date,
    updateDate: new Date,
    pageCount: -1,
    history: [{
        date: new Date,
        currentPage: 0
    }],
    isFavorite: false,
    isCompleted: false,
    memorandum: 'メモです1'
  }

  afterEach(() => {
    vi.restoreAllMocks();
  });
 
  it('レンダリング', () => {
    render(BookInfoDetail, { isDisplay: true, item: bookInfo });

    expect(screen.getByText(bookInfo.title)).toBeInTheDocument();
		expect(screen.getByAltText('書影')).toBeInTheDocument();
    expect(screen.getByText('削除')).toBeInTheDocument();
    expect(screen.getByText('更新')).toBeInTheDocument();
    expect(screen.getByText('キャンセル')).toBeInTheDocument();
  });

  //非表示処理は変わらないのでテストしない

  it('ボタンクリックでお気に入りフラグを変更できること', () => {

  });

  //優先度低いので実装するか未定
  // it('本棚へ登録できること', () => {
    
  // });

  it('読んだ履歴に新規データを追加できるか', () => {
    
  });

  it('メモ欄を編集して更新できるか', () => {
    
  });

  it('削除成功時に、イベントを発信できること', async () => {
    let mockFetch = vi.spyOn(global, 'fetch');
    mockFetch.mockImplementation(async () => new Response('成功しました。', {status: 200}));

    const { component } = render(BookInfoDetail, { isDisplay: true, item: bookInfo });
		const mockSuccess = vitest.fn();
		component.$on('success', mockSuccess);

    const btnDelete = screen.getByText('削除');
    await fireEvent.click(btnDelete);
    
    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalled();
    }, {timeout: 3000});
  });

  it('削除失敗時に、イベントを発信できること', async () => {
    let mockFetch = vi.spyOn(global, 'fetch');
    mockFetch.mockImplementation(async () => new Response('失敗しました', {status: 500}));

    const { component } = render(BookInfoDetail, { isDisplay: true, item: bookInfo });
		const mockFailure = vitest.fn();
		component.$on('failed', mockFailure);

    const btnDelete = screen.getByText('削除');
    await fireEvent.click(btnDelete);
    
    await waitFor(() => {
      expect(mockFailure).toHaveBeenCalled();
    }, {timeout: 3000});
  });

  it('更新成功時に、イベントを発信できること', async () => {
    //fetchのモックを作成
    let mockFetch = vi.spyOn(global, 'fetch');
    mockFetch.mockImplementation(async () => new Response('成功しました。', {status: 200}));

    const { component } = render(BookInfoDetail, { isDisplay: true, item: bookInfo });
		const mockSuccess = vitest.fn();
		component.$on('success', mockSuccess);

    const btnUpdate = screen.getByText('更新');
    await fireEvent.click(btnUpdate);
    
    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalled();
    }, {timeout: 3000});
  });

  it('更新失敗時に、イベントを発信できること', async () => {
    let mockFetch = vi.spyOn(global, 'fetch');
    mockFetch.mockImplementation(async () => new Response('失敗しました', {status: 500}));

    const { component } = render(BookInfoDetail, { isDisplay: true, item: bookInfo });
		const mockFailure = vitest.fn();
		component.$on('failed', mockFailure);

    const btnUpdate = screen.getByText('更新');
    await fireEvent.click(btnUpdate);
    
    await waitFor(() => {
      expect(mockFailure).toHaveBeenCalled();
    }, {timeout: 3000});
  });
});