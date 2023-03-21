using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Html2Markdown;
using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;

namespace HtmlToMDown
{
    public static class HtmlToMarkdown
    {
        [FunctionName("Function1")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string body = await new StreamReader(req.Body).ReadToEndAsync();

            string message = (string)JObject.Parse(body)["message"];

            var html = message;
            var converter = new Converter();
            var markdown = converter.Convert(html);


            var markdownClean = Regex.Replace(markdown, "<(.|\n|\r)*?>", String.Empty);

            string responseMessage = string.IsNullOrEmpty(markdownClean)
                ? "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response."
                : $"{markdownClean}";

            return new OkObjectResult(responseMessage);
        }
    }
}
