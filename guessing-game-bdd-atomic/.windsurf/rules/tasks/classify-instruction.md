---
description: task: instruction-matching
globs: 
alwaysApply: false
---
# Task
請參考給定的 Given / When / Then 指令集，仔細了解指令集中每個指令的格式，然後判斷給定的 Given/When/Then step 格式屬於何種指令，回傳該類型的指令名稱。

# Inputs
1. 指定的 step: 某 scenario/example 中的 step。
2. 指令集檔案：<指令集檔案>

# Outputs
會是該指令集中某一個指令的全名。