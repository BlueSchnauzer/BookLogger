/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				vellum: '#eeeae3'
			},
			borderWidth: {
				6: '6px'
			},
			gridTemplateColumns: {
				smBookContentAutoFit: 'repeat(auto-fit, minmax(128px, 1fr))',
				BookContentAutoFill: 'repeat(auto-fill, minmax(280px, 1fr))'
			},
			animation: {
				'scale-in-right': 'scale-in-right 0.3s ease   both'
			},
			keyframes: {
				'scale-in-right': {
					'0%': {
						transform: 'scale(0)',
						'transform-origin': '100% 50%',
						opacity: '1'
					},
					to: {
						transform: 'scale(1)',
						'transform-origin': '100% 50%',
						opacity: '1'
					}
				}
			}
		}
	},

	plugins: []
};
