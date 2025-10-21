
Tasks represent **individual units of work** within a process — such as an approval, API call, or manual action.

<br><br>

## Concept

A **task** is the most basic element in BPMN Runner.  
It performs a single action and connects with other tasks or gateways through flows.

<br><br>

## Syntax

```bpmn-runner
task(id, "Description", TYPE);
```

| Parameter | Description |
|------------|--------------|
| `id` | Unique identifier for the task |
| `"Description"` | Human-readable label |
| `TYPE` | Defines the execution mode (`MANUAL`, `USER`, or `AUTO`) |

<br><br>

## Task Types

| Type | Description |
|-------|-------------|
| `MANUAL` | A human-only action with no system interaction. |
| `USER` | A task involving user input or interaction through a system. |
| `AUTO` | A fully automated system task. |

<br><br>

## Example

```bpmn-runner
start(s1);
task(t1, "Check Inventory", MANUAL);
task(t2, "Send Invoice", AUTO);
task(t3, "Notify Customer", USER);
end(e1);
```

<br><br>

## Tips

- Use **AUTO** for background logic or API calls.  
- Use **USER** for UI-based interactions.  
- Use **MANUAL** for actions performed by humans outside the system.  
- Keep labels short but descriptive.
