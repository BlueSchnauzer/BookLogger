import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, expect, it, vitest } from 'vitest';
import type { BookInfo } from '$lib/server/models/BookInfo';
import { ObjectId } from 'mongodb';
import BookInfoGrid from '$lib/components/content/parts/BookInfoGrid.svelte';

describe('BookInfoGrid', () => {
	let bookInfos : BookInfo[] = [
			{
					_id: new ObjectId('651451ed67241f439ce8a1af'),
					userId: 1,
					isVisible: true,
					identifier: {
						isbn_13: '978-4-15-031316-6'
					},
					title: 'エピローグ',
					author: ['円城塔'],
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
			},
			{
					_id: new ObjectId('651451ed67241f439ce8a1af'),
					userId: 1,
					isVisible: true,
					identifier: {
						isbn_13: '978-4-16-791019-8'
					},
					title: 'プロローグ',
					author: ['円城塔'],
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
					memorandum: 'メモです2'
			},
	];

	it('レンダリング', () => {
		render(BookInfoGrid, {bookInfos});

		expect(screen.getByTitle(bookInfos[0].title)).toBeInTheDocument();
		expect(screen.getByTitle(bookInfos[1].title)).toBeInTheDocument();
	});

	it('クリックイベントを検知できること', async () => {
    const { component } = render(BookInfoGrid, {bookInfos});
    
    const btns = screen.getAllByRole('button');
    const mock = vitest.fn();

    component.$on('click', mock);
    await fireEvent.click(btns[0]);

    expect(mock).toHaveBeenCalled();
  });
});
