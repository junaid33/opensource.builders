import { createAuth } from "@keystone-6/auth";
import { config } from "@keystone-6/core";
import "dotenv/config";
import { models } from "./models";
import { statelessSessions } from "@keystone-6/core/session";
import { extendGraphqlSchema } from "./mutations";
import { sendPasswordResetEmail } from "./lib/mail";

const databaseURL = process.env.DATABASE_URL || "file:./keystone.db";

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // How long they stay signed in?
  secret:
    process.env.SESSION_SECRET || "this secret should only be used in testing",
};

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"],
    itemData: {
      role: {
        create: {
          name: "Admin",
          canSeeOtherPeople: true,
          canEditOtherPeople: true,
          canManagePeople: true,
          canManageRoles: true,
          canAccessDashboard: true,
          canManageApplications: true,
          canManageCategories: true,
          canManageCapabilities: true,
        },
      },
    },
  },
  passwordResetLink: {
    async sendToken(args) {
      // send the email
      await sendPasswordResetEmail(args.token, args.identity);
    },
  },
  sessionData: `
    name
    email
    role {
      id
      name
      canSeeOtherPeople
      canEditOtherPeople
      canManagePeople
      canManageRoles
      canAccessDashboard
      canManageApplications
      canManageCategories
      canManageCapabilities
    }
  `,
});

export default withAuth(
  config({
    db: {
      provider: "postgresql",
      url: databaseURL,
    },
    lists: models,
    ui: {
      isAccessAllowed: ({ session }) => session?.data.role?.canAccessDashboard ?? false,
    },
    session: statelessSessions(sessionConfig),
    graphql: {
      extendGraphqlSchema,
    },
  })
);