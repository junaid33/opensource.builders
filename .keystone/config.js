"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default2
});
module.exports = __toCommonJS(keystone_exports);

// features/keystone/index.ts
var import_auth = require("@keystone-6/auth");
var import_core9 = require("@keystone-6/core");
var import_config = require("dotenv/config");

// features/keystone/models/User.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");

// features/keystone/access.ts
function isSignedIn({ session }) {
  return Boolean(session);
}
var permissions = {
  canManagePeople: ({ session }) => session?.data.role?.canManagePeople ?? false,
  canManageRoles: ({ session }) => session?.data.role?.canManageRoles ?? false,
  canManageApplications: ({ session }) => session?.data.role?.canManageApplications ?? false,
  canManageCategories: ({ session }) => session?.data.role?.canManageCategories ?? false,
  canManageCapabilities: ({ session }) => session?.data.role?.canManageCapabilities ?? false
};
var rules = {
  canReadPeople: ({ session }) => {
    if (!session) return false;
    if (session.data.role?.canSeeOtherPeople) return true;
    return { id: { equals: session.itemId } };
  },
  canUpdatePeople: ({ session }) => {
    if (!session) return false;
    if (session.data.role?.canEditOtherPeople) return true;
    return { id: { equals: session.itemId } };
  }
};

// features/keystone/models/User.ts
var User = (0, import_core.list)({
  access: {
    operation: {
      ...(0, import_access.allOperations)(isSignedIn),
      create: permissions.canManagePeople,
      delete: permissions.canManagePeople
    },
    filter: {
      query: rules.canReadPeople,
      update: rules.canUpdatePeople
    }
  },
  ui: {
    hideCreate: (args) => !permissions.canManagePeople(args),
    hideDelete: (args) => !permissions.canManagePeople(args),
    listView: {
      initialColumns: ["name", "email", "role"]
    },
    itemView: {
      defaultFieldMode: ({ session, item }) => {
        if (session?.data.role?.canEditOtherPeople) return "edit";
        if (session?.itemId === item?.id) return "edit";
        return "read";
      }
    }
  },
  fields: {
    name: (0, import_fields.text)({
      validation: {
        isRequired: true
      }
    }),
    email: (0, import_fields.text)({
      isFilterable: false,
      isOrderable: false,
      isIndexed: "unique",
      validation: {
        isRequired: true
      }
    }),
    password: (0, import_fields.password)({
      access: {
        read: import_access.denyAll,
        update: ({ session, item }) => permissions.canManagePeople({ session }) || session?.itemId === item.id
      },
      validation: { isRequired: true }
    }),
    role: (0, import_fields.relationship)({
      ref: "Role.assignedTo",
      access: {
        create: permissions.canManagePeople,
        update: permissions.canManagePeople
      },
      ui: {
        itemView: {
          fieldMode: (args) => permissions.canManagePeople(args) ? "edit" : "read"
        }
      }
    })
  }
});

// features/keystone/models/Role.ts
var import_core2 = require("@keystone-6/core");
var import_access3 = require("@keystone-6/core/access");
var import_fields2 = require("@keystone-6/core/fields");
var Role = (0, import_core2.list)({
  access: {
    operation: {
      ...(0, import_access3.allOperations)(permissions.canManageRoles),
      query: isSignedIn
    }
  },
  ui: {
    hideCreate: (args) => !permissions.canManageRoles(args),
    hideDelete: (args) => !permissions.canManageRoles(args),
    listView: {
      initialColumns: ["name", "assignedTo"]
    },
    itemView: {
      defaultFieldMode: (args) => permissions.canManageRoles(args) ? "edit" : "read"
    }
  },
  fields: {
    name: (0, import_fields2.text)({ validation: { isRequired: true } }),
    canSeeOtherPeople: (0, import_fields2.checkbox)({ defaultValue: false }),
    canEditOtherPeople: (0, import_fields2.checkbox)({ defaultValue: false }),
    canManagePeople: (0, import_fields2.checkbox)({ defaultValue: false }),
    canManageRoles: (0, import_fields2.checkbox)({ defaultValue: false }),
    canAccessDashboard: (0, import_fields2.checkbox)({ defaultValue: false }),
    canManageApplications: (0, import_fields2.checkbox)({ defaultValue: false }),
    canManageCategories: (0, import_fields2.checkbox)({ defaultValue: false }),
    canManageCapabilities: (0, import_fields2.checkbox)({ defaultValue: false }),
    assignedTo: (0, import_fields2.relationship)({
      ref: "User.role",
      many: true,
      ui: {
        itemView: { fieldMode: "read" }
      }
    })
  }
});

