import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import type * as stores from '$app/stores';
import type * as customTypes from '$lib/customTypes';
import ContentFilters from '$lib/components/header/ContentFilters.svelte';
import { readable } from 'svelte/store';
import type { Navigation, Page } from '@sveltejs/kit';

describe('ContentFilters', () => {
  //Svelte固有の機能をMock化
  vi.mock('$app/stores', (): typeof stores => {
    const getStores: typeof stores.getStores = () => {
      const navigating = readable<Navigation | null>(null);
      const page = readable<Page>({
        url: new URL('http://localhost'),
        params: {},
        route: {
          id: null
        },
        status: 200,
        error: null,
        data: {},
        form: undefined
      });
      const updated = { subscribe: readable(false).subscribe, check: async () => false };

      return { navigating, page, updated };
    };
    const page: typeof stores.page = {
      subscribe(fn) {
        return getStores().page.subscribe(fn);
      }
    };
    const navigating: typeof stores.navigating = {
      subscribe(fn) {
        return getStores().navigating.subscribe(fn);
      }
    };
    const updated: typeof stores.updated = {
      subscribe(fn) {
        return getStores().updated.subscribe(fn);
      },
      check: async () => false
    };

    return {
      getStores,
      navigating,
      page,
      updated
    };
  });

  //データ作成
	const MenuItemDatas: customTypes.menuItemData[] = [
		{ ref: '/books', name: '全ての本' },
		{ ref: '/books/wish', name: '読みたい'},
		{ ref: '/books/reading', name: '読んでいる'},
		{ ref: '/books/complete', name: '読み終わった'}
	];

  it('レンダリング', () => {
      render(ContentFilters);

      MenuItemDatas.forEach(item => expect(screen.getByText(item.name)).toBeInTheDocument());
  });

  //バインドはテストできない
  //it('トグルボタンの状態をバインドできるか', () => { });
});
