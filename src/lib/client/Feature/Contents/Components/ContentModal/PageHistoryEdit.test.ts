import PageHistoryEdit from '$lib/client/Feature/Contents/Components/ContentModal/PageHistoryEdit.svelte';
import { bookInfoInterfaceMock } from '$lib/mock/Data';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('PageHistoryEdit', () => {
	it('レンダリング', () => {
		const bookInfo = bookInfoInterfaceMock;

		render(PageHistoryEdit, { bookInfo });

		expect(screen.getByText('読んだ記録')).toBeInTheDocument();
	});
});
