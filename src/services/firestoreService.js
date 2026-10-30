import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase';

// In-memory fallback state for demonstration / local testing when Firebase network fails
const fallbackStore = {
  lists: [
    { id: 'list-1', name: 'סופרמרקט (רשימה לדוגמה)', householdId: 'default-household' }
  ],
  items: [
    { id: 'item-1', listId: 'list-1', name: 'חלב 3%', quantity: '2', checked: false, imageUrl: '' },
    { id: 'item-2', listId: 'list-1', name: 'לחם אחיד', quantity: '1', checked: false, imageUrl: '' },
    { id: 'item-3', listId: 'list-1', name: 'עגבניות', quantity: '1 ק"ג', checked: true, imageUrl: '' }
  ],
  productHistory: ['חלב 3%', 'לחם אחיד', 'עגבניות', 'גבינה צהובה', 'שמן זית', 'קפה']
};

export const subscribeToLists = (householdId, callback) => {
  try {
    const q = query(collection(db, 'lists'), where('householdId', '==', householdId));
    return onSnapshot(q,
      (snapshot) => {
        const lists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(lists.length > 0 ? lists : fallbackStore.lists);
      },
      (error) => {
        console.warn('Firestore subscription error, using fallback lists:', error.message);
        callback(fallbackStore.lists);
      }
    );
  } catch (err) {
    console.warn('Firestore fallback lists used:', err.message);
    callback(fallbackStore.lists);
    return () => {};
  }
};

export const createList = async (name, householdId = 'default-household') => {
  try {
    const docRef = await addDoc(collection(db, 'lists'), {
      name,
      householdId,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (err) {
    const newId = `list-${Date.now()}`;
    fallbackStore.lists.push({ id: newId, name, householdId });
    return newId;
  }
};

export const renameList = async (listId, newName) => {
  try {
    const listRef = doc(db, 'lists', listId);
    await updateDoc(listRef, { name: newName });
  } catch (err) {
    const item = fallbackStore.lists.find(l => l.id === listId);
    if (item) item.name = newName;
  }
};

export const deleteList = async (listId) => {
  try {
    await deleteDoc(doc(db, 'lists', listId));
  } catch (err) {
    fallbackStore.lists = fallbackStore.lists.filter(l => l.id !== listId);
  }
};

export const subscribeToItems = (listId, checkedStatus, callback) => {
  try {
    const q = query(
      collection(db, 'items'),
      where('listId', '==', listId),
      where('checked', '==', checkedStatus)
    );
    return onSnapshot(q,
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(items);
      },
      (error) => {
        console.warn('Firestore subscription error, using fallback items:', error.message);
        const filtered = fallbackStore.items.filter(i => i.listId === listId && i.checked === checkedStatus);
        callback(filtered);
      }
    );
  } catch (err) {
    const filtered = fallbackStore.items.filter(i => i.listId === listId && i.checked === checkedStatus);
    callback(filtered);
    return () => {};
  }
};

export const addItem = async (listId, name, quantity = '1', imageUrl = '') => {
  try {
    const itemData = {
      listId,
      name,
      quantity,
      checked: false,
      imageUrl: imageUrl || '',
      updatedAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, 'items'), itemData);
    const historyRef = doc(db, 'product_history', name.trim().toLowerCase());
    await setDoc(historyRef, { name: name.trim() }, { merge: true });
    return docRef.id;
  } catch (err) {
    const newId = `item-${Date.now()}`;
    fallbackStore.items.push({ id: newId, listId, name, quantity, checked: false, imageUrl });
    if (!fallbackStore.productHistory.includes(name)) {
      fallbackStore.productHistory.push(name);
    }
    return newId;
  }
};

export const toggleItemStatus = async (itemId, currentChecked) => {
  try {
    const itemRef = doc(db, 'items', itemId);
    await updateDoc(itemRef, {
      checked: !currentChecked,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    const item = fallbackStore.items.find(i => i.id === itemId);
    if (item) item.checked = !currentChecked;
  }
};

export const updateItem = async (itemId, updates) => {
  try {
    const itemRef = doc(db, 'items', itemId);
    await updateDoc(itemRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    const item = fallbackStore.items.find(i => i.id === itemId);
    if (item) Object.assign(item, updates);
  }
};

export const deleteItem = async (itemId) => {
  try {
    await deleteDoc(doc(db, 'items', itemId));
  } catch (err) {
    fallbackStore.items = fallbackStore.items.filter(i => i.id !== itemId);
  }
};

export const searchProductHistory = async (searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) return [];
  const term = searchTerm.trim().toLowerCase();

  try {
    const snapshot = await getDocs(collection(db, 'product_history'));
    const matches = snapshot.docs
      .map(doc => doc.data().name)
      .filter(name => name && name.toLowerCase().includes(term));
    return matches.length > 0 ? matches : fallbackStore.productHistory.filter(name => name.toLowerCase().includes(term));
  } catch (err) {
    return fallbackStore.productHistory.filter(name => name.toLowerCase().includes(term));
  }
};
