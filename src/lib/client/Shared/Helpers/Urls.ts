export const createUrlWithParams = (url: string, params: Record<string, string>) => {
	const searchParams = new URLSearchParams(params);
	return `${url}?${searchParams.toString()}`;
};

export const getParamValue = (params: URLSearchParams, name: string) => params.get(name);

export const getPageCount = (params: URLSearchParams) => {
	const pageCount = Number(getParamValue(params, 'page'));
	return pageCount >= 0 ? pageCount : 0;
};
