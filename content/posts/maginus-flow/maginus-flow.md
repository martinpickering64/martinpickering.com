---
title: "Maginus Flow"
date: 2018-08-25T16:49:19Z
draft: false
summary: "A description of the process with examples."
categories: Software
tags: ["Git", "Maginus Flow"]

---
## The main branches

There is are two eternal branches. We will refer to these branches as `develop` and `master`.

The purpose of `master` is (as has become the convention in Open Source Projects) to 
represent the code base of the most current, public release of the 
Product that can be found _out in the wild_.

The tip of the `master` branch will point to the last released commit. The tip of 
the `master` branch always represents our promise to be the most recent and 
most stable Product version. One can regard `master` as a marker branch rather 
than a conventional branch.

The purpose of the `develop` branch is as the eternal branch that contains the commit 
history of all of our released code plus any additional code deemed fit and ready to 
form part of our next release. In a conventional Git repository this branch would 
be called `master`, but we have already used that name to satisfy another convention 
(see above).

The tip of the `develop` branch represents our current view of what our next most 
stable version of our Product could be (if we were asked to make a 
release straight away).
 
Figure 3 develop and master branches after first release
 
Figure 4 develop moves onwards, master always points to the current release

 
Figure 5 develop and master after the next release

Note that our `master` branch does not really exist until we have made our first release ;)

To create a repository and to rename the default `master` branch to develop:
 
## Topic branches

Topic branches are where the day-to-day development work happens. They are by 
far the most common of all the branches in the Maginus Flow model. They are 
used by developers to create new features and bug fixes for the upcoming release. 
Topic branches are usually named similarly to `topic/work-item-id`. 

Topic branches often exist only in the developer's repository, and are never pushed 
to the central repository. However, should there be multiple people working on 
one feature, or that the feature requires a long time to develop, it's typical 
to push them to the central repository (if only to make sure the code isn't 
lost with a single disk failure). Such pushed branches would be removed 
from the central server once the feature was integrated with the `develop` branch.

### Creating a topic branch

To start a new topic branch, simply create a new branch from `develop` :
 
 
Figure 6 creating a topic branch

### Finishing a topic branch

Once work on the given feature is done, the commits now present on the topic 
branch need to be integrated back into `develop`. 

The method for integration of the topic branch with `develop` is based 
on _rebase + merge --no—ff_. Combining a `git rebase` with a `git merge --no—ff` 
confers the following advantages:

- Rebasing before integrating with `develop` allows you to clean up 
  the branch history before making it public, resulting in better final history landing on `develop`
- Linear history makes things simpler and easier to find, especially when looking at the per-file history
- Reverting the entire feature requires reverting only one commit (the merge commit)

The disadvantage is that this method is slightly more complex than using 
either just a `git rebase` or just a `git merge --no—ff`, which are valid alternatives 
(but not preferred as they each have disadvantages that are the polar opposite of the above advantages).
 
Note that after the topic branch has been merged into `develop`, `develop` is immediately pushed 
back to the remote `develop` branch (at origin) and then the local topic branch is removed.
 
Figure 7 finishing a topic branch

If the topic branch had been published as well (via a prior `git push`) then the 
upstream topic branch should also be removed.
 
Alternate Topic Branch Integration #1

This method uses Git's rebase command (with the `-i`, meaning interactive, switch) to integrate 
the topic branch with `develop`:
 
 
Figure 8 Alternate #1: finishing a topic branch

A key point to note is that the merge of the changes introduced by the topic branch 
onto the `develop` branch are only ever accomplished using a fast-forward merge. This 
guarantees the linear history on the `develop` branch that we are striving for.

The main disadvantage of this integration method is that reverting the entire 
feature requires reverting multiple commits. If, however, the topic branch's history 
does not have multiple commits then this disadvantage does not apply and 
so this integration method could be used achieving all that we want 
without any disadvantages.

Alternate Topic Branch Integration #2

This method is as advocated by the Gitflow Workflow and `git merge` (with the `--no-ff` switch) 
to integrate the topic branch with `develop` using a merge commit:
 
 
Figure 9 Alternative #2: finishing a topic branch

The main disadvantages of this integration method are:

- The topic branch history, which is often messy, gets put directly on `develop`
- The proliferation of merge commits (especially as the number of developers 
  on a project grows) makes history unmanageable

