namespace TinyUrl.Web.Features.Persistence
{
  public class LongUrl
  {
    public string Id { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public int AccessCount { get; set; } = 0;
  }
}
