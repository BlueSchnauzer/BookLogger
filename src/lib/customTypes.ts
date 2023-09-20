import type { ComponentType } from "svelte"

export type MenuItemData = {
    icon: ComponentType,
    ref: string,
    jpName: string,
    enName: string
}

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