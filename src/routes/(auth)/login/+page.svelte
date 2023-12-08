<script lang="ts">
	import { goto } from '$app/navigation';
  import { firebaseAuth } from '$lib/firebase.client';
  import { signInWithEmailAndPassword } from 'firebase/auth';

  let email: string;
  let password: string;

	let success: boolean | undefined = undefined;

  const login = async () => {
    try {
      const userCredentials = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const idToken = await userCredentials.user.getIdToken();

      const response = await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify(idToken),
        headers: {'Content-type': 'application/json'}
      });
    }
    catch (error) {
      console.log(error);
      success = false;
    }

    goto('/home');
  }
</script>
 
<form
  class="flex flex-col gap-4 p-8 space-y-4 bg-white sm:w-10/12"
  on:submit|preventDefault={login}
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
 
  <button type="submit" class="default-action">Login</button>
</form>