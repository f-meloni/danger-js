"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DangerUtils_1 = require("../DangerUtils");
// BitBucket Cloud supports these emojis 🎉
var noEntryEmoji = "❌";
var warningEmoji = "⚠️";
var messageEmoji = "✨";
var signatureEmoji = "🚫";
var successEmoji = "🎉";
exports.dangerSignature = function (results) {
    var meta = results.meta || { runtimeName: "dangerJS", runtimeHref: "https://danger.systems/js" };
    return "Generated by " + signatureEmoji + " [" + meta.runtimeName + "](" + meta.runtimeHref + ")";
};
exports.messageForResultWithIssues = warningEmoji + "  Danger found some issues. Don't worry, everything is fixable.";
exports.dangerIDToString = function (id) { return "danger-id-" + id + ";"; };
exports.fileLineToString = function (file, line) { return "  File: " + file + ";Line: " + line + ";"; };
/**
 * Postfix signature to be attached comment generated / updated by danger.
 */
exports.dangerSignaturePostfix = function (results, commitID) {
    var signature = exports.dangerSignature(results);
    if (commitID !== undefined) {
        signature = signature + " against " + commitID;
    }
    return "\n\n  " + signature + "\n  ";
};
function buildMarkdownTable(header, defaultEmoji, violations) {
    if (violations.length === 0 || violations.every(function (violation) { return !violation.message; })) {
        return "";
    }
    return "\n\n  |      " + violations.length + " " + header + " |\n  | --- |\n" + violations.map(function (v) { return "  | " + (v.icon || defaultEmoji) + " - " + v.message + " |"; }).join("\n") + "\n\n  ";
}
/**
 * A template function for creating a GitHub issue comment from Danger Results
 * @param {string} dangerID A string that represents a unique build
 * @param {string} commitID The hash that represents the latest commit
 * @param {DangerResults} results Data to work with
 * @returns {string} HTML
 */
function template(dangerID, results, commitID) {
    var summaryMessage;
    if (!results.fails.length && !results.warnings.length) {
        summaryMessage = successEmoji + "  All green. " + DangerUtils_1.compliment();
    }
    else {
        summaryMessage = exports.messageForResultWithIssues;
    }
    return "\n  " + summaryMessage + "\n\n  " + buildMarkdownTable("Fails", noEntryEmoji, results.fails) + "\n  " + buildMarkdownTable("Warnings", warningEmoji, results.warnings) + "\n  " + buildMarkdownTable("Messages", messageEmoji, results.messages) + "\n  \n  " + results.markdowns.map(function (v) { return v.message; }).join("\n\n") + "\n  \n  " + exports.dangerSignaturePostfix(results, commitID) + "\n  \n  [](http://" + exports.dangerIDToString(dangerID) + ")\n  ";
}
exports.template = template;
function inlineTemplate(dangerID, results, file, line) {
    var printViolation = function (defaultEmoji) { return function (violation) {
        return "- " + (violation.icon || defaultEmoji) + " " + violation.message;
    }; };
    return "\n[//]: # (" + exports.dangerIDToString(dangerID) + ")\n[//]: # (" + exports.fileLineToString(file, line) + ")\n" + results.fails.map(printViolation(noEntryEmoji)).join("\n") + "\n" + results.warnings.map(printViolation(warningEmoji)).join("\n") + "\n" + results.messages.map(printViolation(messageEmoji)).join("\n") + "\n" + results.markdowns.map(function (v) { return v.message; }).join("\n\n") + "\n  ";
}
exports.inlineTemplate = inlineTemplate;
//# sourceMappingURL=bitbucketCloudTemplate.js.map