import type { BookSearchResponseItem } from '$lib/client/Application/Interface';
import { bookSearchView } from '$lib/client/Application/Views/BookSearch';
import { convertResponseToBookSearch } from '$lib/client/Domain/Entities/BookSearch';
import ItemModal from '$lib/client/UI/Search/ItemModal/ItemModal.svelte';
import { gapiTestDatas } from '$lib/mock/Data';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi, vitest } from 'vitest';

//dialogタグの関数がJSDomだとサポートされていない？ためスキップ
describe.skip('ContentModal', async () => {
	const entity = convertResponseToBookSearch(gapiTestDatas.items![0]);
	const view = bookSearchView(entity);
	const bookSearch: BookSearchResponseItem = { entity, view };

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('レンダリング', () => {
		render(ItemModal, { isDisplay: true, bookSearch });

		expect(screen.getByText('書籍登録')).toBeInTheDocument();
		expect(screen.getByAltText('書影')).toBeInTheDocument();
		expect(screen.queryByText('削除')).not.toBeInTheDocument();
		expect(screen.getByText('登録')).toBeInTheDocument();
		expect(screen.getByText('キャンセル')).toBeInTheDocument();
	});

	it('isDisplayがFaulthyな場合に非表示に変わること', async () => {
		const testId = 'layerZ30';
		const { component } = render(ItemModal, { isDisplay: true, bookSearch });

		expect(screen.getByTestId(testId)).toBeInTheDocument();

		await component.$set({ isDisplay: false, bookSearch });
		expect(screen.getByTestId(testId)).toHaveClass('hidden');
	});

	it('閉じる・キャンセルボタンクリックで非表示に変わること', async () => {
		const testId = 'layerZ30';
		const { component } = render(ItemModal, { isDisplay: true, bookSearch });

		const btnClose = screen.getByTestId('btnClose');
		const btnCancel = screen.getByText('キャンセル');

		await fireEvent.click(btnClose);
		expect(screen.getByTestId(testId)).toHaveClass('hidden');

		await component.$set({ isDisplay: true, bookSearch });
		await fireEvent.click(btnCancel);
		expect(screen.getByTestId(testId)).toHaveClass('hidden');
	});

	it('登録成功時に、イベントを発信できること', async () => {
		//fetchのモックを作成
		let mockFetch = vi.spyOn(global, 'fetch');
		mockFetch.mockImplementation(async () => new Response('成功しました。', { status: 201 }));

		const { component } = render(ItemModal, { isDisplay: true, bookSearch });
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

		const { component } = render(ItemModal, { isDisplay: true, bookSearch });
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
