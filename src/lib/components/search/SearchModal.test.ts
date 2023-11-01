import { render, screen } from '@testing-library/svelte';
import { describe, expect, it, vitest } from 'vitest';
import SearchModal from '$lib/components/search/SearchModal.svelte';
import userEvent from '@testing-library/user-event';
import { goto } from '$app/navigation';

//ページ遷移をテストできないので、一旦コメントアウト
describe('SearchModal', () => {
  // vitest.mock('$app/navigation', () => ({
  //     goto: vitest.fn(),
  // }))

  // it('検索条件入力時、検索ボタンをクリックした際にページ遷移すること', async () => {
  // });

  // it('検索条件未入力時、検索ボタンをクリックしてもページ遷移しないこと', () => {

  // });

  // it('閉じる・キャンセルボタンクリック時、モーダルが非表示になること', () => {

  // });
});