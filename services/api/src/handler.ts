import {
  APIGatewayProxyResultV2,
  APIGatewayProxyEventV2WithJWTAuthorizer,
} from "aws-lambda";
import {
  LocationClient,
  SearchPlaceIndexForTextCommand,
  SearchPlaceIndexForPositionCommand,
} from "@aws-sdk/client-location";

const locationClient = new LocationClient({ region: process.env.AWS_REGION });
const PLACE_INDEX_NAME = process.env.PLACE_INDEX_NAME!;

// Mock data - In production, this would come from DynamoDB
const MOCK_STORES = [
  {
    id: "1",
    name: "FairPrice Xtra VivoCity",
    type: "supermarket",
    position: [103.822, 1.2644], // [longitude, latitude]
    address: "1 HarbourFront Walk, #B2-01, Singapore 098585",
    hours: "8:00 AM - 10:00 PM",
    phone: "+65 6123 4567",
    status: "Open",
  },
  {
    id: "2",
    name: "Cold Storage Orchard",
    type: "supermarket",
    position: [103.8335, 1.3048],
    address: "290 Orchard Road, #B1-07, Singapore 238859",
    hours: "9:00 AM - 9:00 PM",
    phone: "+65 6234 5678",
    status: "Open",
  },
  {
    id: "3",
    name: "FairPrice Finest Bukit Timah",
    type: "supermarket",
    position: [103.7879, 1.3294],
    address: "170 Upper Bukit Timah Road, Singapore 588179",
    hours: "8:00 AM - 10:00 PM",
    phone: "+65 6345 6789",
    status: "Open",
  },
];

const MOCK_DEALS = [
  {
    id: "1",
    store: "FairPrice",
    title: "20% off all vegetables",
    description: "Fresh vegetables at amazing prices",
    category: "vegetables",
    discount: "20%",
    validUntil: "2025-11-24",
  },
  {
    id: "2",
    store: "Cold Storage",
    title: "Buy 2 Get 1 Free Yogurt",
    description: "All yogurt varieties included",
    category: "dairy",
    discount: "33%",
    validUntil: "2025-11-20",
  },
  {
    id: "3",
    store: "FairPrice",
    title: "10% off fresh fruits",
    description: "Selected seasonal fruits",
    category: "fruits",
    discount: "10%",
    validUntil: "2025-11-22",
  },
];

// Helper: Calculate distance between two points (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Helper: Get user ID from Cognito claims (for protected routes)
function getUserId(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): string | null {
  const claims = event.requestContext.authorizer?.jwt?.claims;
  return (claims?.sub as string) || null;
}

