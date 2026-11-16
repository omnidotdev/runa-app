# @omnidotdev/runa-app

## 0.1.0

### Minor Changes

- [#122](https://github.com/omnidotdev/runa-app/pull/122) [`62026e5`](https://github.com/omnidotdev/runa-app/commit/62026e537c525d94701a56dc1b1b7845134dd94a) Thanks [@coopbri](https://github.com/coopbri)! - Add email settings for task comments, @mentions, and moves to another project. Mentioning someone now emails them.

### Patch Changes

- [#139](https://github.com/omnidotdev/runa-app/pull/139) [`8187251`](https://github.com/omnidotdev/runa-app/commit/8187251dfafc4a83fdbda5a8a371a3ddf89a42ae) Thanks [@coopbri](https://github.com/coopbri)! - Fix several calendar and due date issues:

  - All-day due dates now show on the same day for everyone, whatever their time zone, and no longer show up as a timed "7:00 AM" for teammates in other zones
  - Dragging a timed task to another day on the calendar keeps its time
  - The assignee filter now shows the tasks assigned to the selected people (it previously showed none) on the board, list, and calendar
  - The calendar hides tasks in columns you have hidden, matching the board
  - Overdue highlighting rolls over at midnight on a page left open, and the calendar marks the right day as today
  - Regenerating a calendar feed link now asks for confirmation first, since it stops the current link from working

- [#127](https://github.com/omnidotdev/runa-app/pull/127) [`4de1c08`](https://github.com/omnidotdev/runa-app/commit/4de1c0846bc686c38d8e1117a5f4d2be5eb626df) Thanks [@coopbri](https://github.com/coopbri)! - Update dependencies, including security fixes for sharp (image processing) and zod.

- [#126](https://github.com/omnidotdev/runa-app/pull/126) [`233a469`](https://github.com/omnidotdev/runa-app/commit/233a4690345210b6a6ff176ce91c8d6b4a2e1ee9) Thanks [@coopbri](https://github.com/coopbri)! - Fix changing an existing due date, which cleared the date and showed "Something went wrong".

- [#132](https://github.com/omnidotdev/runa-app/pull/132) [`f333896`](https://github.com/omnidotdev/runa-app/commit/f333896d0bed62866e47ee5edbee8726f7a4b695) Thanks [@coopbri](https://github.com/coopbri)! - Upgrade the rich-text editor to Lexical 0.53 and update auth and validation libraries.

- [#131](https://github.com/omnidotdev/runa-app/pull/131) [`b43b8a3`](https://github.com/omnidotdev/runa-app/commit/b43b8a33642578095e0bff3d36ea08b8e9f1de6c) Thanks [@coopbri](https://github.com/coopbri)! - Update TanStack Start and Router, TypeScript 7, lucide icons, and other dependencies to their latest major versions.

- [#136](https://github.com/omnidotdev/runa-app/pull/136) [`d17ff86`](https://github.com/omnidotdev/runa-app/commit/d17ff8619dd8d9a302684f2798cd2fe389b88d02) Thanks [@coopbri](https://github.com/coopbri)! - Point AI assistants to the hosted MCP server at mcp.runa.omni.dev.

- [#134](https://github.com/omnidotdev/runa-app/pull/134) [`0ab31c5`](https://github.com/omnidotdev/runa-app/commit/0ab31c5e4b537106d22667bcf8c504c0ec6390c3) Thanks [@coopbri](https://github.com/coopbri)! - Show how to connect AI assistants (MCP) with an API token in workspace settings.

- [#135](https://github.com/omnidotdev/runa-app/pull/135) [`d1862c6`](https://github.com/omnidotdev/runa-app/commit/d1862c6c6b268f44604d036d7d9e58b9ffe2513e) Thanks [@coopbri](https://github.com/coopbri)! - Buy and manage plans on the Omni account hub. Upgrade Workspace on a workspace's settings and the pricing page's paid plans now open the hub's confirm step for that plan and workspace, and Manage Subscription opens plan management on the hub (change, cancel, or renew the plan, payment method, invoices); both come back to Runa. A new workspace is created on the hub's workspaces console. The in-app checkout, billing portal, and renew and cancel buttons are removed.

- [#138](https://github.com/omnidotdev/runa-app/pull/138) [`8b040c0`](https://github.com/omnidotdev/runa-app/commit/8b040c0f386302658dd54f0a008451021275d746) Thanks [@coopbri](https://github.com/coopbri)! - Fix pages failing to load (HTTP 431) for accounts that belong to many workspaces

- [#130](https://github.com/omnidotdev/runa-app/pull/130) [`e300830`](https://github.com/omnidotdev/runa-app/commit/e3008306083d2f9079283cea6c994330c1a7f6f7) Thanks [@coopbri](https://github.com/coopbri)! - Update the link-preview image renderer (security fix) without changing how preview cards look.

- [#129](https://github.com/omnidotdev/runa-app/pull/129) [`381efbc`](https://github.com/omnidotdev/runa-app/commit/381efbc89177ef98927609c5f6c72bb968b41ad4) Thanks [@coopbri](https://github.com/coopbri)! - Update TanStack Start and Router for a security fix, and remove the unused maintenance-mode check.

- [#125](https://github.com/omnidotdev/runa-app/pull/125) [`cf1b75e`](https://github.com/omnidotdev/runa-app/commit/cf1b75e78d08fcb4c736324626bab4e1b5ce5e4c) Thanks [@coopbri](https://github.com/coopbri)! - Stop a moved task from showing "renamed this task" in its activity when its title did not change.

- [#133](https://github.com/omnidotdev/runa-app/pull/133) [`8e1a24b`](https://github.com/omnidotdev/runa-app/commit/8e1a24b8f4f487a17c1277d7e2d282ec0c1c2cd3) Thanks [@coopbri](https://github.com/coopbri)! - Upgrading a workspace from its settings now subscribes the workspace itself through the same secure checkout as the pricing page, instead of an unauthenticated checkout that billed the person who clicked
