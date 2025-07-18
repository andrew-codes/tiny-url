using System.Collections.Concurrent;

namespace TinyUrl.Web.Features.Persistence
{
  public class InMemoryShortUrlStore : IPersistShortUrl
  {
    private readonly ConcurrentDictionary<string, LongUrl> _store = new();

    public Task Persist(LongUrl longUrl)
    {
      _store[longUrl.Id] = longUrl;
      return Task.CompletedTask;
    }

    public Task<LongUrl?> Get(string id)
    {
      _store.TryGetValue(id, out var longUrl);
      return Task.FromResult(longUrl);
    }

    public Task ClearAll()
    {
      _store.Clear();
      return Task.CompletedTask;
    }

    public Task<IEnumerable<(string Id, LongUrl LongUrl)>> GetAll()
    {
      var allUrls = _store.Select(kvp => (Id: kvp.Key, LongUrl: kvp.Value)).OrderBy(t => t.Id);
      return Task.FromResult(allUrls.AsEnumerable());
    }
  }
}
