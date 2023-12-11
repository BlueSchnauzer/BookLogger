import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi, vitest } from 'vitest';
import RegisteredModal from '$lib/components/content/RegisteredModal.svelte';
import { getTestData } from '$lib/vitest-setup';
import type { BookInfo } from '$lib/server/models/BookInfo';

describe('RegisteredModal', async () => {
  let testData: BookInfo;
  beforeEach(() => {
    testData = getTestData();
  })

  afterEach(() => {
    vi.restoreAllMocks();
  });
 
  it('レンダリング', () => {
    render(RegisteredModal, { isDisplay: true, bookInfo: testData });

    expect(screen.getByText(testData.title)).toBeInTheDocument();
		expect(screen.getByText('No Image')).toBeInTheDocument();
    expect(screen.getByText('削除')).toBeInTheDocument();
    expect(screen.getByText('編集')).toBeInTheDocument();
    expect(screen.getByText('キャンセル')).toBeInTheDocument();
  });

  it('isDisplayがFaulthyな場合に非表示に変わること', async () => {
    const testId = 'layerZ30';
    const { component } = render(RegisteredModal, { isDisplay: true, bookInfo: testData });
    
    expect(screen.getByTestId(testId)).toBeInTheDocument();
    
    await component.$set({ isDisplay: false, bookInfo: testData });
    expect(screen.getByTestId(testId)).toHaveClass('hidden');
  });
  
  it('閉じる・キャンセルボタンクリックで非表示に変わること', async () => {
    const testId = 'layerZ30';
    const { component } = render(RegisteredModal, { isDisplay: true, bookInfo: testData });
    
    const btnClose = screen.getByTestId('btnClose');
    const btnCancel = screen.getByText('キャンセル');
    
    await fireEvent.click(btnClose);
    expect(screen.getByTestId(testId)).toHaveClass('hidden');
 
    await component.$set({ isDisplay: true, bookInfo: testData });
    await fireEvent.click(btnCancel);
    expect(screen.getByTestId(testId)).toHaveClass('hidden');
  });

  it('削除成功時に、イベントを発信できること', async () => {
    let mockFetch = vi.spyOn(global, 'fetch');
    mockFetch.mockImplementation(async () => new Response('成功しました。', {status: 200}));

    const { component } = render(RegisteredModal, { isDisplay: true, bookInfo: testData });
		const mockSuccess = vitest.fn();
		component.$on('success', mockSuccess);

    const btnDelete = screen.getByText('削除');
    //確認ダイアログをOKに認識させる
    const confirmSpy = vi.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(vi.fn(() => true));

    await fireEvent.click(btnDelete);
    
    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalled();
    }, {timeout: 3000});
  });

  it('削除失敗時に、イベントを発信できること', async () => {
    let mockFetch = vi.spyOn(global, 'fetch');
    mockFetch.mockImplementation(async () => new Response('失敗しました', {status: 500}));

    const { component } = render(RegisteredModal, { isDisplay: true, bookInfo: testData });
		const mockFailure = vitest.fn();
		component.$on('failed', mockFailure);

    const btnDelete = screen.getByText('削除');
    //確認ダイアログをOKに認識させる
    const confirmSpy = vi.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(vi.fn(() => true));

    await fireEvent.click(btnDelete);
    
    await waitFor(() => {
      expect(mockFailure).toHaveBeenCalled();
    }, {timeout: 3000});
  });

  it('更新成功時に、イベントを発信できること', async () => {
    let mockFetch = vi.spyOn(global, 'fetch');
    mockFetch.mockImplementation(async () => new Response('成功しました。', {status: 200}));

    const { component } = render(RegisteredModal, { isDisplay: true, bookInfo: testData });
		const mockSuccess = vitest.fn();
		component.$on('success', mockSuccess);

    const btnUpdate = screen.getByText('編集');
    await fireEvent.click(btnUpdate);
    
    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalled();
    }, {timeout: 3000});
  });

  it('更新失敗時に、イベントを発信できること', async () => {
    let mockFetch = vi.spyOn(global, 'fetch');
    mockFetch.mockImplementation(async () => new Response('失敗しました', {status: 500}));

    const { component } = render(RegisteredModal, { isDisplay: true, bookInfo: testData });
		const mockFailure = vitest.fn();
		component.$on('failed', mockFailure);

    const btnUpdate = screen.getByText('編集');
    await fireEvent.click(btnUpdate);
    
    await waitFor(() => {
      expect(mockFailure).toHaveBeenCalled();
    }, {timeout: 3000});
  });
});