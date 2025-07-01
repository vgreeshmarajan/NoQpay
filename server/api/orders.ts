import { Client, Databases, Query } from 'appwrite';
import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../../config/appwriteConfig';

const databases = new Databases(client);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the user ID from the request
    const userId = req.headers['x-appwrite-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fetch orders from Appwrite database
    const orders = await databases.listDocuments(
      process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.EXPO_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
      [
        Query.equal('userId', userId),
        Query.orderDesc('createdAt')
      ]
    );

    // Transform the data to match our frontend expectations
    const formattedOrders = orders.documents.map(order => ({
      id: order.$id,
      date: order.createdAt,
      total: order.total,
      status: order.status || 'pending',
      items: order.items || []
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}
