using System.Text.Json;
using AdroitTT.Web.Features.ShortenUrl;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.Extensions.FileProviders;
using TinyUrl.Web.Feature.UI;
using TinyUrl.Web.Features.Persistence;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddControllersWithViews();
builder.Services.AddControllers().AddJsonOptions(options =>
{
  options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});
builder.Services.AddTransient<UIController>();
builder.Services.AddSingleton<ICreateId, Base62IdCreation>();
builder.Services.AddSingleton<IPersistShortUrl, InMemoryShortUrlStore>();

var app = builder.Build();

var staticFilesPath = Environment.GetEnvironmentVariable("STATIC_FILES_PATH");
if (staticFilesPath == null || !Directory.Exists(staticFilesPath))
{
  Console.WriteLine($"Warning: STATIC_FILES_PATH is not set or does not exist. Current value: '{staticFilesPath}'");
  staticFilesPath = Path.Combine(Directory.GetCurrentDirectory(), "../../dist/apps/client");
  Console.WriteLine($"Defaulting to '{staticFilesPath}'");
}
staticFilesPath = Path.GetFullPath(staticFilesPath);
var appPrefix = "/app";
app.UseStaticFiles(new StaticFileOptions
{
  FileProvider = new PhysicalFileProvider(staticFilesPath),
  RequestPath = appPrefix
});

app.Use(async (context, next) =>
{
  Console.WriteLine($"Request: {context.Request.Method} {context.Request.Path}");
  try { await next(); }
  catch (NotFoundHttpException nfex)
  {
    Console.WriteLine($"Exception in middleware: {nfex.Message}");
    context.Response.StatusCode = 404;
    var routeData = new RouteData();
    var actionDescriptor = new ControllerActionDescriptor();
    var actionContext = new ActionContext(context, routeData, actionDescriptor);
    var controller = context.RequestServices.GetService(typeof(UIController)) as UIController;
    if (controller != null)
    {
      controller.ControllerContext = new ControllerContext(actionContext);
      var result = controller.NotFound(actionContext);
      if (result is ViewResult viewResult)
      {
        await viewResult.ExecuteResultAsync(actionContext);
      }
    }
  }
  catch (Exception ex)
  {
    Console.WriteLine($"Exception in middleware: {ex.Message}");
  }
});


var clientRouting = new ClientRouting(staticFilesPath, appPrefix);
app.MapWhen((ctx) => !ctx.Request.Path.StartsWithSegments("/api") && !ctx.Request.Path.StartsWithSegments("/s"), apiApp =>
{
  apiApp.Use(async (context, next) =>
  {
    Console.WriteLine($"Fallback for request path: {context.Request.Path.Value}");
    var routeData = new RouteData();
    var actionDescriptor = new ControllerActionDescriptor();
    var actionContext = new ActionContext(context, routeData, actionDescriptor);

    if (context.RequestServices.GetService(typeof(UIController)) is not UIController controller)
    {
      throw new NotFoundHttpException("UIController not found in services");
    }
    controller.ControllerContext = new ControllerContext(actionContext);

    var scriptPath = clientRouting.PageApp(context) ?? throw new NotFoundHttpException($"Static file not found for request path '{context.Request.Path.Value}'");
    var result = controller.Index(actionContext, scriptPath);
    if (result is ViewResult viewResult)
    {
      await viewResult.ExecuteResultAsync(actionContext);
      return;
    }
    await next();
  });
});


app.MapControllers();

app.Run();
