const Maestra = require("../lib/maestra");
const Task = require("../lib/task");

describe("Task", () => {
  let maestra;

  beforeEach(() => {
    maestra = new Maestra();
  });

  test("should run a single time", async () => {
    const handler = jest.fn();
    const task = new Task(maestra, "lorem", [], handler);

    for (let i = 0; i < 5; i++) {
      expect(await task.run()).toBeUndefined();
    }

    expect(handler).toHaveBeenCalledTimes(1);
  });

  test("should be reset", async () => {
    const handler = jest.fn();
    const task = new Task(maestra, "lorem", [], handler);

    await task.run();
    expect(task._memoized).not.toBeNull();

    task.reset();
    expect(task._memoized).toBeNull();
  });

  test("should run multiple times after being reset", async () => {
    const handler = jest.fn();
    const task = new Task(maestra, "lorem", [], handler);

    for (let i = 0; i < 5; i++) {
      await task.run();
      task.reset();
    }

    expect(handler).toHaveBeenCalledTimes(5);
  });
});
