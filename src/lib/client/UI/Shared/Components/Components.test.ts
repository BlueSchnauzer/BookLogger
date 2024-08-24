import { render, fireEvent, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vitest } from 'vitest';
// import type * as customTypes from '$lib/customTypes';
// import LayerZindex30 from '$lib/components/common/parts/LayerZindex30.svelte';
// import ToggleSwitch from '$lib/components/common/parts/ToggleSwitch.svelte';
// import PrimalyButton from '$lib/client/UI/Shared/Components/PrimalyButton.svelte';
// import SecondaryButton from '$lib/components/common/parts/SecondaryButton.svelte';
import CategoryLabel from '$lib/client/UI/Shared/Components/CategoryLabel.svelte';
// import FullCoverLoader from '../../../client/UI/Shared/Components/FullCoverLoader.svelte';
// import BottomStatusLabel from './BottomStatusLabel.svelte';
// import { getTestData } from '$lib/vitest-setup';
// import type { BookInfo } from '$lib/server/models/BookInfo';

// describe('LayerZindex30', () => {
// 	it('レンダリング', () => {
// 		render(LayerZindex30, { isDisplay: true });

// 		expect(screen.getByTestId('layerZ30')).toBeInTheDocument();
// 	});

// 	it('クリックで非表示に変更できること', async () => {
// 		render(LayerZindex30, { isDisplay: true, isHiddenByOnclick: true });

// 		const layer = screen.getByTestId('layerZ30');
// 		await fireEvent.click(layer);

// 		expect(screen.getByTestId('layerZ30')).toHaveClass('hidden');
// 	});
// });

// describe('FullCoverLoader', () => {
// 	it('レンダリング', () => {
// 		render(FullCoverLoader, { isDisplay: true });

// 		expect(screen.getByTestId('layerZ30')).toBeInTheDocument();
// 		expect(screen.getByTestId('loader')).toBeInTheDocument();
// 	});

// 	it('propsがFaulthyの際に非表示に変更されること', async () => {
// 		const { component } = render(FullCoverLoader, { isDisplay: true });

// 		await component.$set({ isDisplay: false });

// 		expect(screen.getByTestId('layerZ30')).toHaveClass('hidden');
// 		expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
// 	});
// });

// describe('ToggleSwitch', () => {
// 	//データ作成
// 	let toggleFilterItems: customTypes.toggleFilterItem[] = [
// 		{ id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true },
// 		{ id: 2, text: '読みたい', type: 'status', isChecked: false, isVisible: true }
// 	];

// 	it('レンダリング', () => {
// 		const { container } = render(ToggleSwitch, {
// 			id: toggleFilterItems[0].id,
// 			text: toggleFilterItems[0].text,
// 			isChecked: toggleFilterItems[0].isChecked,
// 			isVisible: toggleFilterItems[0].isVisible
// 		});

// 		expect(container.querySelector('input')).toBeInTheDocument();
// 		expect(screen.getByText(toggleFilterItems[0].text)).toBeInTheDocument();
// 	});

// 	it('クリック時にinputタグがcheckedになること', async () => {
// 		const { container } = render(ToggleSwitch, {
// 			id: toggleFilterItems[0].id,
// 			text: toggleFilterItems[0].text,
// 			isChecked: toggleFilterItems[0].isChecked,
// 			isVisible: toggleFilterItems[0].isVisible
// 		});

// 		await fireEvent.click(screen.getByText(toggleFilterItems[0].text));

// 		expect(container.querySelector('input')).toBeChecked();
// 	});

// 	it('Props変更時にタグが非表示になること', async () => {
// 		const { container, component } = render(ToggleSwitch, {
// 			id: toggleFilterItems[0].id,
// 			text: toggleFilterItems[0].text,
// 			isChecked: toggleFilterItems[0].isChecked,
// 			isVisible: toggleFilterItems[0].isVisible
// 		});

// 		expect(container.querySelector('div.flex')).toBeInTheDocument();

// 		toggleFilterItems[0].isVisible = false;
// 		await component.$set({
// 			id: toggleFilterItems[0].id,
// 			text: toggleFilterItems[0].text,
// 			isChecked: toggleFilterItems[0].isChecked,
// 			isVisible: toggleFilterItems[0].isVisible
// 		});

// 		expect(container.querySelector('div.hidden')).toBeInTheDocument();
// 	});
// });

// describe('PrimaryButton', () => {
// 	it('レンダリング', () => {
// 		const component = render(PrimalyButton, { type: 'button', text: 'button' });
// 		expect(screen.getByText('button')).toBeInTheDocument();
// 		component.unmount();

// 		render(PrimalyButton, { type: 'submit', text: 'submit' });
// 		expect(screen.getByText('submit')).toBeInTheDocument();
// 	});

// 	it('クリックイベントを検知できること', () => {
// 		const { component } = render(PrimalyButton, { type: 'button', text: 'button' });
// 		const btn = screen.getByText('button');
// 		const mock = vitest.fn();

// 		component.$on('click', mock);
// 		fireEvent.click(btn);

// 		expect(mock).toHaveBeenCalled();
// 	});
// });

// describe('SecondaryButton', () => {
// 	it('レンダリング', () => {
// 		const component = render(SecondaryButton, { type: 'button', text: 'button' });
// 		expect(screen.getByText('button')).toBeInTheDocument();
// 		component.unmount();

// 		render(SecondaryButton, { type: 'submit', text: 'submit' });
// 		expect(screen.getByText('submit')).toBeInTheDocument();
// 	});

// 	it('クリックイベントを検知できること', () => {
// 		const { component } = render(SecondaryButton, { type: 'button', text: 'button' });
// 		const btn = screen.getByText('button');
// 		const mock = vitest.fn();

// 		component.$on('click', mock);
// 		fireEvent.click(btn);

// 		expect(mock).toHaveBeenCalled();
// 	});
// });

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

// describe('BottomStatusLabel', () => {
// 	let testData: BookInfo;
// 	beforeEach(() => {
// 		testData = getTestData();
// 	});

// 	it('登録日のステータスでレンダリングできること', () => {
// 		render(BottomStatusLabel, {
// 			typeForLabel: 'createDate',
// 			bookInfo: testData,
// 			isResponsiveText: false
// 		});

// 		expect(screen.getByText('登録日')).toBeInTheDocument();
// 	});

// 	it('読んでいるページ数でレンダリングできること', () => {
// 		testData.pageHistory?.push({
// 			id: crypto.randomUUID(),
// 			date: new Date(),
// 			currentPage: testData.pageCount / 2
// 		});
// 		render(BottomStatusLabel, {
// 			typeForLabel: 'progress',
// 			bookInfo: testData,
// 			isResponsiveText: false
// 		});

// 		expect(screen.getByText('読んだページ数')).toBeInTheDocument();
// 		expect(screen.getByTestId('pageProgress').style.width).toEqual('50%');
// 	});

// 	//そもそも総ページ数が無い本は編集することが無意味だが
// 	it('総ページ数の無い書誌データの場合、更新日が表示されること', () => {
// 		testData.pageCount = 0;
// 		render(BottomStatusLabel, {
// 			typeForLabel: 'progress',
// 			bookInfo: testData,
// 			isResponsiveText: false
// 		});

// 		expect(screen.getByText('更新日')).toBeInTheDocument();
// 	});

// 	it('読み終わった日のステータスでレンダリングできること', () => {
// 		render(BottomStatusLabel, {
// 			typeForLabel: 'completeDate',
// 			bookInfo: testData,
// 			isResponsiveText: false
// 		});

// 		expect(screen.getByText('読み終わった日')).toBeInTheDocument();
// 	});
// });
