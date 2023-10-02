import {render, fireEvent, screen} from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import type * as customTypes from '$lib/customTypes';
import ToggleSwitch from '$lib/parts/ToggleSwitch.svelte';

describe('ToggleSwitch', () => {
	//データ作成
	let toggleFilterItems: customTypes.toggleFilterItem[] = [
		{ id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true },
		{ id: 2, text: '読みたい', type: 'status', isChecked: false, isVisible: true }
	];

	it('レンダリング', () => {
		const {container} = render(ToggleSwitch, {
			id: toggleFilterItems[0].id,
			text: toggleFilterItems[0].text,
			isChecked: toggleFilterItems[0].isChecked,
			isVisible: toggleFilterItems[0].isVisible
		});

        expect(container.querySelector('input')).toBeInTheDocument();
        expect(screen.getByText(toggleFilterItems[0].text)).toBeInTheDocument();
	});

    it('クリック時にinputタグがcheckedになること', () => {
		const { container } = render(ToggleSwitch, {
			id: toggleFilterItems[0].id,
			text: toggleFilterItems[0].text,
			isChecked: toggleFilterItems[0].isChecked,
			isVisible: toggleFilterItems[0].isVisible
		});

        fireEvent.click(screen.getByText(toggleFilterItems[0].text));

        expect(container.querySelector('input')).toBeChecked();
    });

    it('Props変更時にタグが非表示になること', () => {
        toggleFilterItems[0].isVisible = false;
        const { container } = render(ToggleSwitch, {
			id: toggleFilterItems[0].id,
			text: toggleFilterItems[0].text,
			isChecked: toggleFilterItems[0].isChecked,
			isVisible: toggleFilterItems[0].isVisible
		})

        expect(container.querySelector('div.hidden')).toBeInTheDocument();
    });
});
