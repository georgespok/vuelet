export const formattingMixin = {
  methods: {
    formatCurrency(value: any): string {
      if (value === null || value === undefined || value === "") return "";

      const asNumber =
        typeof value === "number"
          ? value
          : Number(String(value).replace(/[^\d.-]/g, ""));

      if (!Number.isFinite(asNumber)) return String(value);

      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(asNumber);
    },

    // Back-compat for earlier naming in discussion
    formattingCurrency(value: any): string {
      // @ts-expect-error - method exists on this mixin
      return this.formatCurrency(value);
    },
  },
};

