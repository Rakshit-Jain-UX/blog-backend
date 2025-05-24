<script>
  import { onMount } from "svelte";
  import { account } from "$lib/appWriteConfig"; 
  import { goto } from "$app/navigation";

  let user = null;
  let loading = true;

  const ADMIN_UID = "683177c8001a717782c0";

  onMount(async () => {
    try {
      const session = await account.get();
      user = session;
      loading = false;

      if (user.$id === ADMIN_UID) {
        setTimeout(() => {
            goto("/blog-form");
        }, 1000)
      } else {
        goto("/login");
      }
    } catch (err) {
      loading = false;
      goto("/login");
    }
  });
</script>

{#if loading}
  <p>Loading...</p>
{:else if user}
  <p>Welcome, {user.email}!</p>
{:else}
  <p>No user logged in.</p>
{/if}
