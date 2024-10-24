import { toast } from '@zerodevx/svelte-toast';

//トーストは利用先でコンテナのインポート、スタイル適用とアンマウント時のpopが必要
export const mainToastTarget = 'mainToast';
export const notificationToastTarget = 'notificationToast';

const pushToast = (message: string, options: any) => toast.push(message, options);

export const pushNotificationToast = (message: string) =>
	pushToast(message, {
		theme: { '--toastBarBackground': '#65a30d' },
		target: notificationToastTarget
	});

export const pushSuccessToast = (message: string) =>
	pushToast(message, {
		reversed: true,
		intro: { y: 100 },
		theme: { '--toastBarBackground': '#65a30d' },
		target: mainToastTarget
	});

export const pushErrorToast = (message: string) =>
	pushToast(message, {
		reversed: true,
		intro: { y: 100 },
		theme: { '--toastBarHeight': 0, '--toastWidth': 'auto', '--toastBackground': '#dc2626' },
		target: mainToastTarget
	});
