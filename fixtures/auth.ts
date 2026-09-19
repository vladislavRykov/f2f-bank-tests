import { test as base, request } from "@playwright/test";
import { loginUser, uniqUserRegistration } from "../helpers/api-helpers";

type AuthenticatedUser = {
  email: string;
  password: string;
  storageState: any;
};
export const test = base.extend<{ authenticatedUser: AuthenticatedUser }>({
  authenticatedUser: async ({}, use) => {
    const apiContext = await request.newContext();

    const { response, password } = await uniqUserRegistration(apiContext);
    const body: {
      email: string;
    } = await response.json();

    await loginUser(apiContext, { email: body.email, password });

    const storageState = await apiContext.storageState();

    await use({ email: body.email, password, storageState });
  },
});

//   const context = await browser.newContext({
//     storageState: authenticatedUser.storageState,
//   });

//   const page = await context.newPage();
