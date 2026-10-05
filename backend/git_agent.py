"""
Git Agent

Responsibilities:
1. Open the repository prepared by RepoPrepAgent.
2. Create / checkout the recovery branch.
3. Detect changes made by HealingAgent.
4. Commit the changes.
5. Push the recovery branch to GitHub.
6. Create a Pull Request using the GitHub API.
"""

import os
import re
from urllib.parse import urlparse

from git import Repo, GitCommandError
from github import Github
from github.GithubException import GithubException


class GitAgent:
    """
    Agent 4: Git & Pull Request Agent
    """

    def __init__(
        self,
        repo_path,
        repo_url,
        branch_name,
        team_name,
        leader_name,
    ):
        self.repo_path = repo_path
        self.repo_url = repo_url
        self.branch_name = self._sanitize_branch(branch_name)
        self.team_name = team_name
        self.leader_name = leader_name

        self.github_token = os.getenv("GITHUB_TOKEN", "").strip()

    # ---------------------------------------------------------
    # BRANCH SANITIZATION
    # ---------------------------------------------------------

    def _sanitize_branch(self, branch_name):
        """
        Keep branch names Git-compatible.
        """

        branch_name = str(branch_name).strip()

        branch_name = re.sub(
            r"[^A-Za-z0-9._/-]",
            "_",
            branch_name
        )

        branch_name = re.sub(
            r"_+",
            "_",
            branch_name
        )

        branch_name = branch_name.strip("._-/")

        return branch_name or "ACR_AGENT_AI_Fix"

    # ---------------------------------------------------------
    # REPOSITORY VALIDATION
    # ---------------------------------------------------------

    def _get_repo(self):
        """
        Open the repository cloned by RepoPrepAgent.
        """

        if not os.path.isdir(self.repo_path):
            raise RuntimeError(
                f"Repository path does not exist: {self.repo_path}"
            )

        git_dir = os.path.join(
            self.repo_path,
            ".git"
        )

        if not os.path.isdir(git_dir):
            raise RuntimeError(
                f"Git repository not found at: {self.repo_path}"
            )

        try:
            return Repo(self.repo_path)

        except Exception as e:
            raise RuntimeError(
                f"Unable to open Git repository: {e}"
            )

    # ---------------------------------------------------------
    # GITHUB URL PARSING
    # ---------------------------------------------------------

    def _parse_github_repo(self):
        """
        Extract owner and repository name from a GitHub URL.

        Supported examples:

        https://github.com/user/project.git
        https://github.com/user/project
        git@github.com:user/project.git
        """

        url = self.repo_url.strip()

        # HTTPS / HTTP GitHub URL
        parsed = urlparse(url)

        if parsed.hostname:
            path = parsed.path.strip("/")

            parts = path.split("/")

            if len(parts) >= 2:
                owner = parts[0]
                repo_name = parts[1]

                if repo_name.endswith(".git"):
                    repo_name = repo_name[:-4]

                return owner, repo_name

        # SSH GitHub URL
        ssh_match = re.match(
            r"git@github\.com:([^/]+)/(.+?)(?:\.git)?$",
            url
        )

        if ssh_match:
            return (
                ssh_match.group(1),
                ssh_match.group(2),
            )

        raise RuntimeError(
            f"Unable to parse GitHub repository URL: {url}"
        )

    # ---------------------------------------------------------
    # CHECKOUT / CREATE BRANCH
    # ---------------------------------------------------------

    def _prepare_branch(self, repo):
        """
        Create the recovery branch from the currently checked-out
        repository state.

        If the branch already exists locally, switch to it.
        """

        print(
            f"[GIT] Preparing recovery branch: "
            f"{self.branch_name}"
        )

        try:

            # -------------------------------------------------
            # Branch already exists locally
            # -------------------------------------------------

            if self.branch_name in [
                branch.name
                for branch in repo.branches
            ]:

                print(
                    f"[GIT] Branch already exists locally: "
                    f"{self.branch_name}"
                )

                repo.git.checkout(
                    self.branch_name
                )

            # -------------------------------------------------
            # Create new branch
            # -------------------------------------------------

            else:

                print(
                    f"[GIT] Creating branch: "
                    f"{self.branch_name}"
                )

                new_branch = repo.create_head(
                    self.branch_name
                )

                new_branch.checkout()

            print(
                f"[SUCCESS] Checked out branch: "
                f"{self.branch_name}"
            )

        except GitCommandError as e:

            raise RuntimeError(
                f"Failed to prepare Git branch: {e}"
            )

    # ---------------------------------------------------------
    # DETECT CHANGES
    # ---------------------------------------------------------

    def _has_changes(self, repo):
        """
        Check whether HealingAgent produced repository changes.
        """

        try:

            # Tracked modified files
            if repo.is_dirty(
                untracked_files=True
            ):
                return True

            # Staged changes
            if repo.index.diff("HEAD"):
                return True

            return False

        except Exception as e:

            raise RuntimeError(
                f"Unable to inspect repository changes: {e}"
            )

    # ---------------------------------------------------------
    # STAGE CHANGES
    # ---------------------------------------------------------

    def _stage_changes(self, repo):
        """
        Stage all modified, deleted and untracked files.
        """

        print("[GIT] Staging repository changes...")

        try:

            repo.git.add(
                "-A"
            )

            print(
                "[SUCCESS] Repository changes staged."
            )

        except GitCommandError as e:

            raise RuntimeError(
                f"Failed to stage changes: {e}"
            )

    # ---------------------------------------------------------
    # COMMIT
    # ---------------------------------------------------------

    def _commit_changes(self, repo, fixes):
        """
        Create a descriptive commit.
        """

        fix_count = len(fixes)

        commit_message = (
            f"fix: ACR_AGENT automated healing "
            f"({fix_count} fix"
            f"{'' if fix_count == 1 else 'es'})"
        )

        print(
            f"[GIT] Creating commit: "
            f"{commit_message}"
        )

        try:

            commit = repo.index.commit(
                commit_message
            )

            print(
                f"[SUCCESS] Commit created: "
                f"{commit.hexsha[:8]}"
            )

            return commit

        except Exception as e:

            raise RuntimeError(
                f"Failed to create commit: {e}"
            )

    # ---------------------------------------------------------
    # PUSH BRANCH
    # ---------------------------------------------------------

    def _push_branch(self, repo):
        """
        Push recovery branch to origin using the configured
        GitHub credentials.

        GITHUB_TOKEN is inserted into the HTTPS remote URL
        only for the push operation.
        """

        if not self.github_token:
            raise RuntimeError(
                "GITHUB_TOKEN is not configured."
            )

        print(
            f"[GIT] Pushing branch: "
            f"{self.branch_name}"
        )

        try:

            origin = repo.remote(
                "origin"
            )

            remote_url = origin.url

            # -------------------------------------------------
            # HTTPS GitHub remote
            # -------------------------------------------------

            if remote_url.startswith(
                "https://github.com/"
            ):

                authenticated_url = (
                    "https://x-access-token:"
                    f"{self.github_token}"
                    "@github.com/"
                    + remote_url.split(
                        "github.com/",
                        1
                    )[1]
                )

                original_url = origin.url

                try:

                    origin.set_url(
                        authenticated_url
                    )

                    origin.push(
                        refspec=(
                            f"{self.branch_name}:"
                            f"{self.branch_name}"
                        )
                    )

                finally:

                    # Never leave the token inside
                    # .git/config.
                    origin.set_url(
                        original_url
                    )

            else:

                # -------------------------------------------------
                # For SSH or other configured remotes.
                # -------------------------------------------------

                origin.push(
                    refspec=(
                        f"{self.branch_name}:"
                        f"{self.branch_name}"
                    )
                )

            print(
                "[SUCCESS] Branch pushed successfully."
            )

        except GitCommandError as e:

            raise RuntimeError(
                f"Failed to push branch: {e}"
            )

    # ---------------------------------------------------------
    # CREATE PULL REQUEST
    # ---------------------------------------------------------

    def _create_pull_request(self):
        """
        Create a Pull Request using PyGithub.
        """

        if not self.github_token:
            raise RuntimeError(
                "GITHUB_TOKEN is not configured."
            )

        owner, repo_name = (
            self._parse_github_repo()
        )

        print(
            f"[GITHUB] Connecting to "
            f"github.com/{owner}/{repo_name}"
        )

        try:

            github_client = Github(
                self.github_token
            )

            github_repo = (
                github_client.get_repo(
                    f"{owner}/{repo_name}"
                )
            )

            # -------------------------------------------------
            # Determine default branch
            # -------------------------------------------------

            default_branch = (
                github_repo.default_branch
            )

            print(
                f"[GITHUB] Default branch: "
                f"{default_branch}"
            )

            # -------------------------------------------------
            # Pull Request title
            # -------------------------------------------------

            title = (
                "ACR_AGENT: Automated CI/CD Healing"
            )

            # -------------------------------------------------
            # Pull Request body
            # -------------------------------------------------

            body = (
                "## ACR_AGENT Automated Healing\n\n"
                "This Pull Request was generated "
                "automatically by **ACR_AGENT**.\n\n"
                "### Recovery Details\n"
                f"- Team: {self.team_name}\n"
                f"- Team Leader: {self.leader_name}\n"
                f"- Recovery Branch: `{self.branch_name}`\n"
                "- Root-cause analysis: KNN\n"
                "- Code healing: Gemini AI\n"
                "- Verification: Automated pipeline\n\n"
                "### Purpose\n"
                "The CI/CD pipeline detected a failure, "
                "classified the failure using the KNN "
                "failure classifier, generated an automated "
                "repair, and verified the repository again.\n\n"
                "Please review the generated changes before "
                "merging this Pull Request."
            )

            # -------------------------------------------------
            # Check whether an existing PR already exists
            # -------------------------------------------------

            existing_prs = github_repo.get_pulls(
                state="open",
                head=f"{owner}:{self.branch_name}",
                base=default_branch
            )

            for pull_request in existing_prs:

                print(
                    f"[GITHUB] Existing Pull Request found: "
                    f"{pull_request.html_url}"
                )

                return pull_request.html_url

            # -------------------------------------------------
            # Create new PR
            # -------------------------------------------------

            print(
                "[GITHUB] Creating Pull Request..."
            )

            pull_request = (
                github_repo.create_pull(
                    title=title,
                    body=body,
                    head=self.branch_name,
                    base=default_branch
                )
            )

            print(
                "[SUCCESS] Pull Request created:"
            )

            print(
                pull_request.html_url
            )

            return pull_request.html_url

        except GithubException as e:

            raise RuntimeError(
                f"GitHub Pull Request creation failed: "
                f"{e.data if hasattr(e, 'data') else e}"
            )

    # ---------------------------------------------------------
    # MAIN EXECUTION
    # ---------------------------------------------------------

    def execute(self, fixes=None):
        """
        Execute the complete Git operation.

        Returns:
            {
                "status": "SUCCESS",
                "branch": "...",
                "commit": "...",
                "pr_url": "..."
            }
        """

        if fixes is None:
            fixes = []

        print(
            "\n--- [AGENT START]: GitAgent ---"
        )

        try:

            # -------------------------------------------------
            # Validate token
            # -------------------------------------------------

            if not self.github_token:

                return {
                    "status": "FAILED",
                    "error": (
                        "GITHUB_TOKEN is not configured."
                    )
                }

            # -------------------------------------------------
            # Open repository
            # -------------------------------------------------

            repo = self._get_repo()

            # -------------------------------------------------
            # Prepare branch
            # -------------------------------------------------

            self._prepare_branch(
                repo
            )

            # -------------------------------------------------
            # Check changes
            # -------------------------------------------------

            if not self._has_changes(repo):

                print(
                    "[WARN] No repository changes "
                    "were detected."
                )

                return {
                    "status": "FAILED",
                    "error": (
                        "No changes detected after "
                        "healing. Nothing to commit."
                    ),
                    "branch": self.branch_name,
                    "pr_url": None
                }

            # -------------------------------------------------
            # Stage
            # -------------------------------------------------

            self._stage_changes(
                repo
            )

            # -------------------------------------------------
            # Commit
            # -------------------------------------------------

            commit = self._commit_changes(
                repo,
                fixes
            )

            # -------------------------------------------------
            # Push
            # -------------------------------------------------

            self._push_branch(
                repo
            )

            # -------------------------------------------------
            # Pull Request
            # -------------------------------------------------

            pr_url = self._create_pull_request()

            print(
                "--- [AGENT COMPLETED]: GitAgent ---\n"
            )

            return {
                "status": "SUCCESS",
                "branch": self.branch_name,
                "commit": commit.hexsha,
                "pr_url": pr_url,
                "fixes_committed": len(fixes)
            }

        except Exception as e:

            print(
                f"[ERROR] GitAgent failed: {e}"
            )

            return {
                "status": "FAILED",
                "error": str(e),
                "branch": self.branch_name,
                "pr_url": None
            }