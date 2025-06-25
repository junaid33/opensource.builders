import { mergeSchemas } from "@graphql-tools/schema";
import redirectToInit from "./redirectToInit";

const graphql = String.raw;

export const extendGraphqlSchema = (schema) =>
  mergeSchemas({
    schemas: [schema],
    typeDefs: graphql`
      type Query {
        redirectToInit: Boolean
      }
    `,
    resolvers: {
      Query: { 
        redirectToInit,
      },
    },
  });