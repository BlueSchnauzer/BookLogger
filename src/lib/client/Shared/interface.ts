export interface FetchInterface {
	(input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response>;
}
