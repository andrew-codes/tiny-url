namespace TinyUrl.Web.Features.Persistence
{
  public interface IPersistShortUrl
  {
    Task Persist(LongUrl longUrl);
    Task<LongUrl?> Get(string id);
    Task Delete(string id);
    Task ClearAll();
    Task<IEnumerable<KeyValuePair<string, LongUrl>>> GetAll();
  }
}
