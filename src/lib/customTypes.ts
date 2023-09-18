import type { ComponentType } from "svelte"

export interface MenuItemData {
    icon: ComponentType,
    ref: string,
    jpName: string,
    enName: string
}
