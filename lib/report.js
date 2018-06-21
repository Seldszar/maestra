/**
 * A maestra report.
 */
class MaestraReport {
  /**
   * Creates a new maestra report.
   */
  constructor() {
    /**
     * The tasks.
     *
     * @type {Array<Task>}
     */
    this.tasks = [];

    /**
     * The task errors.
     *
     * @type {Array<Error>}
     */
    this.errors = [];
  }

  /**
   * Checks if the report contains tasks.
   *
   * @return {Boolean} Return `true` if the report contains tasks, else `false`.
   */
  hasTasks() {
    return this.tasks.length > 0;
  }

  /**
   * Checks if the report contains errors.
   *
   * @return {Boolean} Return `true` if the report contains errors, else `false`.
   */
  hasErrors() {
    return this.errors.length > 0;
  }

  /**
   * Add a task.
   *
   * @private
   * @param {Task} task The task.
   */
  _addTask(task) {
    this.tasks.push(task);
  }

  /**
   * Add an error.
   *
   * @private
   * @param {Error} error The error.
   */
  _addError(error) {
    this.errors.push(error);
  }

  /**
   * Add a task result.
   *
   * @private
   * @param {Result} result The task result.
   */
  _addResult(result) {
    this._addTask(result.task);

    if (result.error) {
      this._addError(result.error);
    }
  }
}

module.exports = MaestraReport;