// features/keystone/models/Category.ts
var import_core3 = require("@keystone-6/core");
var import_fields3 = require("@keystone-6/core/fields");
var Category = (0, import_core3.list)({
  access: {
    operation: {
      query: () => true,
      // Allow public read access
      create: permissions.canManageCategories,
      update: permissions.canManageCategories,
      delete: permissions.canManageCategories
    }
  },
  ui: {
    hideCreate: (args) => !permissions.canManageCategories(args),
    hideDelete: (args) => !permissions.canManageCategories(args),
    listView: {
      initialColumns: ["name", "slug", "description", "createdAt"]
    },
    itemView: {
      defaultFieldMode: (args) => permissions.canManageCategories(args) ? "edit" : "read"
    }
  },
  fields: {
    name: (0, import_fields3.text)({
      validation: {
        isRequired: true,
        length: { max: 100 }
      }
    }),
    slug: (0, import_fields3.text)({
      validation: {
        isRequired: true,
        length: { max: 100 }
      },
      isIndexed: "unique"
    }),
    description: (0, import_fields3.text)({
      ui: {
        displayMode: "textarea"
      }
    }),
    icon: (0, import_fields3.text)({
      validation: {
        length: { max: 100 }
      }
    }),
    color: (0, import_fields3.text)({
      validation: {
        length: { max: 7 }
      }
    }),
    createdAt: (0, import_fields3.timestamp)({
      defaultValue: { kind: "now" }
    }),
    // Relationships to new application models
    proprietaryApplications: (0, import_fields3.relationship)({
      ref: "ProprietaryApplication.category",
      many: true
    })
  }
});

// features/keystone/models/ProprietaryApplication.ts
var import_core4 = require("@keystone-6/core");
var import_fields4 = require("@keystone-6/core/fields");
var ProprietaryApplication = (0, import_core4.list)({
  access: {
    operation: {
      query: () => true,
      // Allow public read access
      create: permissions.canManageApplications,
      update: permissions.canManageApplications,
      delete: permissions.canManageApplications
    }
  },
  ui: {
    hideCreate: (args) => !permissions.canManageApplications(args),
    hideDelete: (args) => !permissions.canManageApplications(args),
    listView: {
      initialColumns: ["name", "slug", "category", "createdAt"]
    },
    itemView: {
      defaultFieldMode: (args) => permissions.canManageApplications(args) ? "edit" : "read"
    }
  },
  fields: {
    name: (0, import_fields4.text)({
      validation: {
        isRequired: true,
        length: { max: 255 }
      }
    }),
    slug: (0, import_fields4.text)({
      validation: {
        isRequired: true,
        length: { max: 255 }
      },
      isIndexed: "unique"
    }),
    description: (0, import_fields4.text)({
      ui: {
        displayMode: "textarea"
      }
    }),
    websiteUrl: (0, import_fields4.text)({
      label: "Website URL",
      validation: {
        length: { max: 500 }
      }
    }),
    simpleIconSlug: (0, import_fields4.text)({
      label: "Simple Icon Slug",
      validation: {
        length: { max: 100 }
      }
    }),
    simpleIconColor: (0, import_fields4.text)({
      label: "Simple Icon Color",
      validation: {
        length: { max: 7 }
        // For hex colors like #7AB55C
      }
    }),
    category: (0, import_fields4.relationship)({
      ref: "Category.proprietaryApplications",
      ui: {
        displayMode: "select"
      }
    }),
    // Capabilities this proprietary app has (for comparison baseline)
    capabilities: (0, import_fields4.relationship)({
      ref: "ProprietaryCapability.proprietaryApplication",
      many: true
    }),
    // Open source alternatives to this proprietary app
    openSourceAlternatives: (0, import_fields4.relationship)({
      ref: "OpenSourceApplication.primaryAlternativeTo",
      many: true
    }),
    createdAt: (0, import_fields4.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields4.timestamp)({
      defaultValue: { kind: "now" },
      db: {
        updatedAt: true
      }
    })
  }
});

