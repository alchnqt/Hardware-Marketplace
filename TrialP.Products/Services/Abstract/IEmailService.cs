namespace TrialP.Products.Services.Abstract
{
    public interface IEmailService
    {
        public void SendEmail(string email, string body);
        public Task SendEmailAsync(string email, string body);
    }
}
