import type { LayoutServerLoad } from './$types';
import type { BookInfo } from '$lib/customTypes';

//保存した書籍の情報を取得する(APIへのリクエストはフロントで実行)
export const load = (async () => {
    //DBへアクセスして、ユーザーの書誌情報を取得する。
    const bookInfos : BookInfo[] = [
        {
            isbn_13: '978-4-15-031316-6',
            title: 'エピローグ',
            imageUrl: '',
            registrationDate: new Date,
            updateDate: new Date,
            pageCount: -1,
            history: [{
                date: new Date,
                currentPage: 0
            }],
            isCompleted: false,
            memorandum: 'メモです1'
        },
        {
            isbn_13: '978-4-16-791019-8',
            title: 'プロローグ',
            imageUrl: '',
            registrationDate: new Date,
            updateDate: new Date,
            pageCount: -1,
            history: [{
                date: new Date,
                currentPage: 0
            }],
            isCompleted: true,
            memorandum: 'メモです2'
        },
        {
            isbn_13: '978-4-10-240171-2',
            title: 'クイーンズ・ギャンビット',
            imageUrl: '',
            registrationDate: new Date,
            updateDate: new Date,
            pageCount: -1,
            history: [{
                date: new Date,
                currentPage: 100
            }],
            isCompleted: false,
            memorandum: 'メモです3'
        },
        {
            isbn_13: '978-4-15-120051-9',
            title: 'わたしを離さないで',
            imageUrl: '',
            registrationDate: new Date,
            updateDate: new Date,
            pageCount: -1,
            history: [{
                date: new Date,
                currentPage: 0
            }],
            isCompleted: true,
            memorandum: 'メモです4'
        },
        {
            isbn_13: '978-4-15-010224-1',
            title: '地球の長い午後',
            imageUrl: '',
            registrationDate: new Date,
            updateDate: new Date,
            pageCount: -1,
            history: [{
                date: new Date,
                currentPage: 100
            }],
            isCompleted: false,
            memorandum: 'メモです5'
        },
        {
            isbn_13: '978-4-06-274936-7',
            title: '煙か土か食い物',
            imageUrl: '',
            registrationDate: new Date,
            updateDate: new Date,
            pageCount: -1,
            history: [{
                date: new Date,
                currentPage: 0
            }],
            isCompleted: true,
            memorandum: 'メモです6'
        },
        {
            isbn_13: '',
            title: 'ちょっと長めのテキスト　〜サブタイトルもつけて〜',
            imageUrl: '',
            registrationDate: new Date,
            updateDate: new Date,
            pageCount: -1,
            history: [{
                date: new Date,
                currentPage: 0
            }],
            isCompleted: true,
            memorandum: 'メモです6'
        },
        {
            isbn_13: '',
            title: 'あ１２３４５６７８９い１２３４５６７８９う１２３４５６７８９え１２３４５',
            imageUrl: '',
            registrationDate: new Date,
            updateDate: new Date,
            pageCount: -1,
            history: [{
                date: new Date,
                currentPage: 0
            }],
            isCompleted: true,
            memorandum: 'メモです6'
        },
        {
            isbn_13: '',
            title: 'A123456789B123456789C1234',
            imageUrl: '',
            registrationDate: new Date,
            updateDate: new Date,
            pageCount: -1,
            history: [{
                date: new Date,
                currentPage: 0
            }],
            isCompleted: true,
            memorandum: 'メモです6'
        },
        {
            isbn_13: '',
            title: 'あ１２３４５６７８９い１２３４５６７８９う１２３４５６７８９え１２３４５６７８９お１２３４５６７８９',
            imageUrl: '',
            registrationDate: new Date,
            updateDate: new Date,
            pageCount: -1,
            history: [{
                date: new Date,
                currentPage: 0
            }],
            isCompleted: true,
            memorandum: 'メモです6'
        },
        {
            isbn_13: '',
            title: 'ダミー',
            imageUrl: '',
            registrationDate: new Date,
            updateDate: new Date,
            pageCount: -1,
            history: [{
                date: new Date,
                currentPage: 0
            }],
            isCompleted: true,
            memorandum: 'メモです6'
        },
        {
            isbn_13: '',
            title: 'ダミー',
            imageUrl: '',
            registrationDate: new Date,
            updateDate: new Date,
            pageCount: -1,
            history: [{
                date: new Date,
                currentPage: 0
            }],
            isCompleted: true,
            memorandum: 'メモです6'
        },
        {
            isbn_13: '',
            title: 'ダミー',
            imageUrl: '',
            registrationDate: new Date,
            updateDate: new Date,
            pageCount: -1,
            history: [{
                date: new Date,
                currentPage: 0
            }],
            isCompleted: true,
            memorandum: 'メモです6'
        }
    ];

    return { BookInfos: bookInfos};
}) satisfies LayoutServerLoad;