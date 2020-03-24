---
title: "Messaging Patterns"
subtitle: "Collected notes from various sources"
summary: "The hegemony of the Request-Response style must be challenged. Asynchronous Messaging is our _David_. But to defeat _Goliath_ we must know how to apply messaging in an ordered and appropriate way. Messaging Patterns help us to achieve that."
date: 2017-07-03T10:18:53Z
draft: false
---
## Summary 

__Assertion__: Messaging is an important underpinning as to how we will deliver SaaS. 

The hegemony of the Request-Response style must be challenged. Asynchronous Messaging is our _David_. But to defeat _Goliath_ we must know how to apply messaging in an ordered and appropriate way. Messaging Patterns help us to achieve that. 

## Introduction 

This document is about some of the principles and patterns associated with using Messaging as a building block in distributed computing systems. 

Messaging can be described as a building block because: 

* Messaging can be used to reduce the coupling present in a System Design; platform coupling is lessened using XML as a message format and temporal coupling is reduced through the use of asynchronous messaging 
* Messaging helps us to increase the autonomy associated with our software components whilst also reducing afferent and efferent coupling 
* Messaging encourages us to look at again at how we understand the Singe Responsibility Principle and leads towards a viewpoint that a _shared database_ used by all our components should be removed 
* Using message schemas along with our messaging-based communications we are exposing all of our dependencies and hidden coupling, such as that through a shared database 

To utilise Messaging, we will always need to check and re-check the Service Boundaries (aka Boundary Contexts) with our Functional Requirements to ensure that the areas of consistency and responsibility are being correctly identified and appropriately maintained. 

We will make mistakes in drawing up our Boundary Contexts and need to make revisions. This does not mean Messaging is wrong or invalid. It more often means that our understanding of the problem is insufficient and by devoting more thought we will be able to draft more appropriate Boundary Contexts for our purposes. 

The rest of this document is structured such that a few notable design patterns and architectural styles associated with the use of Messaging are illustrated, along with discussion as to how to be resilient towards various common forms of failure. 

## Asynchronous messaging 

Asynchronous messaging is the _daddy concept_. Messaging is one-way, it is fire-and-forget, send and move on. Everything else is built on this idea. The main patterns being: 

1. The Return Address Pattern 
2. Request-Response Pattern, and derivatives such as the Correlated Request-Response 
3. Publish/Subscribe 

## Messaging substrate types 

The messaging substrate is typically one of two types: 

1. The federated message bus 
2. The message broker 

### The Federated Message Bus 

{{< figure src="/posts/images/federated-message-bus.png" caption="figure 1 the federated message bus" >}}

The Federated Bus uses a _store and forward_ technique that reduces temporal coupling between the Client and the Message Substrate and also increases the overall resilience of the substrate. An example of this type of messaging substrate is Microsoft’s MSMQ. 

### The Message Broker 

In a Broker style system, the messaging client exhibits temporal coupling to the Message Broker. 

{{< figure src="/posts/images/message-broker.png" caption="figure 2 the message broker" >}}

Examples of Broker style messaging substrates tend to be those based upon the AQMP standard, like RabbitMQ. 

## One-way, fire and forget messaging 

A Message is sent by a client. If the message is accepted by the messaging substrate then that is the end of it from point of view of the client. The client cannot know, nor must it care whether the message has been delivered or when it will be delivered. The execution of client process is not blocked subsequent to the message being accepted. 

{{< figure src="/posts/images/one-way-fire-and-forget-messaging.png" caption="figure 3 one-way, fire-and-forget messaging" >}}

In the One-way Messaging model, every message has a unique identifier. The Message Identifier (msgId) is critical:
 
* As it allows the Client to recover from outages (e.g. a network outage) by using simple re-try algorithms 
* As it allows the Server (the message recipient) to de-duplicate messages that are received as a consequence of client retries 

Typically asynchronous messaging allows for bursts of messages (that arrive too rapidly for the recipient to immediately consume) to queue (perhaps to disk), yet does not place additional load on the recipient by forcing it to start additional execution threads than it has been designed for or than have been pre-allocated. 

Messages can sit and wait in the queue because we are doing, and have accepted that we are doing, fire-and-forget. The Client is not forced to wait and has moved on to do something else. 

As messaging is asynchronous from top to bottom: 

* Resources are held for shorter durations 
* So reducing contention for resources 
* Resulting in fewer weaknesses of Garbage Collection systems from impacting our systems runtime performance 
* Consequently, our systems can sustain more load 

