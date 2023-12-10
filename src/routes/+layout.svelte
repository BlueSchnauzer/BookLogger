<script lang="ts">
	import '../app.css';
	import NProgress from 'nprogress';
	import 'nprogress/nprogress.css';
	import { navigating } from '$app/stores';

  NProgress.configure({
    showSpinner: false
  });
 
	$: {
		//ページ移動中にプログレスを表示する
		if ($navigating) {
			NProgress.start();
		}
		if (!$navigating) {
			NProgress.done();
		}
	}

</script>

<slot />

<style>
	:global(#nprogress .bar) {
		background-color: #65a30d;
	}
</style>