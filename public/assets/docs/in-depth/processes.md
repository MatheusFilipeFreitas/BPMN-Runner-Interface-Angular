
A **process** represents a **workflow** — a sequence of events, tasks, and gateways.

<br><br>

## Concept

Each process describes a logical flow of actions that achieve a business objective.  
It must always start with a `start()` event and end with an `end()` event.

<br><br>

## Syntax

```bpmn-runner
process(id, "Label") {
  start(...);
  ...
  end(...);
}
```

| Parameter | Description |
|------------|-------------|
| `id` | Unique process identifier |
| `"Label"` | Human-readable process name |

<br><br>

## Example

```bpmn-runner
pool(mainPool, "E-Commerce") {
  process(paymentProc, "Handle Payment") {
    start(s1);
    task(t1, "Charge Credit Card", AUTOMATED);
    end(e1);
  }
}
```

<br><br>

## Tips

- Each process should represent a **single business logic flow**.  
- Keep process IDs consistent with their purpose (`procPayment`, `procOrder`).  
- Use multiple processes within a pool to model separate workflows.
