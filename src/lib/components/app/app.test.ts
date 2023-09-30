import {render, fireEvent, screen} from '@testing-library/svelte';
import ContentHeader from '$lib/components/app/ContentHeader.svelte';
import ContentFilters from '$lib/components/app/ContentFilters.svelte';
import SideMenuItem from '$lib/components/app/SideMenuItem.svelte';
import type { menuItemData, selectFilterItem, toggleFilterItem } from '$lib/customTypes';
import Dashboard from '$lib/icons/Dashboard.svelte';
import BookCase from '$lib/icons/BookCase.svelte';
import PileOfBooks from '$lib/icons/PileOfBooks.svelte';
import { describe, expect, it } from 'vitest';

describe('ContentHeader', () => {
    it('レンダリング', () => {
        const { container } = render(ContentHeader, {headerIcon: BookCase, headerText: 'テスト'});

        expect(() => container.querySelector('.flex > #Layer_1')).not.toThrow();
        expect(() => screen.getByRole('heading')).not.toThrow();
        expect(() => screen.getByRole('button', {hidden: true})).not.toThrow();
    });

    it('ボタンを表示状態でレンダリング', () => {
        const { container } = render(ContentHeader, {headerIcon: BookCase, headerText: 'テスト', isDisplayAddButton: true});
  
        expect(() => container.querySelector('.flex > #Layer_1')).not.toThrow();
        expect(() => screen.getByRole('heading')).not.toThrow();
        expect(() => screen.getByRole('button', {hidden: false})).not.toThrow();
    });

    //ボタンクリックイベントを検知

});

describe('ContentFilters', () => {
    let toggleFilterItems: toggleFilterItem[] = [{ id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true }];
    let selectFilterItems: selectFilterItem[] = [{ id: 1, text: '最近追加した順' }];
    let inputValue = "";
    let selectValue = -1;

    it('レンダリング', () => {
        render(ContentFilters, {toggleFilterItems, inputValue, selectFilterItems, selectValue});

        expect(() => screen.getByText(toggleFilterItems[0].text)).not.toThrow();
        expect(() => screen.getByText(selectFilterItems[0].text)).not.toThrow();
        expect(() => screen.getByPlaceholderText('書名、作者名...')).not.toThrow();
    });

    it('トグルボタンの状態をバインドできるか', () => {
        render(ContentFilters, { toggleFilterItems, inputValue, selectFilterItems, selectValue});

    });
});