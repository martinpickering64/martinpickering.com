---
title: "Recording changes to the Repository"
date: 2018-01-04T14:49:19Z
summary: "Let's get some work done."
draft: false
categories: ["Software"]
tags: ["GIT"]

---

Once you have a Git repository on your local machine, and a checkout or working copy of all 
of its files in front of you. You'll want to start making changes and committing snapshots 
of those changes into your repository each time the project reaches a state you want to record.

Remember that each file in your working directory can be in one of two states: tracked or untracked.

- Tracked files are files that were in the last snapshot; they can be unmodified, modified, 
  or staged. In short, tracked files are files that Git knows about.
- Untracked files are everything else. Any files in your working directory that were not 
  in your last snapshot and are not in your staging area. 

When you first clone a repository, all of your files will be tracked and unmodified 
because Git just checked them out and you haven't edited anything.

As you edit files, Git sees them as modified, because you've changed them since 
your last commit. As you work, you selectively stage these modified files and then 
commit all those staged changes, and the cycle repeats.

## Checking the Status of Your Files

The main tool you use to determine which files are in which state is the git status 
command. If you run this command directly after a clone, you should see something like this:

{{<highlight bash>}}
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
nothing to commit, working directory clean
{{</highlight>}}
 
This means you have a clean working directory; in other words, none of your tracked 
files are modified. Git also doesn't see any untracked files, or they would be listed 
here. Finally, the command tells you which branch you're on and informs you that it 
has not diverged from the same branch on the Server (known as origin). 

Let's say you add a new file to your project, a simple README file. If the file didn't 
exist before, and you run git status, you see your untracked file like so:

{{<highlight bash>}}
$ echo 'My Project' > README
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Untracked files:
  (use "git add <file>..." to include in what will be committed)

    README

nothing added to commit but untracked files present (use "git add" to track)
{{</highlight>}}
 
You can see that your new README file is untracked, because it's under the "Untracked files" 
heading in your status output. Untracked basically means that Git sees a file you 
didn't have in the previous snapshot (commit); Git won't start including it in your commit 
snapshots until you explicitly tell it to do so. It does this so you don't accidentally 
begin including generated binary files or other files that you did not mean to 
include. As you do want to start including README, you need to start tracking the file.

## Tracking New Files

In order to begin tracking a new file, you use the command git add. To begin tracking the 
README file, you can run this:

{{<highlight bash>}}
$ git add README
{{</highlight>}}
 
If you run your status command again, you can see that your README file is now 
tracked and staged to be committed:

{{<highlight bash>}}
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    new file:   README
{{</highlight>}}

You can tell that it's staged because it's under the "Changes to be committed" heading. If you 
commit at this point, the version 
of the file at the time you ran `git add` is what will be in the historical snapshot. 
You may recall that when you ran `git init` earlier, you then ran `git add <files>` to begin 
tracking files in your directory. The `git add` command takes a path name for either a 
file or a directory; if it's a directory, the command adds all the files in that directory recursively.

## Staging Modified Files

Let's change a file that was already tracked. If you change a previously tracked file called 
CONTRIBUTING.md and then run your git status command again, you get something that looks like this:

{{<highlight bash>}}
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    new file:   README

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md
{{</highlight>}}
 
The CONTRIBUTING.md file appears under a section named "Changes not staged for commit" - which 
means that a file that is tracked has been modified in the working directory but not yet 
staged. To stage it, you run the `git add` command. `git add` is a multipurpose command, 
you use it to begin tracking new files, to stage files, and to do other things like 
marking merge-conflicted files as resolved. It may be helpful to think of it more as 
"add precisely this content to the next commit" rather than "add this file to the project". 
Let's run `git add` now to stage the CONTRIBUTING.md file, and then run `git status` again:

{{<highlight bash>}}
$ git add CONTRIBUTING.md
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    new file:   README
    modified:   CONTRIBUTING.md
{{</highlight>}}
 
Both files are staged and will go into your next commit. At this point, suppose you 
remember one little change that you want to make in CONTRIBUTING.md before you 
commit it. You open it again and make that change, and you're ready to commit. 
However, let's run `git status` one more time:

{{<highlight bash>}}
$ vim CONTRIBUTING.md
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    new file:   README
    modified:   CONTRIBUTING.md

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md
{{</highlight>}}
 
Now CONTRIBUTING.md is listed as both staged and unstaged. 

How is that possible? 

It turns out that Git stages a file exactly as it is when you run the `git add` command. 
If you commit now, the version of CONTRIBUTING.md as it was when you last ran the `git add` 
command is how it will go into the commit, not the version of the file as it 
looks in your working directory when you run `git commit`. If you modify a file after 
you run `git add`, you have to run git add again to stage the latest version of the file:

{{<highlight bash>}}
$ git add CONTRIBUTING.md
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    new file:   README
    modified:   CONTRIBUTING.md
{{</highlight>}}
 
## Ignoring Files

Sometimes there are classes of files that you don't want Git to automatically 
add or even show you as being untracked. These are generally automatically generated 
files such as log files or files produced by your build system. In such cases, you 
can create a file listing patterns to match them named `.gitignore`. Here is an 
example `.gitignore` file:

{{<highlight bash>}} 
$ cat .gitignore
*.[oa]
*~
{{</highlight>}}

The first line tells Git to ignore any files ending in ".o" or ".a"; object and archive 
files that may be the product of building your code. The second line tells Git to 
ignore all files whose names end with a tilde (~), which is used by many text 
editors such as Emacs to mark temporary files. You may also include a log, tmp or 
directory; automatically generated documentation; and so on. Setting up a `.gitignore` 
file for your new repository before you get going is generally a good idea so you don't 
accidentally commit files that you really don't want in your Git repository.

The rules for the patterns you can put in the `.gitignore` file are as follows:

- Blank lines or lines starting with # are ignored
- Standard glob patterns work, and will be applied recursively throughout the entire working tree
- You can start patterns with a forward slash (/) to avoid recursion
- You can end patterns with a forward slash (/) to specify a directory
- You can negate a pattern by starting it with an exclamation point (!)

### What's a Glob Pattern?

Glob Patterns are like simplified regular expressions that shells use. 

- An asterisk (*) matches zero or more characters; 
- `[abc]` matches any character inside the brackets (in this case a, b, or c); 
- a question mark (?) matches a single character; 
- and square brackets enclosing characters separated by a hyphen (`[0-9]`) matches any 
  character between them (in this case 0 through 9). 

You can also use two asterisks to match nested directories; `a/**/z` would match a/z, a/b/z, a/b/c/z, and so on.

## Viewing the Staged and Unstaged Changes

If the git status command output is too vague for your purposes (i.e. you 
want to know exactly what has changed, not just which files were changed), then 
use the `git diff` command. `git diff` shows you the exact lines added and removed
(known as the patch).
