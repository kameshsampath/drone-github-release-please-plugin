import { GitHub, Manifest, ReleaserConfig } from "release-please";
import { env } from "process";
import * as yaml from "js-yaml";
import {
  logReleasePRs,
  logReleases,
  parseBoolean,
  valueArrayOrUndefined,
  valueOrUndefined,
} from "./utils";

export const GITHUB_RELEASE_COMMAND = "github-release";
export const GITHUB_RELEASE_PR_COMMAND = "release-pr";
export const GITHUB_API_URL = "https://api.github.com";
export const GITHUB_GRAPHQL_URL = "https://api.github.com";
export const GITHUB_TARGET_BRANCH = "main";
export const DEFAULT_RELEASE_TYPE = "simple";

//TODO add support for manifest

async function runPlugin() {
  const github = await getGitHubInstance();
  const manifest = await getManifestInstance(github);

  logReleases(await manifest.createReleases());
  logReleasePRs(await manifest.createPullRequests());
}

function getGitHubInstance() {
  const token = env.PLUGIN_GITHUB_TOKEN;
  const repoUrl = env.PLUGIN_REPO_URL ? env.PLUGIN_REPO_UR : env.DRONE_REPO;

  if (!token) {
    console.error("Please provide the GitHub token with write permissions");
    process.exit(1);
  }

  if (!repoUrl) {
    console.error(
      "Please provide the Git repository url in <owner>/<repo> format token with write permissions"
    );
    process.exit(1);
  }

  const { apiUrl, graphqlUrl } = getGitHubInput();
  const [owner, repo] = repoUrl.split("/");
  const githubCreateOpts = {
    owner,
    repo,
    apiUrl,
    graphqlUrl,
    token,
  };

  return GitHub.create(githubCreateOpts);
}

function getGitHubInput() {
  const apiUrl = env.PLUGIN_API_URL ? env.PLUGIN_API_URL : GITHUB_API_URL;
  const graphqlUrl = env.PLUGIN_GRAPHQL_URL
    ? env.PLUGIN_GRAPHQL_URL
    : GITHUB_GRAPHQL_URL;
  return {
    apiUrl,
    graphqlUrl,
  };
}

async function getManifestInstance(github) {
  const manifestOptions = env.PLUGIN_MANIFEST_OPTIONS;

  let fork = false;
  let path = undefined;
  let signoff = undefined;
  let draft = false;
  let releaseConfig: ReleaserConfig = { releaseType: DEFAULT_RELEASE_TYPE };
  if (manifestOptions) {
    fork = parseBoolean(manifestOptions["fork"]);
    draft = parseBoolean(manifestOptions["draft"]);
    path = valueOrUndefined(manifestOptions["path"]);
    signoff = valueOrUndefined(manifestOptions["sign-off"]);
    releaseConfig = buildManifestConfig(manifestOptions);
  }

  return await Manifest.fromConfig(
    github,
    github.repository.defaultBranch,
    releaseConfig,
    {
      draft,
      signoff,
      fork,
    },
    path
  );
}

runPlugin()
  .then()
  .catch((err) => console.log(`Error:${err}`));

function buildManifestConfig(manifestOptions): ReleaserConfig {
  if (manifestOptions) {
    const mfOpts = yaml.load(manifestOptions);
    if (mfOpts) {
      console.log("Plugin Settings", JSON.stringify(mfOpts));
      const releaseType = mfOpts["release-type"]
        ? mfOpts["release-type"]
        : DEFAULT_RELEASE_TYPE;
      const bumpMinorPreMajor = parseBoolean(mfOpts["bump-minor-pre-major"]);
      const bumpPatchForMinorPreMajor = parseBoolean(
        mfOpts["bump-patch-for-minor-pre-major"]
      );
      const includeComponentInTag = parseBoolean(mfOpts["mono-repo-tags"]);
      const packageName = valueOrUndefined(mfOpts["package-name"]);
      const changelogPath = valueOrUndefined(mfOpts["changelog-path"]);
      const changelogTypes = valueOrUndefined(mfOpts["changelog-types"]);
      const changelogSections = changelogTypes && JSON.parse(changelogTypes);
      let versionFile = valueOrUndefined(mfOpts["version-file"]);
      if (releaseType === DEFAULT_RELEASE_TYPE && !versionFile) {
        versionFile = "version.txt";
      }
      const extraFiles = valueArrayOrUndefined(mfOpts["extra-files"]);
      const pullRequestTitlePattern = valueOrUndefined(
        mfOpts["pull-request-title-pattern"]
      );
      const draftPullRequest = parseBoolean(mfOpts["draft-pull-request"]);
      return {
        bumpMinorPreMajor,
        bumpPatchForMinorPreMajor,
        packageName,
        releaseType,
        changelogPath,
        changelogSections,
        versionFile,
        extraFiles,
        includeComponentInTag,
        pullRequestTitlePattern,
        draftPullRequest,
      };
    }
  }

  return {
    releaseType: DEFAULT_RELEASE_TYPE,
  };
}
