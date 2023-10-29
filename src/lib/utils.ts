export const convertDate = (date: Date, useYear = true) => {
	return `${useYear? `${date.getFullYear()}年` : ''}${date.getMonth() + 1}月${date.getDay}日`;
}