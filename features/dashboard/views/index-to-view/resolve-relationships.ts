// @ts-nocheck
function sortRelationships(left, right) {
    if (left.field.mode === "one" && right.field.mode === "one") {
      if (
        left.field.foreignKey !== undefined &&
        right.field.foreignKey !== undefined
      ) {
        throw new Error(
          `You can only set db.foreignKey on one side of a one to one relationship, but foreignKey is set on both ${left.listKey}.${left.fieldPath} and ${right.listKey}.${right.fieldPath}`
        )
      }
      if (left.field.foreignKey || right.field.foreignKey) {
        // return the field that specifies the foreignKey first
        return left.field.foreignKey ? [left, right] : [right, left]
      }
    } else if (left.field.mode === "one" || right.field.mode === "one") {
      // many relationships will never have a foreign key, so return the one relationship first
      const rels = left.field.mode === "one" ? [left, right] : [right, left]
      // we're only doing this for rels[1] because:
      // - rels[1] is the many side
      // - for the one side, TypeScript will already disallow relationName
      if (rels[1].field.relationName !== undefined) {
        throw new Error(
          `You can only set db.relationName on one side of a many to many relationship, but db.relationName is set on ${rels[1].listKey}.${rels[1].fieldPath} which is the many side of a many to one relationship with ${rels[0].listKey}.${rels[0].fieldPath}`
        )
      }
      return rels
    }
    if (
      left.field.mode === "many" &&
      right.field.mode === "many" &&
      (left.field.relationName !== undefined ||
        right.field.relationName !== undefined)
    ) {
      if (
        left.field.relationName !== undefined &&
        right.field.relationName !== undefined
      ) {
        throw new Error(
          `You can only set db.relationName on one side of a many to many relationship, but db.relationName is set on both ${left.listKey}.${left.fieldPath} and ${right.listKey}.${right.fieldPath}`
        )
      }
      return left.field.relationName !== undefined ? [left, right] : [right, left]
    }
    const order = left.listKey.localeCompare(right.listKey)
    if (order > 0) {
      // left comes after right, so swap them.
      return [right, left]
    } else if (order === 0) {
      // self referential list, so check the paths.
      if (left.fieldPath.localeCompare(right.fieldPath) > 0) {
        return [right, left]
      }
    }
    return [left, right]
  }
  
  // what's going on here:
  // - validating all the relationships
  // - for relationships involving to-one: deciding which side owns the foreign key
  // - turning one-sided relationships into two-sided relationships so that elsewhere in Keystone,
  //   you only have to reason about two-sided relationships
  //   (note that this means that there are "fields" in the returned ListsWithResolvedRelations
  //   which are not actually proper Keystone fields, they are just a db field and nothing else)
  export function resolveRelationships(lists) {
    const alreadyResolvedTwoSidedRelationships = new Set()
    const resolvedLists = Object.fromEntries(
      Object.keys(lists).map(listKey => [listKey, {}])
    )
    for (const [listKey, fields] of Object.entries(lists)) {
      const resolvedList = resolvedLists[listKey]
      for (const [fieldPath, { dbField: field }] of Object.entries(
        fields.fields
      )) {
        if (field.kind !== "relation") {
          resolvedList[fieldPath] = field
          continue
        }
        const foreignUnresolvedList = lists[field.list]
        if (!foreignUnresolvedList) {
          throw new Error(
            `The relationship field at ${listKey}.${fieldPath} points to the list ${listKey} which does not exist`
          )
        }
        if (foreignUnresolvedList.isSingleton) {
          throw new Error(
            `The relationship field at ${listKey}.${fieldPath} points to a singleton list, ${listKey}, which is not allowed`
          )
        }
        if (field.field) {
          const localRef = `${listKey}.${fieldPath}`
          const foreignRef = `${field.list}.${field.field}`
          if (alreadyResolvedTwoSidedRelationships.has(localRef)) {
            continue
          }
          alreadyResolvedTwoSidedRelationships.add(foreignRef)
          const foreignField = foreignUnresolvedList.fields[field.field]?.dbField
          if (!foreignField) {
            throw new Error(
              `${localRef} points to ${foreignRef}, but ${foreignRef} doesn't exist`
            )
          }
  
          if (foreignField.kind !== "relation") {
            throw new Error(
              `${localRef} points to ${foreignRef}, but ${foreignRef} is not a relationship field`
            )
          }
  
          const actualRef = foreignField.field
            ? `${foreignField.list}.${foreignField.field}`
            : foreignField.list
          if (actualRef !== localRef) {
            throw new Error(
              `${localRef} points to ${foreignRef}, ${foreignRef} points to ${actualRef}, expected ${foreignRef} to point to ${localRef}`
            )
          }
  
          let [leftRel, rightRel] = sortRelationships(
            { listKey, fieldPath, field },
            { listKey: field.list, fieldPath: field.field, field: foreignField }
          )
  
          if (leftRel.field.mode === "one" && rightRel.field.mode === "one") {
            const relationName = `${leftRel.listKey}_${leftRel.fieldPath}`
            resolvedLists[leftRel.listKey][leftRel.fieldPath] = {
              kind: "relation",
              mode: "one",
              field: rightRel.fieldPath,
              list: rightRel.listKey,
              extendPrismaSchema: leftRel.field.extendPrismaSchema,
              foreignIdField: {
                kind: "owned-unique",
                map:
                  typeof leftRel.field.foreignKey === "object"
                    ? leftRel.field.foreignKey?.map
                    : leftRel.fieldPath
              },
              relationName
            }
            resolvedLists[rightRel.listKey][rightRel.fieldPath] = {
              kind: "relation",
              mode: "one",
              field: leftRel.fieldPath,
              list: leftRel.listKey,
              extendPrismaSchema: rightRel.field.extendPrismaSchema,
              foreignIdField: { kind: "none" },
              relationName
            }
            continue
          }
          if (leftRel.field.mode === "many" && rightRel.field.mode === "many") {
            const relationName =
              leftRel.field.relationName ??
              `${leftRel.listKey}_${leftRel.fieldPath}`
            resolvedLists[leftRel.listKey][leftRel.fieldPath] = {
              kind: "relation",
              mode: "many",
              extendPrismaSchema: leftRel.field.extendPrismaSchema,
              field: rightRel.fieldPath,
              list: rightRel.listKey,
              relationName
            }
            resolvedLists[rightRel.listKey][rightRel.fieldPath] = {
              kind: "relation",
              mode: "many",
              extendPrismaSchema: rightRel.field.extendPrismaSchema,
              field: leftRel.fieldPath,
              list: leftRel.listKey,
              relationName
            }
            continue
          }
          const relationName = `${leftRel.listKey}_${leftRel.fieldPath}`
          resolvedLists[leftRel.listKey][leftRel.fieldPath] = {
            kind: "relation",
            mode: "one",
            field: rightRel.fieldPath,
            extendPrismaSchema: leftRel.field.extendPrismaSchema,
            list: rightRel.listKey,
            foreignIdField: {
              kind: "owned",
              map:
                typeof leftRel.field.foreignKey === "object"
                  ? leftRel.field.foreignKey?.map
                  : leftRel.fieldPath
            },
            relationName
          }
          resolvedLists[rightRel.listKey][rightRel.fieldPath] = {
            kind: "relation",
            mode: "many",
            extendPrismaSchema: rightRel.field.extendPrismaSchema,
            field: leftRel.fieldPath,
            list: leftRel.listKey,
            relationName
          }
          continue
        }
        const foreignFieldPath = `from_${listKey}_${fieldPath}`
        if (foreignUnresolvedList.fields[foreignFieldPath]) {
          throw new Error(
            `The relationship field at ${listKey}.${fieldPath} points to the list ${field.list}, Keystone needs to a create a relationship field at ${field.list}.${foreignFieldPath} to support the relationship at ${listKey}.${fieldPath} but ${field.list} already has a field named ${foreignFieldPath}`
          )
        }
  
        if (field.mode === "many") {
          const relationName = field.relationName ?? `${listKey}_${fieldPath}`
          resolvedLists[field.list][foreignFieldPath] = {
            kind: "relation",
            mode: "many",
            extendPrismaSchema: field.extendPrismaSchema,
            list: listKey,
            field: fieldPath,
            relationName
          }
          resolvedList[fieldPath] = {
            kind: "relation",
            mode: "many",
            extendPrismaSchema: field.extendPrismaSchema,
            list: field.list,
            field: foreignFieldPath,
            relationName
          }
        } else {
          const relationName = `${listKey}_${fieldPath}`
          resolvedLists[field.list][foreignFieldPath] = {
            kind: "relation",
            mode: "many",
            extendPrismaSchema: field.extendPrismaSchema,
            list: listKey,
            field: fieldPath,
            relationName
          }
          resolvedList[fieldPath] = {
            kind: "relation",
            list: field.list,
            extendPrismaSchema: field.extendPrismaSchema,
            field: foreignFieldPath,
            foreignIdField: {
              kind: "owned",
              map:
                typeof field.foreignKey === "object"
                  ? field.foreignKey?.map
                  : fieldPath
            },
            relationName,
            mode: "one"
          }
        }
      }
    }
    // the way we resolve the relationships means that the relationships will be in a
    // different order than the order the user specified in their config
    // doesn't really change the behaviour of anything but it means that the order of the fields in the prisma schema will be
    // the same as the user provided
    return Object.fromEntries(
      Object.entries(resolvedLists).map(([listKey, outOfOrderDbFields]) => {
        // this adds the fields based on the order that the user passed in
        // (except it will not add the opposites to one-sided relations)
        const resolvedDbFields = Object.fromEntries(
          Object.keys(lists[listKey].fields).map(fieldKey => [
            fieldKey,
            outOfOrderDbFields[fieldKey]
          ])
        )
        // then we add the opposites to one-sided relations
        Object.assign(resolvedDbFields, outOfOrderDbFields)
        return [listKey, resolvedDbFields]
      })
    )
  }