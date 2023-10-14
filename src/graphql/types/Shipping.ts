import { builder } from "../builder";

builder.prismaObject("ShippingInfo", {
  fields: (t) => ({
    id: t.exposeID("id"),
    trackingCompany: t.exposeString("trackingCompany", { nullable: true }),
    trackingNumber: t.exposeString("trackingNumber", { nullable: true }),
    deliveryAddress: t.exposeString("deliveryAddress", { nullable: true }),
    contactName: t.exposeString("contactName", { nullable: true }),
    contactNumber: t.exposeString("contactNumber", { nullable: true }),
    contactEmail: t.exposeString("contactEmail", { nullable: true }),
  }),
});