It should not be forgotten that all of these advantages come at the price of a performance penalty at low levels of load/demand. 

## Realising Message-based Processing 

This section briefly compares Web Service processing with message processing to make you think. It also shows how very simple software constructs used alongside of the messaging substrate deliver some powerful infrastructure. 

We are entirely familiar with defining a WCF Service in our Service Layer Presentation consisting of Service, Operation, Data and Fault Contracts, for example a Customer Service: 

{{< figure src="/posts/images/customer-service-and-operations.png" caption="figure 4 Service Layer - Customer Service and Operations contract" >}}

We are also familiar with several problems that commonly materialize as our Services tend to grow and become large 

* Creating difficulties for the Development and Maintenance Teams to collaborate on changes and repairs to the Services 
* Presenting difficulties whilst trying to apply authorisation, logging, instrumentation and other cross-cutting concerns 

By introducing asynchronous messaging we have an opportunity to exploit strongly-typed messages: 

{{< figure src="/posts/images/processing-strongly-typed-messages.png" caption="figure 5 a model for processing strongly-typed messages" >}}

In the above model, the Interface `IMessage` could be regarded as the WCF Data Contract equivalent and the Interface `IHandleMessages<T>` as an equivalent of the Service and Operations Contracts. So, we end up representing our Service Methods (as was) as messages of specific types: 

{{< figure src="/posts/images/processing-strongly-typed-messages.png" caption="figure 6 the message handler equivalent of the Customer Service" >}}

The implementation of the Interface IMessage is the equivalent of a <u style="cursor:help;text-decoration-style:dashed" title="Plain Old C# Object Data Transfer Object">POCO DTO</u> Class. 

By taking this approach (`IMessage and IHandleMessages<T>`) we are directed towards decomposing our handling of messages into different Classes, which in turn assist us in achieving a better observation of the Single Responsibility Principle. Examples of messaging substrates that adopt this approach include: NServiceBus, RhinoServiceBus, PheonixServiceBus, RServiceBus and J2EE Message-driven Beans. 

Clearly the implication of the above is that a strongly-typed message can be processed by strongly-typed message handler. But as our Solutions exist in an Object Universe, we can also arrange for a Message Handler to support multiple messages by exploiting inheritance. If we were to imagine our server-side message dispatcher framework was able to implement a kind of polymorphic behaviour then we could achieve a scenario of multiple message handlers that were capable of handling a given message type. This is the basis of being able to utilise a Pipeline Pattern whilst processing or consuming the messages received. The Pipeline Pattern allows for a dividing up of the processing of a message along the boundaries of our cross-cutting concerns or according to discrete parts of the Business Logic. It would also allow for the versioning of messages and the associated routing needs for those message versions. 

{{< figure src="/posts/images/message-handler-pipeline.png" caption="figure 7 a set of message handlers that could be used in a Pipeline" >}}

We could apply a convention in our IMessage definition such that there was a Body property for the Message Payload, and a Header container property for a collection of Message Meta-Data properties and other non-message payload stuff that would help us achieve other non-functional requirements, such as message de-duplication. 

## Messaging and software reliability 

Software is unreliable and is also subject to the unreliability inherent in its execution environment. Appropriate application of Messaging can assist us achieving a more robust outcome in the face of failures such as: 

* Server crashes 
* Network outages 
* Database or Data Server failures 
* Database deadlocks 

First of all, let's take a look at these types of failures for a conventional n-tier system involving a Client making requests of an application server over HTTP that in turn makes requests of a database server. 

{{< figure src="/posts/images/wheres-the-data-gone.png" caption="figure 8 when Servers crash... where's the Request data gone?" >}}

If the App on the WWW Server were to crash and recycle (which would cause the database to rollback), where has the Request Data gone to? Has it been lost? 

{{< figure src="/posts/images/wheres-the-database-gone.png" caption="figure 8 when a database crashes... where's the Request data gone?" >}}

The App on the WWW Server experiences an exception after making a request of the database on the DB Server. Can the App know if the database is up or down? Can the App recover? If it can't, where's the Request Data gone? 

If the DB Server is up, but it has become too busy to handle the new Request from the App (and is the cause of the exception) and the App recycles as a consequence then the App will leave Transactions unresolved on the DB Server. Standard timeouts will apply meaning that it could be 10 minutes before the DB Server will unilaterally decide to roll back the transaction. That is bad. 

