// <copyright file="ImageDataRepository.cs" company="Microsoft">
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
    public class ImageDataRepository : BaseRepository<ImageDataEntity>, IImageDataRepository
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ImageDataRepository"/> class.
        /// </summary>
        /// <param name="logger">The logging service.</param>
        /// <param name="repositoryOptions">Options used to create the repository.</param>
        /// <param name="tableRowKeyGenerator"></param>
        public ImageDataRepository(
            ILogger<ImageDataRepository> logger,
            IOptions<RepositoryOptions> repositoryOptions,
            TableRowKeyGenerator tableRowKeyGenerator)
            : base(
                  logger,
                  storageAccountConnectionString: repositoryOptions.Value.StorageAccountConnectionString,
                  tableName: ImageDataTableName.TableName,
                  defaultPartitionKey: ImageDataTableName.ImagePartition,
                  ensureTableExists: repositoryOptions.Value.EnsureTableExists)
        {
            this.TableRowKeyGenerator = tableRowKeyGenerator;
        }


        public TableRowKeyGenerator TableRowKeyGenerator { get; }

        /// <summary>
        /// Gets all the App config files in the table.
        /// </summary>
        /// <returns>List of all the app config files.</returns>
        public async Task<IEnumerable<ImageDataEntity>> GetAllImageDataAsync()
        {
            var result = await this.GetAllAsync(ImageDataTableName.ImagePartition);

            return result;
        }

        /// <summary>
        /// Updates a app config file.
        /// </summary>
        /// <param name="ImageDataId"></param>
        /// <returns>Task</returns>
        public async Task CreateImageDataAsync(ImageDataEntity ImageData)
        {
            try
            {
                if (ImageData == null)
                {
                    throw new ArgumentNullException(nameof(ImageData));
                }

                var newDataImageId = this.TableRowKeyGenerator.CreateNewKeyOrderingMostRecentToOldest();

                // Create a sent notification based on the draft notification.
                var ImageDataEntity = new ImageDataEntity
                {
                    PartitionKey = ImageData.PartitionKey,
                    RowKey = newDataImageId,
                    Url = ImageData.Url,
                    SelectedImage = ImageData.SelectedImage,
                };
                await this.CreateOrUpdateAsync(ImageDataEntity);
            }
            catch (Exception ex)
            {
                this.Logger.LogError(ex, ex.Message);
                throw;
            }
        }
    }
}
