import pluralize from "pluralize";
import config from "../../../keystone";
import { graphql } from "@keystone-6/core";
import { resolveRelationships } from "./resolve-relationships";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// EXACT COPY from OpenShip utils converted to TypeScript
function humanize(str: string): string {
  return str.replace(/[A-Z]/g, (match, index) => (index === 0 ? '' : ' ') + match.toLowerCase()).replace(/^./, (s) => s.toUpperCase());
}

function labelToPath(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-');
}

function labelToClass(str: string): string {
  return str.replace(/\s+/g, '').replace(/^./, (s) => s.toUpperCase());
}

export function getGqlNames({ listKey, pluralGraphQLName }: { listKey: string, pluralGraphQLName: string }) {
  const lowerPluralName =
    pluralGraphQLName.slice(0, 1).toLowerCase() + pluralGraphQLName.slice(1);
  const lowerSingularName =
    listKey.slice(0, 1).toLowerCase() + listKey.slice(1);
  return {
    outputTypeName: listKey,
    itemQueryName: lowerSingularName,
    listQueryName: lowerPluralName,
    listQueryCountName: `${lowerPluralName}Count`,
    listOrderName: `${listKey}OrderByInput`,
    deleteMutationName: `delete${listKey}`,
    updateMutationName: `update${listKey}`,
    createMutationName: `create${listKey}`,
    deleteManyMutationName: `delete${pluralGraphQLName}`,
    updateManyMutationName: `update${pluralGraphQLName}`,
    createManyMutationName: `create${pluralGraphQLName}`,
    whereInputName: `${listKey}WhereInput`,
    whereUniqueInputName: `${listKey}WhereUniqueInput`,
    updateInputName: `${listKey}UpdateInput`,
    createInputName: `${listKey}CreateInput`,
    updateManyInputName: `${listKey}UpdateArgs`,
    relateToManyForCreateInputName: `${listKey}RelateToManyForCreateInput`,
    relateToManyForUpdateInputName: `${listKey}RelateToManyForUpdateInput`,
    relateToOneForCreateInputName: `${listKey}RelateToOneForCreateInput`,
    relateToOneForUpdateInputName: `${listKey}RelateToOneForUpdateInput`,
  };
}

export function getNamesFromList(listKey: string, { graphql: gqlConfig, ui, isSingleton }: any) {
  if (ui?.path !== undefined && !/^[a-z-_][a-z0-9-_]*$/.test(ui.path)) {
    throw new Error(
      `ui.path for ${listKey} is ${ui.path} but it must only contain lowercase letters, numbers, dashes, and underscores and not start with a number`
    );
  }

  const computedSingular = humanize(listKey);
  const computedPlural = pluralize.plural(computedSingular);
  const computedLabel = isSingleton ? computedSingular : computedPlural;
  const path = ui?.path || labelToPath(computedLabel);

  const pluralGraphQLName = gqlConfig?.plural || labelToClass(computedPlural);
  if (pluralGraphQLName === listKey) {
    throw new Error(
      `The list key and the plural name used in GraphQL must be different but the list key ${listKey} is the same as the plural GraphQL name, please specify graphql.plural`
    );
  }

  return {
    graphql: {
      names: getGqlNames({ listKey, pluralGraphQLName }),
      namePlural: pluralGraphQLName,
    },
    ui: {
      labels: {
        label: ui?.label || computedLabel,
        singular: ui?.singular || computedSingular,
        plural: ui?.plural || computedPlural,
        path,
      },
    },
    adminUILabels: {
      label: ui?.label || computedLabel,
      singular: ui?.singular || computedSingular,
      plural: ui?.plural || computedPlural,
      path,
    },
  };
}

// Missing functions from original
function graphqlForOutputField(field: any) {
  return field.output;
}

function outputTypeField(
  outputField: any,
  dbField: any,
  cacheHint: any,
  access: any,
  listKey: string,
  fieldPath: string,
  lists: any
) {
  return outputField;
}

function graphqlArgForInputField(field: any, operation: string) {
  return field.input?.[operation]?.arg;
}

