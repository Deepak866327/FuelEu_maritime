# Reflection on AI-Assisted Development

# =>Overview

This project was developed using a combination of **AI tools (ChatGPT, Copilot)** and **manual engineering reasoning**. 

##  Key Learnings

###  AI as an Accelerator

AI significantly reduced development time by:

* Generating boilerplate code
* Suggesting architecture (Hexagonal design)
* Providing initial implementations for features like CB calculation, banking, and pooling

However, I learned that:

> AI speeds up development, but does not guarantee correctness.

---

###  Importance of Understanding

AI often generated syntactically correct but logically incomplete solutions.

Examples:

* Banking logic without proper validation
* Pooling algorithm without constraints
* Incorrect API response structure

This highlighted that:

> Understanding the problem is more important than generating code.

---

###  Debugging Still Requires Human Effort

Several issues required manual debugging:

* Frontend crash (`baseline undefined`)
* Database errors (`column does not exist`)
* API mismatches

AI helped identify possible causes, but resolution required:

* Careful reading of errors
* Step-by-step testing
* Verifying assumptions

---

##  Efficiency Gains

Using AI tools:

* Reduced development time by ~60%
* Improved speed of prototyping
* Reduced repetitive coding effort

However, some time was spent on:

* Debugging incorrect outputs
* Refining logic
* Ensuring correctness

---

##  Limitations of AI

AI showed limitations in:

* Handling domain-specific constraints
* Maintaining consistency across components
* Predicting real-world edge cases

It sometimes:

* Assumed incorrect API formats
* Skipped validations
* Produced incomplete logic

---

##  What I Would Improve

* Add more test coverage (integration + edge cases)
* Strengthen pooling validation rules
* Improve UI visualization (charts, indicators)
* Add API documentation

---

##  Final Takeaway

This project demonstrated that:

> AI is most effective as a collaborator, not a source of truth.

The best results came from combining:

* AI-generated code
* Manual validation
* Structured engineering thinking

---

##  Conclusion

AI accelerated development, but correctness depended on human reasoning and validation.
This combination resulted in a system that is both **functional** and **architecturally sound**.


