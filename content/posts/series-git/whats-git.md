---
title: "What is Git?"
date: 2018-01-04T10:49:19Z
draft: false
summary: "And is it GIT, Git or git?"
categories: ["Software"]
tags: ["GIT"]

---
# What is Git?

Quoting [git-scm.com](https://git-scm.com/)...

Git is a distributed version control system designed to handle small 
through to very large projects with speed and efficiency. Git is 
easy to learn and has a tiny footprint with lightning fast 
performance. It outclasses SCM tools like Subversion, CVS, 
Perforce, and ClearCase with features like cheap local branching, convenient 
staging areas, and multiple workflows.

## Small and Fast

Git is fast. 

Nearly all of Git's operations are performed locally, giving it a huge speed 
advantage over centralized systems that constantly communicate with a server somewhere.

Git was built to support work on the Linux Kernel; meaning that it has 
had to effectively handle large repositories from day one. Speed and performance 
has been a primary design goal of the Git from the start.

## Distributed

One of the nicest features of Git is that it's distributed. A Distributed Source 
Code Management System requires that instead of doing a "checkout" of the 
current tip of the source code, that you do a "clone" of the entire repository.

This means that every user essentially has a full backup of the main server. Each of 
these copies could be pushed up to replace the main server in the event of a crash or 
corruption. In effect, there is no single point of failure with Git unless there is 
only a single copy of the repository.

Because of Git's distributed nature and superb branching system, an almost endless number of 
code management workflows can be implemented with relative ease.

- CVS Workflow: A centralized workflow is very common, especially from people transitioning from a centralized version control system such as Subversion or TFS. Git will not allow you to push if someone has pushed since the last time you fetched, so a centralized model where all developers push to the same server works just fine.
- Integration Manager Workflow: Another common Git workflow involves an Integration Manager; a single person who commits to the 'blessed' repository. A number of developers then clone from that repository, push to their own independent repositories, and ask the integrator to pull in their changes. This is the type of development model often seen with open source repositories.
- Dictator and Lieutenants Workflow: For more massive projects, a development workflow like that of the Linux kernel is often effective. In this model, some people ('lieutenants') are in charge of a specific subsystem of the project and they merge in all changes related to that subsystem. Another integrator (the 'dictator') can pull changes from only his/her lieutenants and then push to the 'blessed' repository that everyone then clones from again.

## Data Assurance

The data model that Git uses ensures the cryptographic integrity of every bit of a project. Every file and commit is subject to a checksum, and retrieved by its checksum when checked back out. It's impossible to get anything out of Git other than the exact bits you put in.

It is also impossible to change any file, date, commit message, or any other data in a Git repository without changing the IDs of everything after it. This means that if you have a commit ID, you can be assured not only that your project is exactly the same as when it was committed, but that nothing in its history was changed.

## Staging Area

Unlike the other systems, Git has something called the "staging area" or "index". This is a local, intermediate area where commits can be formatted and reviewed before completing the commit.

This means, for example, that it's possible to quickly stage some of your files and commit them without committing all of the other modified files in your working.

## Branching and Merging

The Git feature that really makes it stand apart from nearly every other SCM out there is its branching model. Git allows and encourages the use of multiple local branches that can be entirely independent of each other. The creation, merging, and deletion of those lines of development takes seconds.

This means that you can do things like:

- Frictionless Context Switching: Create a branch to try out an idea, commit a few times, switch back to where you branched from, apply a patch, switch back to where you are experimenting, and merge it in.
- Role-Based Code lines: Have a branch that always contains only what goes to production, another that you merge work into for testing, and several smaller ones for day to day work.
- Feature Based Workflow: Create new branches for each new feature you're working on so you can seamlessly switch back and forth between them, then delete each branch when that feature gets merged into your main line.
- Disposable Experimentation: Create a branch to experiment in, realize it's not going to work, and just delete it, abandoning the work, with nobody else ever seeing it (even if you've pushed other branches in the meantime).

Notably, when you push to a remote repository, you do not have to push all of your branches. You can choose to share just one of your branches, a few of them, or all of them. This tends to free people to try new ideas without worrying about having to plan how and when they are going to merge it in or share it with others.

There are ways to accomplish some of this with other systems, but the work involved is much more difficult and error-prone. Git makes this process incredibly easy and it changes the way most developers work when they learn it.

# Is it GIT, Git or git?

Based soley on an interpretation of what I see on the Git's [home website](https://git-scm.com/) it is both Git and git.

"Git" is used in documentation and "git" tends to be used in graphices, logos and places where the impression 
to be conveyed is something is _hip_, _cool_ or _on point_. 

Glad I've got that straight.