const viewMappings = {
  [`@keystone-6/core/fields/types/text/views`]: `text`,
  [`@keystone-6/core/fields/types/password/views`]: `password`,
  [`@keystone-6/core/fields/types/relationship/views`]: `relationship`,
  [`@keystone-6/core/fields/types/json/views`]: `json`,
  [`@keystone-6/core/fields/types/timestamp/views`]: `timestamp`,
  [`@keystone-6/core/fields/types/checkbox/views`]: `checkbox`,
  [`@keystone-6/core/fields/types/select/views`]: `select`,
  [`@keystone-6/core/fields/types/integer/views`]: `integer`,
  [`@keystone-6/core/fields/types/float/views`]: `float`,
  [`@keystone-6/core/fields/types/decimal/views`]: `decimal`,
  [`@keystone-6/core/fields/types/image/views`]: `image`,
  [`@keystone-6/core/fields/types/virtual/views`]: `virtual`,
  [`@keystone-6/fields-document/views`]: `document`,
  [`@keystone-6/core/fields/types/bigInt/views`]: `bigInt`
};

export function areArraysEqual(a: any[], b: any[]): boolean {
  return a.length === b.length && a.every((x, i) => x === b[i])
}

/**
 * Main function to generate the field type mapping
 */
export function main() {
  // Access the default export properly
  const keystoneConfig = config.default || config;
  console.log("Config structure:", { config: typeof config, hasDefault: 'default' in config });
  console.log("Keystone config lists:", keystoneConfig.lists ? Object.keys(keystoneConfig.lists) : 'No lists found');

  const lists = initialiseLists(keystoneConfig);

  console.log("=== Initialized Lists ===");
  console.log("Lists:", Object.keys(lists));

  const uniqueViews = extractUniqueViews(lists);
  console.log("=== Extracted Unique Views ===");
  console.log("Unique views found:", uniqueViews);

  const allViews = uniqueViews.map((viewRelativeToProject) => {
    const isRelativeToFile =
      viewRelativeToProject.startsWith("./") ||
      viewRelativeToProject.startsWith("../");
    const viewRelativeToAppFile = isRelativeToFile
      ? "../../../" + viewRelativeToProject
      : viewRelativeToProject;

    // we're not using serializePathForImport here because we want the thing you write for a view
    // to be exactly what you would put in an import in the project directory.
    // we're still using JSON.stringify to escape anything that might need to be though
    return JSON.stringify(viewRelativeToAppFile);
  });

  console.log("=== All Views (processed) ===");
  console.log("All views with imports:", allViews);

  // Create the mapping object for field types in order
  const fieldTypes = ['id', ...uniqueViews];

  const viewsIndexToType: Record<number, string> = {};
  fieldTypes.forEach((fieldType, index) => {
    viewsIndexToType[index] = fieldType;
  });

  console.log("=== Generated views index mapping ===");
  console.log(JSON.stringify(viewsIndexToType, null, 2));

  // Generate the getFieldTypeFromViewsIndex.ts file
  const outputPath = join(dirname(fileURLToPath(import.meta.url)), '../getFieldTypeFromViewsIndex.ts');
  const fileContent = `/**
 * Auto-generated field type mapping from views index
 * This file is generated by index-to-view/generate-field-views.ts
 * DO NOT EDIT THIS FILE MANUALLY
 */

/**
 * Get the field type from a field's viewsIndex
 * @param viewsIndex The views index of the field
 * @returns The field type name
 */
export function getFieldTypeFromViewsIndex(viewsIndex: number): string {
  const viewsIndexToType: Record<number, string> = {
${Object.entries(viewsIndexToType).map(([key, value]) => `    ${key}: "${value}"`).join(',\n')}
  };

  const fieldType = viewsIndexToType[viewsIndex];
  if (!fieldType) {
    throw new Error(\`Invalid views index: \${viewsIndex}\`);
  }

  return fieldType;
}`;

  writeFileSync(outputPath, fileContent);
  console.log(`✅ Generated ${outputPath}`);
}

