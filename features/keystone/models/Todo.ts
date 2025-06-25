import { list } from "@keystone-6/core";
import { allOperations } from "@keystone-6/core/access";
import { 
  checkbox, 
  relationship, 
  text, 
  integer, 
  bigInt,
  float, 
  decimal, 
  select, 
  timestamp, 
  json, 
  password, 
  image
} from "@keystone-6/core/fields";
import { document } from "@keystone-6/fields-document";

import { isSignedIn, permissions, rules } from "../access";

export const Todo = list({
  access: {
    operation: {
      ...allOperations(isSignedIn),
      create: permissions.canCreateTodos,
    },
    filter: {
      query: rules.canReadTodos,
      update: rules.canManageTodos,
      delete: rules.canManageTodos,
    },
  },
  ui: {
    hideCreate: (args) => !permissions.canCreateTodos(args),
    listView: {
      initialColumns: ["label", "isComplete", "assignedTo"],
    },
  },
  fields: {
    // Text fields
    label: text({ validation: { isRequired: true } }),
    description: document({
      formatting: true,
      links: true,
      dividers: true,
      layouts: [
        [1, 1],
        [1, 1, 1],
        [2, 1],
      ],
    }),

    // Boolean fields
    isComplete: checkbox({ defaultValue: false }),
    isPrivate: checkbox({ defaultValue: false }),

    // Number fields
    priority: integer({ 
      defaultValue: 1,
      validation: { min: 1, max: 5 },
      label: "Priority (1-5)"
    }),
    largeNumber: bigInt({
      label: "Large Number Example",
      ui: {
        description: "Example field for testing BigInt values"
      }
    }),
    weight: float({ 
      defaultValue: 1.0,
      label: "Weight"
    }),
    budget: decimal({ 
      precision: 10,
      scale: 2,
      defaultValue: "0.00",
      label: "Budget"
    }),

    // Select fields
    status: select({
      type: "string",
      options: [
        { label: "Todo", value: "todo" },
        { label: "In Progress", value: "in_progress" },
        { label: "Done", value: "done" },
        { label: "Blocked", value: "blocked" }
      ],
      defaultValue: "todo"
    }),

    // Date fields
    dueDate: timestamp({
      label: "Due Date"
    }),

    // Complex fields
    metadata: json({
      label: "Metadata"
    }),

    // Security fields
    secretNote: password({
      label: "Secret Note"
    }),

    // Virtual field - requires graphql import for proper setup
    // Let's comment this out for now to avoid complexity
    // displayName: virtual({
    //   field: graphql.field({
    //     type: graphql.String,
    //     resolve: (item: any) => `${item.label} (${item.status || 'unknown'})`
    //   })
    // }),

    // Relationship field
    assignedTo: relationship({
      ref: "User.tasks",
      ui: {
        createView: {
          fieldMode: (args) =>
            permissions.canManageAllTodos(args) ? "edit" : "hidden",
        },
        itemView: {
          fieldMode: (args) =>
            permissions.canManageAllTodos(args) ? "edit" : "read",
        },
      },
      hooks: {
        resolveInput({ operation, resolvedData, context }) {
          // Default to the currently logged in user on create.
          if (
            operation === "create" &&
            !resolvedData.assignedTo &&
            context.session?.itemId
          ) {
            return { connect: { id: context.session?.itemId } };
          }
          return resolvedData.assignedTo;
        },
      },
    }),
  },
});