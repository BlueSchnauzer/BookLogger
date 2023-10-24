import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, expect, it, vitest } from 'vitest';
import type * as customTypes from '$lib/customTypes';
import ContentFilters from '$lib/components/app/ContentFilters.svelte';

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
