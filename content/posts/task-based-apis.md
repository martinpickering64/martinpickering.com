---
title: "Task-based Apis"
subtitle: "A treatise on behaviourally complete API design "
summary: "This Post is concerned with a possble future direction of Application Programming Interface (API) Design. It asserts that we can achieve better APIs than have hitherto been delivered. It proposes that there is much that we can learn from a small number of key design disciplines and design patterns; DDD, CQRS, Event Sourcing, Naked Objects, SOLID."

date: 2018-03-06T15:08:15Z
draft: false
---
## Summary

This Post is concerned with a possble future direction of Application Programming Interface (API) Design. 
It asserts that we can achieve better APIs than have hitherto been delivered. It proposes that there 
is much that we can learn from a small number of key design 
disciplines and design patterns; DDD, CQRS, Event Sourcing, Naked Objects, SOLID.

It focuses upon a small number of core values that should be upheld by our designs to achieve APIs 
that are easily understood, straightforwardly implemented, easily used, tested with certainty, 
can be supported and maintained and are inherently robust and scalable.  

The thrust and direction this document sets down is that of APIs, which are empathetic to the 
business-led goals that they support and which preserve the true intent that they have been 
created to serve.  

A concept given the name of _Behaviourally Complete APIs_, or _Task-based APIs_ for short. 
 
## Introduction 

APIs for software Products have existed almost forever. Throughout that time there have been various 
styles espoused and technologies employed to create effective APIs. Many have come 
and gone, some have lasted for a long time and some stick around despite the various 
abuses that they are subjected to by well-meaning engineers. 

This is yet another homily about how to do APIs well. 
It is written in response to my experience of using and creating APIs and the evidence of the 
several APIs that have been created (_often left unfinished_) by other adventures. It also 
echoes the cry... 

>>Surely there is a better way? 

I characterise the pain points experienced and uncovers some of their root causes. I offers a 
design philosophy expressed as a set of core values that could be applied to the design of APIs, 
which should cause less pain and suffering. 

The set of core values when applied to APIs results in a style or design of API that I 
give the moniker of _Task-based APIs_ with a sub-text 
of _Task-based APIs exhibit the quality of Behavioural Completeness in support of their assigned Bounded Context_.

Finally, a worked example that incorporates the philosophy is offered to put _meat on the bone_. 

## The sins of the past

Numerous issues with past APIs have as their root cause inappropriate levels of coupling inherent 
in their design, implementation and deployment. Coupling is a multi-dimensional software engineering 
concept. The outcome of the various types of excessive coupling has led to:

* APIs that are hard to use
* APIs that are difficult to create
* APIs that are costly to change or maintain
* APIs that are resistant to change due to actual of perceived risks associated with changes
* APIs that are hard to test
* APIs that are not amenable to automated testing and Continuous Integration 
* APIs that are brittle (they break easily)
* APIs that third-parties have difficulty accessing

  - Due to technology constraints
  - Due to security concerns
  - Due to arcane knowledge

For example, an API delivered as a SOLARIS Shared Library has very high levels of Spatial and 
Platform Coupling that were OK in times of monolithic centralised on-premises computing but is 
mostly inappropriate for today.

For example, Windows ActiveX or COM-based Component Libraries (spatial and platform coupling) 
have been marginalised by the advent of more recent software development and delivery 
technologies from Microsoft and others.

But Web Services increase the amount of temporal coupling (which is inherent in distributed systems) 
and they hold no opinion about afferent or efferent coupling; when the amount of such coupling 
becomes inappropriate then the consequences are quite dire.  

To overcome some of these problems, a proliferation of standards appeared and tooling support 
for those standards. The collective weight of which meant that the low entry costs of Web 
Services were lost, concepts became more addled because all standards were additive and optional 
(known as the principle of composition); i.e. everything became more difficult. This 
encouraged developers to cut corners and make unrealistic assumptions that, in turn, 
served only a short-term need of just get something working. 

