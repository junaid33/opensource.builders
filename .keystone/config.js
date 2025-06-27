"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default2
});
module.exports = __toCommonJS(keystone_exports);

// features/keystone/index.ts
var import_auth = require("@keystone-6/auth");
var import_core10 = require("@keystone-6/core");
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
  canManageTools: ({ session }) => session?.data.role?.canManageTools ?? false,
  canManageCategories: ({ session }) => session?.data.role?.canManageCategories ?? false,
  canManageFeatures: ({ session }) => session?.data.role?.canManageFeatures ?? false,
  canManageAlternatives: ({ session }) => session?.data.role?.canManageAlternatives ?? false,
  canManageDeploymentOptions: ({ session }) => session?.data.role?.canManageDeploymentOptions ?? false,
  canManageTechStacks: ({ session }) => session?.data.role?.canManageTechStacks ?? false
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
    canManageTools: (0, import_fields2.checkbox)({ defaultValue: false }),
    canManageCategories: (0, import_fields2.checkbox)({ defaultValue: false }),
    canManageFeatures: (0, import_fields2.checkbox)({ defaultValue: false }),
    canManageAlternatives: (0, import_fields2.checkbox)({ defaultValue: false }),
    canManageDeploymentOptions: (0, import_fields2.checkbox)({ defaultValue: false }),
    canManageTechStacks: (0, import_fields2.checkbox)({ defaultValue: false }),
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
    tools: (0, import_fields3.relationship)({
      ref: "Tool.category",
      many: true
    }),
    features: (0, import_fields3.relationship)({
      ref: "Feature.category",
      many: true
    })
  }
});

// features/keystone/models/Tool.ts
var import_core4 = require("@keystone-6/core");
var import_fields4 = require("@keystone-6/core/fields");
var import_core5 = require("@keystone-6/core");

