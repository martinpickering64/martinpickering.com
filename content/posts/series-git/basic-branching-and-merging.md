---
title: "Basic Branching and Merging"
date: 2018-01-12T13:49:19Z
summary: "Foundational concepts and commands."
draft: false
categories: Software
tags: ["Git"]

---
A simple example of branching and merging with a workflow that you might use in the real world can be illustrated as:

1.	Do some work on a website.
2.	Create a branch for a new story you're working on.
3.	Do some work in that branch.

At this stage, you receive a call that another issue is critical and you need to create a hotfix:

1.	Switch to your production branch.
2.	Create a branch to add the hotfix.
3.	After it's tested, merge the hotfix branch, and push to production.
4.	Switch back to your original story and continue working.

## Basic Branching

First, let's say you're working on your project and have a couple of commits already on the master branch.

You've decided that you're going to work on issue #53. To create a new branch and switch to it at the 
same time, you run the `git checkout` command with the -b switch:
 
{{<highlight bash>}}
$ git checkout -b iss53
Switched to a new branch "iss53"
{{</highlight>}}
 
You work on your project and do some commits. By doing so the iss53 branch moves forward, because you 
have it checked out (it is where your HEAD is pointing to).

Now you get a call that there is a new issue with the deployed project, and it needs a fix 
immediately. With Git, you don't have to deploy your new fix along with the iss53 changes you've 
already made, nor do you have revert your iss53 changes before you can work on applying your fix 
to what is in production. 

All you have to do is switch back to your master branch.

However, before you do that, note that if your working directory or staging area has uncommitted 
changes that conflict with the branch you're checking out, Git won't let you switch branches. It's 
always best to have a clean working state prior to switching branches. Git has a command called `git stash` 
to temporarily "stash" the state of your current working area prior to switching using `git checkout`. 
This example assumes you've committed all your changes on branch iss53, so you can cleanly switch back 
to your master branch:
 
{{<highlight bash>}}
$ git checkout master
Switched to branch "master"
{{</highlight>}}
 
At this point, your project working directory is exactly the way it was before you started working 
on issue #53, and you can concentrate on your hotfix. This is an important point to remember: when you 
switch branches, Git resets your working directory to look like it did the last time you committed on 
that branch. It adds, removes, and modifies files automatically to make sure your working copy is what 
the branch looked like on your last commit to it.

Next, you have a hotfix to make. Create a hotfix branch on which to work until it's completed:
 
{{<highlight bash>}}
$ git checkout -b hotfix
Switched to a new branch "hotfix"
$ vim index.html
$ git commit -a -m 'fixed the broken email address'
[hotfix 1fb7853] fixed the broken email address
 1 file changed, 2 insertions(+)
{{</highlight>}}
 
You can run your tests, make sure the hotfix is what you want, and finally merge the hotfix 
branch back into your master branch ready to deploy to production. You do this with the `git merge` command:
 
{{<highlight bash>}}
$ git checkout master
$ git merge hotfix
Updating f42c576..3a0874c
Fast-forward
 index.html | 2 ++
 1 file changed, 2 insertions(+)
{{</highlight>}}
 
Note the "fast-forward" in the merge command output. Because the commit pointed to by the 
branch hotfix you merged in was directly ahead of the most recent commit on master, Git simply moves 
the pointer forward. To phrase that another way, when you try to merge one commit with a commit that 
can be reached by following the first commit's history, Git simplifies things by moving the pointer forward 
because there is no divergent work to merge together; this is called a "fast-forward".

Your change is now in the snapshot of the commit pointed to by the master branch, and you can deploy the fix.

After the hotfix is deployed, you're ready to switch back to the work you were doing before you 
were interrupted. However, first delete the hotfix branch, because it is no longer required 
(the master branch points at the same place). You can delete it with the -d option to git branch:
 
{{<highlight bash>}}
$ git branch -d hotfix
Deleted branch hotfix (3a0874c).
{{</highlight>}}
 
