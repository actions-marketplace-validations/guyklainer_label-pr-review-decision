"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = exports.run = void 0;
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const token = core_1.getInput("token") || process.env.GH_PAT || process.env.GITHUB_TOKEN;
const run = async () => {
    core_1.debug("starting");
    if (!token)
        throw new Error("GitHub token not found");
    const octokit = github_1.getOctokit(token);
    if (!github_1.context.payload.pull_request)
        return console.log("No pull request found");
    const pullRequest = github_1.context.payload
        .pull_request;
    core_1.debug(`pr obj: ${JSON.stringify(pullRequest)}`);
    //   const reviews = await octokit.pulls.listReviews({
    //     owner: context.repo.owner,
    //     repo: context.repo.repo,
    //     pull_number: pullRequest.number,
    //   });
    //   const allApproved = reviews.data.every(
    //     (review) => review.state === "APPROVED"
    //   );
    //   if (allApproved) {
    //     if (reviews.data.length >= Number(getInput("approvals") || 1)) {
    //       await octokit.issues.addLabels({
    //         owner: context.repo.owner,
    //         repo: context.repo.repo,
    //         issue_number: pullRequest.number,
    //         labels: (getInput("labels") || "")
    //           .split(",")
    //           .map((label) => label.trim()),
    //       });
    //       console.log("Added labels");
    //     } else {
    //       console.log("Number of approvals not met");
    //     }
    //   } else {
    //     console.log("All reviews are not approved");
    //   }
};
exports.run = run;
const wait = (milliseconds) => {
    return new Promise((resolve) => setTimeout(() => resolve(), milliseconds));
};
exports.wait = wait;
exports.run()
    .then(() => { })
    .catch((error) => {
    console.error("ERROR", error);
    core_1.setFailed(error.message);
});
//# sourceMappingURL=index.js.map