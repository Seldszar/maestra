/**
 * A maestra error.
 *
 * @extends {Error}
 * @param {Report} report The maestra report.
 */
class MaestraError extends Error {
  /**
   * Creates a new maestra error.
   */
  constructor(report) {
    super("Report contains errors");

    Object.defineProperty(this, "name", { value: this.constructor.name });
    Error.captureStackTrace(this, this.constructor);

    /**
     * The maestra report.
     *
     * @type {Report}
     */
    this.report = report;
  }
}

module.exports = MaestraError;