export async function handler(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyResultV2> {
  console.log("Event:", JSON.stringify(event, null, 2));

  const path = event.rawPath;
  const method = event.requestContext.http.method;
  const headers = { "Content-Type": "application/json" };

  try {
    // ==================== PUBLIC ROUTES ====================

    // GET /ping - Health check
    if (path === "/ping" && method === "GET") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: "pong",
          timestamp: new Date().toISOString(),
          version: "1.0.0",
        }),
      };
    }

    // GET /geocode?q=<query> - Geocode an address
    if (path === "/geocode" && method === "GET") {
      const query = event.queryStringParameters?.q;

      if (!query) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Missing query parameter 'q'" }),
        };
      }

      const command = new SearchPlaceIndexForTextCommand({
        IndexName: PLACE_INDEX_NAME,
        Text: query,
        MaxResults: 5,
      });

      const response = await locationClient.send(command);

      const results =
        response.Results?.map((result) => ({
          label: result.Place?.Label,
          address: result.Place?.Label,
          position: result.Place?.Geometry?.Point,
          country: result.Place?.Country,
          region: result.Place?.Region,
          municipality: result.Place?.Municipality,
          postalCode: result.Place?.PostalCode,
        })) || [];

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ results }),
      };
    }

    // GET /stores/nearby?lat=X&lon=Y&radius=5 - Find nearby stores
    if (path === "/stores/nearby" && method === "GET") {
      const lat = parseFloat(event.queryStringParameters?.lat || "");
      const lon = parseFloat(event.queryStringParameters?.lon || "");
      const radius = parseFloat(event.queryStringParameters?.radius || "5"); // km

      if (isNaN(lat) || isNaN(lon)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: "Missing or invalid 'lat' and 'lon' parameters",
          }),
        };
      }

      // Calculate distances and filter by radius
      const nearbyStores = MOCK_STORES.map((store) => {
        const [storeLon, storeLat] = store.position;
        const distance = calculateDistance(lat, lon, storeLat, storeLon);
        return {
          ...store,
          distance: parseFloat(distance.toFixed(2)),
        };
      })
        .filter((store) => store.distance <= radius)
        .sort((a, b) => a.distance - b.distance);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          stores: nearbyStores,
          count: nearbyStores.length,
        }),
      };
    }

    // GET /deals?store=X&category=Y - Get current deals
    if (path === "/deals" && method === "GET") {
      const store = event.queryStringParameters?.store?.toLowerCase();
      const category = event.queryStringParameters?.category?.toLowerCase();

      let deals = MOCK_DEALS;

      if (store) {
        deals = deals.filter((d) => d.store.toLowerCase().includes(store));
      }

      if (category) {
        deals = deals.filter((d) => d.category === category);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          deals,
          count: deals.length,
        }),
      };
    }

    // GET /stores - Get all stores
    if (path === "/stores" && method === "GET") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          stores: MOCK_STORES,
          count: MOCK_STORES.length,
        }),
      };
    }

    // ==================== AI ROUTES (PUBLIC FOR NOW) ====================

    // POST /ai/meal-plan - Generate meal plan
    if (path === "/ai/meal-plan" && method === "POST") {
      const body = JSON.parse(event.body || "{}");
      const { goal, cuisines, dietary, allergies, days = 7 } = body;

      // Mock AI response - In production, integrate Claude API
      const mealPlan = {
        goal: goal || "Health Maintenance",
        days,
        meals: Array.from({ length: days }, (_, i) => ({
          day: i + 1,
          dayName: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i % 7],
          breakfast: {
            name: "Oatmeal with Berries",
            calories: 350,
            protein: 12,
          },
          lunch: {
            name: "Grilled Chicken Salad",
            calories: 450,
            protein: 35,
          },
          dinner: {
            name: "Baked Salmon with Vegetables",
            calories: 550,
            protein: 40,
          },
        })),
        totalCalories: days * 1350,
        shoppingList: [
          "Oats (500g)",
          "Mixed berries (1kg)",
          "Chicken breast (1kg)",
          "Salmon fillets (800g)",
          "Mixed vegetables (2kg)",
          "Salad greens (500g)",
        ],
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(mealPlan),
      };
    }

    // POST /ai/recipe-to-list - Convert recipe to shopping list
    if (path === "/ai/recipe-to-list" && method === "POST") {
      const body = JSON.parse(event.body || "{}");
      const { recipe, servings = 4 } = body;

      if (!recipe) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Missing 'recipe' in request body" }),
        };
      }

      // Mock AI extraction - In production, use Claude API
      const groceryList = [
        {
          id: "1",
          name: "Chicken breast",
          quantity: "500g",
          store: "FairPrice",
        },
        { id: "2", name: "Rice", quantity: "2 cups", store: "FairPrice" },
        { id: "3", name: "Soy sauce", quantity: "3 tbsp", store: "FairPrice" },
        { id: "4", name: "Garlic", quantity: "4 cloves", store: "FairPrice" },
        { id: "5", name: "Ginger", quantity: "1 inch", store: "FairPrice" },
      ];

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          recipe: recipe.substring(0, 100) + "...",
          servings,
          items: groceryList,
          estimatedCost: 15.5,
        }),
      };
    }

    // ==================== PROTECTED ROUTES (REQUIRE AUTH) ====================
    // Note: These routes need Cognito authorizer enabled in CDK
    // For now, they work without auth for testing

    // POST /lists - Save a shopping list
    if (path === "/lists" && method === "POST") {
      const userId = getUserId(event) || "guest"; // Fall back to guest for testing
      const body = JSON.parse(event.body || "{}");
      const { name, items } = body;

      if (!name || !items || !Array.isArray(items)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: "Missing 'name' or 'items' array in request body",
          }),
        };
      }

      const list = {
        id: `list-${Date.now()}`,
        userId,
        name,
        items,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // In production: Save to DynamoDB
      console.log("Saving list:", list);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(list),
      };
    }

    // GET /lists - Get user's shopping lists
    if (path === "/lists" && method === "GET") {
      const userId = getUserId(event) || "guest";

      // Mock data - In production, query DynamoDB
      const lists = [
        {
          id: "list-1",
          userId,
          name: "Weekly Groceries",
          items: [
            { id: "1", name: "Milk", quantity: "2L", store: "FairPrice" },
            { id: "2", name: "Bread", quantity: "1 loaf", store: "FairPrice" },
          ],
          createdAt: "2025-11-15T10:00:00Z",
          updatedAt: "2025-11-15T10:00:00Z",
        },
        {
          id: "list-2",
          userId,
          name: "Party Supplies",
          items: [
            {
              id: "3",
              name: "Chips",
              quantity: "3 bags",
              store: "Cold Storage",
            },
            { id: "4", name: "Soda", quantity: "2L", store: "Cold Storage" },
          ],
          createdAt: "2025-11-16T14:00:00Z",
          updatedAt: "2025-11-16T14:00:00Z",
        },
      ];

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ lists, count: lists.length }),
      };
    }

    // GET /lists/:id - Get a specific list
    if (path.startsWith("/lists/") && method === "GET") {
      const listId = path.split("/")[2];
      const userId = getUserId(event) || "guest";

      // Mock data - In production, get from DynamoDB
      const list = {
        id: listId,
        userId,
        name: "Weekly Groceries",
        items: [
          { id: "1", name: "Milk", quantity: "2L", store: "FairPrice" },
          { id: "2", name: "Bread", quantity: "1 loaf", store: "FairPrice" },
        ],
        createdAt: "2025-11-15T10:00:00Z",
        updatedAt: "2025-11-15T10:00:00Z",
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(list),
      };
    }

    // PUT /lists/:id - Update a list
    if (path.startsWith("/lists/") && method === "PUT") {
      const listId = path.split("/")[2];
      const userId = getUserId(event) || "guest";
      const body = JSON.parse(event.body || "{}");

      const updatedList = {
        id: listId,
        userId,
        ...body,
        updatedAt: new Date().toISOString(),
      };

      // In production: Update in DynamoDB
      console.log("Updating list:", updatedList);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(updatedList),
      };
    }

    // DELETE /lists/:id - Delete a list
    if (path.startsWith("/lists/") && method === "DELETE") {
      const listId = path.split("/")[2];
      const userId = getUserId(event) || "guest";

      // In production: Delete from DynamoDB
      console.log("Deleting list:", listId, "for user:", userId);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "List deleted", id: listId }),
      };
    }

    // GET /preferences - Get user preferences
    if (path === "/preferences" && method === "GET") {
      const userId = getUserId(event) || "guest";

      // Mock data - In production, get from DynamoDB
      const preferences = {
        userId,
        goal: "Health Maintenance",
        cuisines: ["Asian", "Mediterranean"],
        dietary: ["Low Carb"],
        allergies: [],
        createdAt: "2025-11-10T10:00:00Z",
        updatedAt: "2025-11-15T10:00:00Z",
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(preferences),
      };
    }

    // PUT /preferences - Update user preferences
    if (path === "/preferences" && method === "PUT") {
      const userId = getUserId(event) || "guest";
      const body = JSON.parse(event.body || "{}");

      const preferences = {
        userId,
        ...body,
        updatedAt: new Date().toISOString(),
      };

      // In production: Save to DynamoDB
      console.log("Updating preferences:", preferences);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(preferences),
      };
    }

    // Route not found
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        error: "Route not found",
        path,
        method,
        availableRoutes: [
          "GET /ping",
          "GET /geocode?q=<query>",
          "GET /stores",
          "GET /stores/nearby?lat=X&lon=Y&radius=5",
          "GET /deals?store=X&category=Y",
          "POST /ai/meal-plan",
          "POST /ai/recipe-to-list",
          "POST /lists",
          "GET /lists",
          "GET /lists/:id",
          "PUT /lists/:id",
          "DELETE /lists/:id",
          "GET /preferences",
          "PUT /preferences",
        ],
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
}