But what is worse is that in rolling back our crash has not only lost the instantaneous Request Data but has likely contributed to the loss of 10 minutes worth of additional Requests. 

If the exception were as a result of deadlock detection by the DB Server, then again where has the Request Data gone? 

### How can messaging help? 

How can asynchronous messaging and the messaging substrate assist given these inevitable but invidious failures? 

{{< figure src="/posts/images/when-a-crash-happens.png" caption="figure 10 when a crash happens... messaging can help us recover without Request data loss" >}}

Having introduced messaging, our client deposits its Request Data to a durable queue directly, or <u style="cursor:help;text-decoration-style:dashed" title="But the preference is directly">via a HTTP Facade</u>, our App receives the message from the durable queue as part of a new distributed transaction. Our App goes onto to use the <u style="cursor:help;text-decoration-style:dashed" title="Distributed Transaction Corordinator">DTC</u> to enlist the Database Server into the same transaction and then sends Requests to the Database Server. Assuming all is well, then the transaction is committed via the DTC and both the database and the durable queue commit. Should an exception occur after the database has been enlisted into the transaction then it will rollback. The durable queue will always rollback. 

So, the answer as to where is the Request Data when a failure occurs is that it is in the durable queue, waiting for our App to process it; always. 

As the Request Data is not lost then: 

* Our App can retry 
* Our App can be re-started 

Without fear of data loss or additional complications. 

We can implement retry algorithms as a cross-cutting concern and potentially have varying strategies should we need them, e.g. exponential back-off and re-try. 

As we now control the behaviour in respect of Request Data when failures occur, we can also make decisions to keep or to retain a message. We could have a strategy to exponentially back-off and re-try a message for a limited number of times before concluding that the failing message is in fact a poisonous message. We could then re-route the poisonous message to another queue that in turn can then be associated with alternative resolution strategies, e.g. request intervention by an Administrator. In short, we don't lose Request Data unless we want to. 

__Assertion__: the adoption of this type of failure resolution does demand that the message handlers and the business process steps they represent do not rely on the ordering of any message's arrival to the message handler. 

## Messaging and Third-Party Web Services 

In the previous section we looked at failures associated with Web Service architectures and how the introduction of Messaging could increase the resilience of the software without resorting to excessive complications in our application code. 

However, our Solution Designs will often need to integrate with Third-Party Web Services in order to achieve our desired goals. It would not be usual for us to be able to cause a change in the implementation of the Third-Party Services to introduce Messaging; but we should try! 

So, does the need to communicate with Web Services seriously impact our ability to become more reliable? Well possibly. But here are some things we might try. 

First let's decompose the problem a little. 

{{< figure src="/posts/images/processing-pipeline.png" caption="figure 11 a processing pipeline involving a third-party web service call" >}}

In Figure 11, processes A, B, C and D represent steps in a Pipeline. Process Step C involves invoking the services of a Web Service, for example a Payment Processing Service. Process Step D involves persisting information to a database including the details about the Payment Authorisation that took place during Step C. 

Now, imagine that the database instructions failed (the reason does not matter), or our Pipeline procedure was stopped or the host server crashed after Step C completed but before Step D was committed. We have no record of the Payment Authorisation in our database, but the Payment Services have authorised a transaction and money will have been debited. This is not an acceptable outcome. 

How do we recover the situation? 

If we were to simply retry the Pipeline (as we have postulated previously in _How can messaging help?_) and the retry was successful, then our data would be consistent except that the Payment Services will now have two authorised transactions effectively creating a _double-dip_ for the required funds. This is not an acceptable outcome. 

That is unless the Payment Processing Web Service we are making use of is <u style="cursor:help;text-decoration-style:dashed" 
title="Immutable service: the outcome is the same and does not vary over time. So repeated, 
duplicate requests do not result in a different outcome to just one such request. In our 
example, sending the same Payment Request multiple times will only ever result in the same 
outcome as if we had sent the Payment Request once; a single authorised payment transaction.">immutable</u>. If it is immutable and our retry mechanism will create a _duplicate request_ of the Payment Services that it can detect then we have recovered the situation acceptably. 

OK, but what if we can't/don't create exact duplicates of requests when we retry so that the immutable 
Payment Service does not receive duplicate requests from our Pipeline? Let's change the design of the Pipeline a little: 

{{< figure src="/posts/images/modified-processing-pipeline.png" caption="figure 12 modified processing pipeline involving a third-party web service call" >}}

