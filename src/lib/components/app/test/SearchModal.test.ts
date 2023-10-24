import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, expect, it, vitest } from 'vitest';
import SearchModal from '../SearchModal.svelte';
import userEvent from '@testing-library/user-event';
import { goto } from '$app/navigation';

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