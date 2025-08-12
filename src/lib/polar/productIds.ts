import { isDevEnv } from "@/lib/config/env.config";

export enum SandboxFree {
  Free = "6c5584d3-3e28-4895-99c0-4fb4a1056fa5",
}

export enum SandboxMonthly {
  Basic = "c849cbd8-092e-4aee-9c4c-f7ff324dcb10",
  Team = "acc33f3d-05a1-49e8-a61c-8f24f3f5f2ed",
}

export enum SandboxYearly {
  Basic = "6a1cced5-e998-414e-84b8-bbe1e84d023c",
  Team = "58d1f183-6f3f-42a0-bbf2-6609c266d0b7",
}

const sandboxProductIds = [
  SandboxFree.Free,
  ...Object.values(SandboxMonthly),
  ...Object.values(SandboxYearly),
];

const productionProductIds: string[] = [];

const RUNA_PRODUCT_IDS = isDevEnv
  ? [...sandboxProductIds]
  : [...productionProductIds];

export default RUNA_PRODUCT_IDS;
