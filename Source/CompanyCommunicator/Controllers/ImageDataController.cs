using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Teams.Apps.CompanyCommunicator.Common.Repositories;

namespace Microsoft.Teams.Apps.CompanyCommunicator.Controllers
{
    [Route("api/imagedata")]
    public class ImageDataController : ControllerBase
    {

        private readonly IImageDataRepository imageRepository;

        public ImageDataController(IImageDataRepository imageDataRepository)
        {
            this.imageRepository = imageDataRepository ?? throw new ArgumentNullException(nameof(imageDataRepository));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ImageDataEntity>>> GetAllImageDataAsync()
        {
            var imageEntities = await this.imageRepository.GetAllImageDataAsync();

            var result = new List<ImageDataEntity>();

            foreach (var entity in imageEntities)
            {
                var item = new ImageDataEntity() 
                {
                    Url = entity.Url,
                    PartitionKey = entity.PartitionKey,
                    RowKey = entity.RowKey, 
                    SelectedImage = entity.SelectedImage,
                };

                result.Add(item);
            }

            return result;
        }
        [HttpPost]
        public async Task<ActionResult<IEnumerable<ImageDataEntity>>> CreateImageDataAsync([FromBody] ImageDataEntity imageData)
        {
            if (imageData is null)
            {
                throw new ArgumentNullException(nameof(imageData));
            }

            await this.imageRepository.CreateOrUpdateAsync(imageData);

            return this.Ok();
        }
    }
}
