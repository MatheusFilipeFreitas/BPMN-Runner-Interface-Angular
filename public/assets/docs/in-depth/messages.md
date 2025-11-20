
The **message** keyword in BPMN Runner defines communication between **different lanes (pools)** or **separate processes**.  
It allows one task to trigger another process or element across boundaries.

<br><br>

## Concept

Messages are used when one process needs to **send information** or **trigger an action** in another process.  
They establish an explicit **cross-process connection**, similar to BPMN’s *Message Flow* between participants.

In BPMN Runner, a message does **not** create a new task — instead, it points to an existing **target element ID** in another process or pool.

<br><br>

## Syntax

```bpmn-runner
task(...) -> message(targetElementId);
```

| Element | Description |
|----------|-------------|
| `task(...)` | The source task that sends the message |
| `message(targetElementId)` | The message definition that identifies the target element ID |

<br><br>

## Example: Communicating Between Pools

```bpmn-runner
pool(customer, "Customer Application") {
  process(orderProc, "Place Order") {
    start(s1);
    task(t1, "Submit Order", USER) -> message(t2);
  }
}

pool(store, "Store System") {
  process(procRecOrder, "Receive Order") {
    task(t2, "Validate Payment", AUTOMATED);
    end(e1);
  }
}
```

### Explanation

1. The **Customer Application** pool executes `task(t1, "Submit Order", USER)`  
2. The task sends a message using `-> message(procReceiveOrder)`  
3. The message targets the task `t2` that is in process `procReceiveOrder` in the **Store System** pool  

<br><br>

## Important Notes

- The **ID** inside `message(targetElementId)` must match the **target element**.  
- Messages are typically used to represent **inter-process triggers** — for example, between departments or systems.  
- Messages cannot be chained like sequence flows; they exist only between distinct pools.

<br><br>

## Example: Task-to-Task Communication

```bpmn-runner
pool(support, "Support Department") {
  process(ticketHandling, "Handle Ticket") {
    start(s1);
    task(t1, "Assign Ticket", USER) -> message(t2);
  }
}

pool(development, "Development Team") {
  process(fixTicket, "Fix Reported Bug") {
    task(t2, "Fix Issue", AUTOMATED);
    end(e1);
  }
}
```

In this scenario:
- The **Support Department** assigns a ticket (`t1`) and sends a message to `t2` in the **Development Team** process.  
- The **Development Team** begins the automated fix workflow once the message is received.

<br><br>

## Tips

- Use messages to connect tasks **across pools or processes**.  
- The target ID in `message(targetElementId)` must already exist and must be a task or gateway.  
- Messages act like **signals**, not sequences — they don’t pause the sender process.  
- Ideal for modeling **inter-system** or **inter-departmental** communication.

<br><br>
