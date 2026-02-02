//マッチ関数を簡略化するために追加
import 'vitest-dom/extend-expect';
import '@testing-library/jest-dom/vitest';

// jsdom未実装のAPIをモック
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false
	})
});

// getComputedStyleのモック（simplebarで使用）
const originalGetComputedStyle = window.getComputedStyle;
window.getComputedStyle = (elt: Element, pseudoElt?: string | null) => {
	if (pseudoElt) {
		// pseudoElt引数がある場合はダミーのスタイルを返す
		return {
			getPropertyValue: () => '',
			width: '0px',
			height: '0px'
		} as unknown as CSSStyleDeclaration;
	}
	return originalGetComputedStyle(elt);
};
