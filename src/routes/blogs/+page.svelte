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
    await fetchBlogs();
  });

  async function fetchBlogs() {
    loading = true;
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
  }

  const editBlog = (id) => {
    goto(`/blog-edit/${id}`);
  };

  const deleteBlog = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this blog?");
    if (!confirmed) return;

    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      blogs = blogs.filter(blog => blog.$id !== id);
    } catch (err) {
      console.error("Failed to delete blog:", err.message);
    }
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
        <div class="mt-4 flex gap-4">
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
            on:click={() => editBlog(blog.$id)}
          >
            Edit
          </button>
          <button
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
            on:click={() => deleteBlog(blog.$id)}
          >
            Delete
          </button>
        </div>
      </div>
    {/each}
  {/if}
</main>
