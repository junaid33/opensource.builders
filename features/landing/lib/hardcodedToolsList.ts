/**
 * Hardcoded Tools list definition extracted from admin meta
 * Used for buildWhereClause in landing pages without admin access
 */

export const TOOLS_LIST_DEFINITION = {
  key: "Tool",
  path: "tools",
  fields: {
    id: {
      path: "id",
      fieldMeta: { kind: "cuid", type: "String" },
      viewsIndex: 0,
      isFilterable: true,
      isOrderable: true
    },
    name: {
      path: "name",
      fieldMeta: {
        displayMode: "input",
        shouldUseModeInsensitive: true,
        validation: { isRequired: true, match: null, length: { max: 255, min: 1 } },
        defaultValue: "",
        isNullable: false
      },
      viewsIndex: 1,
      isFilterable: true,
      isOrderable: true,
      search: "insensitive"
    },
    slug: {
      path: "slug",
      fieldMeta: {
        displayMode: "input",
        shouldUseModeInsensitive: true,
        validation: { isRequired: true, match: null, length: { max: 255, min: 1 } },
        defaultValue: "",
        isNullable: false
      },
      viewsIndex: 1,
      isFilterable: true,
      isOrderable: true,
      search: "insensitive"
    },
    description: {
      path: "description",
      fieldMeta: {
        displayMode: "textarea",
        shouldUseModeInsensitive: true,
        validation: { isRequired: false, match: null, length: { max: null, min: null } },
        defaultValue: "",
        isNullable: false
      },
      viewsIndex: 1,
      isFilterable: true,
      isOrderable: true,
      search: "insensitive"
    },
    websiteUrl: {
      path: "websiteUrl",
      fieldMeta: {
        displayMode: "input",
        shouldUseModeInsensitive: true,
        validation: { isRequired: false, match: null, length: { max: 500, min: null } },
        defaultValue: "",
        isNullable: false
      },
      viewsIndex: 1,
      isFilterable: true,
      isOrderable: true,
      search: "insensitive"
    },
    repositoryUrl: {
      path: "repositoryUrl",
      fieldMeta: {
        displayMode: "input",
        shouldUseModeInsensitive: true,
        validation: { isRequired: false, match: null, length: { max: 500, min: null } },
        defaultValue: "",
        isNullable: false
      },
      viewsIndex: 1,
      isFilterable: true,
      isOrderable: true,
      search: "insensitive"
    },
    logoUrl: {
      path: "logoUrl",
      fieldMeta: {
        displayMode: "input",
        shouldUseModeInsensitive: true,
        validation: { isRequired: false, match: null, length: { max: 500, min: null } },
        defaultValue: "",
        isNullable: false
      },
      viewsIndex: 1,
      isFilterable: true,
      isOrderable: true,
      search: "insensitive"
    },
    logoSvg: {
      path: "logoSvg",
      fieldMeta: {
        displayMode: "textarea",
        shouldUseModeInsensitive: true,
        validation: { isRequired: false, match: null, length: { max: 10000, min: null } },
        defaultValue: "",
        isNullable: false
      },
      viewsIndex: 1,
      isFilterable: true,
      isOrderable: true,
      search: "insensitive"
    },
    isOpenSource: {
      path: "isOpenSource",
      fieldMeta: { defaultValue: false },
      viewsIndex: 4,
      isFilterable: true,
      isOrderable: true
    },
    category: {
      path: "category",
      fieldMeta: {
        displayMode: "select",
        refFieldKey: "tools",
        refListKey: "Category",
        many: false,
        hideCreate: false,
        refLabelField: "name",
        refSearchFields: ["name", "slug", "description", "icon", "color"]
      },
      viewsIndex: 3,
      isFilterable: true,
      isOrderable: false
    },
    license: {
      path: "license",
      fieldMeta: {
        displayMode: "input",
        shouldUseModeInsensitive: true,
        validation: { isRequired: false, match: null, length: { max: 100, min: null } },
        defaultValue: "",
        isNullable: false
      },
      viewsIndex: 1,
      isFilterable: true,
      isOrderable: true,
      search: "insensitive"
    },
    githubStars: {
      path: "githubStars",
      fieldMeta: {
        validation: { min: -2147483648, max: 2147483647, isRequired: false },
        defaultValue: null
      },
      viewsIndex: 6,
      isFilterable: true,
      isOrderable: true
    },
    status: {
      path: "status",
      fieldMeta: {
        options: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
          { label: "Deprecated", value: "deprecated" },
          { label: "Beta", value: "beta" }
        ],
        type: "string",
        displayMode: "select",
        defaultValue: "active",
        isRequired: false
      },
      viewsIndex: 7,
      isFilterable: true,
      isOrderable: true,
      search: "insensitive"
    },
    pricingModel: {
      path: "pricingModel",
      fieldMeta: {
        options: [
          { label: "Free", value: "free" },
          { label: "Freemium", value: "freemium" },
          { label: "Paid", value: "paid" },
          { label: "One-time", value: "one_time" },
          { label: "Subscription", value: "subscription" },
          { label: "Usage-based", value: "usage_based" }
        ],
        type: "string",
        displayMode: "select",
        defaultValue: null,
        isRequired: false
      },
      viewsIndex: 7,
      isFilterable: true,
      isOrderable: true,
      search: "insensitive"
    },
    createdAt: {
      path: "createdAt",
      fieldMeta: {
        defaultValue: { kind: "now" },
        isRequired: false,
        updatedAt: false
      },
      viewsIndex: 5,
      isFilterable: true,
      isOrderable: true
    },
    updatedAt: {
      path: "updatedAt",
      fieldMeta: {
        defaultValue: { kind: "now" },
        isRequired: false,
        updatedAt: true
      },
      viewsIndex: 5,
      isFilterable: true,
      isOrderable: true
    },
    features: {
      path: "features",
      fieldMeta: {
        displayMode: "select",
        refFieldKey: "tool",
        refListKey: "ToolFeature",
        many: true,
        hideCreate: false,
        refLabelField: "id",
        refSearchFields: ["implementationNotes"]
      },
      viewsIndex: 3,
      isFilterable: true,
      isOrderable: false
    }
  },
  initialSearchFields: ["name", "slug", "description", "websiteUrl", "repositoryUrl", "logoUrl", "logoSvg", "license", "status", "pricingModel"],
  gqlNames: {
    outputTypeName: "Tool",
    itemQueryName: "tool",
    listQueryName: "tools",
    whereInputName: "ToolWhereInput",
    whereUniqueInputName: "ToolWhereUniqueInput",
    createInputName: "ToolCreateInput",
    updateInputName: "ToolUpdateInput",
    orderByInputName: "ToolOrderByInput"
  },
  graphql: {
    names: {
      outputTypeName: "Tool",
      itemQueryName: "tool",
      listQueryName: "tools",
      whereInputName: "ToolWhereInput",
      whereUniqueInputName: "ToolWhereUniqueInput",
      createInputName: "ToolCreateInput",
      updateInputName: "ToolUpdateInput",
      orderByInputName: "ToolOrderByInput"
    }
  }
};