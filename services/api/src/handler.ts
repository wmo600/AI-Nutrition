// services/api/src/handler.ts
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { LocationClient, SearchPlaceIndexForTextCommand } from "@aws-sdk/client-location";

const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "ap-southeast-1";
const PLACE_INDEX_NAME = process.env.PLACE_INDEX_NAME!;
const loc = new LocationClient({ region });

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  try {
    const path = event.rawPath || "/";
    if (path === "/ping") {
      return json(200, { ok: true, msg: "pong" });
    }

    if (path === "/geocode") {
      const q = event.queryStringParameters?.q;
      if (!q) return json(400, { error: "Missing ?q=<text>" });

      const resp = await loc.send(new SearchPlaceIndexForTextCommand({
        IndexName: PLACE_INDEX_NAME,
        Text: q,
        MaxResults: 5,
      }));

      const results = (resp.Results || []).map(r => ({
        label: r.Place?.Label,
        coordinates: r.Place?.Geometry?.Point,      // [lon, lat]
        addressNumber: r.Place?.AddressNumber,
        street: r.Place?.Street,
        municipality: r.Place?.Municipality,
        postalCode: r.Place?.PostalCode,
        country: r.Place?.Country,
      }));
      return json(200, { query: q, results });
    }

    return json(404, { error: "Not found", path });
  } catch (e: any) {
    console.error(e);
    return json(500, { error: e.message || "Internal error" });
  }
};

function json(statusCode: number, body: any): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
    body: JSON.stringify(body),
  };
}
