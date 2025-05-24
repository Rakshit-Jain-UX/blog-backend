import { Client, Account, ID, Databases, Storage } from 'appwrite';

export const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_ENDPOINT)
    .setProject(import.meta.env.VITE_PROJECT_ID);

// Export all necessary Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { ID };
