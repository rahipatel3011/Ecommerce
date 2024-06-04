
using Microsoft.AspNetCore.Authentication;
using System.Net.Http.Headers;

namespace Mango.Services.OrderApi.Utility
{
    public class BackendTokenDelegateHandler: DelegatingHandler
    {
        private readonly IHttpContextAccessor _context;

        public BackendTokenDelegateHandler(IHttpContextAccessor context) {
            _context = context;
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            string token = await _context.HttpContext.GetTokenAsync("Bearer", "access_token");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            return await base.SendAsync(request, cancellationToken);
        }
    }
}
