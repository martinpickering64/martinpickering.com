+++
categories = "Software"
date = 2022-01-30T14:50:34Z
summary = "Authorisation is about determining what a user can do"
tags = ["Security"]
title = "Authorisation in ASP.Net Core"

+++
Security \[_in software_\] is the collective term for six principles: Identity, Authentication, Authorisation, Integrity, Privacy and Non-Repudiation. This Post is about how Authorisation can be added to an ASP.Net Core Web Application.

Authorisation determines what a user can do. The identity of a User can be authenticated or anonymous. Authenticated meaning that the offered Identity has successfully traversed some Authentication mechanism, whilst anonymous meaning that Authentication has not occurred.

## Authorisation Types

There are various types of authorisation supported: simple, role-based, claims-based, and policy-based.

## Simple Authorisation

Simple authorisation is almost always about differentiating requests originating from either an anonymous user or an authenticated user, allowing or denying access to one or the other.

The [`AuthorizeAttribute`](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authorization.authorizeattribute?view=aspnetcore-6.0) is used to decorate a Controller Class, a Controller Action or a Razor Page. The `AuthorizeAttribute` has an opposite in the [`AllowAnonymousAttribute`](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authorization.allowanonymousattribute?view=aspnetcore-6.0)

The following example uses `AuthorizeAttribute` in its default form to require that all Action Methods of the Account Controller be limited to authenticated users only. The addition of `AllowAnonymousAttribute` to the Login Action Method overrides the `AuthorizeAttribute` so permitting anonymous users to access the Login feature.

```cs
[Authorize]
public class AccountController : Controller
{
   [AllowAnonymous]
   public ActionResult Login() {}

   public ActionResult Logout() {}   

}
```

Using `AuthorizeAtttribute` with a Razor Page is demonstrated below:

```cs
[Authorize]
public class LogoutModel : PageModel
{
   public async Task OnGetAsync() {}

   public async Task<IActionResult> OnPostAsync() {}
}
```

{{< alert warning >}}
The `AuthorizeAttribute` is not supported with Razor Page handlers.
{{< /alert >}}

It can sometimes be desirable to cause the default behaviour of a Web Application to require that Users be authenticated. This can reduce the amount of clutter due to `AuthorizeAttribute` needing to be added to every Controller etc. It can also safeguard against an accidental omission of the `AuthorizeAttribute`.

```cs {linenos=true}
var builder = WebApplication.CreateBuilder(args);
// various Web Application start up and initialisation code here…
builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
                                 .RequireAuthenticatedUser()
                                 .Build();
});
```

Once the default behaviour of requiring authentication is established (_see lines 3-8 in the code above_) then `[AllowAnonymous]` can be used to override the default behaviour wherever it is needed.

## Role-based Authorisation

