import { render, fireEvent } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import BottomMenu from '$lib/components/menu/BottomMenu.svelte';
import Dashboard from '$lib/icons/Dashboard.svelte';
import CompleteBook from '$lib/icons/CompleteBook.svelte';
import BookShelf from '$lib/icons/BookShelf.svelte';
import type * as customTypes from '$lib/customTypes';
import type { ComponentType } from 'svelte';

describe('BottomMenu', () => {
  //データ作成
  const MenuItemDatas: customTypes.menuItemData[] = [
      { icon: Dashboard, ref: '/dashboard', jpName: 'ダッシュボード', enName: 'DashBoard' },
      { icon: CompleteBook, ref: '/books/complete', jpName: '読み終わった本', enName: 'Complete' },
      { icon: BookShelf, ref: '/shelfs', jpName: '本棚', enName: 'Shelfs' }
  ];
  const colorStone200 = '#E7E5E4';
  let currentMenu: ComponentType = Dashboard;

  it('レンダリング', () => {
      const {container} = render(BottomMenu, { MenuItemDatas, currentMenu, iconColor: colorStone200 });

      const dashboard = container.querySelector<HTMLElement>(`a[href="${MenuItemDatas[0].ref}"]`)!;
      expect(dashboard).toBeInTheDocument();
      const CompleteBook = container.querySelector<HTMLElement>(`a[href="${MenuItemDatas[1].ref}"]`)!;
      expect(CompleteBook).toBeInTheDocument();
      const BookShelf = container.querySelector<HTMLElement>(`a[href="${MenuItemDatas[2].ref}"]`)!;
      expect(BookShelf).toBeInTheDocument();
  });

  it('クリックに応じてCSSクラスが付与されること', async () => {
      const {container} = render(BottomMenu, { MenuItemDatas, currentMenu, iconColor: colorStone200 });

      const firstItem = container.querySelector<HTMLElement>(`li:nth-child(1)`)!;
      expect(firstItem).toHaveClass('border-y-lime-600');

      const secondItem = container.querySelector<HTMLElement>(`li:nth-child(2)`)!;
      await fireEvent.touchEnd(secondItem);
      expect(secondItem).toHaveClass('border-y-lime-600');
  });
});
