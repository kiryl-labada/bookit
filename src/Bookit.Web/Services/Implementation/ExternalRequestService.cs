using Bookit.Web.Data.Models;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Bookit.Web.Services.Implementation;

public class ExternalRequestService : IExternalRequestService
{
    public async Task<TResponse?> MakeRequestAsync<TRequest, TResponse>(ClientOrg clientOrg, TRequest data) where TResponse : class
    {
        var httpRequest = new HttpRequestMessage(HttpMethod.Post, clientOrg.ServiceUrl);
        var authString = Convert.ToBase64String(
            Encoding.UTF8.GetBytes($"{clientOrg.ServicePublicApiKey}:{clientOrg.ServiceSecretApiKey}"));
        httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Basic", authString);

        var payload = JsonSerializer.Serialize(data);
        httpRequest.Content = new StringContent(payload, Encoding.UTF8, "application/json");

        TResponse? response = null;
        using (var httpClient = new HttpClient())
        {
            var httpResponse = await httpClient.SendAsync(httpRequest);
            if (httpResponse.Content != null)
            {
                var responseString = await httpResponse.Content.ReadAsStringAsync();
                response = JsonSerializer.Deserialize<TResponse?>(responseString);
            }
        }

        return response;
    }
}
