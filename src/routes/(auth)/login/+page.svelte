<script lang="ts">
	import { goto } from '$app/navigation';
	import { authUser } from '$lib/authStore';
  import { auth } from '$lib/firebase';
  import { signInWithEmailAndPassword } from 'firebase/auth';

  let email: string;
  let password: string;

	let success: boolean | undefined = undefined;

  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        authUser.set({
          uid: userCredentials.user.uid,
          email: userCredentials.user.email!
        });

        goto('/home');
      })
      .catch((error) => {
        console.log(error);

        success = false;
      });
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