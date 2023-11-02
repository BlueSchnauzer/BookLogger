import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, expect, it, vitest } from 'vitest';
import SearchResult from '$lib/components/search/result/SearchResult.svelte';
import type { books_v1 } from 'googleapis';
import { getBookInfosByQueries } from '$lib/GoogleBooksAPI/RequestManage';

//awaitがテストできないので保留
describe('SearchResult', () => {
  it.skip('レンダリング', () => {

  });
});