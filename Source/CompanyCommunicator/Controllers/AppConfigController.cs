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
    [Route("api/appConfig")]
    public class AppConfigController : ControllerBase
    {
        private readonly IAppConfigRepository appConfigRepository;

        /// <summary>
        /// Initializes a new instance of the <see cref="AppConfigController"/> class.
        /// </summary>
        /// <param name="appConfigRepository">App config repositoy instance.</param>
        public AppConfigController(IAppConfigRepository appConfigRepository)
        {
            this.appConfigRepository = appConfigRepository ?? throw new ArgumentNullException(nameof(appConfigRepository));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppConfigEntity>>> GetAllAppConfigAsync()
        {
            var configEntities = await this.appConfigRepository.GetAllAppConfigAsync();

            var result = new List<AppConfigEntity>();
            foreach (var configEntity in configEntities)
            {
                var config = new AppConfigEntity
                {
                    Value = configEntity.Value,
                    RowKey = configEntity.RowKey,
                    PartitionKey = configEntity.PartitionKey,

                };

                result.Add(config);
            }
            return result;
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAppConfigAsync([FromBody] AppConfigEntity config)
        {
            if (config == null)
            {
                throw new ArgumentNullException(nameof(AppConfigEntity));
            }

            var configEntity = new AppConfigEntity
            {
                Value = config.Value,
                PartitionKey = config.PartitionKey,
                RowKey = config.RowKey,
            };

            await this.appConfigRepository.CreateOrUpdateAsync(configEntity);
            return this.Ok();
        }

    }
}
