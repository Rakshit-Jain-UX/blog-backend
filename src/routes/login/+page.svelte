<script>
    import {
        app,
        getAuth,
        signInWithEmailAndPassword,
        sendPasswordResetEmail,
        setPersistence,
        browserLocalPersistence,
    } from "$lib/firebaseConfig";

    let email, password;
    const loginUser = async () => {
        const auth = getAuth(app);

        setPersistence(auth, browserLocalPersistence) // Ensures persistence across sessions
            .then(() => {
                return signInWithEmailAndPassword(
                    auth,
                    email.value,
                    password.value,
                );
            })
            .then((res) => {
                alert("Login successful!");

                if (res.user.uid) {
                    window.location.replace("/"); // Redirect to home
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const sendForgotPassword = async () => {
        sendPasswordResetEmail(getAuth(app), email.value)
            .then(() => {
                alert("Password reset email sent");
            })
            .catch((err) => {
                alert(err);
            });
    };
</script>

<main>
    <section class="bg-gray-50 dark:bg-gray-900 h-dvh">
        <div
            class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
        >
            <div
                class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
            >
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1
                        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
                    >
                        Sign in to your account
                    </h1>
                    <div>
                        <label
                            for="email"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >Your email</label
                        >
                        <input
                            type="email"
                            name="email"
                            id="email"
                            class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="name@company.com"
                            required=""
                            bind:this={email}
                        />
                    </div>
                    <div>
                        <label
                            for="password"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >Password</label
                        >
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="••••••••"
                            class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required=""
                            bind:this={password}
                        />
                    </div>
                    <div class="flex items-center justify-between">
                        <button
                            on:click={sendForgotPassword}
                            class="text-sm font-medium text-blue-600 hover:underline dark:text-primary-500"
                            >Forgot password?</button
                        >
                    </div>
                    <button
                        on:click={loginUser}
                        class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 cursor-pointer"
                        >Sign in</button
                    >
                    <p
                        class="text-sm font-light text-gray-500 dark:text-gray-400"
                    >
                        Don’t have an account yet? <a
                            href="/register"
                            class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                            >Sign up</a
                        >
                    </p>
                </div>
            </div>
        </div>
    </section>
</main>
