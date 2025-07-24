import type { ProductsListRequest } from "@polar-sh/sdk/models/operations/productslist";

type ProductIds = ProductsListRequest["id"];

const sandboxProductIds = [
  // Runa Free (Monthly)
  "203e19ff-534a-49dc-a455-6af007588e01",
];

const RUNA_PRODUCT_IDS: ProductIds = [...sandboxProductIds];

export default RUNA_PRODUCT_IDS;
