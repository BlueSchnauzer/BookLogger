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
  });
});