// features/keystone/models/OpenSourceApplication.ts
var import_core5 = require("@keystone-6/core");
var import_fields5 = require("@keystone-6/core/fields");
var OpenSourceApplication = (0, import_core5.list)({
  access: {
    operation: {
      query: () => true,
      // Allow public read access
      create: permissions.canManageApplications,
      update: permissions.canManageApplications,
      delete: permissions.canManageApplications
    }
  },
  ui: {
    hideCreate: (args) => !permissions.canManageApplications(args),
    hideDelete: (args) => !permissions.canManageApplications(args),
    listView: {
      initialColumns: ["name", "slug", "primaryAlternativeTo", "githubStars", "status", "createdAt"]
    },
    itemView: {
      defaultFieldMode: (args) => permissions.canManageApplications(args) ? "edit" : "read"
    }
  },
  fields: {
    name: (0, import_fields5.text)({
      validation: {
        isRequired: true,
        length: { max: 255 }
      }
    }),
    slug: (0, import_fields5.text)({
      validation: {
        isRequired: true,
        length: { max: 255 }
      },
      isIndexed: "unique"
    }),
    description: (0, import_fields5.text)({
      ui: {
        displayMode: "textarea"
      }
    }),
    // Direct connection to ONE proprietary application
    primaryAlternativeTo: (0, import_fields5.relationship)({
      ref: "ProprietaryApplication.openSourceAlternatives",
      ui: {
        displayMode: "select"
      }
    }),
    // Open source specific fields
    repositoryUrl: (0, import_fields5.text)({
      label: "Repository URL",
      validation: {
        length: { max: 500 }
      }
    }),
    websiteUrl: (0, import_fields5.text)({
      label: "Website URL",
      validation: {
        length: { max: 500 }
      }
    }),
    simpleIconSlug: (0, import_fields5.text)({
      label: "Simple Icon Slug",
      validation: {
        length: { max: 100 }
      }
    }),
    simpleIconColor: (0, import_fields5.text)({
      label: "Simple Icon Color",
      validation: {
        length: { max: 7 }
        // For hex colors like #7AB55C
      }
    }),
    license: (0, import_fields5.text)({
      validation: {
        length: { max: 100 }
      }
    }),
    githubStars: (0, import_fields5.integer)({
      label: "GitHub Stars"
    }),
    githubForks: (0, import_fields5.integer)({
      label: "GitHub Forks"
    }),
    githubIssues: (0, import_fields5.integer)({
      label: "GitHub Issues"
    }),
    githubLastCommit: (0, import_fields5.timestamp)({
      label: "GitHub Last Commit"
    }),
    status: (0, import_fields5.select)({
      options: [
        { label: "Active", value: "active" },
        { label: "Maintenance", value: "maintenance" },
        { label: "Deprecated", value: "deprecated" },
        { label: "Beta", value: "beta" }
      ],
      defaultValue: "active"
    }),
    // Rich capabilities for build page
    capabilities: (0, import_fields5.relationship)({
      ref: "OpenSourceCapability.openSourceApplication",
      many: true
    }),
    createdAt: (0, import_fields5.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields5.timestamp)({
      defaultValue: { kind: "now" },
      db: {
        updatedAt: true
      }
    })
  }
});

// features/keystone/models/Capability.ts
var import_core6 = require("@keystone-6/core");
var import_fields6 = require("@keystone-6/core/fields");
var Capability = (0, import_core6.list)({
  access: {
    operation: {
      query: () => true,
      // Allow public read access
      create: permissions.canManageCapabilities,
      update: permissions.canManageCapabilities,
      delete: permissions.canManageCapabilities
    }
  },
  ui: {
    hideCreate: (args) => !permissions.canManageCapabilities(args),
    hideDelete: (args) => !permissions.canManageCapabilities(args),
    listView: {
      initialColumns: ["name", "slug", "category", "complexity", "createdAt"]
    },
    itemView: {
      defaultFieldMode: (args) => permissions.canManageCapabilities(args) ? "edit" : "read"
    }
  },
  fields: {
    name: (0, import_fields6.text)({
      validation: {
        isRequired: true,
        length: { max: 255 }
      }
    }),
    slug: (0, import_fields6.text)({
      validation: {
        isRequired: true,
        length: { max: 255 }
      },
      isIndexed: "unique"
    }),
    description: (0, import_fields6.text)({
      ui: {
        displayMode: "textarea"
      }
    }),
    // Categorization for build page
    category: (0, import_fields6.select)({
      label: "Capability Category",
      options: [
        { label: "Authentication", value: "authentication" },
        { label: "Payment", value: "payment" },
        { label: "Storage", value: "storage" },
        { label: "Communication", value: "communication" },
        { label: "Analytics", value: "analytics" },
        { label: "UI Components", value: "ui_components" },
        { label: "Database", value: "database" },
        { label: "Email", value: "email" },
        { label: "Search", value: "search" },
        { label: "Media", value: "media" },
        { label: "Security", value: "security" },
        { label: "Deployment", value: "deployment" },
        { label: "Monitoring", value: "monitoring" },
        { label: "Testing", value: "testing" },
        { label: "Other", value: "other" }
      ]
    }),
    // Overall implementation complexity
    complexity: (0, import_fields6.select)({
      label: "Implementation Complexity",
      options: [
        { label: "Basic", value: "basic" },
        { label: "Intermediate", value: "intermediate" },
        { label: "Advanced", value: "advanced" }
      ],
      defaultValue: "intermediate"
    }),
    // Relationships to applications
    proprietaryApplications: (0, import_fields6.relationship)({
      ref: "ProprietaryCapability.capability",
      many: true
    }),
    openSourceApplications: (0, import_fields6.relationship)({
      ref: "OpenSourceCapability.capability",
      many: true
    }),
    createdAt: (0, import_fields6.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields6.timestamp)({
      defaultValue: { kind: "now" },
      db: {
        updatedAt: true
      }
    })
  }
});

