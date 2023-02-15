namespace Microsoft.Teams.Apps.CompanyCommunicator.Bot
{
    using System;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Bot.Builder;
    using Microsoft.Bot.Builder.Teams;
    using Microsoft.Bot.Schema;
    using Microsoft.Bot.Schema.Teams;
    using Microsoft.Teams.Apps.CompanyCommunicator.Common.Repositories.FeedbackData;

    /// <summary>
    /// Company Communicator User Bot
    /// Handles the Action.Submit button on the feedback adaptive card
    /// </summary>
    public class UserSubmitsFeedbackActivityHandler : TeamsActivityHandler
    {
        private readonly IFeedbackDataRepository feedbackDataRepository;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserSubmitsFeedbackActivityHandler"/> class.
        /// </summary>
        /// <param name="feedbackDataRepository"> Feedback data service </param>
        public UserSubmitsFeedbackActivityHandler(
            IFeedbackDataService feedbackDataRepository)
        {
            this.IFeedbackDataRepository = feedbackDataRepository ?? throw new ArgumentNullException(nameof(feedbackDataService);

        }

        /// <summary>
        /// Invoked when a user clicks an action button on the adaptive card
        /// </summary>
        /// <param name="turnContext"> The context object for this turn </param>
        /// <param name="cancellationToken"> A cancelation token that can be used by other objects
        /// os threads to receive notice of cancellation </param>
        /// <returns> A task that represents the work queue to execute </returns>
        protected override async Task OnTeamsCardActionInvokeAsync(
            ITurnContext<IConversationUpdateActivity> turnContext,
            CancellationToken cancellationToken)
        {

            await base.OnTeamsCardActionInvokeAsync(turnContext, cancellationToken);
  
            // Saves to the storage the confirmation of the commitment to the message info, the userId and the messageId
            // the activity pertrains to
            if (activity != null) {
                var result = await feedbackDataRepository.SaveFeedbackDataAsync(activity);
                if (result != null)
                {
                    // deletes the activity after the information is added to the storage
                    turnContext.DeleteActivity(activity, cancellationToken);
                } 
            }

        }
    }

}