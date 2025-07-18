namespace AdroitTT.Web.Features.ShortenUrl
{
  public class Base62IdCreation : ICreateId
  {
    public Base62IdCreation()
    {
    }

    protected int NextId { get; set; } = 0;

    public string CreateId()
    {
      NextId++;
      var id = ConvertToBase62(NextId);

      return id;
    }

    public static string ConvertToBase62(int number)
    {
      const string chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      var result = string.Empty;
      do
      {
        result = chars[number % 62] + result;
        number /= 62;
      } while (number > 0);

      return result;
    }
  }
}
