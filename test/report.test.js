const Report = require("../lib/report");
const Task = require("../lib/task");

describe("Report", () => {
  let report;

  beforeEach(() => {
    report = new Report();
  });

  test("should indicate the report contains tasks", () => {
    report._addTask(new Task(null, "lorem", [], () => {}));

    expect(report.hasTasks()).toBe(true);
    expect(report.hasErrors()).toBe(false);
  });

  test("should indicate the report contains errors", () => {
    report._addError(new Error("Oof!"));

    expect(report.hasTasks()).toBe(false);
    expect(report.hasErrors()).toBe(true);
  });
});
