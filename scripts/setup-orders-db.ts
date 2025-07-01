import { Client, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

async function setupOrdersDatabase() {
  try {
    // Create database if it doesn't exist
    const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
    
    // Create orders collection
    const collection = await databases.createCollection(
      databaseId,
      'orders',
      'Orders Collection',
      [
        {
          key: 'userId',
          type: 'string',
          required: true,
          array: false,
        },
        {
          key: 'total',
          type: 'float',
          required: true,
          array: false,
        },
        {
          key: 'status',
          type: 'string',
          required: true,
          array: false,
        },
        {
          key: 'items',
          type: 'json',
          required: true,
          array: false,
        },
      ],
      [
        // Add permission to read orders for the user
        {
          role: 'user',
          permission: 'read',
          resource: 'document',
          condition: {
            key: 'userId',
            value: '${user.id}',
            operator: 'equal',
          },
        },
      ]
    );

    console.log('Orders collection created:', collection);

    // Save collection ID to environment
    process.env.EXPO_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID = collection.$id;
  } catch (error) {
    console.error('Error setting up orders database:', error);
  }
}

setupOrdersDatabase();
