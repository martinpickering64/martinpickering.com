---
title: "Working with Remotes"
date: 2018-01-10T10:49:19Z
summary: "No man is an island."
draft: false
categories: "Software"
tags: ["Git", "Git Basics"]

---
*This Post is part of a series about Git, Git concepts, commands and usage patterns 
to remind me and to help me learn. The first post of the series is [Git - A New Years Resolution](../introduction).*

To be able to collaborate on any Git project, you need to know how to manage your remote repositories. 
Remote repositories are versions of your project that are hosted elsewhere (i.e. on the Internet or 
network somewhere). There can be several of them, each of which generally is either read-only or 
read/write for you. Team collaboration involves managing these remote repositories and pushing and 
pulling data to and from them when you need to share work. Managing remote repositories includes 
knowing how to add remote repositories, remove remotes that are no longer valid, manage various 
remote branches and define them as being tracked or not, and more. 

## Showing Your Remotes

To see which remote servers you have configured, you can run the git remote command. It lists 
the short names of each remote handle you've specified. If you've cloned your repository, you should 
at least see `origin` (origin is the default name Git gives to the server you cloned from).

{{<highlight bash>}}
$ git clone https://github.com/martinp/myGit
Cloning into 'myGit'...
remote: Reusing existing pack: 1857, done.
remote: Total 1857 (delta 0), reused 0 (delta 0)
Receiving objects: 100% (1857/1857), 374.35 KiB | 268.00 KiB/s, done.
Resolving deltas: 100% (772/772), done.
Checking connectivity... done.
$ cd myGit
$ git remote -v
origin	https://github.com/martinp/myGit (fetch)
origin	https://github.com/martinp/myGit (push)
{{</highlight>}}
 
 
If you have more than one remote, the command lists them all. For example, a repository with 
multiple remotes for working with several collaborators might look something like this.

{{<highlight bash>}}
$ cd grit
$ git remote -v
richardt  https://github.com/richardt/grit (fetch)
richardt  https://github.com/richardt/grit (push)
andyd     https://github.com/andyd/grit (fetch)
andyd     https://github.com/andyd/grit (push)
origin    git@github.com:mojombo/grit.git (fetch)
origin    git@github.com:mojombo/grit.git (push)
{{</highlight>}}
 
 
This means we can pull contributions from any of these users pretty easily. We may additionally 
have permission to push to one or more of these, though we can't tell that here.

## Adding Remote Repositories

The git clone command implicitly adds the origin remote for you. Here's how to add a 
new remote explicitly. To add a new remote Git repository as a short name you can 
reference easily, run `git remote add <shortname> <url>`:

{{<highlight bash>}}
$ git remote
origin
$ git remote add pb https://github.com/richardt/myGit
$ git remote -v
origin	https://github.com/martinp/myGit (fetch)
origin	https://github.com/martinp/myGit (push)
rt	https://github.com/richardt/myGit (fetch)
rt	https://github.com/richardt/myGit (push)
{{</highlight>}}
 
 
Now you can use the string `rt` on the command line in lieu of the whole URL. For example, if 
you want to fetch all the information that Richard has but that you don't yet have in your 
repository, you can run `git fetch rt`:

{{<highlight bash>}}
$ git fetch rt
remote: Counting objects: 43, done.
remote: Compressing objects: 100% (36/36), done.
remote: Total 43 (delta 10), reused 31 (delta 5)
Unpacking objects: 100% (43/43), done.
From https://github.com/richardt/myGit
 * [new branch]      master    -> rt/master
 * [new branch]      myGit     -> rt/myGit
{{</highlight>}}
 
 
Richard's master branch is now accessible locally as `rt/master`; you can merge it into 
one of your branches, or you can check out a local branch at that point if you want to inspect it

## Fetching and Pulling from Your Remotes

To get data from your remote projects, you can run:

{{<highlight bash>}}
$ git fetch <remote>
{{</highlight>}}
 
 
The command goes out to that remote project and pulls down all the data from that 
remote project that you don't have yet. After you do this, you should have references to 
all the branches from that remote, which you can merge in or inspect at any time.

If you clone a repository, the command automatically adds that remote repository under the 
name `origin`. So, `git fetch origin` fetches any new work that has been pushed to that 
server since you cloned (or last fetched from) it. It's important to note that the `git fetch` 
command only downloads the data to your local repository; it doesn't automatically merge 
it with any of your work or modify what you're currently working on. You have to merge it 
manually into your work when you're ready.

If your current branch is set up to track a remote branch, you can use the `git pull` 
command to automatically fetch and then merge that remote branch into your 
current branch. This may be an easier or more comfortable workflow; and by default, the `git clone` 
command automatically sets up your local master branch to track the remote master branch 
(or whatever the default branch is called) on the server you cloned from. Running `git pull` 
generally fetches data from the server you originally cloned from and automatically 
tries to merge it into the code you're currently working on.

## Pushing to Your Remotes

When you have your project at a point that you want to share, you have to push 
it upstream. The command for this is simple: `git push <remote> <branch>`. If you want 
to push your master branch to your origin server (again, cloning generally 
sets up both of those names for you automatically), then you can run this to 
push any commits you've done back up to the server:

{{<highlight bash>}}
$ git push origin master
{{</highlight>}}
 
This command works only if you cloned from a server to which you have write 
access and if nobody has pushed in the meantime. If you and someone else clone at 
the same time and they push upstream and then you push upstream, your push will be 
rejected (and rightly so). You'll have to fetch their work first and incorporate it 
into yours before you'll be allowed to push.

## Inspecting a Remote

If you want to see more information about a particular remote, you can use 
the `git remote show <remote>` command. If you run this command with a particular 
short name, such as `origin`, you get something like this:

{{<highlight bash>}}
$ git remote show origin
* remote origin
  Fetch URL: https://github.com/martinp/myGit
  Push  URL: https://github.com/martinp/myGit
  HEAD branch: master
  Remote branches:
    master                               tracked
    dev-branch                           tracked
  Local branch configured for 'git pull':
    master merges with remote master
  Local ref configured for 'git push':
    master pushes to master (up to date)
{{</highlight>}}
 
 
It lists the URL for the remote repository as well as the tracking branch information. 
The command helpfully tells you that if you're on the master branch and you run `git pull`, 
it will automatically merge in the master branch on the remote after it fetches all the 
remote references. It also lists all the remote references it has pulled down.

## Renaming and Removing Remotes

You can run `git remote rename` to change a remote's short name. For instance, if you want 
to rename `rt` to `richardt`, you can do so with `git remote rename`:

{{<highlight bash>}}
$ git remote rename rt richardt
$ git remote
origin
richardt
{{</highlight>}}
 
 
It's worth mentioning that this changes all your remote-tracking branch names, 
too. What used to be referenced at `rt/master` is now at `richardt/master`.

If you want to remove a remote for some reason (e.g. you've moved the server or are no 
longer using a particular mirror, or perhaps a contributor isn't contributing anymore), you 
can either use `git remote remove` or `git remote rm`.

Once you delete the reference to a remote this way, all remote-tracking branches and 
configuration settings associated with that remote are also deleted.

