/**inputタグの日付をDateに変換*/
export const convertReadingDateToDate = (readingDate: string) => {
	const splitDate = readingDate.split('-');
	//UTCで設定する
	return new Date(
		Date.UTC(parseInt(splitDate[0]), parseInt(splitDate[1]) - 1, parseInt(splitDate[2]))
	);
};

export const getCurrentDateString = () => {
	const date = new Date();
	return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
};
