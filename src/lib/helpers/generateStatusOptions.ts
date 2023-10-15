export const generateStatusOptions = (status: string) => [
  {
    group: "Available",
    items: [
      { value: "Processing", label: "Processing" },
      { value: "Picking", label: "Picking" },
      { value: "Picked", label: "Picked" },
      { value: "Delayed", label: "Delayed", disabled: status !== "InTransit" },
      {
        value: "Delivered",
        label: "Delivered",
        disabled: status !== "InTransit",
      },
    ],
  },
  {
    group: "Automatic",
    items: [
      { value: "Draft", label: "Draft", disabled: true },
      { value: "Received", label: "Received", disabled: true },
      { value: "InTransit", label: "In Transit", disabled: true },
      { value: "Cancelled", label: "Cancelled", disabled: true },
    ],
  },
];
