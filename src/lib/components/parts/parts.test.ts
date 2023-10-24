import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, expect, it, vitest } from 'vitest';
import type * as customTypes from '$lib/customTypes';
import ToggleSwitch from '$lib/components/parts/ToggleSwitch.svelte';
import PrimalyButton from './PrimalyButton.svelte';
import SecondaryButton from './SecondaryButton.svelte';

describe('ToggleSwitch', () => {
	//データ作成
	let toggleFilterItems: customTypes.toggleFilterItem[] = [
		{ id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true },
		{ id: 2, text: '読みたい', type: 'status', isChecked: false, isVisible: true }
	];

	it('レンダリング', () => {
		const { container } = render(ToggleSwitch, {
			id: toggleFilterItems[0].id,
			text: toggleFilterItems[0].text,
			isChecked: toggleFilterItems[0].isChecked,
			isVisible: toggleFilterItems[0].isVisible
		});

		expect(container.querySelector('input')).toBeInTheDocument();
		expect(screen.getByText(toggleFilterItems[0].text)).toBeInTheDocument();
	});

	it('クリック時にinputタグがcheckedになること', async () => {
		const { container } = render(ToggleSwitch, {
			id: toggleFilterItems[0].id,
			text: toggleFilterItems[0].text,
			isChecked: toggleFilterItems[0].isChecked,
			isVisible: toggleFilterItems[0].isVisible
		});

		await fireEvent.click(screen.getByText(toggleFilterItems[0].text));

		expect(container.querySelector('input')).toBeChecked();
	});

	it('Props変更時にタグが非表示になること', async () => {
		const { container, component } = render(ToggleSwitch, {
			id: toggleFilterItems[0].id,
			text: toggleFilterItems[0].text,
			isChecked: toggleFilterItems[0].isChecked,
			isVisible: toggleFilterItems[0].isVisible
		})

		expect(container.querySelector('div.flex')).toBeInTheDocument();

		toggleFilterItems[0].isVisible = false;
		await component.$set({
			id: toggleFilterItems[0].id,
			text: toggleFilterItems[0].text,
			isChecked: toggleFilterItems[0].isChecked,
			isVisible: toggleFilterItems[0].isVisible
		});

		expect(container.querySelector('div.hidden')).toBeInTheDocument();
	});
});

describe('PrimaryButton', () =>{
	it('レンダリング', () => {
		const component = render(PrimalyButton, { type:'button', text:'button'});
		expect(screen.getByText('button')).toBeInTheDocument();
		component.unmount();

		render(PrimalyButton, {type: 'submit', text: 'submit'});
		expect(screen.getByText('submit')).toBeInTheDocument();
	});

	it('クリックイベントを検知できること', () => {
		const { component } = render(PrimalyButton, { type:'button', text:'button'});
		const btn = screen.getByText('button');
		const mock = vitest.fn();

		component.$on('click', mock);
		fireEvent.click(btn);

		expect(mock).toHaveBeenCalled();
	});
});

describe('SecondaryButton', () => {
	it('レンダリング', () => {
		const component = render(SecondaryButton, { type:'button', text:'button'});
		expect(screen.getByText('button')).toBeInTheDocument();
		component.unmount();

		render(SecondaryButton, {type: 'submit', text: 'submit'});
		expect(screen.getByText('submit')).toBeInTheDocument();
	});

	it('クリックイベントを検知できること', () => {
		const { component } = render(SecondaryButton, { type:'button', text:'button'});
		const btn = screen.getByText('button');
		const mock = vitest.fn();

		component.$on('click', mock);
		fireEvent.click(btn);

		expect(mock).toHaveBeenCalled();
	});
});