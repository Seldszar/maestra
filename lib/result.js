/**
 * A task result.
 *
 * @param {Task} task The task.
 * @param {Error} [error] The error if the task failed.
 */
class TaskResult {
  /**
   * Creates a new task result.
   */
  constructor(task, error) {
    /**
     * The task.
     *
     * @type {Task}
     */
    this.task = task;

    /**
     * The error if the task fails.
     *
     * @type {?Error}
     */
    this.error = error;
  }
}

module.exports = TaskResult;
