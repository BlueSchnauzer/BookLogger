import { render, fireEvent, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import SideMenuItem from '$lib/components/app/SideMenuItem.svelte';
import BottomMenuItem from '$lib/components/app/BottomMenuItem.svelte';
import ContentHeader from '$lib/components/app/ContentHeader.svelte';
import ContentFilters from '$lib/components/app/ContentFilters.svelte';
import type * as customTypes from '$lib/customTypes';
import Dashboard from '$lib/icons/Dashboard.svelte';
import BookCase from '$lib/icons/BookCase.svelte';
import CompleteBook from '$lib/icons/CompleteBook.svelte';
import BookShelf from '$lib/icons/BookShelf.svelte';
import { describe, expect, it, vitest } from 'vitest';
import type { ComponentType } from 'svelte';
import type { IBookInfo } from '$lib/server/models/BookInfo';
import { ObjectId } from 'mongodb';
import BookInfoGrid from './BookInfoGrid.svelte';
import SearchModal from './SearchModal.svelte';
import { goto } from '$app/navigation';

describe('SideMenuItem', () => {
    //データ作成
    const MenuItemDatas: customTypes.menuItemData[] = [
        { icon: Dashboard, ref: '/dashboard', jpName: 'ダッシュボード', enName: 'DashBoard' },
        { icon: CompleteBook, ref: '/books/complete', jpName: '読み終わった本', enName: 'Complete' },
        { icon: BookShelf, ref: '/shelfs', jpName: '本棚', enName: 'Shelfs' }
    ];
    const colorStone200 = '#E7E5E4';
    let currentMenu: ComponentType = Dashboard;

    it('レンダリング', () => {
        const {container} = render(SideMenuItem, { MenuItemDatas, currentMenu, iconColor: colorStone200 });

        const dashboard = container.querySelector<HTMLElement>(`a[href="${MenuItemDatas[0].ref}"]`)!;
        expect(dashboard).toBeInTheDocument();
        const CompleteBook = container.querySelector<HTMLElement>(`a[href="${MenuItemDatas[1].ref}"]`)!;
        expect(CompleteBook).toBeInTheDocument();
        const BookShelf = container.querySelector<HTMLElement>(`a[href="${MenuItemDatas[2].ref}"]`)!;
        expect(BookShelf).toBeInTheDocument();
    });

    it('クリックに応じてCSSクラスが付与されること', async () => {
        const {container} = render(SideMenuItem, { MenuItemDatas, currentMenu, iconColor: colorStone200 });

        const firstItem = container.querySelector<HTMLElement>(`li:nth-child(1)`)!;
        expect(firstItem).toHaveClass('border-x-lime-600');

        const secondItem = container.querySelector<HTMLElement>(`li:nth-child(2)`)!;
        await fireEvent.click(secondItem);
        expect(secondItem).toHaveClass('border-x-lime-600');
    });
});

describe('BottomMenuItem', () => {
    //データ作成
    const MenuItemDatas: customTypes.menuItemData[] = [
        { icon: Dashboard, ref: '/dashboard', jpName: 'ダッシュボード', enName: 'DashBoard' },
        { icon: CompleteBook, ref: '/books/complete', jpName: '読み終わった本', enName: 'Complete' },
        { icon: BookShelf, ref: '/shelfs', jpName: '本棚', enName: 'Shelfs' }
    ];
    const colorStone200 = '#E7E5E4';
    let currentMenu: ComponentType = Dashboard;

    it('レンダリング', () => {
        const {container} = render(BottomMenuItem, { MenuItemDatas, currentMenu, iconColor: colorStone200 });

        const dashboard = container.querySelector<HTMLElement>(`a[href="${MenuItemDatas[0].ref}"]`)!;
        expect(dashboard).toBeInTheDocument();
        const CompleteBook = container.querySelector<HTMLElement>(`a[href="${MenuItemDatas[1].ref}"]`)!;
        expect(CompleteBook).toBeInTheDocument();
        const BookShelf = container.querySelector<HTMLElement>(`a[href="${MenuItemDatas[2].ref}"]`)!;
        expect(BookShelf).toBeInTheDocument();
    });

    it('クリックに応じてCSSクラスが付与されること', async () => {
        const {container} = render(BottomMenuItem, { MenuItemDatas, currentMenu, iconColor: colorStone200 });

        const firstItem = container.querySelector<HTMLElement>(`li:nth-child(1)`)!;
        expect(firstItem).toHaveClass('border-y-lime-600');

        const secondItem = container.querySelector<HTMLElement>(`li:nth-child(2)`)!;
        await fireEvent.touchEnd(secondItem);
        expect(secondItem).toHaveClass('border-y-lime-600');
    });
});

describe('ContentHeader', () => {
    //データ作成
    it('レンダリング', () => {
        const { container } = render(ContentHeader, { headerIcon: BookCase, headerText: 'テスト' });

        expect(container.querySelector('.flex > #Layer_1')).toBeInTheDocument();
        expect(screen.getByRole('heading')).toBeInTheDocument();
        expect(screen.getByTestId('btnDisplaySearch')).toHaveClass('invisible');
    });

    it('ボタンを表示状態でレンダリング', () => {
        const { container } = render(ContentHeader, { headerIcon: BookCase, headerText: 'テスト', isDisplayAddButton: true });

        expect(container.querySelector('.flex > #Layer_1')).toBeInTheDocument();
        expect(screen.getByRole('heading')).toBeInTheDocument();
        expect(screen.getByTestId('btnDisplaySearch')).toBeInTheDocument();
    });

    //ボタンクリックイベントを検知
    it('ボタンクリックで検索モーダルを表示できること', async () => {
        const { container } = render(ContentHeader, { headerIcon: BookCase, headerText: 'テスト', isDisplayAddButton: true });

        const btnDisplaySearch = screen.getByTestId('btnDisplaySearch');

        await fireEvent.click(btnDisplaySearch);
        expect(screen.getByTestId('fullCoverZ10')).not.toHaveClass('hidden');

        await fireEvent.click(btnDisplaySearch);
        expect(screen.getByTestId('fullCoverZ10')).toHaveClass('hidden');
    });
});

describe('ContentFilters', () => {
    //データ作成
    let toggleFilterItems: customTypes.toggleFilterItem[] = [
        { id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true },
        { id: 2, text: '読みたい', type: 'status', isChecked: false, isVisible: true },
    ];
    let selectFilterItems: customTypes.selectFilterItem[] = [
        { id: 1, text: '最近追加した順' },
        { id: 2, text: '最近読み終わった順' }
    ];
    let inputValue = "";
    let selectValue = -1;

    it('レンダリング', () => {
        render(ContentFilters, { toggleFilterItems, inputValue, selectFilterItems, selectValue });

        expect(screen.getByText(toggleFilterItems[0].text)).toBeInTheDocument();
        expect(screen.getByText(selectFilterItems[0].text)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('タイトル、著者名...')).toBeInTheDocument();
    });

    it('トグルフィルターボタンのクリック時に、フラグがオンになること', async () => {
        render(ContentFilters, { toggleFilterItems, inputValue, selectFilterItems, selectValue });

        const toggleButton = screen.getByText(toggleFilterItems[0].text);
        await fireEvent.click(toggleButton);
        expect(toggleFilterItems[0].isChecked).toBeTruthy();
    });

    it('テキストフィルターの表示を切り替えられること', () => {
        const { container } = render(ContentFilters, { toggleFilterItems, inputValue, selectFilterItems, selectValue });

        const btnDisplay = screen.getByTestId('btnDisplayFilterText');
        fireEvent.click(btnDisplay);
        expect(screen.getByPlaceholderText('タイトル、著者名...')).toBeVisible();

        fireEvent.click(btnDisplay);
        //TailWindCss利用時は単に`.not.toBeVisible()`では検知できなかった。
        expect(screen.getByPlaceholderText('タイトル、著者名...')).toHaveClass('hidden');
    });

    it('リストフィルターの表示を切り替えられること', async () => {
        render(ContentFilters, { toggleFilterItems, inputValue, selectFilterItems, selectValue });

        const btnDisplay = screen.getByTestId('btnDisplayFilterOptions');
        await fireEvent.click(btnDisplay);

        const options = screen.getByTestId('filterOptions');
        expect(options).toBeVisible();

        await fireEvent.click(btnDisplay);
        expect(options).toHaveClass('hidden');
    });

    //バインドはテストできない
    //it('トグルボタンの状態をバインドできるか', () => { });
});

describe('BookInfoGrid', () => {
    let bookInfos : IBookInfo[] = [
        {
            _id: new ObjectId('651451ed67241f439ce8a1af'),
            userId: 1,
            isVisible: true,
            isbn_13: '978-4-15-031316-6',
            title: 'エピローグ',
            imageUrl: '',
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
            isbn_13: '978-4-16-791019-8',
            title: 'プロローグ',
            imageUrl: '',
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

    it('Propsに応じて書誌情報を非表示にできること', async () =>{
        const { component } = render(BookInfoGrid, {bookInfos});

        expect(screen.queryByTitle(bookInfos[0].title)).toBeInTheDocument();
        
        bookInfos[0].isVisible = false;
        await component.$set({bookInfos});

        expect(screen.queryByTitle(bookInfos[0].title)).not.toBeInTheDocument();
        expect(screen.getByTitle(bookInfos[1].title)).toBeInTheDocument();
    });

    it('グリッドアイテムクリックでサブメニュー用のデータと、クリックイベントを検知できること', async () => {
      const { component } = render(BookInfoGrid, {bookInfos});

      const gridItem = screen.queryByTitle(bookInfos[0].title)!;
      const mock = vitest.fn();

      component.$on('click', mock);
      await fireEvent.click(gridItem);

      expect(mock).toHaveBeenCalled();
    });
    
    it('タイトルクリックでページ移動と、クリックイベントを検知できること', async () => {
      const { component } = render(BookInfoGrid, {bookInfos});
      
      const link = screen.getByRole('link');
      const mock = vitest.fn();

      component.$on('click', mock);
      await fireEvent.click(link);

      expect(mock).toHaveBeenCalled();
    });

    it('ボタンクリックでお気に入りを切り替えられ、クリックイベントを検知できること', async () => {
        const { component } = render(BookInfoGrid, {bookInfos});

        const favorite = screen.getByRole('button');
        const mock = vitest.fn();

        component.$on('click', mock);
        await fireEvent.click(favorite);

        expect(bookInfos[0].isFavorite).toBeFalsy();
        expect(mock).toHaveBeenCalled();
    });
});

//ページ遷移をテストできていない
describe('SearchModal', () => {
    vitest.mock('$app/navigation', () => ({
        goto: vitest.fn(),
    }))

    it('検索条件入力時、検索ボタンをクリックした際にページ遷移すること', async () => {
        render(SearchModal, { isDisplay: true });

        const inputTitle = screen.getByRole('textbox', { name: 'author'});
        const btnSearch = screen.getByText('検索');

        await userEvent.type(inputTitle, 'イシグロカズオ');
        await userEvent.click(btnSearch);

        expect(goto).toHaveBeenCalledWith('books/searchresult');
    });

    it('検索条件未入力時、検索ボタンをクリックしてもページ遷移しないこと', () => {

    });

    it('閉じる・キャンセルボタンクリック時、モーダルが非表示になること', () => {

    });
});