I don't think that there are circumstances that would mean that this method is desirable.

## Release branches

Release branches are created to prepare the software for being publically released. 
The contents of a software release will be a mixture of new features,
feature enhancements and bug fixes.

The activities required on the release branch may vary according to the exact 
details of the specific release. This could be as simple as updating the version 
number in the configuration, or involve things like code freezes, producing 
Release Candidates, and having a full Release QA Regression and Acceptance 
process. The important thing is that all of that activity happens on a 
separate branch, so that day-to-day development can continue as usual on the `develop` 
branch.

The naming convention for the Release branches is `release/<Major-number>.<Minor-number>.0`, 
for example, 7.4.0

NOTE: Maginus Flow does not support the concept of Patch Releases or Monthly Update 
Releases, as is current practice. The only Release type supported from current 
parlance is a Full Release.

### Starting a Release branch

Release branches also start from `develop`, however they often don't start from 
the tip of develop. Instead, they have their origin in whatever commit on `develop` 
has been chosen as the commit that contains all of the features that to 
be included in the Release.

For example, here we start the branch for the version 7.4.0 Release on a commit 
in `develop` that has the hash 3abe4c:
 
### Finishing a Release branch

Once the process for releasing is complete, the tip of the Release branch is 
tagged with the Release's version number. After that, the Release branch needs 
to be merged into `develop` to be permanently versioned:
 
Here's a diagram illustrating the above commands (assuming the release took 
two commits):
 
Figure 10 finishing a Release branch

### Updating master after a Release

Subsequent to a Release branch becoming complete the `master` branch needs to be 
updated to respect the new public release point. This is achieved by _fast-forwarding_ 
`master` to the latest release tag:
 
Here's a visualization of the state of the repository after updating `master` 
subsequent to completing a release cycle:
 
Figure 11 updating master subsequent to a release

Again, if the release branch had been pushed to the central repository 
(made publically visible), delete it now:
 
## Hotfix branches

NOTE: A Hotfix branch is not used to create what we currently call a Patch 
Release. It actually produces a Full Release (in current terminology).

Hotfix branches are very similar to Release branches, because they result in 
a new version of the Product being released. It is by their intent that 
they differ. While Release branches signify a planned milestone, Hotfix branches 
are most often an unwanted but necessary exception to the usual release cadence, 
typically because of some critical defect found in the latest release that 
needs to be fixed as soon as possible.

Hotfix branches are named `hotfix/<Major-number>.<Minor-number>.<Patch-number>`. Note 
that as the Product has adopted Semantic Versioning, and whilst a Releases 
affects either the Major or Minor number with the Patch number set to zero, 
a Hotfixes affects only the Patch number. For example, Release 7.4.0 
would have its first Hotfix as 7.4.1, and then 7.4.2 etc.

### Starting a hotfix branch

Hotfix branches begin at the commit that the latest version tag points to. 
As `master` always tracks the latest tag, creating a hotfix branch is quite 
easy. Continuing our example from the release branch 7.4.0:
 
### Finishing a hotfix branch

Finishing a hotfix branch is pretty much the same as finishing a release 
branch: tag the tip, merge it to develop, then delete the branch and 
finally update the `master` branch (moves its position).
 
 
Figure 12 finalising a Hotfix branch

There is one  special case when finishing a Hotfix branch. If a Release 
branch has been created in preparation for the next release before the 
hotfix was finished, then the Hotfix branch must merge with the that 
new Release branch and not to `develop`. If the normal workflow of 
merging the Hotfix branch to `develop` was undertaken then the next Release 
will regress the fault the Hotfix had corrected. The changes in the 
Hotfix will eventually get to our eternal `develop` branch when the 
new Release branch is merged back to `develop`.

## The next branch

The `next` branch is used to publish (to the Team and other contributors 
and collaborators) changes, including enhancements, new features and 
bug fixes that:

1.	Have a worthwhile goal (they are extremely likely to be included in the Product)
2.	Are known to have a reasonably good quality level and stability
3.	Have yet to demonstrate that they are regression free

Such changes (originating from a Topic branch) are integrated into the `next` 
branch to be thoroughly tested and tested in combination with other putative 
changes (contained in other Topic branches). Only once an acceptable level of 
completeness, quality and stability has been achieved in the `next` branch may a 
Topic branch be integrated into the `develop` branch.

