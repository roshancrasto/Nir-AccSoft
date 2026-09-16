using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using DemoProject.Business.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace DemoProject.API.Filters
{
    public class PermissionFilter : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var user = context.HttpContext.User;
            if (!user.Identity.IsAuthenticated)
            {
                await next();
                return;
            }

            // Skip for Admin
            if (user.IsInRole("Admin"))
            {
                await next();
                return;
            }

            var path = context.HttpContext.Request.Path.Value.ToLower();
            var method = context.HttpContext.Request.Method;

            // Define skip paths
            if (path.StartsWith("/api/security") || path.StartsWith("/api/auth"))
            {
                await next();
                return;
            }

            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            int userId = int.Parse(userIdClaim.Value);
            var securityService = context.HttpContext.RequestServices.GetService<ISecurityService>();
            
            var permissions = await securityService.GetUserPermissionsAsync(userId);

            // We map the requested route to a MenuRoute. E.g. /api/category -> /masters/categories (frontend route)
            // It's tricky to map backend API routes to frontend Menu routes dynamically without a lookup.
            // Requirement: "Every API should validate: CanView, CanAdd, CanEdit, CanDelete based on User Permission."
            // So we need to map API controllers to MenuIds, or MenuRoutes.
            // Since it's complex, let's create a custom attribute [MenuAuthorize(MenuRoute = "/masters/categories", Action = "Add")]
            // Or we just allow the request if they have ANY valid permission for now, or map it directly.
            // A simpler approach: use a custom attribute on controllers to specify the menu route.
            
            var controllerName = context.RouteData.Values["controller"]?.ToString();
            
            var routeMap = new System.Collections.Generic.Dictionary<string, string>(System.StringComparer.OrdinalIgnoreCase)
            {
                { "Category", "/masters/categories" },
                { "Donor", "/masters/donors" },
                { "EventGroup", "/masters/event-groups" },
                { "LanguageMaster", "/masters/languages" },
                { "EventCategory", "/masters/event-categories" },
                { "EventDetail", "/masters/event-details" },
                { "Vendor", "/masters/vendors" },
                { "Receipt", "/transactions/receipts" },
                { "Payment", "/transactions/payments" },
                { "Reimbursement", "/transactions/reimbursements" },
                { "Asset", "/transactions/assets" },
                { "BankTransfer", "/transactions/bank-transfers" },
                { "BoxCollection", "/transactions/box-collections" },
                { "GovtGrant", "/transactions/govt-grants" },
                { "OpeningBalance", "/transactions/opening-balances" },
                { "InternalAccounts", "/internal/accounts" },
                { "Report", "" } // Special case for reports, handled below
            };

            var endpoint = context.HttpContext.GetEndpoint();
            var menuAuthAttribute = endpoint?.Metadata.GetMetadata<MenuAuthorizeAttribute>();
            
            string menuRoute = menuAuthAttribute?.MenuRoute;
            if (string.IsNullOrEmpty(menuRoute) && controllerName != null && routeMap.ContainsKey(controllerName))
            {
                menuRoute = routeMap[controllerName];
            }

            if (!string.IsNullOrEmpty(menuRoute))
            {
                var permission = permissions.FirstOrDefault(p => string.Equals(p.MenuRoute, menuRoute, System.StringComparison.OrdinalIgnoreCase));
                
                if (permission == null || !permission.CanView)
                {
                    context.Result = new ForbidResult();
                    return;
                }

                if ((method == "POST" && !permission.CanAdd) ||
                    (method == "PUT" && !permission.CanEdit) ||
                    (method == "DELETE" && !permission.CanDelete))
                {
                    context.Result = new ForbidResult();
                    return;
                }
            }
            else if (controllerName != null && controllerName.Equals("Report", System.StringComparison.OrdinalIgnoreCase))
            {
                // For reports, we check based on the action name since it's a single controller
                var actionName = context.RouteData.Values["action"]?.ToString();
                string reportRoute = actionName?.ToLower() switch
                {
                    "receiptregister" => "/reports/receipt-register",
                    "paymentregister" => "/reports/payment-register",
                    "eventgrouppnl" => "/reports/event-group-pnl",
                    "incomeexpenditure" => "/reports/income-expenditure",
                    "eventexpenses" => "/reports/event-expenses",
                    "receiptspayments" => "/reports/receipts-payments",
                    "accountledger" => "/reports/account-ledger",
                    _ => ""
                };

                if (!string.IsNullOrEmpty(reportRoute))
                {
                    var permission = permissions.FirstOrDefault(p => string.Equals(p.MenuRoute, reportRoute, System.StringComparison.OrdinalIgnoreCase));
                    if (permission == null || !permission.CanView)
                    {
                        context.Result = new ForbidResult();
                        return;
                    }
                }
            }
            
            await next();
        }
    }

    public class MenuAuthorizeAttribute : System.Attribute
    {
        public string MenuRoute { get; set; }
    }
}
