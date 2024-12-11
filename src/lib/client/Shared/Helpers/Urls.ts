import type { OrderFilters } from '$lib/client/Feature/Contents/interface';
import type { status } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Status';

export const createUrlWithParams = (
	url: string,
	params: Record<string, string> | URLSearchParams
) => {
	let searchParams: URLSearchParams;
	if (params instanceof URLSearchParams) {
		searchParams = params;
	} else {
		searchParams = new URLSearchParams(params);
	}

	return `${url}?${searchParams.toString()}`;
};

export const getParamValue = (params: URLSearchParams, name: string) => params.get(name);

export const getPageCount = (params: URLSearchParams) => {
	const pageCount = Number(getParamValue(params, 'page'));
	return pageCount >= 0 ? pageCount : 0;
};

export const getContentsSearchConditions = (params: URLSearchParams) => {
	const page = getPageCount(params);
	const query = getParamValue(params, 'query') ?? '';
	const order = getParamValue(params, 'order') as OrderFilters;

	return { page, query, order };
};
