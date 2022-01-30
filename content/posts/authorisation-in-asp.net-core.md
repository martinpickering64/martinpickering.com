+++
categories = "Software"
date = 2022-01-30T14:50:34Z
draft = true
summary = "Authorisation is about determining what a user can do"
tags = ["Security"]
title = "Authorisation in ASP.Net Core"

+++
Security \[_in software_\] is the collective term for five principles: Identity, Authentication, Authorisation, Integrity, Privacy and Non-Repudiation. This Post is about how Authorisation can be added to an ASP.Net Core Web Application.

Authorisation determines what a user can do. The identity of a User can be authenticated or anonymous. Authenticated meaning that the offered Identity has successfully traversed some Authentication mechanism, whilst anonymous meaning that Authentication has not occurred.

## Authorisation Types

There are various types of authorisation supported: simple, role-based, claims-based, and policy-based.

## Simple Authorisation

Simple authorisation is almost always about differentiating requests originating from either an anonymous user or an authenticated user, allowing or denying access to one or the other.

The [`AuthorizeAttribute`](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authorization.authorizeattribute?view=aspnetcore-6.0) is used to decorate a Controller Class, a Controller Action or a Razor Page. The `AuthorizeAttribute` has an opposite in the [`AllowAnonymousAttribute`](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authorization.allowanonymousattribute?view=aspnetcore-6.0)

The following example uses `AuthorizeAttribute` is its default form to require that all Action Methods of the Account Controller be limited to authenticated users only. The addition of `AllowAnonymousAttribute` to the Login Action Method overrides the `AuthorizeAttribute` so permitting anonymous users to access the Login feature.
{{<highlight csharp>}}
\[Authorize\]
public class AccountController : Controller
{
\[AllowAnonymous\]
public ActionResult Login() {}

    public ActionResult Logout() {}   

}
{{</highlight>}}
Using AuthorizeAtttribute with a Razor Page is demonstrated below:
{{<highlight csharp>}}
\[Authorize\]
public class LogoutModel : PageModel
{
public async Task OnGetAsync() {}

    public async Task<IActionResult> OnPostAsync() {}

}
{{</highlight>}}
The `AuthorizeAttribute` is not supported with Razor Page handlers.

It can sometimes be desirable to cause the default behaviour of a Web Application to require that Users be authenticated. This can reduce the amount of clutter due to `AuthorizeAttribute` needing to be added to every Controller etc. It can also safeguard against an accidental omission of the `AuthorizeAttribute`.

{{<highlight csharp "linenos=true,hl_lines=3-6">}}

var builder = WebApplication.CreateBuilder(args);

// various Web Application start up and initialisation code here…

builder.Services.AddAuthorization(options =>

{

    options.FallbackPolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();

});

{{</highlight>}}

Once the default behaviour of requiring authentication is established (_see highlighted code above_) then `[AllowAnonymous]` can be used to override the default behaviour wherever it is needed.