# Instructions for Claude

## Pull request review comments

Address review comments by amending the commit that introduced the code being commented on, not
by adding fix-up commits on top. Rewrite the branch so that each commit stays self-contained,
then force-push it with `git push --force-with-lease`. Rebase any branches stacked on it onto the
rewritten branch, and force-push those too.
