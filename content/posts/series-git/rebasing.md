---
title: "Rebasing"
date: 2018-01-15T09:49:19Z
summary: "It's a kind of magic."
draft: false
categories: ["Software"]
tags: ["Git"]

---
In Git, there are two main ways to integrate changes from one branch into another: the merge and the rebase. 

## The Basic Rebase

Basic Merging involved you diverging work by making commits on two different branches. The 
easiest way to integrate the branches was via the merge command. It performed a three-way merge 
between the two latest branch snapshots and the most recent common ancestor of the two, creating 
a new snapshot (and commit).
 
{{<figure src="../figure-8.jpg" caption="A divergent history.">}}

{{<figure src="../figure-9.jpg" caption="A basic merge - three-way merge.">}} 

However, there is another way.

You can take the patch of the change that was introduced in one of the branches and reapply 
it on top of the other. In Git, this is called rebasing. With the rebase command, you can take 
all the changes that were committed on one branch and replay them on another one.

{{<highlight bash>}}
$ git checkout experiment
$ git rebase master
First, rewinding head to replay your work on top of it...
Applying: added staged command
{{</highlight>}}
 
It works by going to the common ancestor of the two branches (the one you're on and the one you're 
rebasing onto), getting the diff introduced by each commit of the branch you're on, saving those 
diffs to temporary files, resetting the current branch to the same commit as the branch you are 
rebasing onto, and finally applying each change in turn.
 
{{<figure src="../figure-10.jpg" caption="Rebasing the change introduced in C5 onto C4 creating C5`.">}}

Now, go back to the master branch and do a fast-forward merge.
 
{{<highlight bash>}}
$ git checkout master
$ git merge experiment
Fast-forwarding the master branch.
{{</highlight>}}

{{<figure src="../figure-11.jpg" caption="Fast-forwarding the master branch.">}} 

Now, the snapshot pointed to by C5' is exactly the same as the one that was pointed to by 
C6 in the merge example. There is no difference in the end product of the integration, 
but rebasing can be seen as making a cleaner history. If you examine the log of a 
rebased branch, it looks like a linear history: it appears that all the work happened in 
series; even when it originally happened in parallel.

Often, you'll do this to make sure your commits apply cleanly on a remote branch. Perhaps 
in a project to which you're trying to contribute but that you don't maintain. In this 
case, you'd do your work in a branch and then rebase your work onto `origin/master` when 
you were ready to submit your patches to the main project. That way, the maintainer doesn't 
have to do any integration work, just a fast-forward or a clean apply.

Note that the snapshot pointed to by the final commit you end up with, whether it's the last 
of the rebased commits for a rebase or the final merge commit after a merge, is the same 
snapshot – it's only the history that is different. Rebasing replays changes from one 
line of work onto another in the order they were introduced, whereas merging takes the 
endpoints and merges them together.

## The Perils of Rebasing

Rebasing isn't without its drawbacks, which can be summed up in a single line:

> Do not rebase commits that exist outside your repository.

If you follow that guideline, it will all be fine. If you don't, people will hate you, and you'll 
be scorned by friends and family.

When you rebase stuff, you're abandoning existing commits and creating new ones that 
are similar but different. If you push commits somewhere and others pull them down and 
base work on them, and then you rewrite those commits with `git rebase` and push them up again, 
your collaborators will have to re-merge their work and things will get messy when you try to 
pull their work back into yours.

## Rebase vs. Merge

Is rebasing better than merging?

One point of view on this is that your repository's commit history is a record of 
what actually happened. It's a historical document, valuable in its own right, 
and shouldn't be tampered with. From this angle, changing the commit history 
is almost blasphemous; you're lying about what actually transpired. So, what if there 
was a messy series of merge commits? That's how it happened, and the repository should preserve that 
for posterity.

The opposing point of view is that the commit history is the story of how your 
project was made. You wouldn't publish the first draft of a book, and the manual for how 
to maintain your software deserves careful editing. This is the camp that uses tools 
like rebase and filter-branch to tell the story in the way that’s best for future readers.

Now, to the question of whether merging or rebasing is better: hopefully you'll see 
that it's not that simple. Git is a powerful tool and allows you to do many things 
to and with your history, but every team and every project is different. Now 
that you know how both of these things work, it's up to you to decide which one is best 
for your particular situation.

In general, the way to get the best of both worlds is to rebase local changes you've made 
but haven't shared yet before you push them in order to clean up your story, but never 
rebase anything you've pushed somewhere.

