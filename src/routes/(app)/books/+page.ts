import { getBookInfos } from '$lib/client/Feature/Contents/DataManage/fetcher';
import { getPageCount, getParamValue } from '$lib/client/Shared/Helpers/Urls';
import type { PageLoad } from './$types';
import type { status } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Status';
import type { OrderFilters } from '$lib/client/Feature/Contents/interface';

export const load = (async ({ fetch, url }) => {
	const { page, status, query, order } = getSearchConditions(url.searchParams);

	const { totalCount, lastPageCount, bookInfos } = await getBookInfos(fetch, page, {
		status,
		query,
		order
	});

	return { page, totalCount, lastPageCount, bookInfos };
}) satisfies PageLoad;

const getSearchConditions = (params: URLSearchParams) => {
	const page = getPageCount(params);
	const status = getParamValue(params, 'status') as status;
	const query = getParamValue(params, 'query') ?? '';
	const order = getParamValue(params, 'order') as OrderFilters;

	return { page, status, query, order };
};
