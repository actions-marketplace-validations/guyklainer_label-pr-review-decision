import { getInput, debug, setFailed, setOutput } from "@actions/core";
import {context, getOctokit} from "@actions/github";

const token =
  getInput("token") || process.env.GH_PAT || process.env.GITHUB_TOKEN;

export const run = async () => {
  debug("starting");
  if (!token) throw new Error("GitHub token not found");
  const octokit = getOctokit(token);

  if (!context.payload.pull_request)
    return console.log("No pull request found");

  const pullRequest = (context as any).payload
    .pull_request;

  debug(`pr state is: ${JSON.stringify(pullRequest.mergeable_state)}`);
  if(pullRequest.mergeable_state === "clean") {
    await octokit.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pullRequest.number,
      labels: (getInput("labels") || "")
        .split(",")
        .map((label) => label.trim()),
    });

  }

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

export const wait = (milliseconds: number) => {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), milliseconds));
};

run()
  .then(() => {})
  .catch((error) => {
    console.error("ERROR", error);
    setFailed(error.message);
  });
