
A **pool** represents a participant or organization within a process model.  
It acts as a **container** for one or more processes.

<br><br>

## Concept

In BPMN, a pool represents an entity (organization, system, or department) that performs a process.  
In BPMN Runner, pools define the **scope** in which processes are defined and executed.

<br><br>

## Syntax

```bpmn-runner
pool(id, "Label") {
  process(...)
}
```

| Parameter | Description |
|------------|-------------|
| `id` | Unique identifier for the pool |
| `"Label"` | Human-readable label |
| `{ ... }` | Contains one or more process definitions |

<br><br>

## Example

```bpmn-runner
pool(mainPool, "Order System") {
  process(orderProc, "Customer Order") {
    start(s1);
    task(t1, "Validate Order", USER);
    end(e1);
  }
}
```

<br><br>

## Tips

- Each participant or system can be defined as a separate pool.  
- Pools are useful for **multi-organization** process models.  
- Use descriptive names for clarity, e.g. `paymentPool`, `shippingPool`.