The response to the debacle known as SOAP and the legion of additive WS Standards was to 
simplify again and a research topic known as the [Semantic Web](https://www.w3.org/standards/semanticweb/) 
and <u style="cursor:help" 
title="REST stands for Representational State Transfer, which is an 
architectural style for distributed hypermedia applications. Primarily 
used to build Web services that are lightweight, maintainable, 
and scalable. 
A service based on REST is known as a RESTful service">RESTful</u> 
Services were conceived. 

Consequently, engineers urgently looking for a way out of their current Web Services 
hell adopted REST; without bothering to understand what REST was, nor taking any account 
as to why they got into trouble with SOAP Web Services and API Design in the first place. 
The outcome was solutions, which did random stuff using HTTP and still delivered 
dysfunctional APIs. _Oh, deep joy!_

### An APIs lack intent 
Designing an API is not easy. In fact it is hard to do. 

There has been little assistance for designers and any assistance offered tended to be both 
voluminous and highly distributed; meaning it required dedication to track down and to wade through. 

Further complicated by most of the easily accessed examples of API creation (and especially 
examples involving Web Services) being created by Microsoft aligned publishers who go for the _easy_ 
option of getting something to work in a dozen or fewer lines of code. 
Given their source material, who can blame designers for their struggles and that they are led 
towards a design style that I shall crudely characterise as exposing the logical database schema 
of the application areas exposed via the API and implementing CRUD type Service Methods for each Service. 
 
For example, a Customer Service is created, and it has a CreateCustomer Method and an UpdateCustomer 
Method. It does not have a DeleteCustomer Method, because once created a Customer cannot be deleted. 
That's the entire Customer API; job done. 

Now the Create and Update methods need to support all types of Customers and the many ways 
they are richly described and used. Consequently, the Message Payload given to these Service 
Methods is huge. The task of supplying sufficient and accurate documentation about the payload 
is also a huge undertaking and usually exhausts the Technical Author. The net result is that the 
Service is published with sparse documentation. If more complete documentation is produced, it is 
usually a long time after the Service was originally published and as such is too late to be of 
use to those who needed it. 

Programmers who are tasked to use such Services are faced with a poorly documented, highly 
complex mysterious Message Payload to create. They attempt to divine what to do by sending 
exploratory messages to the installed Service. But all they get back is a failure from the 
Service being usually: 

* HTTP Status 500: Unexpected Server Error 
* Possibly HTTP Status 500 plus a stack dump from the <u style="cursor:help" 
title="But only if the Service deployment has made elementary mistakes! 
Production environments should have been inhibited from leaking any such 
implementation detail to potential un-friendlies">Server's code</u>; the stack dump will usually indicate an Object Null Reference error 
* An Error Contract Response message, but only if the Service's Developer has experimented with one of the WS Standards without anybody knowing 
* A Response containing a non-specific error message like "Can't process badly formed Request" and if you're lucky an application status code 

In other words, it went wrong, probably because of something that was or was not put into the 
Message Payload, but no assistance as to what was specifically wrong and what could be done 
to correct it. _Frustrating, slow work ensues._ 

Even once the right Message Payload has been divined there can still be intractable problems. 
These are often associated with question like "how do I achieve `<state business objective here>`, 
when all I can do is update the Customer?" As the Message Payload is merely a projection of the 
many Customer Attributes the entire application stores about Customers, it demands a full understanding 
of the entire application's features concerning Customer to be able to divine what attribute values 
need to be updated and with what values to accomplish a given business goal. This is this hard 
to do for all but the simplest of applications, and it means that our ability to break software 
that makes use of our API through apparently unrelated changes is incredibly easy, almost always 
unintentional and so usually an unpleasant surprise made very publicly. 

Now consider this large Message Payload once again, does anybody really set out with the 
goal to _update a Customer_? No. There is in mind a sound business objective, in other words 
the true intent, which has the effect that one or several facets of a Customer's state need to 
change. Unfortunately, the original intent is lost because it has been translated into merely 
_update_. This also means that verifying the "true intent" by the Service Implementation is 
near to impossible because the intent was lost. Additionally, consequential actions or 
events, audit and reporting about the original intent can also not be made. This is starting 
to sound really rubbish now. 

Now consider this large message payload from a verification point of view... 
  
Code can be written that ensures that all the mandatory elements have been supplied. 
Similarly, code can be written that ensures all the values supplied fall within 
acceptable bounds. Indeed, if we were competent in XML technologies we could have 
things like XSDs do most of such checking for us as well as supplying usable and useful 
documentation about the message payload at the same time. Usually we are not that competent 
and so this opportunity is overlooked in favour of writing reams of custom code. Even so, 
that still leaves us with problems relating to true intent. As our code does not know the 
true intent of the update it is very difficult to ensure the consistency of the requested 
update, especially where several properties need to change state at the same time and to 
specific bounds that only relate to the original intention.  

Overtime and due to support requests and fault reports, Machiavellian measures are put 
into code to try to divine the original intent and then to validate its correctness. 
Sometime successfully, and sometime not, but it is always hard. Such code become dark 
corners that developers fear to change. So, resistance to change starts to build until 
frustration boils over. 

The root cause was to fail to ensure that inherent in the design of our APIs the true 
intention or business goal for their existence was made clear and preserved.  

### The hell of SOAP and WS Standards 

One of the stated goals of Web Services was to create platform independence between 
Service Clients and Service Hosts. Originally, the Web part of Web Services meant use 
HTTP to achieve that independence. But quickly competing proprietary demands and good 
intentions diluted that simple maxim so that various other transports could be transparently 
incorporated into the Solution Domain for Web Services: such as TCP/IP, Message Queues, RPC, SSH etc. 

To achieve this, intrinsic features of HTTP could no longer be used and so had to be 
replicated in some other way using the lowest common denominator of all the various 
transport options; i.e. the message payload itself. Hence, a legion of additional WS 
Standards were created to add-in perceived missing features such as reliable delivery, 
security, identity, authorization, micro-charging, intra-message encryption and message 
signing. All of which made the message payload overhead larger and more complex to understand and implement. 

In response, tooling support provided by the Development Tool Vendors also expanded. Their 
aim was to simplify what had become complex and restore development efficiencies. These 
efforts were only partially successful, the failing was that the large amount of information 
now involved and the plethora of choices that existed meant that Web Service design and 
development became a more and more specialised task. Acquiring and retaining such specialists 
was often out of the reach of many Teams and so "competent developers" were used instead 
resulting in sub-optimal outcomes. 

The principle of composition adopted by the WS Standards was that Web Service Designs 
could incorporate only those WS Standards that they needed to achieve the goals and so
Platform Independence was further damaged. Projects that involved Web Services would have 
to enter often protracted negotiations concerning which WS Standards were to be involved. 
Often the negotiations involved several development teams from various corporate entities 
making it inevitable that these negotiations were long, involved and full of contradictions, 
misunderstandings and competing interests. 

The lack of experienced skilled developers and the need to undertake complex commercial and 
technical negotiations meant that most projects abandoned the Standards led routes. Instead 
they returned to HTTP and the original SOAP and filled in the gaps using tactical means. Usually this meant: 

* HTTP was the transport 
* HTTPS would be used to ensure message privacy over the wire 
* HTTP Basic Authentication would be used to verify identity 
* Services would reflect Database Entities 
* Service Methods would be CRUDy 
* Message Payloads would be large and loosely typed 

  - Because they were CRUD 
  - Because the design and implementation steps necessary to strongly type messages went beyond the Team's skill level 
  - To try to avoid the need to version of messages as requirements evolved 
  - It naively seemed to be the quickest thing to do  

Incredibly, such Projects were often staffed with team members who had only passing acquaintance 
with XML. Given that SOAP is XML then this was a mortal blow. Perfectly valid XML 
would be either rejected or misinterpreted by the deployed software because the developers 
involved did not know XML. Their resolution to the problems encountered would be to write 
yet more software, totally ignoring that the features of the foundational technology, i.e. 
XML, had already solved the problems they were experiencing they just needed to use the 
XML Technology. So, more complex software was created, there was increased difficulty for 
QA activities, yet more misunderstandings and argument occurred, cost and time overruns 
were experienced, and brittle unstable solutions were delivered. 

### Random stuff over HTTP 

Random stuff over HTTP characterises the deployed result of what a development team 
calls RESTful Services. Most things are apparently random, there is a lack of 
consistency, thought or overall design and very little can be relied upon. Should 
things go wrong... well basically, _you are on your own_. 

Many developers have no knowledge concerning HTTP Status Codes other than: 200, 500, 
404, 301 and 302. They have never encountered HTTP Verbs beyond GET and POST. Could not 
write a RESTful Service other than by using the auto-scaffolding and code generation 
features of their Integrated Development Environment, never mind design a coherent service. 

Common shortcomings include: 

* Little thought invested in URL design 
* GET used to invoke service methods that cause state mutation 
* POST used to create, update and delete state 
* HTTP Status Codes 200 and 500 are the only status codes returned 
* Security is either absent or looks like a colander 
* Identity is absent or trivial 
* Authentication is weak 
* Failure to deliver meaningful documentation  

### The fallacies of distributed computing 

There is a well-known computer science topic entitled 'the fallacies of distributed computing' 
that can be researched on the Web and is abridged in my Post called 
[The Eight Fallacies](/posts/the-eight-fallacies).   

Most APIs currently being developed and supported, and all APIs expressed using 
Web or RESTful Services, create a distributed solution. When designing these APIs, 
the fallacies of distributed computing are often ignored and consequently the negative 
outcomes predicted by these fallacies result, for example: 

* Poor performance 
* Have issues with both scale (going up or down) and throughput 
* Are brittle and unstable 
* Difficulties in maintaining and supporting the solution 
* Difficulties in diagnosing problems 
* Strident criticism of the APIs made by their Users 
* Integration Projects talking extended periods of time to deliver disappointing results  

### Coupling and distributed Systems 

The concepts of Coupling and Cohesion has existed since the birth of Software Engineering. 
They were intended to help Engineers get to achieve the benefits of Modular Programming by 
showing what was good and what was bad. These ancient measures are still important when 
considering software design. 

We even go so far as to reference the term _loose-coupling_ in many design decisions and 
justifications that we make. However, our designs and resultant solutions often tell the 
truth of the matter. Namely, that we failed to adequately consider what Coupling was, how 
we were being affected by it and what we needed to do to make things as good as they 
needed to be; and especially so in our API designs. 

The Web can provide much information about Coupling and it is summarised in my Post [Coupling and Distributed Systems](/posts/coupling-and-distributed-systems). 

### Messaging patterns 

As our focus for interoperable APIs has centred on Web and RESTful Services, we have 
become myopic about the Messaging styles that we utilise; everything has decomposed 
down to the Request-Response Messaging Pattern. 

There is nothing wrong with Request-Response, it is a great pattern. However, like 
all patterns it is not a panacea for all ills. It is appropriate for certain 
situations and not so much for others. We risk much by entirely ignoring the alternatives 
in the Message Patterns Book. Web and RESTful Services do not constrain us to 
only use the Request-Response Pattern. 

The Web has much to say about Messaging Patterns and a set of relevant opinions 
are summarised in my Post [Messaging Patterns](/posts/messaging-patterns). 

## A new hope?

### Our core values for API design 

I assert that many of the past issues related to <u style="cursor:help"
title="Public APIs are those that we publish and document for us and others to use. 
Internal APIs that are private to the inner workings of our software. They 
could adopt the same set of core values, but other ones may also be appropriate 
such as the use of Message Queues or RPCs rather than HTTP">Public APIs</u> are resolved during 
design and that the knowledge and application of a set of core values related to 
API design will stand us in good stead. These values are: 

* Web Services are good, but only over HTTPS 
* RESTful is preferred over SOAP  
* JSON is preferred over XML 
* JSON and XML Message designs should always be expressed using JSON Schema and XML Schema Definitions 
* [<span 
title="Swagger is the world’s largest framework of API developer tools for the OpenAPI Specification (OAS), 
enabling development across the entire API lifecycle, from design and documentation, to test and deployment.">SWAGGER</span>](https://swagger.io/) 
is a preferred way to distribute documentation for our APIs 
* Identification and Authentication should be present and active from the outset 
* OpenID Connect and OAUTH2 are the preferred identification and authentication technologies (and hence RESTful services being preferred) 
* HTTP Verbs must be used appropriately and show true intent, e.g. GET Requests must not cause state to change 
* HTTP Status Codes must be used appropriately, e.g. 200 and 500 are not the only response codes 
* <u style="cursor:help" title="Idempotence is the property of an operation that it can be applied multiple times 
without changing the result beyond the initial application">Idempotent Service Methods</u> are always the goal; 
they lead to simpler and more robust solutions 
* Request-Response is not the only message pattern; try to ensure the most appropriate message pattern is used 

The most important, first amongst equals, of our core values for APIs is...

>> Our APIs must allow the true intent of their use to be fully and clearly expressed 

### APIs must express intent 

The principle that APIs communicate true intent as well as communicate data 
is simply put, but profoundly felt. 

One implication is that expressing a set of Web Services as a facsimile of 
the Database's principle Entities is almost never going to be appropriate. Further, 
declaring <u style="cursor:help" title="CRUD: create, read, update, and delete are the four 
basic functions of persistent storage">CRUD</u> style Service Methods for each of our Services is inappropriate, because 
business processes that our APIs are aimed at supporting don't do CRUDy, things 
they set out to accomplish specific tasks and so should our APIs. 

I envisage that our APIs will breakdown along similar lines to that found in 
[Domain Driven Design](https://www.infoq.com/minibooks/domain-driven-design-quickly). Meaning that there will likely be an API Service for 
each DDD Entity Root with Service Methods that retrieve and affect the state 
of an Entity Root. And there will be API Services that represent (at least some of) 
the <u style="cusror:help" 
title="An Entity Service is such that it operates concurrently on multiple Entity Roots, 
but does not actually belong to a particular Entity Root. For example, in a Banking, 
there is an Account Entity Root. A Fund Transfer (between Accounts) would be an 
Entity Service as it does not naturally belong to one or other instance of an 
Account involved in a transfer of funds">Entity Services</u> revealed by the DDD Model.
 
An API operates within the borders of a single [Bounded Context](https://martinfowler.com/bliki/BoundedContext.html) 
and as such it would be <u style="cursor:help" 
title="Authoritative - the origin of the truth and the only place 
where state changes are allowed to take place">authoritative</u> concerning the Entity Roots 
that reside within the BC. 

Most authorisation needs are satisfied by gaining entry to the BC, so simplifying 
any implementation and administration of Authorisation needs. 

#### But what is meant by intent? 

Rather than directly answer this question, consider a different question...

>> What is the intent of the SaveOrder Method of a SalesOrder Service? 

Answers are numerous, complex and conditional and is the consequence of a loss of the true intent. 

>> But so what? 

The consequences of the doubt and uncertainty introduced by losing the true intent include: 

* Complications for API Clients trying to accomplish even apparently simple things, 
e.g. to cancel a Sales Order one would need to construct a message containing all of 
the current details of the Sales Order as well as the change the Order Status. Resulting 
in Integration Partners taking a dim view of our capability and competence 
* Unintended consequences, e.g. extending the Cancel Order example above, an 
unintended consequence of not getting all of the non-status related details of 
the Sales Order accurate to the Sales Order's current state would be that the Sales 
Order would be edited and cancelled. Creating dissatisfaction all-round 
* Complex Request Validations. In order to validate a request there will be numerous instances where the actual intent is an important input to the validation rules. Therefore, the intent would need to be divined (complex and imprecise) and then acted upon. There is the possibility that the API Client chooses to make several changes due to several separate intentions, yet compound them into one API Call to `SaveOrder`. How is the true intent to be guessed at now? All our attempts to validate the request are likely to fail (allow something that should not be allowed or prevent something that should not be prevented). Software Lifecycle costs are elevated 
* Complex and incomplete QA. When Code gets complex, so do QA activities. But put that to one side for a moment. If the set of operations that the API is supposed to support is lost due to a lack of intent within the API then presumably the actual use the API is put to is open ended and goes beyond our design scope. How would any QA Analyst prepare a Test Plan for such an ambiguous and imprecise eventuality? 
* Loss of opportunity. As the intent has been lost then consequential actions, reporting and auditing in a meaningful way is extremely hard or practically impossible. For example, if a Customer Service Improvement Initiative wanted to know about Customer behaviours concerning changing the delivery address on the orders they place prior to despatch, our intent-less services actively hide such intelligence, rendering meaningful analysis impossible

There are also other issues related to scale, throughput, robustness and resilience. For example, any attempt to make a SaveOrder Service Method inherently idempotent would be a massive undertaking and possibly futile. If SaveOrder was unable to support idempotence then intractable issues relating to lost Requests, time outs whilst awaiting Responses and lost Responses will occur; creating elevated lifetime costs via our Support Desk and poor customer satisfaction. 

Now look at the impact of adding intent back into the SalesOrder Service API. The only change we will make, for illustration purposes, is to add a new Service Method called CancelOrder. The CancelOrder Method requires a Sales Document Number argument to know which Sales Order to cancel. Given this change, how do we now feel about the following questions? 

* When supplied with the documentation for the API, is it easy to identify how an existing Sales Order can be cancelled and so create a Service Client that was able to cause Sales Orders to be cancelled? 
* If you were asked to implement a `CancelOrder` Service Method, is that a more straight forward prospect than being asked to modify an existing `SaveOrder` Service Method? 
* If you were asked to QA the new Cancel Sales Order feature, is that now a more digestible prospect than before? 
* Would the documentation surrounding the concept of Sales Order cancellation be 

  - Easier to write? 
  - Easier to read and understand? 

* Is the CancelOrder Method inherently idempotent? Is that good? 
* Is the amount of IT infrastructure resources needed to handle `CancelOrder` significantly less than that needed to handle `SaveOrder` (when used to achieve the same outcome)? 
* Are changes to `CancelOrder` likely to have minimal impact on other parts of the Sales Order Service? 
* Are any future changes to Sales Order Cancellation procedures now easier to identify, implement and test, and to deliver with certainty? 

If you were in any doubt, the answer to all the above is __YES__. Note that those are just a few of the obvious benefits, there are more besides. 

#### An example 

Lets examine a very trivial example to get ourselves going and in the mood. 

Our simple example is a Light and it's API. We shall dispense with the rather abstract 
and unnecessary concepts of how a Light comes into being and ceases to be, 
and simply focus upon its operation. 

We determine that we should have a Light Service to allow ourselves the ability 
to control our Lights. Each Light instance has a unique Identity and a Description; 
to help us know which Light it is. 

Our DDD Model shows that we need to list all our installed Lights and to get 
the details of a specific Light. We also need to switch an individual Light on and off. 

Intrinsic Identification features of our API platform take care of obtaining 
the caller's authenticated identity for each use of our API. This allows our Service 
to audit/log who is leaving the lights on. As we allow anybody to _see_ our lights 
and to switch them on and off, there is a simple authorisation rule of allow all 
authenticated users for all operations. 

The retrieval side of the functionality is relatively straight forwards and 
should lead to little discussion: 

* To obtain a list of installed Lights, request URL `~/api/lights` using HTTP GET. This would be a Request-Response style message returning a HTTP 200 and a JSON array of Light objects (Id, Description and perhaps current state: on or off) 
* To obtain information about an individual Light, request URL `~/api/lights/{light-id}` using HTTP GET. This Request-Response would return either HTTP 404 (not found) or HTTP 200 along with a JSON Object representing a Light object (Id, Description and current state) 
* 
It is most often the case that retrieval parts of an API will use the Request-Response Message Pattern. 

Now how to do the update side of our API needs, i.e. mutating the state of our Lights? 

To change the state of a Light we will to instruct the Service as to which Light, we want 
to affect by including the Light's Identity as part of the message or instruction. We 
could implement switching on and off as a toggle mechanism, i.e. if the light is on then 
switch it off and if the light is off then switch it on. It is perfectly valid to do so 
and indeed you will find such an arrangement in most houses; such as a switch located at 
the bottom and at the top of the stairs, which operate the light that illuminates the stairs. 

The toggle mechanism fails two of our core values: 

1. The intent of what we are trying to achieve is lost, i.e. we don't know whether the 
intent is to switch on or to switch off. Getting things backwards to the actual intent 
could have serious consequences, like causing someone to fall down the stairs! 
2. The service method is not idempotent. If our Request's Response was apparently lost 
and caused the Request to be re-sent then the actual outcome could in fact be the 
inverse of our intention 

To restore order to our world, we would need to implement two Service Methods: 
one to switch the Light on and the other to switch it off again. I hope it is 
obvious that we would then know the intent being expressed and that each service 
method is inherently idempotent. 

Alternatively, we could implement one Service Method whose message includes the desired 
state to be achieved (on or off). I believe the first design displays better cohesion 
by more honestly observing the single responsibility principle of software design and 
exhibits less data coupling. 

As both operations mutate the state of an existing Light then <u style="cursor:help" 
title="One could argue for the use of HTTP PATCH instead of HTTP PUT, but 
most developers’ minds start to explode at that point, just like in 
the film Mars Attacks">HTTP PUT</u> is the 
appropriate Verb choice. Accordingly, the successful return code is 204, the 
change of state has occurred and signifies the use of the Request-Response message 
pattern. Alternatively, a success response could be 201 ACCEPTED, meaning the request 
to change state has been accepted and will be applied; a message pattern other than 
<u style="cursor:help" 
title="Imagine that the state of our Lights is only ever allowed to change every 5 minutes, 
meaning that a Request-Response pattern would demand that our caller waits 
for up to 5 minutes before getting their reply. Using one or other of the 
asynchronous message patterns, would allow an immediate response of 201 Accepted, 
and allows the caller to move on whilst their request is queued awaiting its 
execution time to arrive">Request-Response is in play</u>.

So, our API Design is now: 

* To switch on a Light with Id 1234, use HTTP PUT to request the URL `~/api/lights/1234/switchOn`, the request body would be empty. This Request-Response would return either HTTP 404 (not found) or HTTP 204 
* To switch off a Light with Id 1234, use HTTP PUT to request the URL `~/api/lights/1234/switchOff`, the request body would be empty. This Request-Response would return either HTTP 404 (not found) or HTTP 204 

The design assumes (or is constrained such that) an identified Light cannot 
fail. The design would need to change some more if there was any doubt about that.

### Separating commands and queries 

Most APIs naturally segment into Service Methods that retrieve data or state, 
i.e. queries, and Service Methods that mutate state, i.e. commands. 

There is a Design Pattern that recognises nature of commands and queries and 
points towards solutions that are beneficial for quality implementations. It 
is known as Command Query Separation (CQS). This early pattern was later revised 
and improved for the context of APIs and given the moniker of Command Query 
Request Separation or CQRS. There is a derivation of CQRS known as CQRS plus 
Event Sourcing, which extends the abstraction even further and incorporates 
specialised persistence technologies with intrinsic Backup, Logging and 
Auditing features as well as the ability to re-purpose history (Commands 
previously received and processed) for the benefit of new features that 
have the characteristic of seemingly having always been present in 
the deployed solution. 

I am not proposing (_at this time_) that we should all incorporate CQRS or CQRS + Event Sourcing. 
I am asserting that knowledge and experience of these 
design patterns will positively assist our design efforts for our 
Behaviourally Complete APIs. The principles these patterns are based 
upon, the reasons why and the issues they attempt to address offer much 
insight for us in our efforts.

## Call to action 

When we consider modifying one or other of our existing APIs, we should 
pause a moment and refrain from our historical practices. We should use 
the opportunity that pause creates to consider whether any of the 
principles contained in this Post could be applied to the modification.
 
For example, if we are asked to make a change to our `SalesOrder` Service 
and our normal practice would be to incorporate the new or changed feature 
within the implementation of the existing SaveOrder Service Method. The pause 
would allow us to consider whether we could instead implement the feature in 
such a way that the true intent is exposed and preserved, e.g. by adding new 
Service Methods to the `SalesOrder` Service that convey the intent of the 
tasks we are creating API support for. 

For any adventure that is destined to create an entirely new API then 
the core values put forward by this document should be incorporated 
from the outset. 

For any existing API, we should consider amending and re-structuring 
their supporting documentation. The new documentation would be 
arranged from a task orientated view with its narrative showing how 
the API is used to achieve business led tasks that are full of intent. 
Whilst not ideal at least we would be making our APIs easier to use 
through meaningful value-added documentation rather than the quite 
sterile documents we have previously produced (for those occasions 
we did create documentation).
