// <copyright file="AppConfigRepository.cs" company="Microsoft">
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

    /// <summary>
    /// App configuration repository.
    /// </summary>
    public class AppConfigRepository : BaseRepository<AppConfigEntity>, IAppConfigRepository
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AppConfigRepository"/> class.
        /// </summary>
        /// <param name="logger">The logging service.</param>
        /// <param name="repositoryOptions">Options used to create the repository.</param>
        public AppConfigRepository(
            ILogger<AppConfigRepository> logger,
            IOptions<RepositoryOptions> repositoryOptions)
            : base(
                  logger,
                  storageAccountConnectionString: repositoryOptions.Value.StorageAccountConnectionString,
                  tableName: AppConfigTableName.TableName,
                  defaultPartitionKey: AppConfigTableName.SettingsPartition,
                  ensureTableExists: repositoryOptions.Value.EnsureTableExists)
        {
        }

        /// <summary>
        /// Gets all the App config files in the table.
        /// </summary>
        /// <returns>List of all the app config files.</returns>
        public async Task<IEnumerable<AppConfigEntity>> GetAllAppConfigAsync()
        {
            var result = await this.GetAllAsync(AppConfigTableName.SettingsPartition);

            return result;
        }

        /// <summary>
        /// Updates a app config file.
        /// </summary>
        /// <param name="appConfigId">Id from the config to be updated.</param>
        /// <returns>Task</returns>
        public async Task UpdateAppConfigAsync(string appConfigId)
        {
            var appConfigEntity = await this.GetAsync(AppConfigTableName.SettingsPartition, appConfigId);

            if (appConfigEntity != null)
            {
                await this.CreateOrUpdateAsync(appConfigEntity);
            }
        }
    }
}
