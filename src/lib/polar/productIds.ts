import { isDevEnv } from "@/lib/config/env.config";

export enum SandboxFree {
  Free = "ab64808c-6616-4265-9de1-1acb606dce2a",
}

enum SandboxMonthly {
  Basic = "c849cbd8-092e-4aee-9c4c-f7ff324dcb10",
  Team = "acc33f3d-05a1-49e8-a61c-8f24f3f5f2ed",
}

enum SandboxYearly {
  Basic = "6a1cced5-e998-414e-84b8-bbe1e84d023c",
  Team = "58d1f183-6f3f-42a0-bbf2-6609c266d0b7",
}

export enum ProductionFree {
  Free = "11a3e723-190b-4218-9499-7518f0ced5bc",
}

enum ProductionMonthly {
  Basic = "446c2fee-ecde-4aab-94d0-099eafcb011c",
  Team = "ef5ac069-7b2c-4c58-ab9d-b319f6ba203a",
}

enum ProductionYearly {
  Basic = "ef3adfa3-3367-4634-86e2-6f78b119e975",
  Team = "6906eaa6-b2f5-467f-a622-d018e1d2e9ec",
}

const sandboxProductIds = [
  SandboxFree.Free,
  ...Object.values(SandboxMonthly),
  ...Object.values(SandboxYearly),
];

const productionProductIds = [
  ProductionFree.Free,
  ...Object.values(ProductionMonthly),
  ...Object.values(ProductionYearly),
];

const RUNA_PRODUCT_IDS = isDevEnv
  ? [...sandboxProductIds]
  : [...productionProductIds];

export default RUNA_PRODUCT_IDS;
