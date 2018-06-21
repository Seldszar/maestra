# Maestra

> Get ready for an encore with this reprise to Octavia's concerto of mayhem.

Another task manager & runner based on dependencies.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Author](#author)
- [License](#license)

## Installation

```bash
npm install maestra --save
```

## Usage

```javascript
const delay = require("delay");
const Maestra = require("maestra");

// Create a new maestra
const maestra = new Maestra();

// Add a task
maestra.add("lorem", [], () => {});

// Add a task depending of `lorem`
maestra.add("ipsum", ["lorem"], () => {});

// Add an task depending of `lorem`
maestra.add("dolor", ["lorem"], () => delay(3000));

// Add a task depending of `ipsum` & `dolor`
maestra.add("sit", ["ipsum", "dolor"], () => Promise.reject(new Error("Oof!")));

// Called when a task started
maestra.on("task-started", task => {
  console.log("[%s] started", task.name);
});

// Called when a task completed
maestra.on("task-completed", task => {
  console.log("[%s] completed", task.name);
});

// Called when a task failed
maestra.on("task-failed", (task, error) => {
  console.log("[%s] failed", task.name, error);
});

// Run the `ipsum` task and its dependencies
maestra.run(["ipsum"]).then(report => {
  // Report all tasks
  console.log('Task "ipsum" complete', report);

  // Reset the `ipsum` task
  maestra.reset(["ipsum"]);

  // Run all tasks
  maestra.run().catch(error => {
    // Reject if the report contains errors
    console.log("Oof!", error);
  });
});
```

## Author

Alexandre Breteau - [@0xSeldszar](https://twitter.com/0xSeldszar)

## License

MIT © [Alexandre Breteau](https://seldszar.fr)
