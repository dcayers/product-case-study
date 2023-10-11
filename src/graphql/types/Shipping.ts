import { builder } from "../builder";

builder.prismaObject("ShippingInfo", {
  fields: (t) => ({
    id: t.exposeID("id"),
    trackingCompany: t.exposeString("trackingCompany"),
    trackingNumber: t.exposeString("trackingNumber"),
    deliveryAddress: t.exposeString("deliveryAddress"),
    contactName: t.exposeString("contactName"),
    contactNumber: t.exposeString("contactNumber"),
    contactEmail: t.exposeString("contactEmail"),
  }),
});
