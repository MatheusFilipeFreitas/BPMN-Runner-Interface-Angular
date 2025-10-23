
This guide introduces the **core structure**, **tokens**, and **syntax rules** of the BPMN Runner language.

<br><br>

## Grammar Overview

### Pool
```bpmn-runner
pool(id, "Label") {
  process(...)
}
```
<br><br>
Defines a **process container**, similar to a BPMN Pool.  
Each `pool` can have multiple `process()` blocks representing the processes of one participant or system.


### Process

```bpmn-runner
process(id, "Label") {
  start(s1);
  ...
  end(e1);
}
```
<br><br>
Defines a sequence of **tasks**, **gateways**, and **events** that form a complete workflow.  
Each process must start with a `start()` event and end with an `end()` event.

### Task

```bpmn-runner
task(id, "Label", MANUAL);
```
<br><br>
Represents a **unit of work**.  
Each task includes:
- An **identifier** (`id`)
- A **description** (`"Label"`)
- A **type** (`TaskType`)

**Available Task Types:**  
- `MANUAL` → Human action required  
- `USER` → System + human interaction  
- `AUTOMATED` → Fully automated by the system

<br><br>

### Gateway

Gateways control **conditional** or **parallel** flows in your process.

#### Exclusive Gateway

```bpmn-runner
gateway(g1, "Decision", EXCLUSIVE) {
  yes -> {
    task(t1, "Approve Request", USER);
  }
  no -> {
    task(t2, "Reject Request", MANUAL);
  }
};
```

Only **one branch** (`yes` or `no`) is executed depending on the decision.

#### Parallel Gateway

```bpmn-runner
gateway(g2, "Parallel Tasks", PARALLEL) {
  scope -> {
    task(t3, "Send Email", AUTOMATED);
    task(t4, "Notify Admin", AUTOMATED);
  }
};
```

All tasks within the `scope` block execute **concurrently**.

<br><br>

### Events

Events define the **start** and **end** of a process.

```bpmn-runner
start(s1);
end(e1);
```

- **start** → Entry point of a process  
- **end** → Marks process completion

<br><br>

### Messages

Messages define **communication** or **signal exchange** between elements.

```bpmn-runner
task(t1, "Send Invoice", AUTOMATED) -> message(m1);
message(m1);
```

Used to represent external communications between processes.

<br><br>

## Token Reference

| Token | Description |
|--------|-------------|
| `POOL`, `PROCESS` | Structural keywords defining the process scope |
| `START`, `END` | Event markers for process boundaries |
| `TASK` | Defines an activity with ID, label, and type |
| `GATEWAY` | Defines a decision or parallel execution point |
| `YES`, `NO` | Conditional branches in exclusive gateways |
| `SCOPE` | Used for concurrent execution in parallel gateways |
| `MESSAGE` | Defines message or signal flows |
| `ARROW (->)` | Defines process flow direction |
| `TaskType` | Enum: `MANUAL`, `USER`, `AUTOMATED` |
| `GatewayType` | Enum: `EXCLUSIVE`, `PARALLEL` |
| `ID` | Unique alphanumeric identifier |
| `STRING` | Text label wrapped in quotes `"..."` |
| `SEMICOLON` | Ends a statement |
| `{}` | Defines block scope |

<br><br>

## Comments

Comments help document your logic and are ignored during execution.

```bpmn-runner
// This is a single-line comment

/* This is
   a multi-line comment */
```

<br><br>

## Formatting Rules

- Statements **must** end with `;`  
- Blocks are enclosed by `{ ... }`  
- Whitespace and indentation are flexible, but readability is recommended

Example (both are valid):

```bpmn-runner
task ( t1 , "Check Inventory" , AUTOMATED ) ;
```

and

```bpmn-runner
task(t1, "Check Inventory", AUTOMATED);
```
