// <copyright file="FeedDataEntity.cs" company="Microsoft">
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
// </copyright>

namespace Microsoft.Teams.Apps.CompanyCommunicator.Common.Repositories
{
    using Microsoft.Azure.Cosmos.Table;

    /// <summary>
    /// ImageData entity.
    /// </summary>
    public class ImageDataEntity : TableEntity
    {
        /// <summary>
        /// Gets or sets the Url value.
        /// </summary>
        public string Url { get; set; }

        public bool SelectedImage { get; set; }
         
        public string Name { get; set; }

    }
}