Now you can switch back to your work-in-progress branch on issue #53 and continue working on it.
 
{{<highlight bash>}}
$ git checkout iss53
Switched to branch "iss53"
$ vim index.html
$ git commit -a -m 'finished the new footer [issue 53]'
[iss53 ad82d7a] finished the new footer [issue 53]
1 file changed, 1 insertion(+)
{{</highlight>}}
 
It's worth noting here that the work you did in your hotfix branch is not contained in the 
files in your iss53 branch. If you need to pull it in, you can merge your master branch into your iss53 
branch by running git merge master, or you can wait to integrate those changes until you decide to 
pull the iss53 branch back into master later.

## Basic Merging

Now that the issue #53 work is complete and ready to be merged into your master branch. In order to 
do that, you'll merge your iss53 branch into master, much like you merged your hotfix branch 
earlier. All you have to do is check out the branch you wish to merge into and then run the git merge command:
 
{{<highlight bash>}}
$ git checkout master
Switched to branch 'master'
$ git merge iss53
Merge made by the 'recursive' strategy.
index.html |    1 +
1 file changed, 1 insertion(+)
{{</highlight>}}
 
This looks a bit different to the hotfix merge done earlier. In this case, the development history 
has diverged from some older point. Because the commit on the iss53 branch you're on isn't a direct 
ancestor of the master branch you’re merging in, Git has to do some work. In this case, Git does a 
simple three-way merge, using the two snapshots pointed to by the branch tips 
and the common ancestor of the two.

Instead of just moving the branch pointer forward, Git creates a new snapshot that results 
from this three-way merge and automatically creates a new commit that points to it. This 
is referred to as a merge commit, and is special in that it has more than one parent.

It's worth pointing out that Git determines the best common ancestor to use for its 
merge base. This makes merging a heck of a lot easier in Git than in these other systems.

Now that your work is merged in, you have no further need for the iss53 branch. You can close the 
ticket in your ticket-tracking system, and delete the branch.

## Basic Merge Conflicts

Occasionally, this process doesn't go smoothly. If you changed the same part of the same 
file differently in the two branches you’re merging together, Git won't be able to merge them 
cleanly. If your fix for issue #53 modified the same part of a file as the hotfix branch, you'll 
get a merge conflict that looks something like this:
 
{{<highlight bash>}}
$ git merge iss53
Auto-merging index.html
CONFLICT (content): Merge conflict in index.html
Automatic merge failed; fix conflicts and then commit the result.
{{</highlight>}}
 
Git hasn’t automatically created a new merge commit. It has paused the process while you resolve 
the conflict. If you want to see which files are unmerged at any point after a merge conflict, 
you can run `git status`:
 
{{<highlight bash>}}
$ git status
On branch master
You have unmerged paths.
  (fix conflicts and run "git commit")

Unmerged paths:
  (use "git add <file>..." to mark resolution)

    both modified:      index.html

no changes added to commit (use "git add" and/or "git commit -a")
{{</highlight>}}
 
Anything that has merge conflicts and hasn't been resolved is listed as unmerged. Git adds standard 
conflict-resolution markers to the files that have conflicts, so you can open them 
manually and resolve those conflicts. 

After you've resolved the conflicts in each conflicted file, run `git add` on each file to 
mark it as resolved. Staging the file marks it as resolved in Git.

If you want to use a graphical tool to resolve these issues, you can run git mergetool, 
which fires up an appropriate visual merge tool and walks you through the conflicts. 
After you exit the merge tool, Git asks you if the merge was successful. If you tell the script 
that it was, it stages the file to mark it as resolved for you. You can run `git status` 
again to verify that all conflicts have been resolved:
 
{{<highlight bash>}}
$ git status
On branch master
All conflicts fixed but you are still merging.
  (use "git commit" to conclude merge)

Changes to be committed:

    modified:   index.html
{{</highlight>}}
 
If you're happy with that, and you verify that everything that had conflicts has been staged, 
you can type git commit to finalize the merge commit. 
