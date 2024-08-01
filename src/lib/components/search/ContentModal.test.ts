import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi, vitest } from 'vitest';
import { requestBookInfosByQueries } from '$lib/GoogleBooksAPI/RequestManage';
import type { books_v1 } from 'googleapis';
import ContentModal from '$lib/components/search/ContentModal.svelte';

//dialogタグの関数がJSDomだとサポートされていない？ためスキップ
describe.skip('ContentModal', async () => {
	const isbn = '978-4-15-120051-9';
	const result: books_v1.Schema$Volumes = await requestBookInfosByQueries('', '', isbn, 10, 0);
	const item: books_v1.Schema$Volume = result.items![0];

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('レンダリング', () => {
		render(ContentModal, { isDisplay: true, item });

		expect(screen.getByText('書籍登録')).toBeInTheDocument();
		expect(screen.getByAltText('書影')).toBeInTheDocument();
		expect(screen.queryByText('削除')).not.toBeInTheDocument();
		expect(screen.getByText('登録')).toBeInTheDocument();
		expect(screen.getByText('キャンセル')).toBeInTheDocument();
	});

	it('isDisplayがFaulthyな場合に非表示に変わること', async () => {
		const testId = 'layerZ30';
		const { component } = render(ContentModal, { isDisplay: true, item });

		expect(screen.getByTestId(testId)).toBeInTheDocument();

		await component.$set({ isDisplay: false, item });
		expect(screen.getByTestId(testId)).toHaveClass('hidden');
	});

	it('閉じる・キャンセルボタンクリックで非表示に変わること', async () => {
		const testId = 'layerZ30';
		const { component } = render(ContentModal, { isDisplay: true, item });

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
		mockFetch.mockImplementation(async () => new Response('成功しました。', { status: 201 }));

		const { component } = render(ContentModal, { isDisplay: true, item });
		const mockSuccess = vitest.fn();
		component.$on('success', mockSuccess);

		const btnRegister = screen.getByText('登録');
		await fireEvent.click(btnRegister);

		await waitFor(
			() => {
				expect(mockSuccess).toHaveBeenCalled();
			},
			{ timeout: 3000 }
		);
	});

	it('登録失敗時に、イベントを発信できること', async () => {
		let mockFetch = vi.spyOn(global, 'fetch');
		mockFetch.mockImplementation(async () => new Response('失敗しました', { status: 500 }));

		const { component } = render(ContentModal, { isDisplay: true, item });
		const mockFailure = vitest.fn();
		component.$on('failed', mockFailure);

		const btnRegister = screen.getByText('登録');
		await fireEvent.click(btnRegister);

		await waitFor(
			() => {
				expect(mockFailure).toHaveBeenCalled();
			},
			{ timeout: 3000 }
		);
	});
});
