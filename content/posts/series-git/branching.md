---
title: "Branching"
date: 2018-01-11T11:49:19Z
summary: "How to diverge from the main line."
draft: false
categories: Software
tags: ["Git", "Git Basics"]

---
*This Post is part of a series about Git, Git concepts, commands and usage patterns 
to remind me and to help me learn. The first post of the series is [Git - A New Years Resolution](../introduction).*

Nearly every VCS has some form of branching support. Branching means you diverge from the main line 
of development and continue to do work without messing with that main line. In many VCS tools, this 
is a realtively expensive process, often requiring the creation of a new copy of your source code 
directory, which can take a long time for large projects. Some refer to Git's branching model as 
its "killer feature", and it certainly sets Git apart in the VCS community. 

The way Git branches is incredibly lightweight, making branching operations nearly instantaneous, 
and switching back and forth between branches generally just as fast. Unlike many other 
VCSs, Git encourages workflows that branch and merge often, even multiple times in a day. 
Understanding and mastering this feature gives you a powerful and unique tool and can entirely 
change the way that you develop.

Thorough understanding of Git Branching requires a clear picture as to how Git stores its data. 
Git doesn't store data as a series of change sets or differences, but instead as a series of 
snapshots. When you make a commit, Git stores a commit object that contains a pointer to the 
snapshot of the content being staged. This object also contains the author's name and email, 
the commit message, and pointers to the commit or commits that directly came before this commit 
(its parent or parents):

- zero parents for the initial commit
- one parent for a normal commit
- multiple parents for a commit that results from a merge of two or more branches

To visualize this, let's assume that you have a directory containing three files, and you stage 
them all and commit. Staging the files computes a checksum for each one, stores that version of 
the file in the Git repository (Git refers to them as blobs), and adds that checksum to the staging area.

When you create the commit by running git commit, Git checksums each subdirectory and stores 
those tree objects in the Git repository. Git then creates a commit object that has the metadata 
and a pointer to the root project tree so it can re-create that snapshot when needed.

The Git repository now contains several objects: one blob for the contents of each of the files 
in the commit, one tree that lists the contents of the directory and specifies which file names 
are stored as which blobs, and one commit with the pointer to that root tree and all the commit 
metadata.

If you make some changes and commit again, the next commit will additionally store a pointer 
to the commit that came immediately before it.

A branch in Git is simply a lightweight movable pointer to one of these commits. The default 
branch name in Git is `master`. As you start making commits, you're given a master branch that 
points to the last commit you made. Every time you commit, it moves forward automatically.
