// messagesService.js
import { database } from "@/firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const fetchMessages = async () => {
  try {
    const messagesCollection = collection(database, "messages");
    const q = query(messagesCollection, where("message", "!=", "gods of death love apples"));
    const messagesSnapshot = await getDocs(q);

    if (messagesSnapshot.empty) {
      console.log("No matching documents.");
      return [];
    }

    const messagesList = messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched messages:", messagesList);
    return messagesList;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};
