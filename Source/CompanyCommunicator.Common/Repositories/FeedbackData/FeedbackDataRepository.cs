

namespace Microsoft.Teams.Apps.CompanyCommunicator.Common.Repositories
{
    using System.Threading.Tasks;
    using System.Collections.Generic;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using Microsoft.Teams.Apps.CompanyCommunicator.Common.Repositories;
    using System;

    public class FeedbackDataRepository: BaseRepository<FeedbackDataEntity>, IFeedbackDataRepository
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="FeedbackDataRepository"/> class.
        /// </summary>
        /// <param name="logger">The logging service.</param>
        /// <param name="repositoryOptions">Options used to create the repository.</param>
        /// <param name="tableRowKeyGenerator"></param>
        public FeedbackDataRepository(
            ILogger<FeedbackDataRepository> logger,
            IOptions<RepositoryOptions> repositoryOptions,
            TableRowKeyGenerator tableRowKeyGenerator)
            : base(
                  logger,
                  storageAccountConnectionString: repositoryOptions.Value.StorageAccountConnectionString,
                  tableName: FeedbackDataTableName.TableName,
                  defaultPartitionKey: FeedbackDataTableName.FeedbackPartition,
                  ensureTableExists: repositoryOptions.Value.EnsureTableExists)
        {
            this.TableRowKeyGenerator = tableRowKeyGenerator;
        }

        /// <summary>
        /// Adds a new feedback to the storage
        /// </summary>
        /// <param name="activity"></param>
        /// <returns></returns>
        public async Task SaveFeedbackDataAsync(IConversationUpdateActivity activity)
        {
            try
            {
                if(activity == null)
                {
                    throw new ArgumentNullException(nameof(activity)); 
                }

                var feedbackDataEntity = this.ParseData(activity, FeedbackDataTableName.FeedbackPartition);
                if(feedbackDataEntity != null)
                {
                    await this.CreateOrUpdateAsync(feedbackDataEntity);
                }
            }catch(Exception ex) {
                this.Logger.LogError(ex, ex.Message);
                throw;
            }
        }

        private FeedbackDataEntity ParseData(IConversationUpdateActivity activity, string partitionKey)
        {
            if (activity == null)
            {
                throw new ArgumentNullException(nameof(activity));
            }

            var newFeedbackDataId = this.TableRowKeyGenerator.CreateNewKeyOrderingMostRecentToOldest();

            return new FeedbackDataEntity
            {
                PartitionKey = partitionKey,
                RowKey = newFeedbackDataId,
                UserId = activity?.From?.Id,
                ServiceUrl = activity?.ServiceUrl,
                TenantId = activity?.Conversation?.TenantId,
                MessageId = activity?.Value,
                IsConfirmed = true,
            };
        }

        public TableRowKeyGenerator TableRowKeyGenerator { get; }

    }
}