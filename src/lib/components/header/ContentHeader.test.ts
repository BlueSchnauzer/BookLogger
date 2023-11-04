import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ContentHeader from '$lib/components/header/ContentHeader.svelte';
import BookCase from '$lib/icons/BookCase.svelte';

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
      render(ContentHeader, { headerIcon: BookCase, headerText: 'テスト', isDisplayAddButton: true });

      const btnDisplaySearch = screen.getByTestId('btnDisplaySearch');

      await fireEvent.click(btnDisplaySearch);
      expect(screen.queryByTestId('layerZ30')).toBeInTheDocument();

      await fireEvent.click(btnDisplaySearch);
      expect(screen.queryByTestId('layerZ30')).not.toBeInTheDocument();
  });
});
