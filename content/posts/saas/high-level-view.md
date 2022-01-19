+++
categories = "Software"
date = 2022-01-19T17:13:57Z
summary = "An aerial view of herald"
tags = ["SAAS", "herald"]
title = "High-level View"

+++
**Review**: herald is the name I have given to a SAAS Starter Kit. The kit does not implement a SAAS Product, instead it provides the encompassing elements that are common to any SAAS product. There is a series of articles about herald, and more on their way, that can be tracked down by looking at the [herald tag on this website](/tags/herald).

The following diagram presents a high-level view of herald.

![](/uploads/highlevelview.svg)

There are two domains:

1. The _product_ Domain: where the software and services of the SAAS Product exist
2. The _herald_ Domain: where the software and services of herald exist

Users of the SAAS Product (_tenant users_) interact with the Product’s Applications and services via the _product_ Domain. Beforehand they must authenticate themselves via the identity features located in the _herald_ Domain. If the SASS Product offers an API and an associated Developer experience, then the _product_ Domain also has a Developer Portal.

Visitors wishing to sign-up to be able to make use of the SAAS Product will do so using herald’s sign-up application. This would create a new tenancy within the SAAS Product. Alternatively, a herald Administrator can use the admin console to create a new tenant on-behalf of the user.

Suitably authorised tenant users are also able to interact with herald’s tenant admin app to manage their tenancy, review their bills etc.

To support all these interactions herald has several services:

* **Registrar**: creates new tenants and onboards them to SAAS Product. It is mostly about orchestrating interactions with User Manager, Tenant Manager and Tenant Provisioner to complete the onboarding experience
* **Tenant Manager**: all the configuration and operations that can be performed on a tenant; including activating and disabling tenants and tenant functionality
* **User Manager**: used to manage tenant users; including disable all users, and enable all users by tenancy
* **Tenant Provisioner**: handles provisioning and de-provisioning of a tenant. This service differentiates its activities between tenants that are part of a pool and those that are provisioned in a silo
* **Billing**: provides features to assemble a tenant’s bill as well as the ability for a tenant admin/herald admin to review (_their_) bills

It is envisaged that the web applications in the _herald_ Domain will be Static Web Apps interacting with Web APIs. It is hoped that the APIs (_and perhaps their persistent data stores_) can be created from Azure Serverless Services (_Azure Functions_). Azure API Management and Azure Active Directory for B2C will also be important Azure platform services used to implement the herald Domain.