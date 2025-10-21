Gateways define **decision points** and **parallel paths** in a process flow.

<br><br>

## Concept

Gateways are logical structures that allow a process to **branch**, **merge**, or **run concurrently**.

There are two main types of gateways in BPMN Runner:  
- **EXCLUSIVE** → for conditional logic (choose one path)  
- **PARALLEL** → for concurrent execution (run all paths)

<br><br>

## Syntax

```bpmn-runner
gateway(id, "Label", TYPE) {
  ...
};
```

| Parameter | Description |
|------------|-------------|
| `id` | Unique identifier |
| `"Label"` | Gateway label or question |
| `TYPE` | `EXCLUSIVE` or `PARALLEL` |

<br><br>

## Exclusive Gateway

```bpmn-runner
gateway(g1, "Is payment approved?", EXCLUSIVE) {
  yes -> {
    task(t1, "Send Confirmation", AUTO);
  }
  no -> {
    task(t2, "Notify Customer", AUTO);
  }
};
```

- Only one branch (`yes` or `no`) will be followed.

<br><br>

## Parallel Gateway

```bpmn-runner
gateway(g2, "Perform Actions in Parallel", PARALLEL) {
  scope -> {
    task(t3, "Update CRM", AUTO);
    task(t4, "Send Email", AUTO);
  }
  scope -> {
    task(t5, "confirm sending of the email", AUTO);
  }
};
```

- All tasks within `scope` run concurrently.

<br><br>

## Tips

- Use **EXCLUSIVE** when you need a conditional path.  
- Use **PARALLEL** when multiple actions can happen at the same time.  
- Gateways can be **nested** to build complex flow logic.
