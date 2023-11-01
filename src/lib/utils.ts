export const convertDate = (date: Date, useYear = true) => {
	//DBから取った書誌データは文字列で日付を持ってるため
	if (typeof date === 'string') { date = new Date(date); }
	return `${useYear? `${date.getFullYear()}/` : ''}${date.getMonth() + 1}/${date.getDate()}`;
}