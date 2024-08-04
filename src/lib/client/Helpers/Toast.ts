import { toast } from '@zerodevx/svelte-toast';

//トーストは利用先でコンテナのインポート、スタイル適用とアンマウント時のpopが必要
export const mainToastTarget = 'mainToast';
export const modalToastTarget = 'modalToast';

/**画面右上にトーストを表示する*/
export const pushToast = (message: string, target: string): void => {
	toast.push(message, { theme: { '--toastBarBackground': '#65a30d' }, target });
};

/**画面下部に正常完了用トーストを表示する*/
export const pushSuccessToast = (message: string, target: string): void => {
	toast.push(message, {
		reversed: true,
		intro: { y: 100 },
		theme: { '--toastBarBackground': '#65a30d' },
		target
	});
};

/**画面下部に異常完了用トーストを表示する*/
export const pushErrorToast = (message: string, target: string): void => {
	toast.push(message, {
		reversed: true,
		intro: { y: 100 },
		theme: { '--toastBarHeight': 0, '--toastWidth': 'auto', '--toastBackground': '#dc2626' },
		target
	});
};
