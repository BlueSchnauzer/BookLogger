import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, expect, it, vitest } from 'vitest';
import BookInfoList from '$lib/components/content/BookInfoList.svelte';
import { ObjectId } from 'mongodb';
import type { BookInfo } from '$lib/server/models/BookInfo';

describe('BookInfoList', () => {
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
      render(BookInfoList, {bookInfos});

      expect(screen.getByTitle(bookInfos[0].title)).toBeInTheDocument();
      expect(screen.getByTitle(bookInfos[1].title)).toBeInTheDocument();
  });

  it('Propsに応じて書誌情報を非表示にできること', async () =>{
      const { component } = render(BookInfoList, {bookInfos});

      expect(screen.queryByTitle(bookInfos[0].title)).toBeInTheDocument();
      
      bookInfos[0].isVisible = false;
      await component.$set({bookInfos});

      expect(screen.queryByTitle(bookInfos[0].title)).not.toBeInTheDocument();
      expect(screen.getByTitle(bookInfos[1].title)).toBeInTheDocument();
  });

  it('', () => {

  });
  
  it('ボタンクリックでお気に入りを切り替えられること', async () => {
      const { component } = render(BookInfoList, {bookInfos});

      const favorite = screen.getByRole('button');
      const mock = vitest.fn();

      component.$on('click', mock);
      await fireEvent.click(favorite);

      expect(bookInfos[0].isFavorite).toBeFalsy();
      expect(mock).toHaveBeenCalled();
  });
});
