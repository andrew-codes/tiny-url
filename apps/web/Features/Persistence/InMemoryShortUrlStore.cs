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

    public Task<IEnumerable<KeyValuePair<string, LongUrl>>> GetAll()
    {
      var allUrls = _store.OrderBy(kvp => kvp.Key)
                          .Select(kvp => new KeyValuePair<string, LongUrl>(kvp.Key, kvp.Value));
      return Task.FromResult(allUrls.AsEnumerable());
    }

    public Task Delete(string id)
    {
      _store.TryRemove(id, out _);
      return Task.CompletedTask;
    }
  }
}
