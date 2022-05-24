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
        /// <summary>
        /// Gets table row key generator.
        /// </summary>
        public TableRowKeyGenerator TableRowKeyGenerator { get; }

        Task<IEnumerable<FeedDataEntity>> GetAllFeedDataAsync();

        /// <summary>
        ///
        /// </summary>
        /// <param name="feedData">feedData</param>
        /// <returns>A <see cref="Task"/> representing the result of the asynchronous operation.</returns>
        Task CreateFeedDataAsync(FeedDataEntity feedData);
    }
}