export function initialiseLists(config: any) {
  console.log({config})
  const listsConfig = config.lists;

  let intermediateLists;
  intermediateLists = Object.fromEntries(
    Object.entries(getIsEnabled(listsConfig)).map(([key, isEnabled]) => [
      key,
      { graphql: { isEnabled } },
    ])
  );

  /**
   * Lists is instantiated here so that it can be passed into the `getListGraphqlTypes` function
   * This function binds the listsRef object to the various graphql functions
   *
   * The object will be populated at the end of this function, and the reference will be maintained
   */
  const listsRef = {};

  {
    const listGraphqlTypes = getListGraphqlTypes(
      listsConfig,
      listsRef,
      intermediateLists
    );
    intermediateLists = getListsWithInitialisedFields(
      config,
      listGraphqlTypes,
      intermediateLists
    );
  }

  {
    const resolvedDBFieldsForLists = resolveRelationships(intermediateLists);
    intermediateLists = Object.fromEntries(
      Object.entries(intermediateLists).map(([listKey, list]) => [
        listKey,
        {
          ...list,
          resolvedDbFields: resolvedDBFieldsForLists[listKey],
        },
      ])
    );
  }

  intermediateLists = Object.fromEntries(
    Object.entries(intermediateLists).map(([listKey, list]) => {
      const fields = {};

      for (const [fieldKey, field] of Object.entries(list.fields)) {
        fields[fieldKey] = {
          ...field,
          dbField: list.resolvedDbFields[fieldKey],
        };
      }

      return [listKey, { ...list, fields }];
    })
  );

  for (const list of Object.values(intermediateLists)) {
    let hasAnEnabledCreateField = false;
    let hasAnEnabledUpdateField = false;

    for (const field of Object.values(list.fields)) {
      if (field.input?.create?.arg && field.graphql.isEnabled.create) {
        hasAnEnabledCreateField = true;
      }
      if (field.input?.update && field.graphql.isEnabled.update) {
        hasAnEnabledUpdateField = true;
      }
    }

    // you can't have empty GraphQL types
    //   if empty, omit the type completely
    if (!hasAnEnabledCreateField) {
      list.graphql.isEnabled.create = false;
    }
    if (!hasAnEnabledUpdateField) {
      list.graphql.isEnabled.update = false;
    }
  }

  // fixup the GraphQL refs
  for (const [listKey, intermediateList] of Object.entries(intermediateLists)) {
    listsRef[listKey] = {
      ...intermediateList,
      lists: listsRef,
    };
  }

  // Do some introspection
  // introspectGraphQLTypes(listsRef);
  return listsRef;
}

function extractUniqueViews(jsonData: any) {
  let viewsArray: string[] = [];

  console.log("=== Extracting Views Debug ===");
  
  for (const key in jsonData) {
    if (jsonData.hasOwnProperty(key)) {
      console.log(`Processing list: ${key}`);
      const fields = jsonData[key].fields;
      if (fields) {
        console.log(`  Fields in ${key}:`, Object.keys(fields));
        for (const fieldKey in fields) {
          if (fields.hasOwnProperty(fieldKey)) {
            const field = fields[fieldKey];
            console.log(`    Field ${fieldKey} views:`, field.views);
            const viewMap = viewMappings[field.views] || field.views;
            if (viewMap && !viewsArray.includes(viewMap)) {
              console.log(`      Adding unique view: ${viewMap}`);
              viewsArray.push(viewMap);
            }
          }
        }
      } else {
        console.log(`  No fields found in ${key}`);
      }
    }
  }

  console.log("Final viewsArray:", viewsArray);
  return viewsArray;
}

function getIsEnabled(listsConfig) {
  const isEnabled = {};
  console.log(listsConfig);

  for (const [listKey, listConfig] of Object.entries(listsConfig)) {
    const omit = listConfig.graphql?.omit;
    const { defaultIsFilterable, defaultIsOrderable } = listConfig;
    if (!omit) {
      // We explicity check for boolean/function values here to ensure the dev hasn't made a mistake
      // when defining these values. We avoid duck-typing here as this is security related
      // and we want to make it hard to write incorrect code.
      throwIfNotAFilter(defaultIsFilterable, listKey, "defaultIsFilterable");
      throwIfNotAFilter(defaultIsOrderable, listKey, "defaultIsOrderable");
    }
    if (omit === true) {
      isEnabled[listKey] = {
        type: false,
        query: false,
        create: false,
        update: false,
        delete: false,
        filter: false,
        orderBy: false,
      };
    } else {
      isEnabled[listKey] = {
        type: true,
        query: !omit?.query,
        create: !omit?.create,
        update: !omit?.update,
        delete: !omit?.delete,
        filter: defaultIsFilterable ?? true,
        orderBy: defaultIsOrderable ?? true,
      };
    }
  }

  return isEnabled;
}

