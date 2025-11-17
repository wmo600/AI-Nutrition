export const API = process.env.AWS_API;

// ==================== UTILITY ====================

export async function ping() {
  const r = await fetch(`${API}/ping`);
  return r.json();
}

// ==================== LOCATION & STORES ====================

export async function geocode(q: string) {
  const r = await fetch(`${API}/geocode?q=${encodeURIComponent(q)}`);
  if (!r.ok) throw new Error("geocode failed");
  return r.json();
}

export async function getNearbyStores(
  lat: number,
  lon: number,
  radius: number = 5
) {
  const r = await fetch(
    `${API}/stores/nearby?lat=${lat}&lon=${lon}&radius=${radius}`
  );
  if (!r.ok) throw new Error("Failed to get nearby stores");
  return r.json();
}

export async function getAllStores() {
  const r = await fetch(`${API}/stores`);
  if (!r.ok) throw new Error("Failed to get stores");
  return r.json();
}

// ==================== DEALS ====================

export async function getDeals(filters?: {
  store?: string;
  category?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.store) params.append("store", filters.store);
  if (filters?.category) params.append("category", filters.category);

  const queryString = params.toString();
  const url = `${API}/deals${queryString ? `?${queryString}` : ""}`;

  const r = await fetch(url);
  if (!r.ok) throw new Error("Failed to get deals");
  return r.json();
}

// ==================== AI FEATURES ====================

export async function generateMealPlan(preferences: {
  goal?: string;
  cuisines?: string[];
  dietary?: string[];
  allergies?: string[];
  days?: number;
}) {
  const r = await fetch(`${API}/ai/meal-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(preferences),
  });
  if (!r.ok) throw new Error("Failed to generate meal plan");
  return r.json();
}

export async function recipeToShoppingList(
  recipe: string,
  servings: number = 4
) {
  const r = await fetch(`${API}/ai/recipe-to-list`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipe, servings }),
  });
  if (!r.ok) throw new Error("Failed to convert recipe to list");
  return r.json();
}

// ==================== SHOPPING LISTS ====================

export type GroceryItem = {
  id: string;
  name: string;
  quantity: string;
  store?: string;
};

export type ShoppingList = {
  id: string;
  userId: string;
  name: string;
  items: GroceryItem[];
  createdAt: string;
  updatedAt: string;
};

export async function createList(name: string, items: GroceryItem[]) {
  const r = await fetch(`${API}/lists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, items }),
  });
  if (!r.ok) throw new Error("Failed to create list");
  return r.json();
}

export async function getLists() {
  const r = await fetch(`${API}/lists`);
  if (!r.ok) throw new Error("Failed to get lists");
  return r.json();
}

export async function getList(id: string) {
  const r = await fetch(`${API}/lists/${id}`);
  if (!r.ok) throw new Error("Failed to get list");
  return r.json();
}

export async function updateList(
  id: string,
  updates: { name?: string; items?: GroceryItem[] }
) {
  const r = await fetch(`${API}/lists/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!r.ok) throw new Error("Failed to update list");
  return r.json();
}

export async function deleteList(id: string) {
  const r = await fetch(`${API}/lists/${id}`, {
    method: "DELETE",
  });
  if (!r.ok) throw new Error("Failed to delete list");
  return r.json();
}

// ==================== USER PREFERENCES ====================

export type Preferences = {
  userId: string;
  goal?: string;
  cuisines: string[];
  dietary: string[];
  allergies: string[];
  createdAt?: string;
  updatedAt?: string;
};

export async function getPreferences() {
  const r = await fetch(`${API}/preferences`);
  if (!r.ok) throw new Error("Failed to get preferences");
  return r.json();
}

export async function updatePreferences(prefs: Partial<Preferences>) {
  const r = await fetch(`${API}/preferences`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prefs),
  });
  if (!r.ok) throw new Error("Failed to update preferences");
  return r.json();
}
