---
title: "Undoing things"
date: 2018-01-07T10:49:19Z
summary: "Oops, how do I get out of that?"
draft: false
categories: ["Software"]
tags: ["Git"]

---

At any stage, you may want to undo something. There are a few basic tools for 
undoing changes that you've made. Be careful, because you can't always undo 
some of these undos. This is one of the few areas in Git where you may lose some 
work if you do it wrong.

One of the common undos takes place when you commit too early and possibly forget 
to add some files, or you mess up your commit message. If you want to redo that 
commit, make the additional changes you forgot, stage them, and commit again using the `--amend` option:

{{<highlight bash>}}
$ git commit --amend
{{</highlight>}}
 
This command takes your staging area and uses it for the commit. If you've made no changes since your 
last commit (for instance, you run this command immediately after your previous commit), then your 
snapshot will look exactly the same, and all you'll change is your commit message. The same 
commit-message editor fires up, but it already contains the message of your previous commit. 
You can edit the message the same as always, but it overwrites your previous commit.

As an example, if you commit and then realize you forgot to stage the changes in a file you 
wanted to add to this commit, you can do something like this:
 
{{<highlight bash>}}
$ git commit -m 'initial commit'
$ git add forgotten_file
$ git commit --amend
{{</highlight>}}

You end up with a single commit; the second commit replaces the results of the first.

## Unstaging a Staged File

The command that you use to determine the state of your staging area also reminds you 
how to undo changes that you've made to the staging area. For example, let's say you've changed 
two files and want to commit them as two separate changes, but you accidentally type `git add *` 
and staged them both. How can you unstage one of the two? The `git status` command will remind you:

{{<highlight bash>}}
$ git add *
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    renamed:    README.md -> README
    modified:   CONTRIBUTING.md
{{</highlight>}}
 
Right below the "Changes to be committed" text, it says `use git reset HEAD <file>... to unstage`.
So, use that advice to unstage the CONTRIBUTING.md file:
 
{{<highlight bash>}}
$ git reset HEAD CONTRIBUTING.md
Unstaged changes after reset:
M	CONTRIBUTING.md
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    renamed:    README.md -> README

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md
{{</highlight>}}

The command is a bit strange, but it works. The CONTRIBUTING.md file is modified but once again unstaged.

## Unmodifying a Modified File

What if you realize that you don't want to keep your changes to the CONTRIBUTING.md file? 

How can you easily unmodify it, i.e. revert it back to what it looked like when you last 
committed (or initially cloned, or however you got it into your working directory)?
 
Again, `git status` tells you how to do that, too. In the last example output, the unstaged area looks like this:

{{<highlight bash>}}
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md
{{</highlight>}}
 
It tells you pretty explicitly how to discard the changes you've made. 
 
{{<highlight bash>}}
$ git checkout -- CONTRIBUTING.md
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    renamed:    README.md -> README
{{</highlight>}}

You can see that the changes have been reverted.
