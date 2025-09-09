import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Only POST allowed" };
  }

  const { email, password } = JSON.parse(event.body || "{}");

  // secrets stored in Netlify dashboard
  const defaultUser = process.env.DEFAULT_USER;
  const defaultPass = process.env.DEFAULT_PASS;

  if (email === defaultUser && password === defaultPass) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  }

  return {
    statusCode: 401,
    body: JSON.stringify({
      success: false,
      message: "Wrong username or password",
    }),
  };
};
