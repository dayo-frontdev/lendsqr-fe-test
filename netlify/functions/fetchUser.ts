import type { Handler } from "@netlify/functions";

export const handler: Handler = async () => {
  try {
    const response = await fetch(
      "https://api.json-generator.com/templates/BNHHyXQHClhi/data",
      {
        headers: {
          Authorization: `Bearer ${process.env.USERS_DATA_API}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