function throwIfNotAFilter(x, listKey, fieldKey) {
  if (["boolean", "undefined", "function"].includes(typeof x)) return;

  throw new Error(
    `Configuration option '${listKey}.${fieldKey}' must be either a boolean value or a function. Received '${x}'.`
  );
}

function getListGraphqlTypes(listsConfig, lists, intermediateLists) {
  const graphQLTypes = {};

  for (const [listKey, listConfig] of Object.entries(listsConfig)) {
    const {
      graphql: { names },
    } = getNamesFromList(listKey, listConfig);

    const output = graphql.object()({
      name: names.outputTypeName,
      fields: () => {
        const { fields } = lists[listKey];
        return {
          ...Object.fromEntries(
            Object.entries(fields).flatMap(([fieldPath, field]) => {
              if (
                !field.output ||
                !field.graphql.isEnabled.read ||
                (field.dbField.kind === "relation" &&
                  !intermediateLists[field.dbField.list].graphql.isEnabled
                    .query)
              ) {
                return [];
              }

              const outputFieldRoot = graphqlForOutputField(field);
              return [
                [fieldPath, outputFieldRoot],
                ...Object.entries(field.extraOutputFields || {}),
              ].map(([outputTypeFieldName, outputField]) => {
                return [
                  outputTypeFieldName,
                  outputTypeField(
                    outputField,
                    field.dbField,
                    field.graphql?.cacheHint,
                    field.access.read,
                    listKey,
                    fieldPath,
                    lists
                  ),
                ];
              });
            })
          ),
        };
      },
    });

    const uniqueWhere = graphql.inputObject({
      name: names.whereUniqueInputName,
      fields: () => {
        const { fields } = lists[listKey];
        return {
          ...Object.fromEntries(
            Object.entries(fields).flatMap(([key, field]) => {
              if (
                !field.input?.uniqueWhere?.arg ||
                !field.graphql.isEnabled.read ||
                !field.graphql.isEnabled.filter
              ) {
                return [];
              }
              return [[key, field.input.uniqueWhere.arg]];
            })
          ),
          // this is exactly what the id field will add
          // but this does it more explicitly so that typescript understands
          id: graphql.arg({ type: graphql.ID }),
        };
      },
    });

    const where = graphql.inputObject({
      name: names.whereInputName,
      fields: () => {
        const { fields } = lists[listKey];
        return Object.assign(
          {
            AND: graphql.arg({ type: graphql.list(graphql.nonNull(where)) }),
            OR: graphql.arg({ type: graphql.list(graphql.nonNull(where)) }),
            NOT: graphql.arg({ type: graphql.list(graphql.nonNull(where)) }),
          },
          ...Object.entries(fields).map(
            ([fieldKey, field]) =>
              field.input?.where?.arg &&
              field.graphql.isEnabled.read &&
              field.graphql.isEnabled.filter && {
                [fieldKey]: field.input?.where?.arg,
              }
          )
        );
      },
    });

    const create = graphql.inputObject({
      name: names.createInputName,
      fields: () => {
        const { fields } = lists[listKey];
        const ret = {};

        for (const key in fields) {
          const arg = graphqlArgForInputField(fields[key], "create");
          if (!arg) continue;
          ret[key] = arg;
        }

        return ret;
      },
    });

    const update = graphql.inputObject({
      name: names.updateInputName,
      fields: () => {
        const { fields } = lists[listKey];
        const ret = {};

        for (const key in fields) {
          const arg = graphqlArgForInputField(fields[key], "update");
          if (!arg) continue;
          ret[key] = arg;
        }

        return ret;
      },
    });

    const orderBy = graphql.inputObject({
      name: names.listOrderName,
      fields: () => {
        const { fields } = lists[listKey];
        return Object.fromEntries(
          Object.entries(fields).flatMap(([key, field]) => {
            if (
              !field.input?.orderBy?.arg ||
              !field.graphql.isEnabled.read ||
              !field.graphql.isEnabled.orderBy
            ) {
              return [];
            }
            return [[key, field.input.orderBy.arg]];
          })
        );
      },
    });

    let take = graphql.arg({ type: graphql.Int });
    if (listConfig.graphql?.maxTake !== undefined) {
      take = graphql.arg({
        type: graphql.nonNull(graphql.Int),
        // warning: this is used by queries/resolvers.ts to enforce the limit
        defaultValue: listConfig.graphql.maxTake,
      });
    }

    const findManyArgs = {
      where: graphql.arg({
        type: graphql.nonNull(where),
        defaultValue: listConfig.isSingleton
          ? {
              id: { equals: "1" },
            }
          : {},
      }),
      orderBy: graphql.arg({
        type: graphql.nonNull(graphql.list(graphql.nonNull(orderBy))),
        defaultValue: [],
      }),
      take,
      skip: graphql.arg({
        type: graphql.nonNull(graphql.Int),
        defaultValue: 0,
      }),
      cursor: graphql.arg({ type: uniqueWhere }),
    };

    const isEnabled = intermediateLists[listKey].graphql.isEnabled;
    let relateToManyForCreate,
      relateToManyForUpdate,
      relateToOneForCreate,
      relateToOneForUpdate;
    if (isEnabled.type) {
      relateToManyForCreate = graphql.inputObject({
        name: names.relateToManyForCreateInputName,
        fields: () => {
          return {
            // Create via a relationship is only supported if this list allows create
            ...(isEnabled.create && {
              create: graphql.arg({
                type: graphql.list(graphql.nonNull(create)),
              }),
            }),
            connect: graphql.arg({
              type: graphql.list(graphql.nonNull(uniqueWhere)),
            }),
          };
        },
      });

      relateToManyForUpdate = graphql.inputObject({
        name: names.relateToManyForUpdateInputName,
        fields: () => {
          return {
            // The order of these fields reflects the order in which they are applied
            // in the mutation.
            disconnect: graphql.arg({
              type: graphql.list(graphql.nonNull(uniqueWhere)),
            }),
            set: graphql.arg({
              type: graphql.list(graphql.nonNull(uniqueWhere)),
            }),
            // Create via a relationship is only supported if this list allows create
            ...(isEnabled.create && {
              create: graphql.arg({
                type: graphql.list(graphql.nonNull(create)),
              }),
            }),
            connect: graphql.arg({
              type: graphql.list(graphql.nonNull(uniqueWhere)),
            }),
          };
        },
      });

      relateToOneForCreate = graphql.inputObject({
        name: names.relateToOneForCreateInputName,
        fields: () => {
          return {
            // Create via a relationship is only supported if this list allows create
            ...(isEnabled.create && { create: graphql.arg({ type: create }) }),
            connect: graphql.arg({ type: uniqueWhere }),
          };
        },
      });

      relateToOneForUpdate = graphql.inputObject({
        name: names.relateToOneForUpdateInputName,
        fields: () => {
          return {
            // Create via a relationship is only supported if this list allows create
            ...(isEnabled.create && { create: graphql.arg({ type: create }) }),
            connect: graphql.arg({ type: uniqueWhere }),
            disconnect: graphql.arg({ type: graphql.Boolean }),
          };
        },
      });
    }

    graphQLTypes[listKey] = {
      types: {
        output,
        uniqueWhere,
        where,
        create,
        orderBy,
        update,
        findManyArgs,
        relateTo: {
          many: {
            where: graphql.inputObject({
              name: `${listKey}ManyRelationFilter`,
              fields: {
                every: graphql.arg({ type: where }),
                some: graphql.arg({ type: where }),
                none: graphql.arg({ type: where }),
              },
            }),
            create: relateToManyForCreate,
            update: relateToManyForUpdate,
          },
          one: { create: relateToOneForCreate, update: relateToOneForUpdate },
        },
      },
    };
  }

  return graphQLTypes;
}

