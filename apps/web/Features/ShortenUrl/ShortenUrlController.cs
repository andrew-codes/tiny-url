using Microsoft.AspNetCore.Mvc;
using TinyUrl.Web.Features.Persistence;

namespace TinyUrl.Web.Features.ShortenUrl
{
  public class ShortenUrlRequest
  {
    public string LongUrl { get; set; }
  }

  [ApiController]
  public class ShortenUrlController(ICreateId idCreator, IPersistShortUrl dataStore) : ControllerBase
  {
    private readonly ICreateId _idCreator = idCreator;
    private readonly IPersistShortUrl _dataStore = dataStore;

    [HttpPost]
    [Route("api/url/short")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Shorten([FromBody] ShortenUrlRequest request)
    {
      Console.WriteLine($"Received URL to shorten");

      if (string.IsNullOrWhiteSpace(request.LongUrl))
      {
        return BadRequest("Long URL cannot be empty.");
      }

      var shortUrlId = _idCreator.CreateId();
      var shortenedUrl = "http://localhost:5289/s/" + shortUrlId;

      await _dataStore.Persist(new LongUrl { Id = shortUrlId, Url = request.LongUrl });

      return Created($"/api/url/short/{shortUrlId}", new { ShortUrl = shortenedUrl });
    }

    [HttpPost]
    [Route("api/url/clear")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteAll()
    {
      Console.WriteLine($"Received request to clear all URLs");

      await _dataStore.ClearAll();

      return NoContent();
    }

    [HttpGet]
    [Route("api/url/list")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ListAll()
    {
      Console.WriteLine($"Received request to list all URLs");

      var urls = (await _dataStore.GetAll()).Select(kvp => new { ShortUrl = $"http://localhost:5289/s/{kvp.Id}", LongUrl = kvp.LongUrl.Url, kvp.LongUrl.AccessCount }).ToList();

      return Ok(urls);
    }
  }
}
