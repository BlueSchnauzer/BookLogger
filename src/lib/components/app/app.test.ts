import {render, fireEvent, screen} from '@testing-library/svelte';
import ContentHeader from '$lib/components/app/ContentHeader.svelte';
import ContentFilters from '$lib/components/app/ContentFilters.svelte';
import type * as customTypes from '$lib/customTypes';
import BookCase from '$lib/icons/BookCase.svelte';
import { describe, expect, it } from 'vitest';


describe('ContentHeader', () => {
    it('レンダリング', () => {
        const { container } = render(ContentHeader, {headerIcon: BookCase, headerText: 'テスト'});

        expect(container.querySelector('.flex > #Layer_1')).toBeInTheDocument();
        expect(screen.getByRole('heading')).toBeInTheDocument();
        expect(container.querySelector('button.invisible')).toBeInTheDocument();
    });

    it('ボタンを表示状態でレンダリング', () => {
        const { container } = render(ContentHeader, {headerIcon: BookCase, headerText: 'テスト', isDisplayAddButton: true});
  
        expect(container.querySelector('.flex > #Layer_1')).toBeInTheDocument();
        expect(screen.getByRole('heading')).toBeInTheDocument();
        expect(screen.getByRole('button', {hidden: false})).toBeInTheDocument();
    });

    //ボタンクリックイベントを検知

});

describe('ContentFilters', () => {
    let toggleFilterItems: customTypes.toggleFilterItem[] = [{ id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true }];
    let selectFilterItems: customTypes.selectFilterItem[] = [{ id: 1, text: '最近追加した順' }];
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