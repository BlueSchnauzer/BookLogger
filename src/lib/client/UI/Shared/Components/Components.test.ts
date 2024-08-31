import CategoryLabel from '$lib/client/UI/Shared/Components/CategoryLabel.svelte';
import FullCoverLoader from '$lib/client/UI/Shared/Components/FullCoverLoader.svelte';
import PrimaryButton from '$lib/client/UI/Shared/Components/PrimaryButton.svelte';
import SecondaryButton from '$lib/client/UI/Shared/Components/SecondaryButton.svelte';
import ToggleSwitch from '$lib/client/UI/Shared/Components/ToggleSwitch.svelte';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vitest } from 'vitest';

describe('FullCoverLoader', () => {
	it('レンダリング', () => {
		render(FullCoverLoader, { isDisplay: true });

		expect(screen.getByTestId('layerZ30')).toBeInTheDocument();
		expect(screen.getByTestId('loader')).toBeInTheDocument();
	});

	it('propsがFaulthyの際に非表示に変更されること', async () => {
		const { component } = render(FullCoverLoader, { isDisplay: true });

		await component.$set({ isDisplay: false });

		expect(screen.getByTestId('layerZ30')).toHaveClass('hidden');
		expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
	});
});

describe('ToggleSwitch', () => {
	//データ作成
	let toggleFilterItems = [
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
		});

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

describe('PrimalyButton', () => {
	it('レンダリング', () => {
		const component = render(PrimaryButton, { type: 'button', text: 'button' });
		expect(screen.getByText('button')).toBeInTheDocument();
		component.unmount();

		render(PrimaryButton, { type: 'submit', text: 'submit' });
		expect(screen.getByText('submit')).toBeInTheDocument();
	});

	it('クリックイベントを検知できること', () => {
		const { component } = render(PrimaryButton, { type: 'button', text: 'button' });
		const btn = screen.getByText('button');
		const mock = vitest.fn();

		component.$on('click', mock);
		fireEvent.click(btn);

		expect(mock).toHaveBeenCalled();
	});
});

describe('SecondaryButton', () => {
	it('レンダリング', () => {
		const component = render(SecondaryButton, { type: 'button', text: 'button' });
		expect(screen.getByText('button')).toBeInTheDocument();
		component.unmount();

		render(SecondaryButton, { type: 'submit', text: 'submit' });
		expect(screen.getByText('submit')).toBeInTheDocument();
	});

	it('クリックイベントを検知できること', () => {
		const { component } = render(SecondaryButton, { type: 'button', text: 'button' });
		const btn = screen.getByText('button');
		const mock = vitest.fn();

		component.$on('click', mock);
		fireEvent.click(btn);

		expect(mock).toHaveBeenCalled();
	});
});

describe('CategoryLabel', () => {
	it('レンダリング', () => {
		const labelText = 'データあり';
		render(CategoryLabel, {
			categoryText: 'カテゴリー',
			displayText: labelText
		});

		expect(screen.getByText(labelText)).toBeInTheDocument();
	});

	it('displayTextがFalthyな場合にテキストの値がデータ無しになること', () => {
		const labelText = '';
		render(CategoryLabel, {
			categoryText: 'カテゴリー',
			displayText: labelText
		});

		expect(screen.getByText('データ無し')).toBeInTheDocument();
	});

	//todo 登録済みデータ用のテストを追加する
});
