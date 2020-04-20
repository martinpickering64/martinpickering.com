---
title: "Remote Branches"
date: 2018-01-15T09:49:19Z
summary: "When you're not an island."
draft: false
categories: ["Software"]
tags: ["Git"]

---
Remote references are references (pointers) in remote repositories, including branches, tags, 
and so on. You can get a full list of remote references explicitly with `git ls-remote [remote]`, 
or `git remote show [remote]` for remote branches as well as more information. Nevertheless, a more 
common way is to take advantage of remote-tracking branches.

Remote-tracking branches are references to the state of remote branches. They're local references 
that you can't move; Git moves them for you whenever you do any network communication, to make 
sure they accurately represent the state of the remote repository. Think of them as bookmarks, 
to remind you where the branches in your remote repositories were the last time you connected to them.

Remote-tracking branches take the form `<remote>/<branch>`. For instance, if you wanted to see 
what the master branch on your origin remote looked like as of the last time you communicated 
with it, you would check the `origin/master` branch. If you were working on an issue with a 
partner and they pushed up an `iss53` branch, you might have your own local `iss53` branch, but 
the branch on the server would be represented by the remote-tracking branch `origin/iss53`.

Let's say you have a Git server on your network at `git.maginus.com`. If you clone from this, 
Git's clone command automatically names it origin  for you, pulls down all its data, creates 
a pointer to where its master branch is, and names it `origin/master` locally. Git also gives 
you your own local master branch starting at the same place as origin's master branch, so you 
have something to work from.
 
{{<figure src="../figure-5.jpg" caption="Server and local repositories after cloning.">}}

If you do some work on your local master branch, and, in the meantime, someone else 
pushes to `git.maginus.com` and updates its master branch, then your histories move 
forward differently. Also, as long as you stay out of contact with your origin server, 
your `origin/master` pointer doesn’t move.

{{<figure src="../figure-6.jpg" caption="Local and remote work create divergence.">}}

To synchronize your work, you run a `git fetch origin` command. This command looks up which 
server origin is (in this case, it's `git.maginus.com`), fetches any data from it that you 
don't yet have, and updates your local database, moving your `origin/master` pointer to its 
new, more up-to-date position.

{{<figure src="../figure-7.jpg" caption="'git fetch' updates your remote references.">}}

## Pushing

When you want to share a branch with the world, you need to push it up to a remote that you 
have write access to. Your local branches aren't automatically synchronized to the remotes you 
write to; you have to explicitly push the branches you want to share. That way, you can use 
private branches for work you don't want to share, and push up only the topic branches you want to collaborate on.

If you have a branch named serverfix that you want to work on with others, you can push it 
up to the server by running `git push <remote> <branch>`:
 
{{<highlight bash>}}
$ git push origin serverfix
Counting objects: 24, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (15/15), done.
Writing objects: 100% (24/24), 1.91 KiB | 0 bytes/s, done.
Total 24 (delta 2), reused 0 (delta 0)
To https://github.com/schacon/simplegit
 * [new branch]      serverfix -> serverfix
{{</highlight>}}

Git automatically expands the serverfix branch name out to `refs/heads/serverfix:refs/heads/serverfix`, 
which means, _Take my serverfix local branch and push it to update the remote's serverfix branch_. 
You can also do `git push origin serverfix:serverfix`, which does the same thing; it says, _Take my 
serverfix and make it the remote's serverfix_. You can use this format to push a local branch into a 
remote branch that is named differently. If you didn't want it to be called `serverfix` on the remote, you 
could instead run `git push origin serverfix:awesomebranch` to push your local `serverfix` branch 
to the `awesomebranch` branch on the remote project.

The next time one of your collaborators fetches from the server, they will get a reference to where 
the server's version of `serverfix` is under the remote branch `origin/serverfix`:

{{<highlight bash>}}
$ git fetch origin
remote: Counting objects: 7, done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 3 (delta 0), reused 3 (delta 0)
Unpacking objects: 100% (3/3), done.
From https://github.com/schacon/simplegit
 * [new branch]      serverfix    -> origin/serverfix
{{</highlight>}}
 
It's important to note that when you do a fetch that brings down new remote-tracking branches, 
you don't automatically have local, editable copies of them. In other words, you don't have a 
new `serverfix` branch; you only have an `origin/serverfix` pointer that you can't modify.

To merge this work into your current working branch, you can run `git merge origin/serverfix`. If 
you want your own `serverfix` branch that you can work on, you can base it 
off your remote-tracking branch:

{{<highlight bash>}}
$ git checkout -b serverfix origin/serverfix
Branch serverfix set up to track remote branch serverfix from origin.
Switched to a new branch 'serverfix'
{{</highlight>}}
 
This gives you a local branch that you can work on that starts where `origin/serverfix` is.

## Tracking Branches

Checking out a local branch from a remote-tracking branch automatically creates what is 
called a _tracking branch_ (and the branch it tracks is called an _upstream branch_, as such the tracking 
branch is sometime referred to as the _downstream branch_). 

Tracking branches are local branches that have a direct relationship to a remote branch. If you're 
on a tracking branch and type `git pull`, Git automatically knows which server to fetch from 
and branch to merge into.

When you clone a repository, it generally automatically creates a master branch that tracks `origin/master`. 
However, you can set up other tracking branches if you wish, ones that track branches on other remotes, 
or don't track the master branch. The simple case is the example you just saw, running `git 
checkout -b <branch> <remote>/<branch>`. This is a common enough operation that Git provides the --track shorthand:

{{<highlight bash>}}
$ git checkout --track origin/serverfix
Branch serverfix set up to track remote branch serverfix from origin.
Switched to a new branch 'serverfix'
{{</highlight>}}
 
In fact, this is so common that there's even a shortcut for that shortcut. If the branch name you're 
trying to checkout (a) doesn't exist and (b) exactly matches a name on only one remote, Git will create a 
tracking branch for you:

{{<highlight bash>}}
$ git checkout serverfix
Branch serverfix set up to track remote branch serverfix from origin.
Switched to a new branch 'serverfix'
{{</highlight>}} 
 
If you already have a local branch and want to set it to a remote branch you just pulled down, or 
want to change the upstream branch you're tracking, you can use the -u or --set-upstream-to option 
to git branch to explicitly set it at any time.

{{<highlight bash>}}
$ git branch -u origin/serverfix
Branch serverfix set up to track remote branch serverfix from origin.
{{</highlight>}}

## Pulling

The git fetch command will fetch down all the changes on the server that you don't have yet, 
it will not modify your working directory at all. It will simply get the data for you and 
let you merge it yourself. However, there is a command called `git pull` which is essentially a `git fetch` 
immediately followed by a `git merge` in most cases. 

Generally it's better to simply use the `git fetch` and `git merge` commands explicitly as the 
magic of `git pull` can often be confusing.

## Deleting Remote Branches

When you're done with a remote branch, you delete the remote branch using the --delete option to `git push`. 
If you want to delete your serverfix branch from the server, you run the following:
 
{{<highlight bash>}}
$ git push origin --delete serverfix
To https://github.com/schacon/simplegit
 - [deleted]         serverfix
{{</highlight>}}
 
Basically all this does is remove the pointer from the server. The Git server will generally 
keep the data there for a while until a garbage collection runs, so if it was accidentally deleted, it's 
often easy to recover.

