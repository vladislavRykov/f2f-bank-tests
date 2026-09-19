import { APIRequestContext } from "@playwright/test";

export async function registerUser(
  request: APIRequestContext,
  data: {
    name: string;
    surname: string;
    email: string;
    password: string;
    role: string;
  },
) {
  const response = await request.post("http://localhost/api/auth/register", {
    data,
  });

  return response;
}
export async function uniqUserRegistration(request: APIRequestContext) {
  const email = `e2e_${Date.now()}_${Math.random().toString(36).slice(2)}@m`;
  const password = "123123";
  const response = await registerUser(request, {
    email,
    password,
    name: "user",
    role: "user",
    surname: "user",
  });

  return { password, response };
}
export async function loginUser(
  request: APIRequestContext,
  data: { password: string; email: string },
) {
  const response = await request.post("http://localhost/api/auth/login", {
    data,
  });

  return response;
}
