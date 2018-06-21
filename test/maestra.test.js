const Maestra = require("../lib/maestra");
const Report = require("../lib/report");

describe("Maestra", () => {
  let maestra;

  beforeEach(() => {
    maestra = new Maestra();
  });

  test("should register a task", () => {
    maestra.add("lorem", [], () => {});

    expect(maestra._tasks.size).toBe(1);
  });

  test("should check if a task exists", () => {
    maestra.add("lorem", [], () => {});

    expect(maestra.has("lorem")).toBe(true);
    expect(maestra.has("oof")).toBe(false);
  });

  test("should delete a task", () => {
    maestra.add("lorem", [], () => {});

    expect(maestra.delete("lorem")).toBe(true);
    expect(maestra.delete("oof")).toBe(false);
  });

  test("should reset tasks", () => {
    maestra.add("lorem", [], () => {});
    maestra.add("ipsum", ["lorem"], () => {});

    expect(maestra.reset()).toBe(maestra);
    expect(maestra.reset(["lorem"])).toBe(maestra);
    expect(() => maestra.reset(["oof"])).toThrow();
  });

  test("should report without registered tasks", async () => {
    const report = await maestra.run();

    expect(report).toBeInstanceOf(Report);
    expect(report.errors.length).toBe(0);
    expect(report.tasks.length).toBe(0);
  });

  test("should report completed tasks", async () => {
    maestra.add("lorem", [], () => {});
    maestra.add("ipsum", ["lorem"], () => {});

    const report = await maestra.run();

    expect(report).toBeInstanceOf(Report);
    expect(report.errors.length).toBe(0);
    expect(report.tasks.length).toBe(2);
  });

  test("should report failed tasks", async () => {
    maestra.add("lorem", [], () => {});
    maestra.add("ipsum", [], () => Promise.reject(new Error("oof")));

    try {
      await maestra.run();
    } catch (error) {
      expect(error.report.errors.length).toBe(1);
      expect(error.report.tasks.length).toBe(2);
    }
  });

  test("should reject if a task has a non-defined dependency", async () => {
    try {
      await maestra.run(["oof"]);
    } catch (error) {
      expect(error.report.errors.length).toBe(1);
      expect(error.report.tasks.length).toBe(0);
    }
  });
});
