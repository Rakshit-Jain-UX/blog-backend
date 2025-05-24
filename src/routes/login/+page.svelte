<script>
    import { account, ID } from '$lib/appWriteConfig';

    let email, password;
    let isLoading = false;
    let loggedInUser = null;

    async function loginUser() {
        isLoading = true;
        try {
            await account.createEmailPasswordSession(email.value, password.value);
            loggedInUser = await account.get();
            alert("Login successful!");
            window.location.replace("/");
        } catch (err) {
            alert(err.message || "Login failed");
        } finally {
            isLoading = false;
        }
    }

    async function registerUser() {
        isLoading = true;
        try {
            await account.create(ID.unique(), email.value, password.value);
            await loginUser(); // Automatically login after registration
        } catch (err) {
            alert(err.message || "Registration failed");
        } finally {
            isLoading = false;
        }
    }

    async function logoutUser() {
        try {
            await account.deleteSession("current");
            loggedInUser = null;
            alert("Logged out");
        } catch (err) {
            alert(err.message || "Logout failed");
        }
    }
</script>

<main>
    <section class="bg-gray-50 dark:bg-gray-900 h-dvh">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div class="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        {loggedInUser ? `Welcome, ${loggedInUser.name || loggedInUser.email}` : 'Sign in or Register'}
                    </h1>

                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="name@company.com"
                            required
                            bind:this={email}
                            class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        />
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="••••••••"
                            required
                            bind:this={password}
                            class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        />
                    </div>

                    <div class="flex gap-2">
                        <button
                            on:click={loginUser}
                            class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>

                        <button
                            on:click={registerUser}
                            class="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </div>

                    {#if loggedInUser}
                        <button
                            on:click={logoutUser}
                            class="w-full mt-2 text-white bg-red-600 hover:bg-red-700 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700"
                        >
                            Logout
                        </button>
                    {/if}
                </div>
            </div>
        </div>
    </section>
</main>
