import { Client, Account, Databases } from 'appwrite';

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID);

// Initialize Appwrite services
const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
