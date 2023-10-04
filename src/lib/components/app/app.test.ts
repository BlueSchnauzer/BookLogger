import { render, fireEvent, screen } from '@testing-library/svelte';
import SideMenuItem from '$lib/components/app/SideMenuItem.svelte';
import BottomMenuItem from '$lib/components/app/BottomMenuItem.svelte';
import ContentHeader from '$lib/components/app/ContentHeader.svelte';
import ContentFilters from '$lib/components/app/ContentFilters.svelte';
import type * as customTypes from '$lib/customTypes';
import Dashboard from '$lib/icons/Dashboard.svelte';
import BookCase from '$lib/icons/BookCase.svelte';
import CompleteBook from '$lib/icons/CompleteBook.svelte';
import BookShelf from '$lib/icons/BookShelf.svelte';
import { describe, expect, it } from 'vitest';
import type { ComponentType } from 'svelte';

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

    it('propsに応じてCSSクラスが付与されること', () => {
        const {container} = render(SideMenuItem, { MenuItemDatas, currentMenu, iconColor: colorStone200 });

        const firstItem = container.querySelector<HTMLElement>(`li:nth-child(1)`)!;
        expect(firstItem).toHaveClass('border-x-lime-600');
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

    it('propsに応じてCSSクラスが付与されること', () => {
        const {container} = render(BottomMenuItem, { MenuItemDatas, currentMenu, iconColor: colorStone200 });

        const firstItem = container.querySelector<HTMLElement>(`li:nth-child(1)`)!;
        expect(firstItem).toHaveClass('border-y-lime-600');
    });
});

describe('ContentHeader', () => {
    //データ作成
    it('レンダリング', () => {
        const { container } = render(ContentHeader, { headerIcon: BookCase, headerText: 'テスト' });

        expect(container.querySelector('.flex > #Layer_1')).toBeInTheDocument();
        expect(screen.getByRole('heading')).toBeInTheDocument();
        expect(container.querySelector('button.invisible')).toBeInTheDocument();
    });

    it('ボタンを表示状態でレンダリング', () => {
        const { container } = render(ContentHeader, { headerIcon: BookCase, headerText: 'テスト', isDisplayAddButton: true });

        expect(container.querySelector('.flex > #Layer_1')).toBeInTheDocument();
        expect(screen.getByRole('heading')).toBeInTheDocument();
        expect(screen.getByRole('button', { hidden: false })).toBeInTheDocument();
    });

    //ボタンクリックイベントを検知

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
        expect(screen.getByPlaceholderText('書名、作者名...')).toBeInTheDocument();
    });

    it('トグルフィルターボタンのクリック時に、フラグがオンになること', () => {
        render(ContentFilters, { toggleFilterItems, inputValue, selectFilterItems, selectValue });

        const toggleButton = screen.getByText(toggleFilterItems[0].text);
        fireEvent.click(toggleButton);
        expect(toggleFilterItems[0].isChecked).toBeTruthy();
    });

    it('テキストフィルターの表示を切り替えられること', () => {
        const { container } = render(ContentFilters, { toggleFilterItems, inputValue, selectFilterItems, selectValue });

        const btnDisplay = screen.getByTestId('btnDisplayFilterText');
        fireEvent.click(btnDisplay);
        expect(screen.getByPlaceholderText('書名、作者名...')).toBeVisible();

        fireEvent.click(btnDisplay);
        //TailWindCss利用時は単に`.not.toBeVisible()`では検知できなかった。
        expect(screen.getByPlaceholderText('書名、作者名...')).toHaveClass('hidden');
    });

    it('リストフィルターの表示と、リスト選択時に変数が更新されること', () => {
        const { container } = render(ContentFilters, { toggleFilterItems, inputValue, selectFilterItems, selectValue });

        const btnDisplay = screen.getByTestId('btnDisplayFilterOptions');
        fireEvent.click(btnDisplay);

        const options = screen.getByTestId('filterOptions');
        expect(options).toBeVisible();

        fireEvent.click(btnDisplay);
        expect(options).toHaveClass('hidden');
    });

    //バインドはテストできないので別途テストする
    //it('トグルボタンの状態をバインドできるか', () => { });
});