// <copyright file="FeedDataRepository.cs" company="Microsoft">
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
// </copyright>

namespace Microsoft.Teams.Apps.CompanyCommunicator.Common.Repositories
{
    using System.Threading.Tasks;
    using System.Collections.Generic;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using Microsoft.Teams.Apps.CompanyCommunicator.Common.Repositories;
    using Microsoft.Teams.Apps.CompanyCommunicator.Common.Repositories.NotificationData;
    using System;

    /// <summary>
    /// App configuration repository.
    /// </summary>
    public class FeedDataRepository : BaseRepository<FeedDataEntity>, IFeedDataRepository
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="FeedDataRepository"/> class.
        /// </summary>
        /// <param name="logger">The logging service.</param>
        /// <param name="repositoryOptions">Options used to create the repository.</param>
        /// <param name="tableRowKeyGenerator"></param>
        public FeedDataRepository(
            ILogger<FeedDataRepository> logger,
            IOptions<RepositoryOptions> repositoryOptions,
            TableRowKeyGenerator tableRowKeyGenerator)
            : base(
                  logger,
                  storageAccountConnectionString: repositoryOptions.Value.StorageAccountConnectionString,
                  tableName: FeedDataTableName.TableName,
                  defaultPartitionKey: FeedDataTableName.FeedPartition,
                  ensureTableExists: repositoryOptions.Value.EnsureTableExists)
        {
            this.TableRowKeyGenerator = tableRowKeyGenerator;
        }


        public TableRowKeyGenerator TableRowKeyGenerator { get; }

        /// <summary>
        /// Gets all the App config files in the table.
        /// </summary>
        /// <returns>List of all the app config files.</returns>
        public async Task<IEnumerable<FeedDataEntity>> GetAllFeedDataAsync()
        {
            var result = await this.GetAllAsync(FeedDataTableName.FeedPartition);

            return result;
        }

        /// <summary>
        /// Updates a app config file.
        /// </summary>
        /// <param name="feedDataId"></param>
        /// <returns>Task</returns>
        public async Task CreateFeedDataAsync(FeedDataEntity feedData)
        {
            try
            {
                if (feedData == null)
                {
                    throw new ArgumentNullException(nameof(feedData));
                }

                var newDataFeedId = this.TableRowKeyGenerator.CreateNewKeyOrderingMostRecentToOldest();

                // Create a sent notification based on the draft notification.
                var feedDataEntity = new FeedDataEntity
                {
                    PartitionKey = feedData.PartitionKey,
                    RowKey = newDataFeedId,
                    Value = feedData.Value,
                };
                await this.CreateOrUpdateAsync(feedDataEntity);
            }
            catch (Exception ex)
            {
                this.Logger.LogError(ex, ex.Message);
                throw;
            }
        }
    }
}