The `next` branch is a likely to be a long-lived branch, but it will be periodically 
discarded and re-built. One such event that causes the current `next` branch to be 
discarded is subsequent to the release of a new version of the Product. When a 
Release branch is tagged with its Release Number and integrated back into the `develop` 
branch, the current `next` branch should be:

- Discarded and a new `next` branch created pointed at the merge commit in 
  the `develop` branch of the new Release and then the outstanding Topic branches 
  from the old next re-integrated with what is now the current next branch
- Or, the `next` branch is rebased on the `develop` branch based upon the 
  merge commit point of the new Release

The `next` branch allows the Team to

- Stabilize upcoming features in combination with its peers
- Guard against polluting the change history of `develop` due to such stabilization efforts
- Invite wider participation in stabilization efforts without needing to make a formal 
  Release followed by several Hotfixes due to stabilization issues

When the `next` branch is re-built then all Contributors should be notified 
of the fact so that they may re-synchronise their own local repositories.

Topic branches that meet the criteria for `next` are merged to the next 
prior to be merged into `develop`. In general, the `next` branch always 
contains the tip of `develop`. `next` might not be quite stable, but is expected to work 
without major breakage. The `next` branch is where new and exciting things take 
place. A topic that is merged into `next` is expected to be polished to 
perfection before it is merged to `develop`.

Topics are generally integrated into `next` using a straight forwards `git merge` 
command. As the history of `next` never contributes to that of `develop`, we can afford 
`next`'s history to be somewhat less pure.
 
Between releases, the `next` branch should be regularly updated from the `develop` 
branch preferably as and when Topic branches are merged into `develop`.
 
The stability and longevity of the `next` branch means that it is possible, 
even practicable, to base new development off of the `next` branch. 
However, it is most ill advised to do so for many other reasons, so 
resist the temptation and base your Topic branches on the `develop` branch only.

## The pu (proposed updates) branch

The `pu` branch is used to publicise proposed changes that do not yet meet 
the criteria for the `next` branch, in that:

1.	Their goal is still tentative. They are experimental ideas for which no 
    guarantee of inclusion in the Product is being offered, yet wider development 
	participation or integration testing with other prototype features 
	is demanded in order to achieve worthiness
2.	They are few guarantees in respect of quality and stability
3.	There are known bugs, some of which might be serious

The `pu` branch is also likely to be a long-lived branch (in comparison 
to Topic branches), but not as long-lived as the `next` branch. The `pu` branch contains all 
of the changes merged with `next` plus other changes deemed not to meet `next`'s 
criteria, but is built directly from the `develop` branch.

Developers merging their Topic branches with `pu` is extremely useful to obtain initial 
feedback on development work from product owners, functional testers and even keen users. 

The `pu` branch is recreated at least as often as the `next` branch and is probably 
re-created more often than next due to the instabilities associated with the `pu` 
branch that are inherent in its purpose.

You can run the following command to see what topics are currently in 
flight on the `pu` branch.  Sometimes, an idea that looked promising turns out 
to be not so good and the topic can be dropped from `pu`.
 
The `pu` branch and Topic branches that are only integrated with `pu` are 
highly likely to be subject to `git rebase`. This also contributes to 
the instability of this branch (but makes many other things easier) and 
as such nobody should ever base new development off of the `pu` branch.

## The Maintainer

Maginus Flow demands the role of Maintainer to be staffed. The Maintainer takes 
responsibility for the guardianship and health of the following branches:

- develop
- master
- next
- pu

That's is not to say they are responsible for the quality of the 
software present on those branches, just the Git operations 
that are being conducted there.

### The develop branch

The commit history on `develop` is being maintained cleanly and as linearly as is 
practicable. Therefore, spotting breaches in Topic branching policy and other 
similar faults and misunderstandings.

### The master branch

Ensuring that the `master` branch always fulfils our promise.

The `master` branch represents the most recent and stable publically 
available version of Maginus OMS

### The next branch

Ensuring that the `next` branch is re-built subsequent to 
a Release (or sometimes a Hotfix) has been integrated into the `develop` branch.

Notifying collaborators that `next` has been re-built.

Regularly reviewing the need to merge develop into `next` again, usually subsequent to 
a Topic branch being merged into the `develop` branch.

### The pu branch

Ensuring that the `pu` branch is re-built as and when is necessary or desirable.
