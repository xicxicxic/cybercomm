
namespace Microsoft.Teams.Apps.CompanyCommunicator.Common.Repositories.FeedbackData
{
    using System;
    using System.Globalization;
    using Microsoft.Azure.Cosmos.Table;

    public class FeedbackEntity : TableEntity
    {
        /// <summary>
        /// the id of the feedback entity
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the user id for the sender.
        /// </summary>
        public string UserId { get; set; }

        /// <summary>
        /// Gets or sets the message id to which the users are submiting an answer for
        /// </summary>
        public string MessageId { get; set; }

        /// <summary>
        /// Gets or sets the tenant id of the sender
        /// </summary>
        public string TenantId { get; set; }

        /// <summary>
        /// Gets or sets the information of whether the user as commited to implementing
        /// notifaction's message
        /// </summary>
        public bool IsConfirmed { get; set; }

    }
    
    
}

    