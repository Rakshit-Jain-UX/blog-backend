<script>
  import { onMount } from "svelte";
  import { databases } from "$lib/appWriteConfig";
  import { goto } from "$app/navigation";
  import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

  const DATABASE_ID = import.meta.env.VITE_DB_ID;
  const COLLECTION_ID = import.meta.env.VITE_COLLECTION_ID;

 let blogs = [];
let loading = true;

onMount(async () => {
  try {
    const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    blogs = res.documents.map((doc) => {
      const delta = JSON.parse(doc.content);
      const converter = new QuillDeltaToHtmlConverter(delta.ops, {});
      const html = converter.convert();
      return { ...doc, html };
    });
  } catch (err) {
    console.error("Failed to fetch blogs:", err.message);
  } finally {
    loading = false;
  }
});

  const editBlog = (id) => {
    goto(`/blog-edit/${id}`);
  };
</script>

<main class="p-8">
  <h1 class="text-3xl font-bold mb-6">Blog Posts</h1>

  {#if loading}
    <p class="text-lg text-gray-500">Loading blogs...</p>
  {:else if blogs.length === 0}
    <p class="text-lg text-gray-500">No blogs found.</p>
  {:else}
    {#each blogs as blog}
      <div class="mb-8 p-4 border rounded shadow">
        <h2 class="text-2xl font-semibold">{blog.title}</h2>
        <p class="text-gray-600 mb-2">{blog.description}</p>
        <div class="prose max-w-none">
          {@html blog.html}
        </div>
        <button
          class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
          on:click={() => editBlog(blog.$id)}
        >
          Edit
        </button>
      </div>
    {/each}
  {/if}
</main>

