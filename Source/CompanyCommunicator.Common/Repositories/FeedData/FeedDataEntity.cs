// <copyright file="FeedDataEntity.cs" company="Microsoft">
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
// </copyright>

namespace Microsoft.Teams.Apps.CompanyCommunicator.Common.Repositories
{
    using Microsoft.Azure.Cosmos.Table;

    /// <summary>
    /// FeedData entity.
    /// </summary>
    public class FeedDataEntity : TableEntity
    {
        /// <summary>
        /// Gets or sets the entity value.
        /// </summary>
        public string Value { get; set; }

        public string Title { get; set; }

        public bool AskAuth { get; set; }

        public bool DailyNotifications { get; set; }
    }
}
