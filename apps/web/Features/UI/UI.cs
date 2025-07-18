using Microsoft.AspNetCore.Mvc;

namespace TinyUrl.Web.Feature.UI
{
  public class UIController : Controller
  {
    public IActionResult Index(ActionContext actionContext, string pageScriptPath)
    {
      ViewBag.pageScriptPath = pageScriptPath;
      return View("UI");
    }

    public IActionResult NotFound(ActionContext actionContext)
    {
      ViewBag.pageScriptPath = "/app/404.js";
      return View("UI");
    }
  }
}
