import { BookSearchView } from '$lib/client/Application/Views/BookSearch';
import ResultModal from '$lib/client/UI/Search/ResultModal/ResultModal.svelte';
import { gapiTestDatas } from '$lib/mock/Data';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi, vitest } from 'vitest';

//dialogタグの関数がJSDomだとサポートされていない？ためスキップ
describe.skip('ContentModal', async () => {
	const item = gapiTestDatas.items![0];
	const view = new BookSearchView(item);

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('レンダリング', () => {
		render(ResultModal, { isDisplay: true, view });

		expect(screen.getByText('書籍登録')).toBeInTheDocument();
		expect(screen.getByAltText('書影')).toBeInTheDocument();
		expect(screen.queryByText('削除')).not.toBeInTheDocument();
		expect(screen.getByText('登録')).toBeInTheDocument();
		expect(screen.getByText('キャンセル')).toBeInTheDocument();
	});

	it('isDisplayがFaulthyな場合に非表示に変わること', async () => {
		const testId = 'layerZ30';
		const { component } = render(ResultModal, { isDisplay: true, view });

		expect(screen.getByTestId(testId)).toBeInTheDocument();

		await component.$set({ isDisplay: false, view });
		expect(screen.getByTestId(testId)).toHaveClass('hidden');
	});

	it('閉じる・キャンセルボタンクリックで非表示に変わること', async () => {
		const testId = 'layerZ30';
		const { component } = render(ResultModal, { isDisplay: true, view });

		const btnClose = screen.getByTestId('btnClose');
		const btnCancel = screen.getByText('キャンセル');

		await fireEvent.click(btnClose);
		expect(screen.getByTestId(testId)).toHaveClass('hidden');

		await component.$set({ isDisplay: true, view });
		await fireEvent.click(btnCancel);
		expect(screen.getByTestId(testId)).toHaveClass('hidden');
	});

	it('登録成功時に、イベントを発信できること', async () => {
		//fetchのモックを作成
		let mockFetch = vi.spyOn(global, 'fetch');
		mockFetch.mockImplementation(async () => new Response('成功しました。', { status: 201 }));

		const { component } = render(ResultModal, { isDisplay: true, view });
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

		const { component } = render(ResultModal, { isDisplay: true, view });
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
