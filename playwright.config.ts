import type { PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(spec)\.[jt]s/,
	retries: 3,
	//初回DB接続が少し遅いので長めにとる
	timeout: 10 * 1000,
	expect: {
		timeout: 10 * 1000
	}
};

export default config;
