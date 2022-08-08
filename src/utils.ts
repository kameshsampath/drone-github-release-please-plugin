export function parseBoolean(strBool: string): boolean {
  if (strBool) {
    switch (strBool) {
      case "yes":
      case "true":
        return true;
      case "no":
      case "false":
        return false;
      default:
        return false;
    }
  }
  return false;
}

export function valueOrUndefined(str: string): string {
  if (str) {
    return str;
  }
  return undefined;
}

export function valueArrayOrUndefined(strs: string[]): string[] {
  if (strs && strs.length > 0) {
    return strs;
  }
  return undefined;
}

export function logReleases(releases: any[]): void {
  releases = releases.filter((r) => r !== undefined);
  if (releases.length) {
    for (const release of releases) {
      const path = release.path || ".";
      if (path) {
        for (let [key, val] of Object.entries(release)) {
          // Historically tagName was output as tag_name, keep this
          // consistent to avoid breaking change:
          if (key === "tagName") key = "tag_name";
          if (key === "uploadUrl") key = "upload_url";
          if (key === "notes") key = "body";
          if (key === "url") key = "html_url";
          console.log(`Created release ${path} with ${key} ${val}`);
        }
      }
    }
  }
}

export function logReleasePRs(prs: any[]): void {
  prs = prs.filter((pr) => pr !== undefined);
  if (prs.length) {
    console.log(`Release PRs: ${JSON.stringify(prs)}`);
  }
}
