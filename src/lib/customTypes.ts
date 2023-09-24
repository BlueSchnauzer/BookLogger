import type { ComponentType } from "svelte"

/**メニューの項目データ */
export type MenuItemData = {
    icon: ComponentType,
    ref: string,
    jpName: string,
    enName: string
}

/**ラベルフィルター(トグル) */
export type filterToggleItem = {
    id: number,
    text: string,
    type: 'favorite'|'status',
    isChecked: boolean,
    isVisible: boolean
}

/**書誌情報 */
export type BookInfo = {
    isbn_13: string,
    isbn_10?: string,
    title: string,
    imageUrl: string,
    registrationDate: Date,
    updateDate: Date,
    pageCount: number,
    history: [{
        date: Date,
        currentPage: number
    }],
    isCompleted: boolean,
    memorandum: string
}