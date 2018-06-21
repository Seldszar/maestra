const EventEmitter = require("events");
const Result = require("./result");

/**
 * A task.
 *
 * @extends {EventEmitter}
 * @param {Maestra} maestra The maestra.
 * @param {String} name The task name.
 * @param {Array<String>} dependencies The task dependencies.
 * @param {Function} handler The task handler.
 */
class Task extends EventEmitter {
  /**
   * Creates a new task.
   */
  constructor(maestra, name, dependencies, handler) {
    super();

    /**
     * The maestra.
     *
     * @type {Maestra}
     */
    this.maestra = maestra;

    /**
     * The task name.
     *
     * @type {String}
     */
    this.name = name;

    /**
     * The task dependencies.
     *
     * @type {Array<String>}
     */
    this.dependencies = dependencies;

    /**
     * The task handler.
     *
     * @type {Function}
     */
    this.handler = handler;

    /**
     * The memoized task handler.
     *
     * @private
     * @type {?Promise}
     */
    this._memoized = null;
  }

  /**
   * Runs the task.
   *
   * @return {Promise}
   */
  async run() {
    await this._ensureDependencies();
    await this._handle();
  }

  /**
   * Resets the task and its dependents.
   */
  reset() {
    this._memoized = null;

    for (const task of this.maestra._tasks.values()) {
      if (task.dependencies.includes(this.name)) {
        task.reset();
      }
    }
  }

  /**
   * Ensures the task dependencies ended.
   *
   * @private
   * @return {Promise}
   */
  async _ensureDependencies() {
    await this.maestra._mapTasks(this.dependencies, task => task.run());
  }

  /**
   * Handles the task.
   *
   * @private
   * @return {Promise}
   */
  async _handle() {
    if (!this._memoized) {
      this._memoized = (async () => {
        this.emit("started");

        try {
          await this.handler();
          this.emit("completed");
        } catch (error) {
          this.emit("failed", error);
          throw error;
        }
      })();
    }

    return this._memoized;
  }
}

module.exports = Task;
