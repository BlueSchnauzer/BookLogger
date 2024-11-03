export const createUrlWithParams = (url: string, params: Record<string, string>) => {
	const searchParams = new URLSearchParams(params);
	return `${url}?${searchParams.toString()}`;
};
