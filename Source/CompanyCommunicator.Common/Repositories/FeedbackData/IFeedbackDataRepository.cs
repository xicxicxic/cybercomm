namespace Microsoft.Teams.Apps.CompanyCommunicator.Common.Repositories.FeedbackData
{
    using System.Threading.Tasks;
    using Microsoft.Bot.Schema;

    /// <summary>
    /// Interface for Sent Notification data Repository.
    /// </summary>
    public interface IFeedbackDataRepository : IRepository<FeedbackDataEnity>
    {
        /// <summary>
        /// This method ensures the FeedbackData table is created in the storage.
        /// This method should be called before kicking off an Azure function that uses the FeedbackData table.
        /// Otherwise the app will crash.
        /// By design, Azure functions (in this app) do not create a table if it's absent.
        /// </summary>
        /// <returns>A <see cref="Task"/> representing the result of the asynchronous operation.</returns>
        public Task EnsureFeedbackDataTableExistsAsync();

        /// <summary>
        /// Save exception error message in a feedback data entity.
        /// </summary>
        /// <param name="feedbackMessageId">notification Id.</param>
        /// <param name="senderId">sender Id.</param>
        /// <param name="errorMessage">Error message.</param>
        /// <returns>A <see cref="Task"/> representing the result of the asynchronous operation.</returns>
        public Task SaveExceptionInFeedbackDataEntityAsync(string feedbackMessageId, string senderId, string errorMessage);

        /// <summary>
        /// This method adds a new feedback entity to the storage
        /// </summary>
        /// <param name="activity">The feedback card activity</param>
        /// <returns>A <see cref="Task"/> representing the result of the asynchronous operation.</returns>
        public Task SaveFeedbackDataAsync(IConversationUpdateActivity activity);
    }

}