/**inputタグの日付をDateに変換*/
export const convertReadingDateToDate = (readingDate: string) => {
  const splitDate = readingDate.split('-');
  //UTCで設定する
  return new Date(Date.UTC(parseInt(splitDate[0]), parseInt(splitDate[1]) - 1, parseInt(splitDate[2])));
};