function getListsWithInitialisedFields(
  { storage: configStorage, lists: listsConfig, db: { provider } },
  listGraphqlTypes,
  intermediateLists
) {
  const result = {};

  for (const [listKey, list] of Object.entries(listsConfig)) {
    const intermediateList = intermediateLists[listKey];
    const resultFields = {};
    const groups = [];
    const fieldKeys = Object.keys(list.fields);

    for (const [idx, [fieldKey, fieldFunc]] of Object.entries(
      list.fields
    ).entries()) {
      if (fieldKey.startsWith("__group")) {
        const group = fieldFunc;
        if (
          typeof group === "object" &&
          group !== null &&
          typeof group.label === "string" &&
          (group.description === null ||
            typeof group.description === "string") &&
          Array.isArray(group.fields) &&
          areArraysEqual(
            group.fields,
            fieldKeys.slice(idx + 1, idx + 1 + group.fields.length)
          )
        ) {
          groups.push(group);
          continue;
        }
        throw new Error(
          `unexpected value for a group at ${listKey}.${fieldKey}`
        );
      }

      if (typeof fieldFunc !== "function") {
        throw new Error(
          `The field at ${listKey}.${fieldKey} does not provide a function`
        );
      }

      const f = fieldFunc({
        fieldKey,
        listKey,
        lists: listGraphqlTypes,
        provider,
        getStorage: (storage) => configStorage?.[storage],
      });

      // We explicity check for boolean values here to ensure the dev hasn't made a mistake
      // when defining these values. We avoid duck-typing here as this is security related
      // and we want to make it hard to write incorrect code.
      throwIfNotAFilter(f.isFilterable, listKey, "isFilterable");
      throwIfNotAFilter(f.isOrderable, listKey, "isOrderable");

      const omit = f.graphql?.omit;
      const read = omit !== true && !omit?.read;
      const _isEnabled = {
        read,
        create: omit !== true && !omit?.create,
        update: omit !== true && !omit?.update,
        // Filter and orderBy can be defaulted at the list level, otherwise they
        // default to `false` if no value was set at the list level.
        filter:
          read && (f.isFilterable ?? intermediateList.graphql.isEnabled.filter),
        orderBy:
          read && (f.isOrderable ?? intermediateList.graphql.isEnabled.orderBy),
      };

      const fieldModes = {
        create:
          f.ui?.createView?.fieldMode ??
          list.ui?.createView?.defaultFieldMode ??
          "edit",
        item:
          f.ui?.itemView?.fieldMode ??
          list.ui?.itemView?.defaultFieldMode ??
          "edit",
        list:
          f.ui?.listView?.fieldMode ??
          list.ui?.listView?.defaultFieldMode ??
          "read",
      };

      resultFields[fieldKey] = {
        dbField: f.dbField,
        access: parseFieldAccessControl(f.access),
        hooks: parseFieldHooks(f.hooks ?? {}),
        graphql: {
          cacheHint: f.graphql?.cacheHint,
          isEnabled: _isEnabled,
          isNonNull: {
            read: f.graphql?.isNonNull?.read ?? false,
            create: f.graphql?.isNonNull?.create ?? false,
            update: f.graphql?.isNonNull?.update ?? false,
          },
        },
        ui: {
          label: f.label ?? null,
          description: f.ui?.description ?? null,
          views: f.ui?.views ?? null,
          createView: {
            fieldMode: _isEnabled.create ? fieldModes.create : "hidden",
          },

          itemView: {
            fieldPosition: f.ui?.itemView?.fieldPosition ?? "form",
            fieldMode: _isEnabled.update
              ? fieldModes.item
              : _isEnabled.read && fieldModes.item !== "hidden"
              ? "read"
              : "hidden",
          },

          listView: {
            fieldMode: _isEnabled.read ? fieldModes.list : "hidden",
          },
        },

        // copy
        __ksTelemetryFieldTypeName: f.__ksTelemetryFieldTypeName,
        extraOutputFields: f.extraOutputFields,
        getAdminMeta: f.getAdminMeta,
        input: { ...f.input },
        output: { ...f.output },
        unreferencedConcreteInterfaceImplementations:
          f.unreferencedConcreteInterfaceImplementations,
        views: f.views,
      };
    }

    // Default the labelField to `name`, `label`, or `title` if they exist; otherwise fall back to `id`
    const labelField =
      list.ui?.labelField ??
      (list.fields.label
        ? "label"
        : list.fields.name
        ? "name"
        : list.fields.title
        ? "title"
        : "id");

    const searchFields = new Set(list.ui?.searchFields ?? []);
    if (searchFields.has("id")) {
      throw new Error(`${listKey}.ui.searchFields cannot include 'id'`);
    }

    const names = getNamesFromList(listKey, list);

    result[listKey] = {
      access: parseListAccessControl(list.access),

      fields: resultFields,
      groups,

      graphql: {
        types: listGraphqlTypes[listKey].types,
        names: names.graphql.names,
        namePlural: names.graphql.namePlural, // TODO: remove
        ...intermediateList.graphql,
      },

      prisma: {
        listKey: listKey[0].toLowerCase() + listKey.slice(1),
        mapping: list.db?.map,
        extendPrismaSchema: list.db?.extendPrismaSchema,
      },

      ui: {
        labels: names.ui.labels,
        labelField,
        searchFields,
        searchableFields: new Map(),
      },
      hooks: parseListHooks(list.hooks ?? {}),
      listKey,
      cacheHint: (() => {
        const cacheHint = list.graphql?.cacheHint;
        if (cacheHint === undefined) {
          return undefined;
        }
        return typeof cacheHint === "function" ? cacheHint : () => cacheHint;
      })(),
      isSingleton: list.isSingleton ?? false,
    };
  }

  return result;
}

