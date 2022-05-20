// <copyright file="FeedDataTableName.cs" company="Microsoft">
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
// </copyright>

namespace Microsoft.Teams.Apps.CompanyCommunicator.Common.Repositories
{
    /// <summary>
    /// App config table information.
    /// </summary>
    public class FeedDataTableName
    {
        /// <summary>
        /// Table name for feed data..
        /// </summary>
        public static readonly string TableName = "FeedData";

        /// <summary>
        /// App settings partition.
        /// </summary>
        public static readonly string FeedPartition = "Feed";

        /// <summary>
        /// Service url row key.
        /// </summary>
        public static readonly string ServiceUrlRowKey = "ServiceUrl";

        /// <summary>
        /// User app id row key.
        /// </summary>
        public static readonly string UserAppIdRowKey = "UserAppId";
    }
}
