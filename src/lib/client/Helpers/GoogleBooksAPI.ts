/**GAPIのresource!.volumeInfo?.industryIdentifiers */
export type industryIdentifiers =
	| {
			identifier?: string | undefined;
			type?: string | undefined;
	  }[]
	| undefined;

export const getIdentifier = (identifiers: industryIdentifiers) => {
	const isbn_13 = identifiers?.find((id) => id.type === 'ISBN_13')?.identifier;
	if (isbn_13) {
		return { isbn_13 };
	}

	const isbn_10 = identifiers?.find((id) => id.type === 'ISBN_10')?.identifier;
	if (isbn_10) {
		return { isbn_10 };
	}

	return undefined;
};