// features/keystone/models/ProprietaryCapability.ts
var import_core7 = require("@keystone-6/core");
var import_fields7 = require("@keystone-6/core/fields");
var ProprietaryCapability = (0, import_core7.list)({
  access: {
    operation: {
      query: () => true,
      // Allow public read access
      create: permissions.canManageCapabilities,
      update: permissions.canManageCapabilities,
      delete: permissions.canManageCapabilities
    }
  },
  ui: {
    hideCreate: (args) => !permissions.canManageCapabilities(args),
    hideDelete: (args) => !permissions.canManageCapabilities(args),
    listView: {
      initialColumns: ["proprietaryApplication", "capability", "isActive", "createdAt"]
    },
    itemView: {
      defaultFieldMode: (args) => permissions.canManageCapabilities(args) ? "edit" : "read"
    }
  },
  fields: {
    proprietaryApplication: (0, import_fields7.relationship)({
      ref: "ProprietaryApplication.capabilities",
      ui: {
        displayMode: "select"
      }
    }),
    capability: (0, import_fields7.relationship)({
      ref: "Capability.proprietaryApplications",
      ui: {
        displayMode: "select"
      }
    }),
    // Simple tracking - does this proprietary app have this capability?
    isActive: (0, import_fields7.checkbox)({
      defaultValue: true,
      ui: {
        description: "Does this proprietary application currently have this capability?"
      }
    }),
    createdAt: (0, import_fields7.timestamp)({
      defaultValue: { kind: "now" }
    })
  }
});

// features/keystone/models/OpenSourceCapability.ts
var import_core8 = require("@keystone-6/core");
var import_fields8 = require("@keystone-6/core/fields");
var OpenSourceCapability = (0, import_core8.list)({
  access: {
    operation: {
      query: () => true,
      // Allow public read access
      create: permissions.canManageCapabilities,
      update: permissions.canManageCapabilities,
      delete: permissions.canManageCapabilities
    }
  },
  ui: {
    hideCreate: (args) => !permissions.canManageCapabilities(args),
    hideDelete: (args) => !permissions.canManageCapabilities(args),
    listView: {
      initialColumns: ["openSourceApplication", "capability", "isActive", "implementationComplexity", "createdAt"]
    },
    itemView: {
      defaultFieldMode: (args) => permissions.canManageCapabilities(args) ? "edit" : "read"
    }
  },
  fields: {
    openSourceApplication: (0, import_fields8.relationship)({
      ref: "OpenSourceApplication.capabilities",
      ui: {
        displayMode: "select"
      }
    }),
    capability: (0, import_fields8.relationship)({
      ref: "Capability.openSourceApplications",
      ui: {
        displayMode: "select"
      }
    }),
    // Basic status
    isActive: (0, import_fields8.checkbox)({
      defaultValue: true,
      ui: {
        description: "Does this open source application currently have this capability?"
      }
    }),
    // Rich implementation details for build page
    implementationNotes: (0, import_fields8.text)({
      label: "Implementation Notes",
      ui: {
        displayMode: "textarea",
        description: "How this application implements this capability"
      }
    }),
    githubPath: (0, import_fields8.text)({
      label: "GitHub Path",
      validation: {
        length: { max: 500 }
      },
      ui: {
        description: 'Relative path to code that implements this capability (e.g., "src/auth/providers/google.ts")'
      }
    }),
    documentationUrl: (0, import_fields8.text)({
      label: "Documentation URL",
      validation: {
        length: { max: 500 }
      },
      ui: {
        description: "Link to documentation for this specific capability"
      }
    }),
    implementationComplexity: (0, import_fields8.select)({
      label: "Implementation Complexity",
      options: [
        { label: "Basic", value: "basic" },
        { label: "Intermediate", value: "intermediate" },
        { label: "Advanced", value: "advanced" }
      ],
      defaultValue: "intermediate",
      ui: {
        description: "How complex it is to implement this capability in this application"
      }
    }),
    createdAt: (0, import_fields8.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields8.timestamp)({
      defaultValue: { kind: "now" },
      db: {
        updatedAt: true
      }
    })
  }
});

