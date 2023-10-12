import { DateTimeResolver } from "graphql-scalars";
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated"
import prisma from "../lib/client"

export const builder = new SchemaBuilder<{ 
  PrismaTypes: PrismaTypes,
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    }
  },
  Connection: {
    totalCount: number | (() => number | Promise<number>);
  };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma
  }
})

builder.queryType({
  fields: (t) => ({
    ok: t.boolean({
      resolve: () => true
    }),
    checkP: t.boolean({
      resolve: () => prisma ? true : false
    }),
    checkG: t.boolean({
      resolve: () => global.prisma ? true : false
    })
  })
})

builder.mutationType({})

builder.addScalarType("Date", DateTimeResolver, {});