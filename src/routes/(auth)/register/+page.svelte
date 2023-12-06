<script lang="ts">
	import { goto } from '$app/navigation';
	import { createUserWithEmailAndPassword } from 'firebase/auth';
	import { auth } from '$lib/firebase';

	let email: string;
	let password: string;

	let success: boolean | undefined = undefined;

	const register = () => {
		createUserWithEmailAndPassword(auth, email, password)
			.then(() => {
				goto('/login');
			})
			.catch((error) => {
				console.log(error);
				success = false;
			});
	};
</script>

<form
	class="flex flex-col gap-4 p-8 space-y-4 bg-white sm:w-10/12"
	on:submit|preventDefault={register}
>
	<input
		type="email"
		placeholder="Email"
		class="px-4 py-2 border border-gray-300 rounded-md"
		required
		bind:value={email}
	/>
	<input
		type="password"
		placeholder="Password"
		class="px-4 py-2 border border-gray-300 rounded-md"
		required
		bind:value={password}
	/>

	<button type="submit" class="default-action">Register</button>
</form>
