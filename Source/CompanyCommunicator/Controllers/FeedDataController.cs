using Microsoft.AspNetCore.Mvc;
using Microsoft.Teams.Apps.CompanyCommunicator.Common.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Microsoft.Teams.Apps.CompanyCommunicator.Models;

namespace Microsoft.Teams.Apps.CompanyCommunicator.Controllers
{
    [Route("api/feedData")]
    public class FeedDataController : ControllerBase
    {
        private readonly IFeedDataRepository feedDataRepository;

        /// <summary>
        /// Initializes a new instance of the <see cref="FeedDataController"/> class.
        /// </summary>
        /// <param name="feedDataRepository">App config repositoy instance.</param>
        public FeedDataController(IFeedDataRepository feedDataRepository)
        {
            this.feedDataRepository = feedDataRepository ?? throw new ArgumentNullException(nameof(feedDataRepository));
        }

        /// <summary>
        ///
        /// </summary>
        /// <returns>A <see cref="Task{TResult}"/> representing the result of the asynchronous operation.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FeedDataEntity>>> GetAllFeedDataAsync()
        {
            var feedEntities = await this.feedDataRepository.GetAllFeedDataAsync();

            var result = new List<FeedDataEntity>();
            foreach (var feedEntity in feedEntities)
            {
                var feed = new FeedDataEntity
                {
                    Value = feedEntity.Value,
                    PartitionKey = feedEntity.PartitionKey,
                    RowKey = feedEntity.RowKey,
                    AskAuth = feedEntity.AskAuth,
                    DailyNotifications = feedEntity.DailyNotifications,
                    Title = feedEntity.Title,
                };

                result.Add(feed);
            }

            return result;
        }

        [HttpPost]
        public async Task<IActionResult> CreateFeedDataAsync([FromBody] FeedDataEntity feed)
        {
            if (feed == null)
            {
                throw new ArgumentNullException(nameof(FeedDataEntity));
            }

            var feedEntity = new FeedDataEntity
            {
                Value = feed.Value,
                PartitionKey = feed.PartitionKey,
                AskAuth = feed.AskAuth,
                DailyNotifications = feed.DailyNotifications,
                Title = feed.Title,
            };

            await this.feedDataRepository.CreateFeedDataAsync(feedEntity);

            return this.Ok();
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="feed">Feed</param>
        /// <returns>A <see cref="Task{TResult}"/> representing the result of the asynchronous operation.</returns>
        [HttpPut]
        public async Task<IActionResult> UpdateFeedDataAsync([FromBody] FeedDataEntity feed)
        {
            if (feed == null)
            {
                throw new ArgumentNullException(nameof(FeedDataEntity));
            }

            var feedEntity = new FeedDataEntity
            {
                Value = feed.Value,
                PartitionKey = feed.PartitionKey,
                RowKey = feed.RowKey,
                AskAuth = feed.AskAuth,
                DailyNotifications = feed.DailyNotifications,
                Title = feed.Title,
            };

            await this.feedDataRepository.CreateOrUpdateAsync(feedEntity);

            return this.Ok();
        }

        /// <summary>
        /// Delete an existing draft notification.
        /// </summary>
        /// <param name="id">The id of the draft notification to be deleted.</param>
        /// <returns>If the passed in Id is invalid, it returns 404 not found error. Otherwise, it returns 200 OK.</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFeedDataAsync(string id)
        {
            if (id == null)
            {
                throw new ArgumentNullException(nameof(id));
            }

            var feedDataEntity = await this.feedDataRepository.GetAsync(
                FeedDataTableName.FeedPartition,
                id);
            if (feedDataEntity == null)
            {
                return this.NotFound();
            }

            await this.feedDataRepository.DeleteAsync(feedDataEntity);
            return this.Ok();
        }
    }
}
