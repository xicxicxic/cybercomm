// <copyright file="IFeedDataRepository.cs" company="Microsoft">
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
// </copyright>

using System.Collections.Generic;
using System.Threading.Tasks;

namespace Microsoft.Teams.Apps.CompanyCommunicator.Common.Repositories
{
    /// <summary>
    /// Interface for App configuration repository.
    /// </summary>
    public interface IFeedDataRepository : IRepository<FeedDataEntity>
    {
        Task<IEnumerable<FeedDataEntity>> GetAllFeedDataAsync();

        Task CreateFeedDataAsync(string appConfigId);
    }
}