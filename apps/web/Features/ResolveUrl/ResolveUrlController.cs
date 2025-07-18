using Microsoft.AspNetCore.Mvc;
using TinyUrl.Web.Features.Persistence;

namespace TinyUrl.Web.Features.ResolveUrl
{
  [ApiController]
  public class ResolveUrlController : Controller
  {
    private IPersistShortUrl _dataStore;

    public ResolveUrlController(IPersistShortUrl dataStore)
    {
      _dataStore = dataStore;
    }

    [HttpGet]
    [Route("s/{**catchAll}")]
    public async Task<IActionResult> Resolve()
    {
      Console.WriteLine($"Received URL to resolve");
      var shortUrlId = RouteData.Values["catchAll"];
      if (shortUrlId == null)
      {
        return BadRequest("Short URL ID is missing.");
      }

      var longUrl = await _dataStore.Get(shortUrlId.ToString());
      if (longUrl == null)
      {
        return NotFound();
      }

      longUrl.AccessCount++;
      await _dataStore.Persist(longUrl);
      return Redirect(longUrl.Url);
    }
  }
}
