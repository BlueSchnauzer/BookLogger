import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import type { Navigation, Page } from '@sveltejs/kit';
import { readable } from 'svelte/store';
import type * as stores from '$app/stores';
import SideMenu from '$lib/components/menu/SideMenu.svelte';


describe('SideMenu', () => {
  //共通化が必要
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

  it('レンダリング', () => {
    render(SideMenu);

    expect(screen.getByText('ホーム')).toBeInTheDocument();
    expect(screen.getByText('ライブラリ')).toBeInTheDocument();
    expect(screen.getByText('書籍検索')).toBeInTheDocument();
    expect(screen.getByText('本棚')).toBeInTheDocument();
  });
});
