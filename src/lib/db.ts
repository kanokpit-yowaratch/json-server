import { MongoClient } from 'mongodb';

const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | undefined;

function getClientPromise(): Promise<MongoClient> {
	if (clientPromise) return clientPromise;

	const uri = process.env.MONGODB_URI;
	if (!uri) {
		clientPromise = Promise.reject(new Error('MONGODB_URI environment variable is not configured'));
		clientPromise.catch(() => {});
		return clientPromise;
	}

	if (process.env.NODE_ENV === 'development') {
		const globalWithMongo = globalThis as typeof globalThis & {
			_mongoClientPromise?: Promise<MongoClient>;
		};

		if (!globalWithMongo._mongoClientPromise) {
			client = new MongoClient(uri, options);
			globalWithMongo._mongoClientPromise = client.connect();
		}
		clientPromise = globalWithMongo._mongoClientPromise;
	} else {
		client = new MongoClient(uri, options);
		clientPromise = client.connect();
	}

	return clientPromise;
}

getClientPromise();

export default clientPromise!;

export async function connectToDatabase() {
	const connectedClient = await getClientPromise();
	const db = connectedClient.db(process.env.MONGODB_DB || 'resume');
	return { client: connectedClient, db };
}
