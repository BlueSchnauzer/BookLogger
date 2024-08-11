import { setContext, getContext } from 'svelte';

export const setPathNameContext = (pathName: string) => {
	setContext('pathName', pathName);
};

export const getPathNameContext = () => {
	return getContext<string>('pathName');
};