Step C no longer interacts directly with the Payment Processing Web Service. Instead it uses a message to indicate 
that a request for a Payment Authorisation is needed. This `Auth Payment Msg` is the subject of a transacted message 
send that is enlisted into the same distributed transaction as the eventual database updates in Step D. 
Should Step D succeed and be committed then Process P may receive the `Auth Payment Msg`. If the transaction 
failed for any reason, then effectively the `Auth Payment Msg` was never sent. 

Process P has the direct dependency with the Payment Processing Web Service. When it receives the `Auth Payment Msg` it 
will interact with the Payment Processor to obtain the Payment Authorisation. If failures occur, it will 
re-start and re-try using standard mechanisms to recover from the error condition. As the Payment 
Processor's Services are immutable, a duplicate request will not impact the overall outcome. 

Upon a successful Payment Authorisation response, another message is sent `Payment Authorised Msg` that should cause 
(via Process Q) the database to be updated with the results of the Payment Authorisation Request. 

So now all is good. 

However, if our assumption about the Payment Processor's Services being immutable did not hold to be true, 
then we have a whole new world of pain. As far as I can see things we have only a few options to resolving 
this issue and making our interactions with the Payment Processor robust and reliable and they are: 

* Ask the Payment Processor to make their Services immutable 
* Ask the Payment Processor to change their Services such that they use reliable messaging as the API Presentation rather than a Web Service 
* Use the query services provided by the Payment Processor prior to sending a payment authorisation request to discover whether such a request has been made before and accepted (in other words we had lost a prior response). But be aware if the query service utilises caching then an absence of data does not reliably indicate no request has been previously made and accepted due to stale data. There are techniques that can be used that may defeat or work around their cache, but they can look like and indeed behave similar to a Denial of Service attack. Presumably that would not be welcome 
* Give up and accept that this part of the System is going to forever be the cause of dissatisfaction 

## The Request/Response Pattern 

The Request-Response Pattern builds upon our core (and preferred) asynchronous messaging pattern by adding to the Request Messages meta-data an indication of where any responses are to be sent (known as the Return Address Pattern). 

{{< figure src="/posts/images/return-address-pattern.png" caption="figure 13 Request/Response using the Return Address Pattern" >}}

Therefore, the Request/Response Pattern requires 2 communication channels: 1 for Requests and 1 for Responses. 

Unlike Request/Response models we are more used to (e.g. HTTP), there is not an absolute need for the recipient of the Response to be the same as the initiator of the Request. We can make use of this new degree of freedom in our System Designs to assist with partitioning our processing and distribution of load, to make constructs like a Pipeline or to handle error scenarios such as poisonous messages. 

{{< figure src="/posts/images/partitioning-the-return-address-pattern.png" caption="figure 14 partitioning/distribution using the Return Address Pattern" >}}

In Figure 14, we have used the Return Address Pattern to implement a Request/Response model, but we have also taken advantage of this separation to distribute the processing of the Request and the Response between Server 1 and Server 3. A similar technique could be used to create a Pipeline or to manage poisonous letters. 

{{< figure src="/posts/images/return-address-pattern-error-mgmt.png" caption="figure 15 error management using the Return Address Pattern" >}}

## The Correlated Request/Response Pattern 

The Correlated Request/Response Pattern is used when the recipient of the Response must be able to match the Response received with the original Request that generated it. 

This Pattern builds upon the Request/Response Pattern by adding more Meta-data to the Response Message. This additional meta-data property is known as the Correlation Identity and its value is that of the Request Message's Message Identity. 

{{< figure src="/posts/images/correlated-request-response.png" caption="figure 16 Correlated Request/Response" >}}

Generally, it is implied that the Recipient of the Response is the same as the Initiator of the Request, as the Recipient has to have access to and a need to use state derived from the Request, such as the Request Message Identity.  

The Correlated Request/Response Pattern can prove useful when making a facade around asynchronous messaging for 
HTTP-based Clients. The Client's HTTP Request is received by an Asynchronous MVC/WebAPI Controller and the 
implied request creates asynchronous messages using Correlated Request/Response so that the Controller can 
(asynchronously) receive the expected Response. The additional advantage of using an Asynchronous Controller 
along with Asynchronous Messaging is that the <u style="cursor:help;text-decoration-style:dashed"
title="Worker Threads are from a pre-allocated Pool and as such are a very finite resource. 
Often times, making efficient use of these threads and not holding on to them can make a 
significant difference into the scale and throughput achieved by any given deployment.">IIS/ASP.Net Application Pool Worker Thread</u> can be returned back 
to IIS/ASP.Net early and be re-used to service additional HTTP Requests. 

