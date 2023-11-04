import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, expect, it, vitest } from 'vitest';
import PagingLabel from '$lib/components/search/parts/PagingLabel.svelte';

describe('PagingLabel', () => {
	it('レンダリング', () => {
		render(PagingLabel, {startIndex: 0, resultCount: 30});

		expect(screen.getByTitle('前へ')).toBeInTheDocument();
		expect(screen.getByTitle('次へ')).toBeInTheDocument();
		expect(screen.getByText('1～10/30件')).toBeInTheDocument();
	});

	it('クリックイベントを検知できること', async () => {
		const { component } = render(PagingLabel, {startIndex: 0, resultCount: 30});

		const mockPrevious = vitest.fn();
		const btnPrevious = screen.getByTitle('前へ');
		component.$on('backward', mockPrevious);

		const mockNext = vitest.fn();
		const btnNext = screen.getByTitle('次へ');
		component.$on('forward', mockNext);

		await fireEvent.click(btnPrevious);
		await fireEvent.click(btnNext);

		expect(mockPrevious).toHaveBeenCalled();
		expect(mockNext).toHaveBeenCalled();
	});

	it('isLoadingがTruthyな場合にボタンが操作できないこと', async () => {
		render(PagingLabel, {startIndex: 0, resultCount: 30, isLoading: true});

		expect(screen.getByTitle('前へ')).toHaveAttribute('disabled');
		expect(screen.getByTitle('次へ')).toHaveAttribute('disabled');
	});

	it('isBottomとisLoadingがTruethyな場合に、レンダリングされないこと', () => {
		const {container} = render(PagingLabel, {startIndex: 0, resultCount: 30, isBottom: true, isLoading: true});

		const element = container.querySelector('div.flex');
		expect(element).toBeNull;
	});
});
