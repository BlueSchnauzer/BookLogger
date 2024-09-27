import ContentsGrid from '$lib/client/Feature/Contents/Components/ContentsGrid/ContentsGrid.svelte';
import { bookInfoInterfaceMocks } from '$lib/mock/Data';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('BookInfoGrid', () => {
	const bookInfos = bookInfoInterfaceMocks;

	it('レンダリング', () => {
		render(ContentsGrid, { bookInfos, emptyMessage: '', handleClick: () => void 0 });

		expect(screen.getByTitle(bookInfos[0].title)).toBeInTheDocument();
		expect(screen.getByTitle(bookInfos[1].title)).toBeInTheDocument();
		expect(screen.getByTitle(bookInfos[2].title)).toBeInTheDocument();

		//メッセージ確認
	});

	//メッセージが変更できるか

	// it('クリックイベントを検知できること', async () => {
	// 	const { component } = render(ContentsGrid, {
	// 		bookInfos,
	// 		emptyMessage: '',
	// 		handleClick: () => void 0
	// 	});

	// 	const btns = screen.getAllByRole('button');
	// 	const mock = vitest.fn();

	// 	component.$on('click', mock);
	// 	await fireEvent.click(btns[0]);

	// 	expect(mock).toHaveBeenCalled();
	// });
});
