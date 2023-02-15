
namespace Microsoft.Teams.Apps.CompanyCommunicator.Common.Repositories.FeedbackData
{
    /// <summary>
    /// Sent notification data table names.
    /// </summary>
    public static class FeedbackDataTableName
    {
        /// <summary>
        /// Table name for the sent notification data table.
        /// </summary>
        public static readonly string TableName = "FeedbackData";

        /// <summary>
        /// Default partition - should not be used.
        /// </summary>
        public static readonly string FeedbackPartition = "FeedbackPartition";

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