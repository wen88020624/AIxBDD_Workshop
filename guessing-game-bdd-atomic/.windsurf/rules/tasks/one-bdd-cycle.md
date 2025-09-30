---
description: task: one-bdd-cycle
globs:
alwaysApply: false
---
# 任務
此為一個「巨集」指令，你需要嚴格遵照底下定義的 SOP 順序（不可跳順序、不可忽略步驟）來依序呼叫每個 Rule。直到完成整個 SOP 所規範的每一個步驟，在那之前，不可擅自停止。

# 要參考的 Specs
1. 指定的 Scenario: 請見參考的 feature file 中指定的 Scenario行數
2. Tech-Stack 規格：dev/tech-stack.md
3. API Spec: analysis/api/api.yml
4. 指令集：GWT-ISA.yml

# 嚴格執行任務

Input: 指定的一個 Scenario
1. 會以 pseudo-code 格式來代表此任務的 SOP，你必須遵照此 pseudo-code 嚴格執行此 SOP。
2. 此 pseudo-code 中的每一個函數呼叫，皆代表去執行一份 cursor rule。

好比說，當程式撰寫底下：
```
check-in-scenario(scenario)
```，則代表一開始要嚴格參考 check-in-scenario 這個 rule 規範，並指定針對這份 scenario 做處理。

## pseudo-code (SOP)

```
check-in-scenario(scenario)

for each step in scenario:
    instruction_name = instruction-matching(step) # 先判斷其指令類型

    switch(instruction_name):
        case "API call":
            api-call-step(step)
            break
        case "API response validate":
            # 啥都不做，因為已經內建在 CommonThen 中了
            break
        case "API response without content":
            # 啥都不做，因為已經內建在 CommonThen 中了
            break
        case "Entity setup":
            given-entity-saved(step)
            break
        case "Entity validate":
            then-entity-validate(step)
            break
        case "Relationship validate":
            relationship-validate(step)
            break
        case "Count validate":
            count-validate(step)
            break
        case "Request fails with reason":
            # 啥都不做，因為已經內建在 CommonThen 中了
            break
        case "Request fails without reason":
            # 啥都不做，因為已經內建在 CommonThen 中了
            break

ticket = verify-scenario-test-fails(scenario) # 確認測試合理失敗，且產出工單

do-implement(scenario)

check-out-scenario(scenario)
```