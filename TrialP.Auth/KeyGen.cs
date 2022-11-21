using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;

namespace TrialP.Auth
{
    public class KeyGen
    {
        public RSA RsaKey { get; private set; }
        public RsaSecurityKey RsaSecurityKey => new RsaSecurityKey(RsaKey);
        public KeyGen(IWebHostEnvironment env)
        {
            RsaKey = RSA.Create();
            var path = Path.Combine(env.ContentRootPath, "crypto_key");
            if (File.Exists(path))
            {
                var rsaKey = RSA.Create();
                rsaKey.ImportRSAPrivateKey(File.ReadAllBytes(path), out _);
            }
            else
            {
                var privateKey = RsaKey.ExportRSAPrivateKey();
                File.WriteAllBytes(path, privateKey);
            }
        } 
    }
}
