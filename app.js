import { cacheTransactions, readCache, enqueue, flushQueue } from "./db.js";

const API_URL = "https://script.google.com/macros/s/AKfycbyiCgsCBuk8wMzJReISNte_fV3lYNXAdDfvfTSbPig9k-qKC9gU0VinQwvbaBwcZ9737Q/exec";
const TOKEN = "694ec953e60c832280e4316f7d02b261";

let isLoading = false;
let loadingCallbacks = [];

export function onLoadingChange(callback) {
  loadingCallbacks.push(callback);
}

function setLoading(loading) {
  isLoading = loading;
  loadingCallbacks.forEach(cb => cb(loading));
}

async function api(action, payload = {}) {
  console.log(`API call: ${action}`, payload);
  
  if (!navigator.onLine) {
    console.log('Offline - enqueueing request');
    await enqueue(action, payload);
    return { offline: true };
  }

  try {
    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    // Create form data to avoid CORS preflight
    const formData = new FormData();
    formData.append('token', TOKEN);
    formData.append('action', action);
    
    // Add payload fields to form data
    Object.keys(payload).forEach(key => {
      formData.append(key, payload[key]);
    });

    console.log('Request data:', { action, ...payload });

    const res = await fetch(API_URL, {
      method: "POST",
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log('Response status:', res.status, res.statusText);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const text = await res.text();
    console.log('Raw response:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid JSON response from server');
    }
    
    console.log('Parsed response:', data);
    
    if (data.error) {
      throw new Error(data.error);
    }

    await flushQueue(api);
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  } finally {
    setLoading(false);
  }
}


export async function loadData() {
  try {
    const data = await api("fetch");
    if (data.offline) {
      const cached = await readCache();
      return cached || [];
    }
    
    // Ensure data is an array
    const transactions = Array.isArray(data) ? data : [];
    await cacheTransactions(transactions);
    return transactions;
  } catch (error) {
    console.warn('Failed to load from API, using cache:', error);
    const cached = await readCache();
    return cached || [];
  }
}

export async function addTx(amount, note) {
  if (!amount || isNaN(amount)) {
    throw new Error('Invalid amount');
  }
  
  const tx = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    amount: Number(amount),
    note: note || ''
  };

  try {
    await api("add", tx);
    return tx;
  } catch (error) {
    console.error('Failed to add transaction:', error);
    throw error;
  }
}

export async function updateTx(tx) {
  if (!tx.id || !tx.amount || isNaN(tx.amount)) {
    throw new Error('Invalid transaction data');
  }
  
  try {
    await api("update", {
      ...tx,
      amount: Number(tx.amount),
      date: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to update transaction:', error);
    throw error;
  }
}

export async function deleteTx(id) {
  if (!id) {
    throw new Error('Invalid transaction ID');
  }
  
  try {
    await api("delete", { id });
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    throw error;
  }
}

