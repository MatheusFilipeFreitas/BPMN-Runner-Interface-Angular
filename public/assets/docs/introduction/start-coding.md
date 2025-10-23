
This guide walks you through creating your first BPMN Runner process step-by-step.

<br><br>

## Setup

You can use the **BPMN Runner Playground** (the in-app Monaco editor) or any text editor of your choice.  
Each file should be saved with the extension `.bpmn-runner`.

Example file name:
```
customer-order.bpmn-runner
```

<br><br>

## Your First Process

Let’s create a simple customer order workflow.

```bpmn-runner
pool(mainPool, "Order Management") {
  process(orderProc, "Customer Order") {
    start(s1);
    task(t1, "Receive Order", MANUAL);
    task(t2, "Validate Payment", USER);
    gateway(g1, "Payment Approved?", EXCLUSIVE) {
      yes -> {
        task(t3, "Ship Product", AUTOMATED);
      }
      no -> {
        task(t4, "Notify Customer", AUTOMATED);
      }
    };
    end(e1);
  }
}
```

<br><br>

## Explanation

| Element | Description |
|----------|--------------|
| `pool` | Defines the environment or participant of the process |
| `process` | Describes the workflow sequence |
| `start(s1)` | Entry point of the process |
| `task(t1, "Receive Order", MANUAL)` | Manual action performed by a person |
| `gateway(g1, ..., EXCLUSIVE)` | Decision point with yes/no branches |
| `end(e1)` | Indicates process completion |

<br><br>

## Running the Model

If you’ve integrated BPMN Runner with an interpreter (for example, using **Java + ANTLR**), you can execute the process directly in code.

```java
ProcessParser parser = new ProcessParser(tokens);
ProcessModel model = parser.model();
model.execute();
```

The interpreter reads your `.bpmn-runner` file, builds a process graph, and executes tasks according to their type and flow.

<br><br>

## Improving Readability

BPMN Runner syntax is designed to be human-friendly.  
Here are a few tips for writing cleaner definitions:

- Keep each statement on a separate line  
- Use indentation to group logical blocks  
- Use comments to explain logic  
- Prefer short, descriptive identifiers  

```bpmn-runner
// Example of a clean, readable structure
pool(orderApp, "Order System") {
  process(p1, "Order Validation") {
    start(s1);
    task(t1, "Validate Customer", USER);
    end(e1);
  }
}
```

<br><br>

## Tips and Best Practices

- Use **uppercase** for types (`MANUAL`, `AUTOMATED`, `USER`)  
- Always close definitions with a semicolon (`;`)  
- Keep IDs short and descriptive (e.g., `t1`, `pOrder`, `gMain`)  
- Use **exclusive gateways** for decisions  
- Use **parallel gateways** for concurrent actions  
- Comment your logic generously  

<br><br>

## Next Steps

Once you’re comfortable defining your first process, move on to the **In-Depth Guides** to explore:
- Tasks (`task(...)`)
- Gateways (`gateway(...)`)
- Events (`start(...)` and `end(...)`)
