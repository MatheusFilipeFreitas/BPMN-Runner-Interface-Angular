
Events define **entry** and **exit points** for a process.  
They are required for marking when a process starts and ends.

<br><br>

## Concept

In BPMN Runner, events ensure that each process has a clear beginning and end.  
They provide structure and define process boundaries.

<br><br>

## Start Event

```bpmn-runner
start(id);
```

| Parameter | Description |
|------------|-------------|
| `id` | Unique event identifier |

<br><br>

## End Event

```bpmn-runner
end(id);
```

| Parameter | Description |
|------------|-------------|
| `id` | Unique event identifier |

<br><br>

## Example

```bpmn-runner
process(orderProc, "Customer Order") {
  start(s1);
  task(t1, "Receive Order", USER);
  end(e1);
}
```

<br><br>

## Tips

- Each process must have **at least one** start and end event.  
- Use short, meaningful identifiers like `s1` and `e1`.  
- Start and end events make your process easier to visualize and debug.
