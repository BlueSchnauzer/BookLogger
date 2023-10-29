import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, expect, it, vitest } from 'vitest';
import type * as customTypes from '$lib/customTypes';
import ToggleSwitch from '$lib/components/parts/ToggleSwitch.svelte';
import PrimalyButton from '$lib/components/parts/PrimalyButton.svelte';
import SecondaryButton from '$lib/components/parts/SecondaryButton.svelte';
import CategoryLabel from '$lib/components/parts/CategoryLabel.svelte';
import BookInfoGrid from '$lib/components/parts/BookInfoGrid.svelte';
import PagingLabel from '$lib/components/parts/PagingLabel.svelte';
import { getBookInfosByQueries } from '$lib/GoogleBooksAPI/RequestManage';
import DetailContent from '$lib/components/parts/DetailContent.svelte';
import RegisteredContent from '$lib/components/parts/RegisteredContent.svelte';
import type { books_v1 } from 'googleapis';
import type { BookInfo } from '$lib/server/models/BookInfo';
import { ObjectId } from 'mongodb';
import { convertDate } from '$lib/utils';

describe('ToggleSwitch', () => {
	//データ作成
	let toggleFilterItems: customTypes.toggleFilterItem[] = [
		{ id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true },
		{ id: 2, text: '読みたい', type: 'status', isChecked: false, isVisible: true }
	];

	it('レンダリング', () => {
		const { container } = render(ToggleSwitch, {
			id: toggleFilterItems[0].id,
			text: toggleFilterItems[0].text,
			isChecked: toggleFilterItems[0].isChecked,
			isVisible: toggleFilterItems[0].isVisible
		});

		expect(container.querySelector('input')).toBeInTheDocument();
		expect(screen.getByText(toggleFilterItems[0].text)).toBeInTheDocument();
	});

	it('クリック時にinputタグがcheckedになること', async () => {
		const { container } = render(ToggleSwitch, {
			id: toggleFilterItems[0].id,
			text: toggleFilterItems[0].text,
			isChecked: toggleFilterItems[0].isChecked,
			isVisible: toggleFilterItems[0].isVisible
		});

		await fireEvent.click(screen.getByText(toggleFilterItems[0].text));

		expect(container.querySelector('input')).toBeChecked();
	});

	it('Props変更時にタグが非表示になること', async () => {
		const { container, component } = render(ToggleSwitch, {
			id: toggleFilterItems[0].id,
			text: toggleFilterItems[0].text,
			isChecked: toggleFilterItems[0].isChecked,
			isVisible: toggleFilterItems[0].isVisible
		})

		expect(container.querySelector('div.flex')).toBeInTheDocument();

		toggleFilterItems[0].isVisible = false;
		await component.$set({
			id: toggleFilterItems[0].id,
			text: toggleFilterItems[0].text,
			isChecked: toggleFilterItems[0].isChecked,
			isVisible: toggleFilterItems[0].isVisible
		});

		expect(container.querySelector('div.hidden')).toBeInTheDocument();
	});
});

describe('PrimaryButton', () =>{
	it('レンダリング', () => {
		const component = render(PrimalyButton, { type:'button', text:'button'});
		expect(screen.getByText('button')).toBeInTheDocument();
		component.unmount();

		render(PrimalyButton, {type: 'submit', text: 'submit'});
		expect(screen.getByText('submit')).toBeInTheDocument();
	});

	it('クリックイベントを検知できること', () => {
		const { component } = render(PrimalyButton, { type:'button', text:'button'});
		const btn = screen.getByText('button');
		const mock = vitest.fn();

		component.$on('click', mock);
		fireEvent.click(btn);

		expect(mock).toHaveBeenCalled();
	});
});

describe('SecondaryButton', () => {
	it('レンダリング', () => {
		const component = render(SecondaryButton, { type:'button', text:'button'});
		expect(screen.getByText('button')).toBeInTheDocument();
		component.unmount();

		render(SecondaryButton, {type: 'submit', text: 'submit'});
		expect(screen.getByText('submit')).toBeInTheDocument();
	});

	it('クリックイベントを検知できること', () => {
		const { component } = render(SecondaryButton, { type:'button', text:'button'});
		const btn = screen.getByText('button');
		const mock = vitest.fn();

		component.$on('click', mock);
		fireEvent.click(btn);

		expect(mock).toHaveBeenCalled();
	});
});

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

describe('CategoryLabel', () => {
	it('レンダリング', () => {
		const labelText = 'データあり';
		render(CategoryLabel, { categoryText: 'カテゴリー', condition: true, labelFunction: () => labelText });

		expect(screen.getByText(labelText)).toBeInTheDocument();
	});

	it('conditionがFalthyな場合にテキストの値がデータ無しになること', () => {
		const labelText = 'データあり';
		render(CategoryLabel, { categoryText: 'カテゴリー', condition: false, labelFunction: () => labelText });

		expect(screen.getByText('データ無し')).toBeInTheDocument();
	});
});

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

describe('DetailContent', async () => {
	const isbn = '978-4-15-120051-9';
	const result: books_v1.Schema$Volumes = await getBookInfosByQueries('', '', isbn);
	const item: books_v1.Schema$Volume = result.items![0];

	it('レンダリング', () => {
		render(DetailContent, {item});

		expect(screen.getByAltText('書影')).toBeInTheDocument();
		expect(screen.getByText(item.volumeInfo?.title!)).toBeInTheDocument();
		expect(screen.getByText(item.volumeInfo?.authors?.join(',')!)).toBeInTheDocument();
		expect(screen.getByText('データ無し')).toBeInTheDocument(); //データが無い場合はテキストを変更する
		expect(screen.getByText(item.volumeInfo?.publishedDate!)).toBeInTheDocument();
		expect(screen.getByText(item.volumeInfo?.pageCount!)).toBeInTheDocument();
		expect(screen.getByText(item.volumeInfo?.description!)).toBeInTheDocument();
	});
});

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