## The Request/Multi-Response Pattern 

The Request/Multi-Response Pattern builds on top of the Request/Response Pattern. It allows for the Recipient of the Request to respond with several messages, which could also be different message types. 

{{< figure src="/posts/images/request-multi-response.png" caption="figure 17 Request/Multi-Reponse" >}}

There can be several scenarios where the Request/Multi-Response Pattern could prove useful. An interesting one is in regard of the Pipeline Pattern. Here an individual Request initiates a number of Pipeline Steps, any and all of those Steps could be allowed to generate a Response (or Responses). 

Decomposing a problem-solution using an asynchronous messaging pipeline approach can remove the need to create Server Facades or Service Layer Business Logic Orchestration as those needs become subsumed into the Message Pipeline. By using subscription to recruit message handlers into a pipeline for a given message type we have a new way of thinking about our solution design and decomposition that has lower coupling and built-in extensibility. Most of the coupling that does remain is the type of coupling we already know has to be present; semantic interoperability and boundary contexts. 

{{< figure src="/posts/images/message-pipeline-decoupling.png" caption="figure 18 Message Pipeline decouling" >}}

## The Publish/Subscribe Pattern 
This is a well-known pattern used in both Messaging and Event-driven systems. In all cases its name is a bit of a misnomer as it implies a reversal of the actual sequence between the roles of Publisher and Subscriber. Renaming the Pattern as Subscribe/Publish would be more accurate as it reflects the actual sequence; subscription must take place prior to publication for the parties to communicate. But Publish/Subscribe it is, or Pub/Sub for short. 

{{< figure src="/posts/images/publish-subscribe-pattern.png" caption="figure 19 the Publish/Subscribe Pattern" >}} 

There are many parallels between Pub/Sub and the Request/Multi-Response Pattern. The key difference being that Pub/Sub does not rely on or need a Correlation Identity as part of the Message Meta-Data. 

There is a contract contained in the Pub/Sub Pattern, in that the Publisher must publish its messages to each and every Subscriber (not broadcast). Consequently, the Publisher must make the list of Subscribers durable so that continuation after failures is possible. 

There is contained within the Pattern a Logical/Physical Design dilemma. If the System was load balanced running several instances of a particular Subscriber (Service A), when the Publisher (Service B) publishes a Message, should Service B send copies of the Message to all of the Service A instances or to just one of them? 

It is my opinion that Service B should not increase its extent of spatial coupling with Service A by caring that Service A has been deployed in a robust load balanced configuration. As such it should publish its Message only once to Service A (the logical entity that is Service A). To do otherwise and allow the extent of spatial coupling between Service A and Service B to increase by having Service B send its published Messages to each and every instance of Service A introduces the question of what happens to the System if one or more published Messages are missed by one or more instances of Service A. The permutations are huge and the implications quite wicked, as such I see this as an irrecoverable situation. 

This does mean that the implementation of the Subscriber needs to take account of this design decision. The state that Service A creates and maintains as a result of receiving the published messages from Service B must be kept in a durable, distributed cache accessible to all instances of Service A. 

## Topics, Topic Hierarchies and Polymorphism 

A Topic is a message meta-data property that can be added to the messaging substrate. It is generally implemented as a string. 
There is a parallel to be drawn between the concept of a message's Topic and an Event Type. 

Messaging systems that express the concept of Topics often use them as a way of routing messages and in particular in respect of Pub/Sub scenarios. 

Topics can be used to represent semantic concepts and organised into hierarchies, for example Topic names could be: 

* `Products`,
* `Products.AvailableToSell`  
* and `Products.AvailableToSell.OnOffer` 

Topics can be used to create interesting scenarios that involve, what I can only describe as, polymorphism. For example, suppose that our semantic concept associated with the structuring of Topics allows for Topic A to inherit from Topics B, C and D. Then Subscribers could subscribe to any or all of A, B, C or D and still receive the messages published as Topic A. 

RabbitMQ and Azure Service Bus Queues tend to extensively use the concept of Topics. 

## Commands and Events 

A Message representing a Command is almost invariably a message sent by a Client. As any information 
emitted by a Client is inherently _untrusted_ by its recipients (Servers), it is useful to model Commands 
as POCOs with in-built Validation that ensures the validity of any Command instance. The principle 
adopted here is that Clients are not the single source of truth and so anything they say is not to be trusted. 

