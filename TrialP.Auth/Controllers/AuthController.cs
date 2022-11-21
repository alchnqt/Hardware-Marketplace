using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Web;
using TrialP.Auth.Models;

namespace TrialP.Auth.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        //public static User user = new User();
        private readonly IConfiguration _configuration;
        //private readonly IUserService _userService;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
            //_userService = userService;
        }

        [HttpGet, Authorize]
        public ActionResult<string> GetMe()
        {
            //var userName = _userService.GetMyName();
            return Ok("secret");
        }

        //[HttpPost("register")]
        //public async Task<ActionResult<User>> Register(UserDto request)
        //{
        //    CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);

        //    user.Username = request.Username;
        //    user.PasswordHash = passwordHash;
        //    user.PasswordSalt = passwordSalt;

        //    return Ok(user);
        //}

        [HttpPost]
        public async Task<ActionResult<string>> Login(string login, string password)
        {
            if (login != "bob")
            {
                return BadRequest("User not found.");
            }

            if (password != "1234")
            {
                return BadRequest("Wrong password.");
            }

            string token = CreateToken(login);

            var refreshToken = GenerateRefreshToken();
            SetRefreshToken(refreshToken);

            return Ok(token);
        }

        [HttpPost]
        public async Task<ActionResult<string>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            //if (!user.RefreshToken.Equals(refreshToken))
            //{
            //    return Unauthorized("Invalid Refresh Token.");
            //}
            //else if (user.TokenExpires < DateTime.Now)
            //{
            //    return Unauthorized("Token expired.");
            //}

            string token = CreateToken("");
            var newRefreshToken = GenerateRefreshToken();
            SetRefreshToken(newRefreshToken);

            return Ok(token);
        }

        private RefreshToken GenerateRefreshToken()
        {
            var refreshToken = new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Expires = DateTime.Now.AddDays(7),
                Created = DateTime.Now
            };

            return refreshToken;
        }

        private void SetRefreshToken(RefreshToken newRefreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = newRefreshToken.Expires
            };
            Response.Cookies.Append("refreshToken", newRefreshToken.Token, cookieOptions);

            //user.RefreshToken = newRefreshToken.Token;
            //user.TokenCreated = newRefreshToken.Created;
            //user.TokenExpires = newRefreshToken.Expires;
        }

        private string CreateToken(string login)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, login),
                new Claim(ClaimTypes.Role, "Admin")
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }
    }
}
