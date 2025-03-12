/**
 * @fileoverview Loads the content of a script file.
 *
 * Version History:
 * - 1.0.0: Initial release with full scraping and data management capabilities.
 *
 * Author:
 * - Shakhrillo
 *
 * License:
 * - This script is licensed under the CodeCanyon Standard License.
 *
 * @version 1.0.0
 * @since 1.0.0
 * @author Shakhrillo
 * @license CodeCanyon Standard License
 */

"use strict";

// Import dependencies
const fs = require("fs");
const path = require("path");

/**
 * Get the content of a script file.
 *
 * @param {string} filename - The name of the script file.
 * @param {string} folder - The folder containing the script file.
 * @returns {string} The content of the script file.
 */
function getScriptContent(filename, folder) {
  const scriptsDirectory = path.join(__dirname, "..", folder);
  if (!fs.existsSync(scriptsDirectory)) {
    throw new Error(`Directory not found: ${scriptsDirectory}`);
  }
  return fs.readFileSync(path.join(scriptsDirectory, filename), "utf8");
}

module.exports = {
  getScriptContent,
};
