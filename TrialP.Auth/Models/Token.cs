namespace TrialP.Auth.Models
{
    public class Token
    {
        public string GrantType { get; set; }
        public string Code { get; set; }
        public string RedirectUrl { get; set; } 
        public string CodeVerifier { get; set; }
    }
}
