namespace TinyUrl.Web.Feature.UI
{
  class NotFoundHttpException : Exception
  {
    public NotFoundHttpException() { }
    public NotFoundHttpException(string message) : base(message) { }
    public NotFoundHttpException(string message, Exception inner) : base(message, inner) { }
  }
}