// features/keystone/models/index.ts
var models = {
  User,
  Role,
  Category,
  ProprietaryApplication,
  OpenSourceApplication,
  Capability,
  ProprietaryCapability,
  OpenSourceCapability
};

// features/keystone/index.ts
var import_session = require("@keystone-6/core/session");

// features/keystone/mutations/index.ts
var import_schema = require("@graphql-tools/schema");

// features/keystone/mutations/redirectToInit.ts
async function redirectToInit(root, { ids }, context) {
  const userCount = await context.sudo().query.User.count({});
  if (userCount === 0) {
    return true;
  }
  return false;
}
var redirectToInit_default = redirectToInit;

// features/keystone/mutations/index.ts
var graphql = String.raw;
var extendGraphqlSchema = (schema) => (0, import_schema.mergeSchemas)({
  schemas: [schema],
  typeDefs: graphql`
      type Query {
        redirectToInit: Boolean
      }
    `,
  resolvers: {
    Query: {
      redirectToInit: redirectToInit_default
    }
  }
});

// features/keystone/lib/mail.ts
var import_nodemailer = require("nodemailer");
function getBaseUrlForEmails() {
  if (process.env.SMTP_STORE_LINK) {
    return process.env.SMTP_STORE_LINK;
  }
  console.warn("SMTP_STORE_LINK not set. Please add SMTP_STORE_LINK to your environment variables for email links to work properly.");
  return "";
}
var transport = (0, import_nodemailer.createTransport)({
  // @ts-ignore
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});
function passwordResetEmail({ url }) {
  const backgroundColor = "#f9f9f9";
  const textColor = "#444444";
  const mainBackgroundColor = "#ffffff";
  const buttonBackgroundColor = "#346df1";
  const buttonBorderColor = "#346df1";
  const buttonTextColor = "#ffffff";
  return `
    <body style="background: ${backgroundColor};">
      <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
        <tr>
          <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
            Please click below to reset your password
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Reset Password</a></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
            If you did not request this email you can safely ignore it.
          </td>
        </tr>
      </table>
    </body>
  `;
}
async function sendPasswordResetEmail(resetToken, to, baseUrl) {
  const frontendUrl = baseUrl || getBaseUrlForEmails();
  const info = await transport.sendMail({
    to,
    from: process.env.SMTP_FROM,
    subject: "Your password reset token!",
    html: passwordResetEmail({
      url: `${frontendUrl}/dashboard/reset?token=${resetToken}`
    })
  });
  if (process.env.MAIL_USER?.includes("ethereal.email")) {
    console.log(`\u{1F4E7} Message Sent!  Preview it at ${(0, import_nodemailer.getTestMessageUrl)(info)}`);
  }
}

// features/keystone/index.ts
var databaseURL = process.env.DATABASE_URL || "file:./keystone.db";
var sessionConfig = {
  maxAge: 60 * 60 * 24 * 360,
  // How long they stay signed in?
  secret: process.env.SESSION_SECRET || "this secret should only be used in testing"
};
var { withAuth } = (0, import_auth.createAuth)({
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
          canManageCapabilities: true
        }
      }
    }
  },
  passwordResetLink: {
    async sendToken(args) {
      await sendPasswordResetEmail(args.token, args.identity);
    }
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
  `
});
var keystone_default = withAuth(
  (0, import_core9.config)({
    db: {
      provider: "postgresql",
      url: databaseURL
    },
    lists: models,
    ui: {
      isAccessAllowed: ({ session }) => session?.data.role?.canAccessDashboard ?? false
    },
    session: (0, import_session.statelessSessions)(sessionConfig),
    graphql: {
      extendGraphqlSchema
    }
  })
);

// keystone.ts
var keystone_default2 = keystone_default;
//# sourceMappingURL=config.js.map
