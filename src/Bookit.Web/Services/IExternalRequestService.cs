﻿using Bookit.Web.Data.Models;
using System.Threading.Tasks;

namespace Bookit.Web.Services;

public interface IExternalRequestService
{
    Task<TResponse?> MakeRequestAsync<TRequest, TResponse>(ClientOrg clientOrg, TRequest data) where TResponse : class;
}
