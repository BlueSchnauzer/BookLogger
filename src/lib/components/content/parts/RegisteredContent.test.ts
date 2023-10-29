import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import type { BookInfo } from '$lib/server/models/BookInfo';
import { ObjectId } from 'mongodb';
import RegisteredContent from '$lib/components/content/parts/RegisteredContent.svelte';
import { convertDate } from '$lib/utils';

describe('RegisteredContent', async () => {
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

	it('レンダリング', () => {
		render(RegisteredContent, {bookInfo});

		expect(screen.getByAltText('書影')).toBeInTheDocument();
		expect(screen.getByText(bookInfo.title!)).toBeInTheDocument();
		expect(screen.getByText(bookInfo.author?.join(',')!)).toBeInTheDocument();
		expect(screen.getByText(bookInfo.pageCount!)).toBeInTheDocument();
		expect(screen.getByText(convertDate(bookInfo.history[0].date))).toBeInTheDocument();
		expect(screen.getByText(bookInfo.history[0].currentPage)).toBeInTheDocument();
	});
});