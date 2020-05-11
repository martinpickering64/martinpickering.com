---
title: "Committing changes"
date: 2018-01-04T15:49:19Z
summary: "Making history"
draft: false
categories: Software
tags: ["Git", "Git Basics"]

---
*This Post is part of a series about Git, Git concepts, commands and usage patterns 
to remind me and to help me learn. The first post of the series is [Git - A New Years Resolution](../introduction).*

Now that your staging area is set up the way you want it, you can commit your changes. 
Remember that anything that is still unstaged (any files you have created or modified 
that you haven't run `git add` on since you edited them) won't go into this commit. They 
will stay as modified files on your disk. In this case, let's say that the last time you 
ran `git status`, you saw that everything was staged, so you're ready to commit your changes. 
The simplest way to commit is to type:

{{<highlight bash>}}
$ git commit
{{</highlight>}}
 
Doing so launches a Text Editor, which displays the following text:

{{<highlight bash>}}
# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
# On branch master
# Your branch is up-to-date with 'origin/master'.
#
# Changes to be committed:
#	new file:   README
#	modified:   CONTRIBUTING.md
#
{{</highlight>}}
 
You can see that the default commit message contains the latest output of the `git status` 
command commented out and one empty line on top. You can remove these comments and type 
your commit message, or you can leave them there to help you remember what you're committing. 
When you exit the editor, Git creates your commit along with your commit message.

Alternatively, you can type your commit message in-line with the commit command by specifying 
it after a `-m` flag:
 
{{<highlight bash>}}
$ git commit -m "Story: Fix for speed"
[master 463dc4f] Story: Fix for speed
 2 files changed, 2 insertions(+)
 create mode 100644 README
{{</highlight>}}

The commit has now been created and the command output some information about itself; 
which branch you committed to (`master`), what SHA-1 checksum the commit has (`463dc4f`), 
how many files were changed, and statistics about lines added and removed in the commit.

Remember that the commit records the snapshot you set up in your staging area. Anything you didn't 
stage is still sitting there modified; you can do another commit to add it to your history. 
Every time you perform a commit, you're recording a snapshot of your project that you can 
revert to or compare to later.

## Skipping the Staging Area

Although it can be amazingly useful for crafting commits exactly how you want them, the 
staging area is sometimes a bit more complex than you need in your workflow. 
If you want to skip the staging area, Git provides a simple shortcut. 
Adding the `-a` option to the `git commit` command makes Git automatically stage 
every file that is already tracked before doing the commit, letting you skip the `git add` part:

{{<highlight bash>}}
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md

no changes added to commit (use "git add" and/or "git commit -a")
$ git commit -a -m 'added new benchmarks'
[master 83e38c7] added new benchmarks
 1 file changed, 5 insertions(+), 0 deletions(-)
{{</highlight>}}


Notice that the `git add` was not run on the CONTRIBUTING.md file prior to the `git commit`. That's 
because the `-a` flag includes all changed files. This is convenient, but be careful; sometimes 
this flag will cause you to include unwanted changes.

## Removing Files

To remove a file from Git, you have to remove it from your tracked files (more accurately, 
remove it from your staging area) and then commit. The `git rm` command does that, and also 
removes the file from your working directory so you don't see it as an untracked file 
the next time around.

If you simply remove the file from your working directory, it shows up under the 
"Changes not staged for commit" (that is, unstaged) area of your `git status` output:

{{<highlight bash>}}
$ rm PROJECTS.md
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        deleted:    PROJECTS.md

no changes added to commit (use "git add" and/or "git commit -a")
{{</highlight>}} 

Then, if you run `git rm`, it stages the file's removal:

{{<highlight bash>}}
$ git rm PROJECTS.md
rm 'PROJECTS.md'
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    deleted:    PROJECTS.md
{{</highlight>}}
 
The next time you commit, the file will be gone and no longer tracked. If you 
modified the file and added it to the staging area already, you must force the 
removal with the `-f` option. This is a safety feature to prevent accidental removal 
of data that hasn't yet been recorded in a snapshot and that can't be recovered from Git.

Another useful thing you may want to do is to keep the file in your working tree 
but remove it from your staging area. In other words, you may want to keep the 
file on your hard drive but not have Git track it anymore. This is particularly
 useful if you forgot to add something to your `.gitignore` file and accidentally 
staged it, like a large log file or a bunch of `.a` compiled files. Just use the `--cached` option:

{{<highlight bash>}}
$ git rm --cached README
{{</highlight>}}
 
You can pass files, directories, and file-glob patterns to the `git rm` command. 
That means you can do things such as:

{{<highlight bash>}}
$ git rm log/\*.log
{{</highlight>}}
 
Note the backslash (`\`) in front of the `*.` This is necessary because Git does its own 
filename expansion in addition to your shell's filename expansion. This command removes 
all files that have the `.log` extension in the `log/` directory. 

## Moving Files

Unlike many other VCS systems, Git doesn't explicitly track file movement. 
If you rename a file in Git, no metadata is stored in Git that tells it you renamed 
the file. However, Git is pretty smart about figuring that out after the fact. 
Thus it's a bit confusing that Git has a `mv` command. If you want to rename a file in Git, 
you can run something like:

{{<highlight bash>}}
$ git mv file_from file_to
{{</highlight>}}

By looking at the status, you'll see that Git considers it a renamed file:

{{<highlight bash>}}
$ git mv README.md README
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    renamed:    README.md -> README
{{</highlight>}}
 
It is also equivalent to running something like this:

{{<highlight bash>}} 
$ mv README.md README
$ git rm README.md
$ git add README
{{</highlight>}}

Git figures out that it's a rename implicitly, so it doesn't matter if you rename 
a file that way or with the `mv` command. The only real difference is that `git mv` is one 
command instead of three; it's a convenience function. More importantly, you can use any 
tool you like to rename a file, and address the `add/rm` later, before you commit.

