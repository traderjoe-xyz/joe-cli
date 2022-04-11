# Joe CLI

CLI tool for various monitoring tasks.

Currently available :
-   `farm-allocations` : retrieve all allocations from MasterchefV2, MasterchefV3 and BoostedMasterChef. APR on BoostedMasterChef is JOE APR + average boosted APR from veJOE.

## Install from sources

```
yarn install
yarn run codegen
yarn global add file:*folder location*
```

You should then be able to run it from terminal using `joe-cli` and every commands like `joe-cli farm-allocations`