In older times it was common to see authorisation by role being used and it was actively promoted within the Windows Community. However, it comes with several significant drawbacks. With the advent of ASP.Net Core claims-based authentication was introduced and along with-it authorization policy infrastructure. Role-based authorisation still exists but is now built on top of claims authentication and policy authorisation; a role is a [specific type of claim](https://docs.microsoft.com/en-us/dotnet/api/system.security.claims.claimtypes.role?view=net-6.0). So, it can still be used but still comes with all its baggage. Perhaps it is now better to not bother with Role-based authorisation and instead use Policy-based authorisation instead.

Our friend the `AuthorizeAttribute` is required again. This time we specify the Role restrictions by using the Roles property of the `AuthorizeAttribute`. Should Role-based authorisation fit your need than the following sample code illustrates what is involved:

```cs
[Authorize(Roles = "HRManager, CLevel")]
[Authorize(Roles = "PowerUser")]
public class AccountController: Controller
{
   public IActionResult ViewUsers()
   {
      return View();
   }
} 
```

Note: The above example restricts use of the `AccountController` to Users who are members of either the `HRManager` or `CLevel` Roles, and they must also be a member of the `PowerUser` Role.

When configuring the Web Application don’t forget to append the [IdentityBuilder.AddRoles](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.identity.identitybuilder.addroles?view=aspnetcore-6.0) method whilst adding Identity to the Web Applications Services.

## Claims-based Authorisation

Claims-based authorisation involves checking for the existence of or the value of a claim associated with the User’s identity. For example, a claim might be about a user’s email address. The existence of the claim signifies that the user has an email address, and the value of the claim informs what their email address is. The simplest claims-based authorisation checks for the existence of a particular claim.

`AuthorizeAttribute` can be used to assert where a claim-based authorisation must be tested. This time we use its Policy property. Therefore, to specify that the requesting user must possess a claim or possess a claim with a specific value one must first register a policy expressing the claim requirements. Then the `[Authorize(Policy=”somePolicyName”)]` can be used to decorate Controller Classes, Action Methods and Razor Pages (not Razor Page Handlers) as desired.

To register a policy call the [UseAuthorzation](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.builder.authorizationappbuilderextensions.useauthorization?view=aspnetcore-6.0) [BuilderExtension](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.builder.authorizationappbuilderextensions?view=aspnetcore-6.0) method:

```cs
builder.Services.AddAuthorization(options =>
{
   options.AddPolicy("needsEmail", 
                     policy => policy.RequireClaim(ClaimTypes.Email));
   options.AddPolicy("calledMartin", policy =>
                     policy.RequireClaim(ClaimTypes.GivenName, new [] { "Martin"}));
   options.DefaultPolicy(policy => 
                         policy.RequireClaim(ClaimTypes.Country, new [] {“UK”}));
});
```

To use a Policy:

```cs
[Authorize]
public class CommunicationController : Controller
{
  [Authorize(Policy="needsEmail")]
  [Authorize(Policy="calledMartin")]
  public IActionResult ContactMe() { }
}
```

The Web Application Builder supports a default policy, which is used whenever the `AuthorizeAttribute` is used in its default form of `[Authorize]`

## Policy-based Authorisation

The foundational building blocks of Authorisation in ASP.Net Core are:

* Policies
* Authorisation Requirements
* Authorisation Handlers

Role-based and Claims-based authorisation have been built out of these foundations. They are also available to Developers to build rich, re-usable and testable authorisation models.

### Authorisation Requirements

A Requirement is a class that implements the [IAuthorizeRequirement](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authorization.iauthorizationrequirement?view=aspnetcore-6.0) marker interface. The class is a collection of data points that are used to evaluate the Requester (current user principal) by a policy. A parameterized country of residence requirement could be implemented as follows:

```cs
public class CountryOfResidenceRequirement : IAuthorizationRequirement
{
    public CountryOfResidenceRequirement(string isoCountryCode) =>
        IsoCountryCode = isoCountryCode;

    public string IsoCountryCode { get; }
}
```

Note: it is not mandatory for a Requirement to have data or properties.

### Authorisation Handlers

A Handler is responsible for the evaluation of an Authorisation Requirement and its properties. An [AuthorizationHandlerContext](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authorization.authorizationhandlercontext?view=aspnetcore-6.0) is available to the Handler to aid evaluation. A Requirement may have multiple Handlers and a Handler may handle one or several types of Requirements.

To create a Handler capable of handling a single type of Requirement implement a Class that inherits from [AuthorzationHandler<TRequirement>](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authorization.authorizationhandler-1?view=aspnetcore-6.0). For example:

```cs
public class CountryOfResidenceHandler : AuthorizationHandler<CountryOfResidenceRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context, 
        CountryOfResidenceRequirement requirement)
    {
        var countryClaim = context.User.FindFirst(
            c => c.Type == ClaimTypes.Country 
                 && c.Issuer == "http://example.com");
       if (countryClaim?.Value == requirement.IsoCountryCode)
       {
          context.Succeed(requirement);
       }
       return context.Task.CompletedTask;
    }
}
```

Should it be desirable to implement a Handler that is responsible for several different types of Requirements then implement the [`IAuthorizationHandler`](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authorization.iauthorizationhandler?view=aspnetcore-6.0) Interface. The Handler must implement the `Task HandleAsync(AuthorizationContext)` Interface Method. The `AuthorizationContext` object has a property called `PendingRequirments` that lists Requirements that have yet to be marked as successful. The Handler may examine the list and pull out those Requirements that it can evaluate. For each requirement that the Handler evaluates to be satisfied then it calls `context.Succeed(requirement)`. Finally, the Handler returns `Task.CompletedTask`

A Handler indicated a Requirement is satisfied by calling `context.Succeed(requirement)`, passing the instance of the requirement that was satisfied. A Handler indicates completion by returning `Task.Completed`. Generally, Handlers avoid explicitly handling failure as other Handlers may succeed. However, when authorisation failure needs to be guaranteed regardless of the success of other Handler then a call of `context.Fail()` offers such a guarantee.

Having implemented the Authorisation Requirements and the Authorisation Handlers a couple more things need to happen before they come to life. First, an Authorisation Handler must be registered in the Web Applications collection of Services, e.g.

```cs
builder.Services.AddSingleton<IAuthorizationHandler, CountryOfResidenceHandler>();
```

Second, policies need to be registered that make use of Requirements, e.g.

```cs
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("residentInUK", policy =>
        policy.Requirements.Add(new IsoCountryRequirement("GBR")));
});
```

When it is possible to clearly express in simple code how a Policy can be evaluated then it is possible to use a `func` to fulfill the Policy. For example,

```cs
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("hasUkEmail", policy =>
        policy.RequireAssertion(context => context.User.HasClaim(c =>
            c.Type == ClaimTypes.Email && (c.Value.EndsWith(".gb") || c.Value.EndsWith(".uk")))));
});
```

## Specialised Policy-based Authorisation

The above has shown the common or preferred ways by which Policy-based authorisation is achieved; namely, `AuthorizationOptions.AddPolicy` calls during authorisation service configuration. Circumstances may dictate that registration of policies this way is somehow inappropriate. A custom [`IAuthorizationPolicyProvider`](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authorization.iauthorizationpolicyprovider?view=aspnetcore-6.0) offers an alternative way to control how authorisation policies are supplied.

Having implemented a Class that inherits from `IAuthorizationPolicyProvider` it needs to be registered with the Web Application’s Dependency Injection sub-system to replace the default policy provider:

```cs
services.AddSingleton<IAuthorizationPolicyProvider, MyPolicyProvider>();
```