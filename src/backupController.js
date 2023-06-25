const { CronJob } = require("cron");
const fs = require("fs");
const { Octokit } = require("@octokit/core");
const {
  restEndpointMethods,
} = require("@octokit/plugin-rest-endpoint-methods");

const createBackupJob = async (req, res) => {
  const { repositoryUrl, frequency } = req.body;

  if (!repositoryUrl || !frequency) {
    return res
      .status(200)
      .json({ result: "error", message: "Missing required parameters." });
  }

  const MyOctokit = Octokit.plugin(restEndpointMethods);
  const octokit = new MyOctokit();
  const backup = { owner: "", repo: "" };

  try {
    const url = new URL(repositoryUrl);

    if (url.hostname !== "github.com") {
      return res
        .status(200)
        .json({ result: "error", message: "URL doesn't belong to Github." });
    }

    [, backup.owner, backup.repo] = url.pathname.split("/");

    await octokit.rest.repos.get({
      owner: backup.owner,
      repo: backup.repo,
    });
  } catch (error) {
    return res.status(200).json({ result: "error", message: error.message });
  }

  const job = new CronJob(frequency, async () => {
    try {
      const response = await octokit.rest.repos.downloadZipballArchive({
        owner: backup.owner,
        repo: backup.repo,
      });

      console.log(`Creating backup: ${backup.owner}/${backup.repo}.`);

      if (!fs.existsSync("backups")) fs.mkdirSync("backups");
      const output = fs.createWriteStream(`backups/${backup.repo}.zip`);
      const buffer = Buffer.from(response.data);
      output.write(buffer);
      output.end();

      console.log(`${backup.owner}/${backup.repo} backed up.`);
    } catch (error) {
      console.log(error);
    }
  });

  job.start();
  return res.status(200).json({
    result: "success",
    message: `Job to backup ${repositoryUrl} scheduled.`,
  });
};

module.exports = { createBackupJob };
