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

```cs
[Authorize]
public class AccountController : Controller
{
   [AllowAnonymous]
   public ActionResult Login() {}

   public ActionResult Logout() {}   

}
```

Using AuthorizeAtttribute with a Razor Page is demonstrated below:

```cs
[Authorize]
public class LogoutModel : PageModel
{
   public async Task OnGetAsync() {}

   public async Task<IActionResult> OnPostAsync() {}
}
```

The `AuthorizeAttribute` is not supported with Razor Page handlers.

It can sometimes be desirable to cause the default behaviour of a Web Application to require that Users be authenticated. This can reduce the amount of clutter due to `AuthorizeAttribute` needing to be added to every Controller etc. It can also safeguard against an accidental omission of the `AuthorizeAttribute`.

```cs {linenos=true,hl_lines=["3-8"]}
var builder = WebApplication.CreateBuilder(args);
// various Web Application start up and initialisation code here…
builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
                                 .RequireAuthenticatedUser()
                                 .Build();
});
```

Once the default behaviour of requiring authentication is established (_see highlighted code above_) then `[AllowAnonymous]` can be used to override the default behaviour wherever it is needed.

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
