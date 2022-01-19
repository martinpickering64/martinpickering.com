+++
categories = "Software"
date = 2022-01-19T13:29:28Z
summary = "Herald's tenancy model"
tags = ["herald", "SAAS"]
title = "Tenancy Model"

+++
![Shows shared and silo tenants](/uploads/tenancymodel.svg "The Herald Tenancy Model")

As herald is the executive services for a SAAS Product, herald is not a multi-tenant deployment. However, it is the supervisor for the SAAS Product, which is multi-tenant. Therefore, herald must be somewhat opinionated about the SAAS Product tenancy models that it is willing to work alongside.

One of the tenancy models supported by herald is the shared or pooled tenants. This is where an instance of the SAAS Product is shared by multiple tenants. The size and amount of resources allocated to the pool flexing as the demands of the tenants change. There could be one or several such pools for differing purposes, e.g. a Demonstration pool and a Production pool.

Another tenancy model supported by herald is the silo tenant. Each silo being a complete instance of the SAAS Product that has been dedicated to a single tenant. Again flexing as the tenant's demands change. The silo shares nothing from the pool(s) and vice-versa. There can be zero, one or more silos.

There is only one instance of herald and there is only ever one tenant for herald; the SAAS Product Owner.