Whereas Servers are each the authority over their part of the Solution Domain and possess the single version of truth. As such it is useful to look upon the messages sent by a Server as being Events and to model Events as Interfaces. As they are Interfaces then they can support multiple inheritance and consequently support polymorphism. 

In a .Net world, the standard serializers (e.g. the XML Serializer) do not support serializing of Interfaces and the messaging substrate would need to provide its own serialisation technology; e.g. by making use of Dynamic Proxies. It should be noted that this custom serialisation increases the amount of platform coupling that is present in the Solution Design, but it may be found to be appropriate and so not necessarily bad. 

### In-process vs. Distributed Events 

It is typical to find that _events_ communicated within a process boundary (i.e. in-process) are 
actually sent via synchronous means using in-memory constructs. It also typical that _events_ 
sent between process boundaries, i.e. in a distributed system, are sent asynchronously. 

This difference (synchronous and asynchronous) matters in respect of the certainty that the Publisher can infer about the point in time by when Subscribers are up to date. Synchronous invocation allows the Publisher to infer when state transitions occur, but asynchronous invocations mean that the Publisher cannot know when, or even if, all of its Subscribers are up to date. 

## Out of order Events 

The problem of receiving and processing Events out of order is probably best illustrated by example. 

Imagine a distributed system that involves a Sales Service, a Billing Service and a Shipping 
Service. When an Order is accepted by the Sales Service, it publishes an Event called _Order Accepted_. 
Both the Billing and Shipping Services subscribe to the _Order Accepted_ Event. 

The Shipping Service is constrained by a business rule that states: 

> An Order cannot be shipped until it is accepted and has been billed 

So the Shipping Service also subscribes to the _Order Billed_ Event published by the Billing Service. 

{{< figure src="/posts/images/example-distribution-system.png" caption="figure 20 our example distributed system" >}} 

Now consider if the Shipping Service is implemented assuming that the Order Accepted event will always arrive before the Order Billed event. The resultant System will probably pass its tests and be put into Production. Intermittently we will find that it fails to ship all of our accepted and billed Orders. The root cause will be found that occasionally, the Order Billed and Order Accepted events for an Order arrive in the opposite sequence to that expected. 

How should the System be amended to eliminate this weakness? 

Solution proposals include: 

1) Have the Shipping Service check that the events arrive in the expected order and to throw an exception when it is detected that they have arrived out of sequence 

<div style="padding-left:3em">
<p>This could be seen as a case of <i>using Exceptions to implement control of flow</i>, which is generally considered to be an anti-pattern and should be avoided. If it is control of flow then we are flagging an error condition when there is no error present and that can be confusing for all concerned. </p>
<p>Also, exception handling is an expensive undertaking for the run-time processes concerned; the expense is proportionate to the stack depth at the point when the exception occurs. It is true to say that good service design tends to produce service implementations that do not exhibit deep stacks, which does mitigate that sort of expense. However that is missing the point, handling flow of control using exceptions and error handling will eventually involve the poison letter handling and error queue of the messaging substrate. Our contract on the occupancy of the Error Queue is that they all signal a problem that needs investigation. That is always expensive.</p>
</div>

2) Have the Shipping Service detect when an Order Billed event arrives out of order and send it to the back of the Queue to be re-processed again at some future point 

<div style="padding-left:3em">
<p>This is better than solution candidate 1. However it does not mitigate the risk of logical failures in the Billing Service or the Sales Service sending the wrong Order Identity in their published events. </p>
</div>

### The Error Queue 

The above scenario begins to question our understanding of the Error Queue used to handle poison 
messages. If we are not careful in the use we make of the Error Queue then we 
will create a new form of chaos. So let's set down some principles: 

* If a Message is in the Error Queue then something is wrong 
* If an exception has been logged, but there is nothing in the Error Queue then the System Administrators can conclude that either the System has recovered from the conditions that gave rise to the exception, or the System is about to go into an error state and something will appear in the Error Queue 
* Exceptions are thrown and logs are raised for exceptional purposes and not a surrogate for flow of control 

This leads us to be able to establish a new paradigm that will be of great assistance to Administrators.  

> Actionable Exceptions and Logs are those that can be associated with a Message in the Error Queue. 

Administrators should periodically data mine the Logs to validate that the rate at which types of exceptions are being raised from particular exception sources are within expected and accepted bounds. Administrators can monitor the quantity of and rate of arrival of messages in the Error Queue as a key metric of overall System Health. 