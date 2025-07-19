using Microsoft.AspNetCore.Mvc;
using TinyUrl.Web.Features.Persistence;

namespace TinyUrl.Web.Features.ShortenUrl
{
  public class ShortenUrlRequest
  {
    public string LongUrl { get; set; }
    public string? VanityPath { get; set; }
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
      var shortUrlId = request.VanityPath;
      if (string.IsNullOrWhiteSpace(request.LongUrl))
      {
        return BadRequest("Long URL cannot be empty.");
      }

      if (!string.IsNullOrWhiteSpace(request.VanityPath))
      {

        if (request.VanityPath.Length < 3)
        {
          return BadRequest("Vanity path must be at least 3 characters long.");
        }

        if (request.VanityPath.Length > 20)
        {
          return BadRequest("Vanity path must not exceed 20 characters.");
        }

        if (!System.Text.RegularExpressions.Regex.IsMatch(request.VanityPath, @"^[a-zA-Z0-9_-]+$"))
        {
          return BadRequest("Vanity path can only contain alphanumeric characters, underscores, and hyphens.");
        }

        if (await _dataStore.Get(request.VanityPath) != null)
        {
          return BadRequest(new { error = "Duplicate" });
        }
      }
      else
      {
        shortUrlId = _idCreator.CreateId();
      }
      var shortenedUrl = "http://localhost:5289/s/" + shortUrlId;

      await _dataStore.Persist(new LongUrl
      {
        Id = shortUrlId,
        Url = request.LongUrl
      });

      return Created($"/s/{shortUrlId}", new
      {
        ShortUrl = shortenedUrl
      });
    }

    [HttpPost]
    [Route("api/url/clear")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteAll()
    {
      await _dataStore.ClearAll();

      return NoContent();
    }

    [HttpGet]
    [Route("api/url/list")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ListAll()
    {
      var urls = (await _dataStore.GetAll()).Select(kvp => new { ShortUrl = $"http://localhost:5289/s/{kvp.Key}", LongUrl = kvp.Value.Url, kvp.Value.AccessCount }).ToList();

      return Ok(urls);
    }
  }
}
