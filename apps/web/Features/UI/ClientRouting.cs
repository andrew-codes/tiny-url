namespace TinyUrl.Web.Feature.UI
{
  internal class ClientRouteInfo
  {
    public string Path { get; set; } = "";
    public string? ScriptPath { get; set; } = null;
    public IList<ClientRouteInfo> Children { get; set; } = new List<ClientRouteInfo>();
  }

  public class ClientRouting
  {
    private ClientRouteInfo _root = new ClientRouteInfo();

    private ClientRouteInfo processRouteFile(ClientRouteInfo node, string routeFilePath, string prefixPath = "")
    {
      var routeParts = routeFilePath.Split(".");
      if (routeParts.Length == 0) return node;

      routeParts.Aggregate(node, (n, p) =>
      {
        var child = n.Children.FirstOrDefault(c => c.Path == p);
        if (child == null)
        {
          child = new ClientRouteInfo { Path = p, ScriptPath = $"{prefixPath}/{routeFilePath}.js" };
          n.Children.Add(child);
        }
        else
        {
          child.ScriptPath = $"{prefixPath}/{routeFilePath}.js";
        }
        return child;
      });


      return node;
    }

    public ClientRouting(string clientAppsPath, string prefix)
    {
      if (!Directory.Exists(clientAppsPath))
      {
        throw new ArgumentException($"Client apps path '{clientAppsPath}' does not exist.");
      }

      var files = Directory.GetFiles(clientAppsPath, "*.js").Where(f => !f.Equals("index.js", StringComparison.OrdinalIgnoreCase));
      foreach (var file in files)
      {
        var fileName = Path.GetFileNameWithoutExtension(file);
        _root = processRouteFile(_root, fileName, prefix);
      }
    }


    public string? PageApp(HttpContext actionContext)
    {
      var page = $"/{actionContext.Request.Path.Value?.TrimStart('/') ?? ""}";
      if (page.Equals("/")) return "/app/index.js";

      var segments = page.Split('/', StringSplitOptions.RemoveEmptyEntries);
      var current = _root;
      foreach (var segment in segments)
      {
        var child = current.Children.FirstOrDefault(c => c.Path.Equals(segment, StringComparison.OrdinalIgnoreCase));
        if (child == null) break;
        current = child;
      }

      if (current.Path.Equals(String.Empty) && segments.Length == 0)
      {
        return null;
      }

      return current.ScriptPath;
    }
  }

}
