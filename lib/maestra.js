const EventEmitter = require("events");
const MaestraError = require("./error");
const MaestraReport = require("./report");
const TaskResult = require("./result");
const Task = require("./task");

/**
 * A maestra.
 *
 * @extends {EventEmitter}
 * @param {Object} [options] The maestra options.
 * @param {Boolean} [options.rejectErrors=true] Rejects if the report contains errors.
 */
class Maestra extends EventEmitter {
  /**
   * Creates a new maestra.
   */
  constructor(options) {
    super();

    /**
     * The maestra options.
     *
     * @type {Object}
     */
    this.options = Object.assign({ rejectErrors: true }, options);

    /**
     * The tasks.
     *
     * @private
     * @type {Map<String, Task>}
     */
    this._tasks = new Map();
  }

  /**
   * Adds a task.
   *
   * @param {String} name The task name.
   * @param {Array<String>} dependencies The task dependencies.
   * @param {Function} handler The task handler.
   * @return {Task} The task.
   */
  add(name, dependencies, handler) {
    const task = new Task(this, name, dependencies, handler);

    this._bindTaskEvents(task);
    this._tasks.set(task.name, task);

    return task;
  }

  /**
   * Returns a task.
   *
   * @param {String} name The task name.
   * @return {?Task} Returns the task, or `undefined` if the task does not exists.
   */
  get(name) {
    return this._tasks.get(name);
  }

  /**
   * Checks if the task exists.
   *
   * @param {String} name The task name.
   * @return {Boolean} Returns `true` if the task exists; otherwise `false`.
   */
  has(name) {
    return this._tasks.has(name);
  }

  /**
   * Removes a task.
   *
   * @param {String} name The task name.
   * @return {Boolean} Returns `true` if the task existed and has been removed, or `false` if the task does not exist.
   */
  delete(name) {
    return this._tasks.delete(name);
  }

  /**
   * Returns the task names.
   *
   * @return {Array<String>} The task names.
   */
  taskNames() {
    return Array.from(this._tasks.keys());
  }

  /**
   * Runs tasks.
   *
   * @param {Array<String>} [names=this.taskNames()] The task names.
   * @return {Promise<MaestraReport, MaestraReport>}
   */
  async run(names = this.taskNames()) {
    const report = new MaestraReport();

    try {
      for (const result of await this._runTasks(names)) {
        report._addResult(result);
      }
    } catch (error) {
      report._addError(error);
    }

    if (this.options.rejectErrors && report.hasErrors()) {
      throw new MaestraError(report);
    }

    return report;
  }

  /**
   * Resets tasks.
   *
   * @param {Array<String>} [names=this.taskNames()] The task names.
   * @throws {RangeError} A task does not exists.
   * @return {Maestra} The maestra.
   */
  reset(names = this.taskNames()) {
    for (const task of this._getTasks(names)) {
      task.reset();
    }

    return this;
  }

  /**
   * Binds the task events to the maestra.
   *
   * @private
   * @param {Task} task The task.
   */
  _bindTaskEvents(task) {
    task.on("started", this.emit.bind(this, "task-started", task));
    task.on("completed", this.emit.bind(this, "task-completed", task));
    task.on("failed", this.emit.bind(this, "task-failed", task));
  }

  /**
   * Get tasks.
   *
   * @private
   * @param {Array<String>} names The task names.
   * @throws {RangeError} A task does not exists.
   * @return {Array<Task>} The tasks.
   */
  _getTasks(names) {
    const tasks = [];

    for (const name of names) {
      const task = this.get(name);

      if (task === undefined) {
        throw new RangeError(`Task "${name}" not found`);
      }

      tasks.push(task);
    }

    return tasks;
  }

  /**
   * Call a function on each task.
   *
   * @private
   * @param {Array<String>} names The task names.
   * @param {Function} callback The function called on each task.
   * @return {Promise<Array<*>>}
   */
  async _mapTasks(names, callback) {
    return Promise.all(this._getTasks(names).map(callback));
  }

  /**
   * Run the given task and returns its result.
   *
   * @private
   * @param {Task} task The task to run.
   * @return {Promise<TaskResult>}
   */
  async _runTask(task) {
    try {
      await task.run();
    } catch (error) {
      return new TaskResult(task, error);
    }

    return new TaskResult(task, null);
  }

  /**
   * Run the given tasks.
   *
   * @private
   * @param {Array<String>} names The task names.
   * @throws {RangeError} A task does not exists.
   * @return {Promise<Array<TaskResult>>}
   */
  async _runTasks(names) {
    return this._mapTasks(names, task => this._runTask(task));
  }
}

module.exports = Maestra;
