using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Filters;


namespace ApteanSalesFlow.App_Start
{

    public class JwtAuthenticationAttribute : ActionFilterAttribute, IAuthenticationFilter
    {

        public static bool ValidateToken(string token)
        {

            var simplePrinciple = GetPrincipal(token);
            if (simplePrinciple == null)
            {
                return false;
            }
            try
            {
                var identity = simplePrinciple.Identity as ClaimsIdentity;


                if (identity == null)
                    return false;

                if (!identity.IsAuthenticated)
                    return false;

                //var userName = identity.FindFirst(ClaimTypes.Name);

                //username = userName?.Value;

                var jwtExpValue = long.Parse(simplePrinciple.Claims.FirstOrDefault(x => x.Type == "exp").Value);
                //DateTime expirationTime = DateTimeOffset.FromUnixTimeSeconds(jwtExpValue).DateTime;
                TimeSpan t = DateTime.UtcNow - new DateTime(1970, 1, 1);
                int secondsSinceEpoch = (int)t.TotalSeconds;
                if (secondsSinceEpoch > jwtExpValue)
                    return false;

            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return false;
            } // More validate to check whether username exists in system

            return true;
        }

        public static ClaimsPrincipal GetPrincipal(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadToken(token) as JwtSecurityToken;

                if (jwtToken == null)
                    return null;

                var symmetricKey = Convert.FromBase64String("db3OIsj+BXE9NZDy0t8W3TcNekrF+2d/1sFnWG4HnV8TZY30iTOdtVWJG8abWvB1GlOgJuQZdcF2Luqm/hccMw==");

                var validationParameters = new TokenValidationParameters()
                {
                    RequireExpirationTime = true,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    IssuerSigningKey = new SymmetricSecurityKey(symmetricKey)
                };

                SecurityToken securityToken;
                var principal = tokenHandler.ValidateToken(token, validationParameters, out securityToken);

                return principal;

            }
            catch (Exception)
            {
                //should write log
                return null;
            }
        }

        public async Task AuthenticateAsync(HttpAuthenticationContext context, CancellationToken cancellationToken)
        {
            HttpRequestMessage request = context.Request;
            var token = context.Request.Headers.GetValues("Cookie").First().ToString().Substring(8);
            //string username = "";
            if (!ValidateToken(token))
            {
                context.ErrorResult = new AuthenticationFailureResult("Unauthorized", request);
            }
            return;
        }

        public Task ChallengeAsync(HttpAuthenticationChallengeContext context, CancellationToken cancellationToken)
        {
            //return Task.FromResult(new HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized));
            var challenge = new AuthenticationHeaderValue("Basic");
            context.Result = new AddChallengeOnUnauthorizedResult(challenge, context.Result);
            return Task.FromResult(0);
        }
    }
}