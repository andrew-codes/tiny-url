using Microsoft.AspNetCore.Http;
using TinyUrl.Web.Feature.UI;

namespace TinyUrl.Web.Test;

public class ClientRoutingTest
{
  [Fact(DisplayName = "Non-existent directory throws exception.")]
  public void Test1()
  {
    Assert.Throws<ArgumentException>(() =>
        new ClientRouting("non-existent-path", "/app")
    );
  }

  [Fact(DisplayName = @"Look up root path '/' returns '/app/index.js'.")]
  public void Test2()
  {
    var clientRouting = new ClientRouting(Path.Combine(Directory.GetCurrentDirectory(), "Features/UI/TestData/ClientRouting"), "/app");

    Assert.Equal("/app/index.js", clientRouting.PageApp(new DefaultHttpContext { Request = { Path = "/" } }));
  }

  [Fact(DisplayName = @"Look up matching path returns expected script path.
  - dot in file name represents path separator.")]
  public void Test4()
  {
    var clientRouting = new ClientRouting(Path.Combine(Directory.GetCurrentDirectory(), "Features/UI/TestData/ClientRouting"), "/app");
    Assert.Equal("/app/foo.js", clientRouting.PageApp(new DefaultHttpContext { Request = { Path = "/foo" } }));
    Assert.Equal("/app/foo.bar.js", clientRouting.PageApp(new DefaultHttpContext { Request = { Path = "/foo/bar" } }));
  }

  [Fact(DisplayName = @"Partial matching pattern.
  - Matches the longest matching prefix and returns the associated script path.")]
  public void Test6()
  {
    var clientRouting = new ClientRouting(Path.Combine(Directory.GetCurrentDirectory(), "Features/UI/TestData/ClientRouting"), "/app");
    Assert.Equal("/app/foo.js", clientRouting.PageApp(new DefaultHttpContext { Request = { Path = "/foo" } }));
    Assert.Equal("/app/foo.bar.js", clientRouting.PageApp(new DefaultHttpContext { Request = { Path = "/foo/bar/wiz/qiz" } }));
  }

  [Fact(DisplayName = @"Look up non-matching path returns null.")]
  public void Test5()
  {
    var clientRouting = new ClientRouting(Path.Combine(Directory.GetCurrentDirectory(), "Features/UI/TestData/ClientRouting"), "/app");
    Assert.Null(clientRouting.PageApp(new DefaultHttpContext { Request = { Path = "/nonexistent" } }));
  }
}
