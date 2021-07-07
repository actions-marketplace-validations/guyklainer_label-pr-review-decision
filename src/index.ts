import { getInput, debug, info, setFailed } from "@actions/core";
import {context, getOctokit} from "@actions/github";
import {WebhookPayload} from "@actions/github/lib/interfaces";

const token =
  getInput("token") || process.env.GH_PAT || process.env.GITHUB_TOKEN;

export const run = async () => {
  debug("starting");
  if (!token) throw new Error("GitHub token not found");
  const octokit = getOctokit(token);

  if (!context.payload.pull_request)
    return console.log("No pull request found");

  const pullRequest = (context as any).payload
    .pull_request as WebhookPayload['pull_request'];

  if(pullRequest){
    const { repository } = await octokit.graphql(`
     {
      repository(name: "${context.repo.repo}", owner: "${context.repo.owner}") { 
       pullRequest(number: ${pullRequest.number}) {
        reviewDecision
       }
      }
     }
    `);
    const state = repository.pullRequest.reviewDecision;
    info(`PR state is: ${state}`);

    if(state === "APPROVED") {
      const labelToAdd = getInput("approveLabel") || "ready to merge";
      const labelToRemove = getInput("labelToRemove") || "ready for review";
      await octokit.issues.addLabels({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: pullRequest.number,
        labels: [labelToAdd],
      });

      octokit.issues.removeLabel({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: pullRequest.number,
        name: labelToRemove
      })

      info(`PR labeled with: ${labelToAdd}`);
    }
  }
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