// features/keystone/utils/logo-resolver.ts
var import_crypto = __toESM(require("crypto"));
var GLOBE_ICON_HASHES = [
  "99fd8ddc4311471625e5756986002b6b",
  // Common globe hash
  "b8a0bf372c762e966cc99ede8682bc71",
  // Blank/default image hash
  "7c4e3eea2cd5a57b08b3e8d8f6e8b9c1"
  // Another common globe variant
];
async function resolveToolLogo(tool) {
  if (tool.logoSvg) {
    return {
      type: "svg",
      data: tool.logoSvg,
      verified: true
    };
  }
  if (tool.logoUrl) {
    return {
      type: "url",
      data: tool.logoUrl,
      verified: true
    };
  }
  if (tool.websiteUrl) {
    try {
      const domain = new URL(tool.websiteUrl).hostname;
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
      const isValidFavicon = await checkFaviconQuality(faviconUrl);
      if (isValidFavicon) {
        return {
          type: "favicon",
          data: faviconUrl,
          domain,
          verified: true
        };
      }
    } catch (error) {
      console.warn(`Failed to resolve favicon for ${tool.name}:`, error);
    }
  }
  const firstLetter = tool.name ? tool.name.charAt(0).toUpperCase() : "?";
  return {
    type: "letter",
    data: firstLetter,
    verified: true
  };
}
async function checkFaviconQuality(faviconUrl) {
  try {
    const response = await fetch(faviconUrl, {
      method: "HEAD",
      timeout: 5e3
      // 5 second timeout
    });
    if (!response.ok) {
      return false;
    }
    const imageResponse = await fetch(faviconUrl, {
      timeout: 5e3
    });
    if (!imageResponse.ok) {
      return false;
    }
    const buffer = await imageResponse.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    if (buffer.byteLength < 200) {
      return false;
    }
    const hash = import_crypto.default.createHash("md5").update(uint8Array).digest("hex");
    if (GLOBE_ICON_HASHES.includes(hash)) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}
function generateLetterAvatarSvg(letter, size = 32) {
  const colors = [
    "#3B82F6",
    // blue
    "#EF4444",
    // red
    "#10B981",
    // green
    "#F59E0B",
    // yellow
    "#8B5CF6",
    // purple
    "#06B6D4",
    // cyan
    "#F97316",
    // orange
    "#84CC16"
    // lime
  ];
  const colorIndex = letter.charCodeAt(0) % colors.length;
  const color = colors[colorIndex];
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${color}"/>
      <text x="${size / 2}" y="${size / 2}" dy="0.35em" text-anchor="middle" 
            fill="white" font-family="system-ui, sans-serif" 
            font-size="${size * 0.5}" font-weight="600">
        ${letter}
      </text>
    </svg>
  `.trim();
}

// features/keystone/models/Tool.ts
var Tool = (0, import_core4.list)({
  access: {
    operation: {
      query: () => true,
      // Allow public read access
      create: permissions.canManageTools,
      update: permissions.canManageTools,
      delete: permissions.canManageTools
    }
  },
  ui: {
    hideCreate: (args) => !permissions.canManageTools(args),
    hideDelete: (args) => !permissions.canManageTools(args),
    listView: {
      initialColumns: ["name", "slug", "category", "isOpenSource", "status", "createdAt"]
    },
    itemView: {
      defaultFieldMode: (args) => permissions.canManageTools(args) ? "edit" : "read"
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
    repositoryUrl: (0, import_fields4.text)({
      label: "Repository URL",
      validation: {
        length: { max: 500 }
      }
    }),
    logoUrl: (0, import_fields4.text)({
      label: "Logo URL",
      validation: {
        length: { max: 500 }
      }
    }),
    logoSvg: (0, import_fields4.text)({
      label: "Logo SVG",
      ui: {
        displayMode: "textarea"
      },
      validation: {
        length: { max: 1e4 }
      }
    }),
    isOpenSource: (0, import_fields4.checkbox)({
      label: "Is Open Source",
      defaultValue: false
    }),
    category: (0, import_fields4.relationship)({
      ref: "Category.tools",
      ui: {
        displayMode: "select"
      }
    }),
    license: (0, import_fields4.text)({
      validation: {
        length: { max: 100 }
      }
    }),
    githubStars: (0, import_fields4.integer)({
      label: "GitHub Stars"
    }),
    status: (0, import_fields4.select)({
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Deprecated", value: "deprecated" },
        { label: "Beta", value: "beta" }
      ],
      defaultValue: "active"
    }),
    pricingModel: (0, import_fields4.select)({
      label: "Pricing Model",
      options: [
        { label: "Free", value: "free" },
        { label: "Freemium", value: "freemium" },
        { label: "Paid", value: "paid" },
        { label: "One-time", value: "one_time" },
        { label: "Subscription", value: "subscription" },
        { label: "Usage-based", value: "usage_based" }
      ]
    }),
    createdAt: (0, import_fields4.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields4.timestamp)({
      defaultValue: { kind: "now" },
      db: {
        updatedAt: true
      }
    }),
    features: (0, import_fields4.relationship)({
      ref: "ToolFeature.tool",
      many: true
    }),
    proprietaryAlternatives: (0, import_fields4.relationship)({
      ref: "Alternative.proprietaryTool",
      many: true
    }),
    openSourceAlternatives: (0, import_fields4.relationship)({
      ref: "Alternative.openSourceTool",
      many: true
    }),
    deploymentOptions: (0, import_fields4.relationship)({
      ref: "DeploymentOption.tool",
      many: true
    }),
    // Virtual field that provides intelligent logo resolution
    resolvedLogo: (0, import_fields4.virtual)({
      field: import_core5.graphql.field({
        type: import_core5.graphql.JSON,
        async resolve(item) {
          try {
            const result = await resolveToolLogo({
              name: item.name,
              logoSvg: item.logoSvg,
              logoUrl: item.logoUrl,
              websiteUrl: item.websiteUrl
            });
            if (result.type === "letter") {
              return {
                ...result,
                svg: generateLetterAvatarSvg(result.data)
              };
            }
            return result;
          } catch (error) {
            console.error(`Error resolving logo for ${item.name}:`, error);
            const firstLetter = item.name ? item.name.charAt(0).toUpperCase() : "?";
            return {
              type: "letter",
              data: firstLetter,
              svg: generateLetterAvatarSvg(firstLetter),
              verified: false
            };
          }
        }
      }),
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read" },
        listView: { fieldMode: "hidden" }
      }
    })
  }
});

// features/keystone/models/Feature.ts
var import_core6 = require("@keystone-6/core");
var import_fields5 = require("@keystone-6/core/fields");
var Feature = (0, import_core6.list)({
  access: {
    operation: {
      query: () => true,
      // Allow public read access
      create: permissions.canManageFeatures,
      update: permissions.canManageFeatures,
      delete: permissions.canManageFeatures
    }
  },
  ui: {
    hideCreate: (args) => !permissions.canManageFeatures(args),
    hideDelete: (args) => !permissions.canManageFeatures(args),
    listView: {
      initialColumns: ["name", "slug", "category", "featureType", "createdAt"]
    },
    itemView: {
      defaultFieldMode: (args) => permissions.canManageFeatures(args) ? "edit" : "read"
    }
  },
  fields: {
    name: (0, import_fields5.text)({
      validation: {
        isRequired: true,
        length: { max: 100 }
      }
    }),
    slug: (0, import_fields5.text)({
      validation: {
        isRequired: true,
        length: { max: 100 }
      },
      isIndexed: "unique"
    }),
    description: (0, import_fields5.text)({
      ui: {
        displayMode: "textarea"
      }
    }),
    category: (0, import_fields5.relationship)({
      ref: "Category.features",
      ui: {
        displayMode: "select"
      }
    }),
    featureType: (0, import_fields5.select)({
      label: "Feature Type",
      options: [
        { label: "Core", value: "core" },
        { label: "Integration", value: "integration" },
        { label: "UI/UX", value: "ui_ux" },
        { label: "API", value: "api" },
        { label: "Security", value: "security" },
        { label: "Performance", value: "performance" },
        { label: "Analytics", value: "analytics" },
        { label: "Collaboration", value: "collaboration" },
        { label: "Deployment", value: "deployment" },
        { label: "Customization", value: "customization" }
      ]
    }),
    createdAt: (0, import_fields5.timestamp)({
      defaultValue: { kind: "now" }
    }),
    tools: (0, import_fields5.relationship)({
      ref: "ToolFeature.feature",
      many: true
    })
  }
});

// features/keystone/models/ToolFeature.ts
var import_core7 = require("@keystone-6/core");
var import_fields6 = require("@keystone-6/core/fields");
var ToolFeature = (0, import_core7.list)({
  access: {
    operation: {
      query: () => true,
      // Allow public read access
      create: permissions.canManageTools,
      update: permissions.canManageTools,
      delete: permissions.canManageTools
    }
  },
  ui: {
    hideCreate: (args) => !permissions.canManageTools(args),
    hideDelete: (args) => !permissions.canManageTools(args),
    listView: {
      initialColumns: ["tool", "feature", "qualityScore", "verified", "createdAt"]
    },
    itemView: {
      defaultFieldMode: (args) => permissions.canManageTools(args) ? "edit" : "read"
    }
  },
  fields: {
    tool: (0, import_fields6.relationship)({
      ref: "Tool.features",
      ui: {
        displayMode: "select"
      }
    }),
    feature: (0, import_fields6.relationship)({
      ref: "Feature.tools",
      ui: {
        displayMode: "select"
      }
    }),
    implementationNotes: (0, import_fields6.text)({
      label: "Implementation Notes",
      ui: {
        displayMode: "textarea"
      }
    }),
    qualityScore: (0, import_fields6.integer)({
      label: "Quality Score",
      validation: {
        min: 1,
        max: 10
      }
    }),
    verified: (0, import_fields6.checkbox)({
      defaultValue: false
    }),
    createdAt: (0, import_fields6.timestamp)({
      defaultValue: { kind: "now" }
    })
  }
});

// features/keystone/models/Alternative.ts
var import_core8 = require("@keystone-6/core");
var import_fields7 = require("@keystone-6/core/fields");
var Alternative = (0, import_core8.list)({
  access: {
    operation: {
      query: () => true,
      // Allow public read access
      create: permissions.canManageAlternatives,
      update: permissions.canManageAlternatives,
      delete: permissions.canManageAlternatives
    }
  },
  ui: {
    hideCreate: (args) => !permissions.canManageAlternatives(args),
    hideDelete: (args) => !permissions.canManageAlternatives(args),
    listView: {
      initialColumns: ["proprietaryTool", "openSourceTool", "similarityScore", "matchType", "createdAt"]
    },
    itemView: {
      defaultFieldMode: (args) => permissions.canManageAlternatives(args) ? "edit" : "read"
    }
  },
  fields: {
    proprietaryTool: (0, import_fields7.relationship)({
      ref: "Tool.proprietaryAlternatives",
      label: "Proprietary Tool",
      ui: {
        displayMode: "select"
      }
    }),
    openSourceTool: (0, import_fields7.relationship)({
      ref: "Tool.openSourceAlternatives",
      label: "Open Source Tool",
      ui: {
        displayMode: "select"
      }
    }),
    similarityScore: (0, import_fields7.decimal)({
      label: "Similarity Score",
      precision: 3,
      scale: 2,
      validation: {
        min: "0.00",
        max: "1.00"
      }
    }),
    matchType: (0, import_fields7.select)({
      label: "Match Type",
      options: [
        { label: "Direct", value: "direct" },
        { label: "Partial", value: "partial" },
        { label: "Alternative", value: "alternative" },
        { label: "Complementary", value: "complementary" }
      ]
    }),
    comparisonNotes: (0, import_fields7.text)({
      label: "Comparison Notes",
      ui: {
        displayMode: "textarea"
      }
    }),
    createdAt: (0, import_fields7.timestamp)({
      defaultValue: { kind: "now" }
    })
  }
});

// features/keystone/models/DeploymentOption.ts
var import_core9 = require("@keystone-6/core");
var import_fields8 = require("@keystone-6/core/fields");
var DeploymentOption = (0, import_core9.list)({
  access: {
    operation: {
      query: () => true,
      // Allow public read access
      create: permissions.canManageDeploymentOptions,
      update: permissions.canManageDeploymentOptions,
      delete: permissions.canManageDeploymentOptions
    }
  },
  ui: {
    hideCreate: (args) => !permissions.canManageDeploymentOptions(args),
    hideDelete: (args) => !permissions.canManageDeploymentOptions(args),
    listView: {
      initialColumns: ["tool", "platform", "createdAt"]
    },
    itemView: {
      defaultFieldMode: (args) => permissions.canManageDeploymentOptions(args) ? "edit" : "read"
    }
  },
  fields: {
    tool: (0, import_fields8.relationship)({
      ref: "Tool.deploymentOptions",
      ui: {
        displayMode: "select"
      }
    }),
    platform: (0, import_fields8.text)({
      validation: {
        isRequired: true,
        length: { max: 100 }
      },
      ui: {
        description: "Platform name (e.g., Vercel, Railway, Render)"
      }
    }),
    deployUrl: (0, import_fields8.text)({
      label: "Deploy URL",
      validation: {
        length: { max: 500 }
      },
      ui: {
        description: "One-click deploy URL"
      }
    }),
    createdAt: (0, import_fields8.timestamp)({
      defaultValue: { kind: "now" }
    })
  }
});

// features/keystone/models/index.ts
var models = {
  User,
  Role,
  Category,
  Tool,
  Feature,
  ToolFeature,
  Alternative,
  DeploymentOption
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
var graphql2 = String.raw;
var extendGraphqlSchema = (schema) => (0, import_schema.mergeSchemas)({
  schemas: [schema],
  typeDefs: graphql2`
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
          canManageTools: true,
          canManageCategories: true,
          canManageFeatures: true,
          canManageAlternatives: true,
          canManageDeploymentOptions: true,
          canManageTechStacks: true
        }
      }
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
      canManageTools
      canManageCategories
      canManageFeatures
      canManageAlternatives
      canManageDeploymentOptions
      canManageTechStacks
    }
  `
});
var keystone_default = withAuth(
  (0, import_core10.config)({
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
