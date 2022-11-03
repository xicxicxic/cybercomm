// <copyright file="ImageDataTableName.cs" company="Microsoft">
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
// </copyright>

namespace Microsoft.Teams.Apps.CompanyCommunicator.Common.Repositories
{
    /// <summary>
    /// App config table information.
    /// </summary>
    public class ImageDataTableName
    {
        /// <summary>
        /// Table name for Image data..
        /// </summary>
        public static readonly string TableName = "ImageData";

        /// <summary>
        /// App settings partition.
        /// </summary>
        public static readonly string ImagePartition = "Image";

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
