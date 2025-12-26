const DB_NAME = "finance-db";
const STORE = "transactions";
const QUEUE = "queue";

/* =========================
   OPEN DATABASE
   ========================= */
export function openDB() {
  return new Promise(resolve => {
    const req = indexedDB.open(DB_NAME, 2);

    req.onupgradeneeded = e => {
      const db = e.target.result;

      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(QUEUE)) {
        db.createObjectStore(QUEUE, { autoIncrement: true });
      }
    };

    req.onsuccess = () => resolve(req.result);
  });
}

/* =========================
   CACHE (READ-ONLY SOURCE)
   ========================= */
export async function cacheTransactions(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return; // Don't cache empty or invalid data
  }
  
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  const store = tx.objectStore(STORE);
  
  // Clear existing data first
  await store.clear();
  
  // Add new data
  data.forEach(d => store.put(d));
}

export async function readCache() {
  try {
    const db = await openDB();
    return new Promise(resolve => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch (error) {
    console.error('Error reading cache:', error);
    return [];
  }
}

/* =========================
   OFFLINE QUEUE
   ========================= */
export async function enqueue(action, payload) {
  const db = await openDB();
  const tx = db.transaction(QUEUE, "readwrite");
  const store = tx.objectStore(QUEUE);
  await store.add({ action, payload, timestamp: Date.now() });
}

export async function flushQueue(apiFunction) {
  if (!navigator.onLine) return;

  const db = await openDB();
  const tx = db.transaction(QUEUE, "readwrite");
  const store = tx.objectStore(QUEUE);
  
  return new Promise((resolve) => {
    const req = store.getAll();
    req.onsuccess = async () => {
      const items = req.result;
      
      for (const item of items) {
        try {
          await apiFunction(item.action, item.payload);
          await store.delete(item.id);
        } catch (error) {
          console.error('Failed to flush queue item:', error);
          // Keep item in queue for retry
        }
      }
      resolve();
    };
  });
}
