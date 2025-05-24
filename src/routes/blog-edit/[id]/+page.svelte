<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { databases, ID } from "$lib/appWriteConfig";
  import { goto } from "$app/navigation";

  let blogId;
  let title, description;
  let quill;
  let originalBlog;

  const DATABASE_ID = import.meta.env.VITE_DB_ID;
  const COLLECTION_ID = import.meta.env.VITE_COLLECTION_ID;
  
  $: blogId = $page.params.id;

  onMount(async () => {
    try {
      const blog = await databases.getDocument(DATABASE_ID, COLLECTION_ID, blogId);
      originalBlog = blog;

      title.value = blog.title;
      description.value = blog.description;

      const editor = document.getElementById("editor");
      quill = new Quill(editor, {
        theme: "snow",
        modules: {
          toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ script: "sub" }, { script: "super" }],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "image", "video"],
          ["clean"],
        ],
        }
      });

      quill.setContents(JSON.parse(blog.content));
    } catch (err) {
      console.error("Failed to load blog:", err.message);
    }
  });

  const updateBlog = async () => {
    try {
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, blogId, {
        title: title.value,
        description: description.value || '',
        content: JSON.stringify(quill.getContents())
      });
      alert("Blog updated!");
      goto("/blogs");
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };
</script>

<svelte:head>
  <link href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" rel="stylesheet" />
</svelte:head>

<main class="p-8">
  <h1 class="text-2xl font-bold mb-4">Edit Blog</h1>
  <form on:submit|preventDefault={updateBlog}>
    <div class="mb-4">
      <label class="text-gray-700">Title</label>
      <input bind:this={title} type="text" class="w-full border p-2" required />
    </div>

    <div class="mb-4">
      <label class="text-gray-700">Description</label>
      <input bind:this={description} type="text" class="w-full border p-2" />
    </div>

    <div class="mb-4">
      <label class="text-gray-700">Content</label>
      <div id="editor" class="border p-2 h-96"></div>
    </div>

    <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500">
      Save Changes
    </button>
  </form>

  <script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js"></script>
</main>
