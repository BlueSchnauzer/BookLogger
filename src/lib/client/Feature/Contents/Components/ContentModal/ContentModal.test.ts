import type { BookInfoResponseItem } from '$lib/client/Application/Interface';
import ContentModal from '$lib/client/Feature/Contents/Components/ContentModal/ContentModal.svelte';
import { bookInfoResponseItemMock } from '$lib/mock/Data';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi, vitest } from 'vitest';

//dialogタグの関数がJSDomだとサポートされていない？ためスキップ
describe.skip('ContentModal', async () => {
	let testData: BookInfoResponseItem;
	beforeEach(() => {
		testData = bookInfoResponseItemMock();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('レンダリング', () => {
		render(ContentModal, { isDisplay: true, item: testData });

		expect(screen.getByText(testData.entity.title)).toBeInTheDocument();
		expect(screen.getByText('No Image')).toBeInTheDocument();
		expect(screen.getByText('削除')).toBeInTheDocument();
		expect(screen.getByText('編集')).toBeInTheDocument();
		expect(screen.getByText('キャンセル')).toBeInTheDocument();
	});

	it('isDisplayがFaulthyな場合に非表示に変わること', async () => {
		const testId = 'registeredDialog';
		const { component } = render(ContentModal, { isDisplay: true, item: testData });

		expect(screen.getByTestId(testId)).toBeInTheDocument();

		await component.$set({ isDisplay: false, item: testData });
		expect(screen.getByTestId(testId)).not.toBeVisible();
	});

	it('閉じる・キャンセルボタンクリックで非表示に変わること', async () => {
		const testId = 'registeredDialog';
		const { component } = render(ContentModal, { isDisplay: true, item: testData });

		const btnClose = screen.getByTestId('btnClose');
		const btnCancel = screen.getByText('キャンセル');

		await fireEvent.click(btnClose);
		expect(screen.getByTestId(testId)).not.toBeVisible();

		await component.$set({ isDisplay: true, item: testData });
		await fireEvent.click(btnCancel);
		expect(screen.getByTestId(testId)).not.toBeVisible();
	});

	it('削除成功時に、イベントを発信できること', async () => {
		let mockFetch = vi.spyOn(global, 'fetch');
		mockFetch.mockImplementation(async () => new Response('成功しました。', { status: 200 }));

		const { component } = render(ContentModal, { isDisplay: true, item: testData });
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

		const { component } = render(ContentModal, { isDisplay: true, item: testData });
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

		const { component } = render(ContentModal, { isDisplay: true, item: testData });
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

		const { component } = render(ContentModal, { isDisplay: true, item: testData });
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
