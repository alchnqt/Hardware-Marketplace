using MimeKit;
using System.Net;
using System.Net.Mail;
using TrialP.Products.Services.Abstract;

namespace TrialP.Products.Services.Domain
{
    public class EmailService : IEmailService
    {
        public void SendEmail(string email, string body)
        {
            throw new NotImplementedException();
        }

        public async Task SendEmailAsync(string email, string body)
        {
            await Send(email, body);
        }

        private async Task Send(string email, string body)
        {
            MailAddress from = new MailAddress("dimplomemailam2023@gmail.com", "E-Katalog");
            MailAddress to = new MailAddress(email);
            MailMessage m = new MailMessage(from, to);
            m.Subject = "Заказ товаров";
            m.Body = body;
            m.IsBodyHtml= true;
            SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587);
            smtp.UseDefaultCredentials = false;
            smtp.Credentials = new NetworkCredential("dimplomemailam2023@gmail.com", "llltmkxgcklzokqs");
            smtp.EnableSsl = true;
            await smtp.SendMailAsync(m);
        }
    }
}
