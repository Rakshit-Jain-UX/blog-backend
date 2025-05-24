<script>
  import { onMount } from "svelte";
  import { account, databases, storage, ID } from "$lib/appWriteConfig";
  import { goto } from "$app/navigation";

  let user = null;
  let isAdmin = false;
  let title, description;
  let quill;
  let editorContent = "";
  const BUCKET_ID = import.meta.env.VITE_BUCKET_ID;
  const DATABASE_ID = import.meta.env.VITE_DB_ID;
  const COLLECTION_ID = import.meta.env.VITE_COLLECTION_ID;
  const ADMIN_UID = import.meta.env.VITE_ADMIN_ID;
  let isSaving = false;

  onMount(async () => {
    try {
      const session = await account.get();
      user = session;
      isAdmin = user.$id === ADMIN_UID;

      if (!isAdmin) {
        alert("You are not authorized to access this page.");
        goto("/login");
        return;
      }
    } catch (err) {
      goto("/login");
      return;
    }

    const editor = document.getElementById("editor");
    quill = new Quill(editor, {
      theme: "snow",
      placeholder: "Compose something amazing...",
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
      },
    });

    // Image upload handler using Appwrite Storage
    quill.getModule("toolbar").addHandler("image", async () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = async () => {
        const file = input.files[0];
        const maxSize = 1 * 1024 * 1024;
        if (file.size > maxSize) {
          alert("Image size exceeds 1MB.");
          return;
        }

        try {
          const fileId = ID.unique();
          const uploaded = await storage.createFile(BUCKET_ID, fileId, file);
          const fileUrl = storage.getFileView(BUCKET_ID, uploaded.$id).href;

          const range = quill.getSelection();
          quill.insertEmbed(range.index, "image", fileUrl);
        } catch (err) {
          alert("Image upload failed: " + err.message);
        }
      };
    });
  });

  const saveEditorContent = async () => {
    if (!user) {
      alert("You must be logged in.");
      return;
    }

    isSaving = true;
    editorContent = JSON.stringify(quill.getContents());

    try {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        userId: user.$id,
        title: title.value,
        description: description.value,
        content: editorContent,
        timestamp: Date.now(),
      });
      alert("Content saved to Appwrite!");
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      isSaving = false;
    }
  };
</script>

<svelte:head>
  <link
    href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css"
    rel="stylesheet"
  />
</svelte:head>

<main>
  <div class="py-12">
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div class="p-6 bg-white border-b border-gray-200">
          <form on:submit|preventDefault={saveEditorContent}>
            <div class="mb-4">
              <label class="text-xl text-gray-600">
                Title <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                class="border p-2 w-full"
                bind:this={title}
                required
              />
            </div>
            <div class="mb-4">
              <label class="text-xl text-gray-600">Description</label>
              <input
                type="text"
                class="border p-2 w-full"
                bind:this={description}
              />
            </div>
            <div class="mb-8">
              <label class="text-xl text-gray-600">
                Content <span class="text-red-500">*</span>
              </label>
              <div id="editor" class="border-2 border-gray-500 h-96"></div>
            </div>
            <div class="flex gap-2">
              <button
                type="submit"
                class="p-3 bg-blue-500 text-white hover:bg-blue-400 disabled:opacity-50"
                disabled={isSaving}
              >
                {#if isSaving}
                  Saving...
                {:else}
                  Save Content
                {/if}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js"></script>
</main>
