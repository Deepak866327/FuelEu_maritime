#  AI Agent Workflow Log

##  Agents Used

### 🔹 ChatGPT 

Primary development assistant used for:

* System design (Hexagonal Architecture)
* Backend domain logic (CB, Banking, Pooling)
* Debugging runtime & API errors
* Frontend structure and integration

### 🔹 GitHub Copilot 

Used for:

* Inline suggestions
* Boilerplate generation (React + Express)

---

## Development Workflow 

This project was developed incrementally using AI assistance combined with manual validation.

---

###  Phase 1: Architecture Design

**Prompt:**

> "Design a scalable backend using hexagonal architecture for a compliance system"

**AI Output:**

* Suggested separation:

  * `core` → business logic
  * `ports` → interfaces
  * `adapters` → DB + API

**Decision Taken:**

* Adopted structure but manually enforced:

  * strict separation of logic
  * no DB calls inside core

 **Key Insight:**
AI provided structure, but correctness required manual discipline.

---

###  Phase 2: Compliance Balance (CB)

**Prompt:**

> "Implement FuelEU compliance balance calculation"

**AI Output:**

```ts
const cb = (target - actual) * energy;
```

**Enhancements Applied:**

* Added:

  * Energy calculation (`fuel × 41000`)
  * Status classification (Surplus / Deficit)
* Ensured type safety

-> **Learning:**
AI gives formulas, but domain correctness must be verified manually.

---

###  Phase 3: Routes & Baseline API

**Prompt:**

> "Create routes API with baseline selection"

**AI Output:**

* Basic GET + POST endpoints

**Refinement:**

* Enforced:

  * Only one baseline at a time
* Synced with DB schema

-> **Issue Faced:**
AI did not enforce uniqueness → fixed manually

---

###  Phase 4: Banking System (Article 20)

**Prompt:**

> "Design a banking system for emissions compliance"

**AI Output:**

* Simple insert logic

**Critical Improvement:**
Implemented **ledger-based design**:

```ts
+100  → banked
-40   → used
= 60 remaining
```

**Added Components:**

* `getTotalBank()` → aggregate
* `applyBank()` → controlled consumption

-> **Key Engineering Decision:**
Avoid overwriting values → maintain audit trail

---

###  Phase 5: Pooling System (Article 21)

**Prompt:**

> "Implement greedy allocation for surplus to deficit"

**AI Output:**

* Nested loop structure

**Refinement:**

* Ensured:

  * surplus never negative
  * deficit not overfilled
* Produced structured output:

```ts
{ from, to, amount }
```

-> **Insight:**
AI gave skeleton, but correctness required constraint handling

---

###  Phase 6: Frontend Dashboard

**Prompt:**

> "Build React dashboard with multiple tabs and API integration"

**AI Output:**

* Page components

**Enhancements:**

* Added:

  * Tailwind styling
  * Loading & error states
  * API abstraction layer

=> **Result:**
Clean separation between UI and data fetching

---

###  Phase 7: Debugging & Error Handling

#### => Issue 1: Frontend Crash

Error:

```text
data.baseline undefined
```

**Root Cause:**
Backend returned incorrect structure

**Fix:**

```ts
return { baseline, comparisons }
```

---

#### => Issue 2: Database Schema Error

Error:

```text
column "name" does not exist
```

**Fix:**

```sql
ALTER TABLE pools ADD COLUMN name TEXT;
```

---

#### => Issue 3: API Mismatch

* Incorrect endpoints used
* Fixed by standardizing:

```text
/routes/banking/*
/routes/pooling/*
```

---

###  Phase 8: Testing

**Prompt:**

> "Add unit tests for core logic using Jest"

**Implementation:**

* Tested:

  * positive CB
  * negative CB
  * boundary case

 **Outcome:**
Ensured correctness of core domain logic

---

##  Validation Strategy

* **Backend:**

  * Tested via Postman
  * Verified DB queries manually

* **Frontend:**

  * Used console logs
  * UI validation

* **Integration:**

  * Ensured API contract consistency

---

##  Observations :

###  Where AI Excelled

* Fast scaffolding
* Generating structured code
* Suggesting algorithms
* Reducing boilerplate effort

---

###  Where AI Failed :

* Incorrect assumptions about:

  * API response shape
  * DB schema
* Missed validation rules
* Required manual debugging

---

### => Key Takeaway

AI accelerates development, but:

> **Correctness comes from human validation, not generation**

##

* Built system incrementally
* Validated each layer independently
* Maintained separation of concerns
* Used logs for debugging
* Never trusted AI blindly
* Ensured consistent API contracts

---

##  Final Reflection

This project demonstrates effective collaboration between:

* AI-assisted code generation
* Manual engineering reasoning

Resulting in a system that is:

* Architecturally clean
* Domain-correct
* Production-inspired

---
