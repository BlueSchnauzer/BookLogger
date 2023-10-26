import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, expect, it, vitest } from 'vitest';
import BookInfoGrid from '../BookInfoGrid.svelte';
import { ObjectId } from 'mongodb';
import type { BookInfo } from '$lib/server/models/BookInfo';

describe('BookInfoGrid', () => {
  let bookInfos : BookInfo[] = [
      {
          _id: new ObjectId('651451ed67241f439ce8a1af'),
          userId: 1,
          isVisible: true,
          identifier: {
            isbn_13: '978-4-15-031316-6'
          },
          title: 'エピローグ',
          author: ['円城塔'],
          thumbnail: '',
          createDate: new Date,
          updateDate: new Date,
          pageCount: -1,
          history: [{
              date: new Date,
              currentPage: 0
          }],
          isFavorite: false,
          isCompleted: false,
          memorandum: 'メモです1'
      },
      {
          _id: new ObjectId('651451ed67241f439ce8a1af'),
          userId: 1,
          isVisible: true,
          identifier: {
            isbn_13: '978-4-16-791019-8'
          },
          title: 'プロローグ',
          author: ['円城塔'],
          thumbnail: '',
          createDate: new Date,
          updateDate: new Date,
          pageCount: -1,
          history: [{
              date: new Date,
              currentPage: 0
          }],
          isFavorite: false,
          isCompleted: false,
          memorandum: 'メモです2'
      },
  ];

  it('レンダリング', () => {
      render(BookInfoGrid, {bookInfos});

      expect(screen.getByTitle(bookInfos[0].title)).toBeInTheDocument();
      expect(screen.getByTitle(bookInfos[1].title)).toBeInTheDocument();
  });

  it('Propsに応じて書誌情報を非表示にできること', async () =>{
      const { component } = render(BookInfoGrid, {bookInfos});

      expect(screen.queryByTitle(bookInfos[0].title)).toBeInTheDocument();
      
      bookInfos[0].isVisible = false;
      await component.$set({bookInfos});

      expect(screen.queryByTitle(bookInfos[0].title)).not.toBeInTheDocument();
      expect(screen.getByTitle(bookInfos[1].title)).toBeInTheDocument();
  });

  it('グリッドアイテムクリックでサブメニュー用のデータと、クリックイベントを検知できること', async () => {
    const { component } = render(BookInfoGrid, {bookInfos});

    const gridItem = screen.queryByTitle(bookInfos[0].title)!;
    const mock = vitest.fn();

    component.$on('click', mock);
    await fireEvent.click(gridItem);

    expect(mock).toHaveBeenCalled();
  });
  
  it('タイトルクリックでページ移動と、クリックイベントを検知できること', async () => {
    const { component } = render(BookInfoGrid, {bookInfos});
    
    const link = screen.getByRole('link');
    const mock = vitest.fn();

    component.$on('click', mock);
    await fireEvent.click(link);

    expect(mock).toHaveBeenCalled();
  });

  it('ボタンクリックでお気に入りを切り替えられ、クリックイベントを検知できること', async () => {
      const { component } = render(BookInfoGrid, {bookInfos});

      const favorite = screen.getByRole('button');
      const mock = vitest.fn();

      component.$on('click', mock);
      await fireEvent.click(favorite);

      expect(bookInfos[0].isFavorite).toBeFalsy();
      expect(mock).toHaveBeenCalled();
  });
});
