import ContentModal from '$lib/client/Feature/Contents/Components/ContentModal/ContentModal.svelte';
import type { BookInfo } from '$lib/client/Feature/Contents/Domain/Entities/BookInfo';
import { bookInfoInterfaceMock } from '$lib/mock/Data';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi, vitest } from 'vitest';

//dialogタグの関数がJSDomだとサポートされていない？ためスキップ
describe.skip('ContentModal', async () => {
	let bookInfo: BookInfo;
	beforeEach(() => {
		bookInfo = bookInfoInterfaceMock;
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('レンダリング', () => {
		render(ContentModal, { isDisplay: true, bookInfo });

		expect(screen.getByText(bookInfo.title)).toBeInTheDocument();
		expect(screen.getByText('No Image')).toBeInTheDocument();
		expect(screen.getByText('削除')).toBeInTheDocument();
		expect(screen.getByText('編集')).toBeInTheDocument();
		expect(screen.getByText('キャンセル')).toBeInTheDocument();
	});

	it('isDisplayがFaulthyな場合に非表示に変わること', async () => {
		const testId = 'registeredDialog';
		const { component } = render(ContentModal, { isDisplay: true, bookInfo });

		expect(screen.getByTestId(testId)).toBeInTheDocument();

		await component.$set({ isDisplay: false, bookInfo });
		expect(screen.getByTestId(testId)).not.toBeVisible();
	});

	it('閉じる・キャンセルボタンクリックで非表示に変わること', async () => {
		const testId = 'registeredDialog';
		const { component } = render(ContentModal, { isDisplay: true, bookInfo });

		const btnClose = screen.getByTestId('btnClose');
		const btnCancel = screen.getByText('キャンセル');

		await fireEvent.click(btnClose);
		expect(screen.getByTestId(testId)).not.toBeVisible();

		await component.$set({ isDisplay: true, bookInfo });
		await fireEvent.click(btnCancel);
		expect(screen.getByTestId(testId)).not.toBeVisible();
	});

	it('削除成功時に、イベントを発信できること', async () => {
		let mockFetch = vi.spyOn(global, 'fetch');
		mockFetch.mockImplementation(async () => new Response('成功しました。', { status: 200 }));

		const { component } = render(ContentModal, { isDisplay: true, bookInfo });
		const mockSuccess = vitest.fn();
		component.$on('success', mockSuccess);

		const btnDelete = screen.getByText('削除');
		//確認ダイアログをOKに認識させる
		const confirmSpy = vi.spyOn(window, 'confirm');
		confirmSpy.mockImplementation(vi.fn(() => true));

		await fireEvent.click(btnDelete);

		await waitFor(
			() => {
				expect(mockSuccess).toHaveBeenCalled();
			},
			{ timeout: 3000 }
		);
	});

	it('削除失敗時に、イベントを発信できること', async () => {
		let mockFetch = vi.spyOn(global, 'fetch');
		mockFetch.mockImplementation(async () => new Response('失敗しました', { status: 500 }));

		const { component } = render(ContentModal, { isDisplay: true, bookInfo });
		const mockFailure = vitest.fn();
		component.$on('failed', mockFailure);

		const btnDelete = screen.getByText('削除');
		//確認ダイアログをOKに認識させる
		const confirmSpy = vi.spyOn(window, 'confirm');
		confirmSpy.mockImplementation(vi.fn(() => true));

		await fireEvent.click(btnDelete);

		await waitFor(
			() => {
				expect(mockFailure).toHaveBeenCalled();
			},
			{ timeout: 3000 }
		);
	});

	it('更新成功時に、イベントを発信できること', async () => {
		let mockFetch = vi.spyOn(global, 'fetch');
		mockFetch.mockImplementation(async () => new Response('成功しました。', { status: 200 }));

		const { component } = render(ContentModal, { isDisplay: true, bookInfo });
		const mockSuccess = vitest.fn();
		component.$on('success', mockSuccess);

		const btnUpdate = screen.getByText('編集');
		await fireEvent.click(btnUpdate);

		await waitFor(
			() => {
				expect(mockSuccess).toHaveBeenCalled();
			},
			{ timeout: 3000 }
		);
	});

	it('更新失敗時に、イベントを発信できること', async () => {
		let mockFetch = vi.spyOn(global, 'fetch');
		mockFetch.mockImplementation(async () => new Response('失敗しました', { status: 500 }));

		const { component } = render(ContentModal, { isDisplay: true, bookInfo });
		const mockFailure = vitest.fn();
		component.$on('failed', mockFailure);

		const btnUpdate = screen.getByText('編集');
		await fireEvent.click(btnUpdate);

		await waitFor(
			() => {
				expect(mockFailure).toHaveBeenCalled();
			},
			{ timeout: 3000 }
		);
	});
});