export function parseFieldAccessControl(access) {
  if (typeof access === "function") {
    return { read: access, create: access, update: access };
  }

  return {
    read: access?.read ?? allowAll,
    create: access?.create ?? allowAll,
    update: access?.update ?? allowAll,
  };
}

export function allowAll() {
  return true;
}

function parseFieldHooks(hooks) {
  return {
    resolveInput: {
      create: hooks.resolveInput ?? defaultFieldHooksResolveInput,
      update: hooks.resolveInput ?? defaultFieldHooksResolveInput,
    },
    validateInput: hooks.validateInput ?? defaultOperationHook,
    validateDelete: hooks.validateDelete ?? defaultOperationHook,
    beforeOperation: {
      create: hooks.beforeOperation ?? defaultOperationHook,
      update: hooks.beforeOperation ?? defaultOperationHook,
      delete: hooks.beforeOperation ?? defaultOperationHook,
    },
    afterOperation: {
      create: hooks.afterOperation ?? defaultOperationHook,
      update: hooks.afterOperation ?? defaultOperationHook,
      delete: hooks.afterOperation ?? defaultOperationHook,
    },
  };
}

function defaultFieldHooksResolveInput({ resolvedData, fieldKey }) {
  return resolvedData[fieldKey];
}

function defaultOperationHook() {}

