BPMN Runner is a **domain-specific language (DSL)** designed to model and execute business processes using a **developer-friendly syntax** inspired by BPMN (Business Process Model and Notation).

It allows you to describe workflows as text — readable, structured, and directly executable — instead of relying on complex visual editors.

<br>
<br>

## Why BPMN Runner?

BPMN Runner bridges the gap between **process modeling** and **code execution**.  
While BPMN XML can be verbose and hard to maintain, BPMN Runner offers an elegant, expressive syntax that’s easy to read, version, and execute.

### Key Benefits

- ✅ **Readable** – Human-friendly syntax for developers.  
- ⚙️ **Executable** – Designed for runtime interpretation.  
- 🧩 **Modular** – Every process element is self-contained.  
- 🔁 **Extensible** – Easy to integrate with APIs and systems.  
- 💾 **Versionable** – Stored as plain text, perfect for Git repositories.

<br>
<br>

## Core Concepts

A BPMN Runner model is composed of a **pool**, which contains one or more **processes**.  
Each process defines a sequence of **events**, **tasks**, and **gateways** connected by **flows**.

| Concept | Description |
|----------|-------------|
| **Pool** | A logical container for processes (like an organization or system). |
| **Process** | A workflow with defined start, task, and end steps. |
| **Task** | A unit of work — manual, user, or automated. |
| **Gateway** | A decision or parallel execution point. |
| **Event** | A start or end marker for process flow. |
| **Message** | A communication or signal between processes. |

<br>
<br>

## Quick Example

The example below defines a simple customer order workflow.  
Each step of the process corresponds to a real-world action.

```bpmn-runner
pool(mainPool, "Order Management") {
  process(procOrder, "Customer Order") {
    start(s1);
    task(t1, "Validate Order", USER);
    gateway(g1, "Payment Decision", EXCLUSIVE) {
      yes -> {
        task(t2, "Charge Payment", AUTO);
      }
      no -> {
        task(t3, "Cancel Order", MANUAL);
      }
    };
    end(e1);
  }
}
```

<br>
<br>

## How It Works

1. **Define a pool** — represents your organization or main system.  
2. **Add processes** — describe specific business workflows.  
3. **Use tasks and gateways** — define logic and actions.  
4. **Connect elements** — use `->` to define the execution order.  
5. **Run it** — use the BPMN Runner engine or interpreter to execute.

<br>
<br>

## Real-World Example

Here’s how BPMN Runner could model an e-commerce payment process:

```bpmn-runner
pool(ecommerce, "E-Commerce System") {
  process(paymentFlow, "Payment Process") {
    start(s1);
    task(t1, "Capture Payment", AUTO);
    gateway(g1, "Payment Approved?", EXCLUSIVE) {
      yes -> {
        task(t2, "Send Confirmation Email", AUTO);
      }
      no -> {
        task(t3, "Notify Customer", AUTO);
      }
    };
    end(e1);
  }
}
```
<br>
<br>

## Summary

BPMN Runner is a **text-first process modeling language** designed for developers who want the power of BPMN without the complexity.

It’s ideal for:
- Workflow orchestration  
- Rule-based automation  
- Process documentation as code  
- Rapid prototyping of business flows  

> 💡 **Next step:** Explore the [Essentials](./essentials.md) to learn the grammar, tokens, and syntax of BPMN Runner.
