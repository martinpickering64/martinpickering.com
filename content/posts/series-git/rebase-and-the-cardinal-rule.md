---
title: "The Cardinal Rule about Git Rebase"
date: 2020-05-11T10:49:19Z
draft: false
summary: "And why should you care..."
categories: "Software"
tags: ["Git", "Git Basics"]

---
*This Post is part of a series about Git, Git concepts, commands and usage patterns 
to remind me and to help me learn. The first post of the series is [Git - A New Years Resolution](../introduction).*

> "Never `git rebase` a Shared Branch" is the often quoted rebasing guidance

But what does it mean and why is this a consideration?

## What is a Shared Branch?

A Shared Branch is a branch that exists on a remote repository that is accessible to 
others and as such could be 'pulled' and used to base further work upon.

## A quick review of `git rebase`

For many (_and for me_), a `git rebase` looks like the diagram below.

{{<figure src="../rebase-1.jpg">}}

Conceptually, it appears as though the whole `feature` branch has been unplugged from its original position
on `develop` and moved to be based upon the `head` of `develop`; or, to put it another way 
that all the commits from the 
`feature` branch have been re-applied to the tip of the `develop` branch.

Note my use of the word 'reapply', not 'move' or 'cut & paste'. Git has taken each of the original commits
on the `feature` branch in sequence, and has re-applied them to the destination [_of the rebase command_]. 
The implications of which are:

1. These are new commits. They are not the original commits simply moved elsewhere
2. The original commits still exist [_somewhere in Git_] and have not been destroyed; although they are now
   quite hard to find

The following diagram is perhaps a more accurate picture of what has actually happened due 
to a `git rebase` command, where commits _E_ and _F_ still exist but are all but hidden from view:

{{<figure src="../rebase-2.jpg">}}

The changes represented by commits _E_ and _F_ have been re-applied to create the new _E'_ and _F'_ commits.

## Guidance is great, but knowledge is better

Let's illustrate why the Rebase Cardinal Rule exists by exploring some of the consequences 
of ignoring it.

Richard and Martin are working on the same Product and have both just resynchronised their local 
workspaces with the Azure DevOps hosted Repository. Their stuff looks similar to:

{{<figure src="../rebase-3.jpg">}}

Martin rebases the `F100` branch on `develop`; thereby, breaking the Cardinal Rule. Meanwhile Richard 
continues his work on `F100` and adds a new commit.

{{<figure src="../rebase-4.jpg">}}

Martin, proud of what he has achieved, decides that he should share the fruits of his labours, but 
is disappointed to receive a rejection from Git.

{{<highlight bash>}}
Martin (F100)$ git push
To https://dev.azure.com/bedroom-software/mega-product.git
 ! [rejected]    F100 -> F100 (non-fast-forward)
error: failed to push some refs to 'https://dev.azure.com/bedroom-software/mega-product.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.
hint: 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push -- help' for details.
{{</highlight>}}

Usually when Martin pushes his work back to the remote, Git performs a fast-forward merge of his local 
changes into the remote's copy. As Git cannot perform a fast-forward merge under these circumstances Git 
refuses to comply with Martin's wishes. Git is trying its hardest to protect Martin from himself.

So, Martin hits the Git Documentation and finds that a solution to his dilemma is to use `git push --force`.
By forcing the situation, Martin has instructed the remote to not attempt a fast-forward merge. Instead the 
remote will erase its version of `F100` in favour of Martin's version, to end up with...

{{<figure src="../rebase-5.jpg">}}

Now, the unfortunate Richard also wishes to share his work on `F100` by pushing back to the remote.


{{<highlight bash>}}
Richard (F100)$ git push
To https://dev.azure.com/bedroom-software/mega-product.git
 ! [rejected]    F100 -> F100 (non-fast-forward)
error: failed to push some refs to 'https://dev.azure.com/bedroom-software/mega-product.git'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing
hint: to the same ref. You may want to first integrate the remote changes
hint: (e.g. 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push -- help' for details.
{{</highlight>}}


Richard's attempt to `git push` has been rejected. However, the message justifying why the refusal occurred
is not all that alarming. It has a fairly straight forward explanantion. Richard's version of `F100` 
is not in sync with the remote because it has been updated by somebody else. Git tries to help Richard by advising
him to re-synchronise by using a `git pull`. This causes a merge to occur in Richard's workspace of his version 
of `F100` with the remote's version. The outcome of the merge for Richard's local copy is:

{{<figure src="../rebase-6.jpg">}}

Having achieved a successful merge, Richard is now able to push his work back to the remote and sign-off 
for the day, happy with his achievements.

However, come the next team meeting and a quick review of the Azure Devops Repository and everybody is alarmed
and confused as to what has happened and how such a messy history has been created. That's when Martin remembers
the Cardinal Rule for Git Rebase, makes his confession, puts on the dunce's hat and buys everybody 
conciliatory doughnuts.

At least only two people's work was involved in the SNAFU. Breaking the Cardinal Rule when more parties 
are involved gets exponentially worse and the mess becomes a real horror show. When that happens, doughnuts 
are not nearly enough to restore team love.