export function parseListAccessControl(access) {
  if (typeof access === "function") {
    return {
      operation: {
        query: access,
        create: access,
        update: access,
        delete: access,
      },
      filter: {
        query: allowAll,
        update: allowAll,
        delete: allowAll,
      },
      item: {
        create: allowAll,
        update: allowAll,
        delete: allowAll,
      },
    };
  }

  let { operation, filter, item } = access;
  if (typeof operation === "function") {
    operation = {
      query: operation,
      create: operation,
      update: operation,
      delete: operation,
    };
  }

  return {
    operation: {
      query: operation.query ?? allowAll,
      create: operation.create ?? allowAll,
      update: operation.update ?? allowAll,
      delete: operation.delete ?? allowAll,
    },
    filter: {
      query: filter?.query ?? allowAll,
      // create: not supported
      update: filter?.update ?? allowAll,
      delete: filter?.delete ?? allowAll,
    },
    item: {
      // query: not supported
      create: item?.create ?? allowAll,
      update: item?.update ?? allowAll,
      delete: item?.delete ?? allowAll,
    },
  };
}

function parseListHooksResolveInput(f) {
  if (typeof f === "function") {
    return {
      create: f,
      update: f,
    };
  }

  const {
    create = defaultListHooksResolveInput,
    update = defaultListHooksResolveInput,
  } = f ?? {};
  return { create, update };
}

function parseListHooks(hooks) {
  return {
    resolveInput: parseListHooksResolveInput(hooks.resolveInput),
    validateInput: hooks.validateInput ?? defaultOperationHook,
    validateDelete: hooks.validateDelete ?? defaultOperationHook,
    beforeOperation: parseListHooksBeforeOperation(hooks.beforeOperation),
    afterOperation: parseListHooksAfterOperation(hooks.afterOperation),
  };
}

function defaultListHooksResolveInput({ resolvedData }) {
  return resolvedData;
}

function parseListHooksBeforeOperation(f) {
  if (typeof f === "function") {
    return {
      create: f,
      update: f,
      delete: f,
    };
  }

  const {
    create = defaultOperationHook,
    update = defaultOperationHook,
    delete: _delete = defaultOperationHook,
  } = f ?? {};
  return { create, update, delete: _delete };
}

function parseListHooksAfterOperation(f) {
  if (typeof f === "function") {
    return {
      create: f,
      update: f,
      delete: f,
    };
  }

  const {
    create = defaultOperationHook,
    update = defaultOperationHook,
    delete: _delete = defaultOperationHook,
  } = f ?? {};
  return { create, update, delete: _delete };
}