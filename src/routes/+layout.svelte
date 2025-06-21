<script>
	import '../app.css';
  import Header from '../header.svelte';
	let { children } = $props();
</script>
<div class="app">
    <Header />
    <main>
        {@render children()}
    </main>
</div>
