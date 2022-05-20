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
                RowKey = feed.RowKey,
            };

            await this.feedDataRepository.CreateOrUpdateAsync(feedEntity);

            return this.Ok();
        }
    }
}
