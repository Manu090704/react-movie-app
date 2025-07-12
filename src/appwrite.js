import {Client, Databases, ID, Query} from 'appwrite';

const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(projectId);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    try{
        const result = await database.listDocuments(databaseId, collectionId, [
            Query.equal('searchTerm', searchTerm),
        ])

        if(result.documents.length > 0){
            const doc = result.documents[0];

            // Update the existing document
            await database.updateDocument(databaseId, collectionId, doc.$id, {
                count : doc.count + 1,
            })
        } else{
            await database.createDocument(databaseId, collectionId, ID.unique(), {
                searchTerm: searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url:`https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            });
        }

    }
    catch(error){
        console.error('Error updating search count:', error);
    }
   
}