using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Web;
using TrialP.Auth.Data;
using TrialP.Auth.DTO;
using TrialP.Auth.Models;

namespace TrialP.Auth.Controllers
{
    [EnableCors("CorsPolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;

        public AuthController(UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        public ActionResult<string> Secret()
        {
            return Ok("secret");
        }

        [HttpGet, Authorize(Roles = "Admin")]
        public ActionResult<string> AdminSecret()
        {
            return Ok("admin secret");
        }

        [HttpPost]
        public async Task<ActionResult<string>> Login(UserDto user)
        {
            var existingUser = await _userManager.FindByEmailAsync(user.Email);

            if (existingUser == null)
            {
                return BadRequest(new { message = "Пользователь не найден" });
            }

            if (user.Email != existingUser.Email)
            {
                return BadRequest(new { message = "Пользователь не найден" });
            }

            var passwordCheck = await _userManager.CheckPasswordAsync(existingUser, user.Password);

            if (!passwordCheck)
            {
                return BadRequest(new { message = "Неверный пароль" });
            }

            string token = await CreateToken(existingUser.UserName);
            var refreshToken = GenerateRefreshToken(existingUser.Id.ToString());
            SetRefreshToken(refreshToken);
            return Ok(new { access_token = token });
        }



        [HttpPost]
        public async Task<ActionResult<string>> Register(RegisterDto user)
        {
            var existingUser = await _userManager.FindByNameAsync(user.Username);

            if (string.IsNullOrEmpty(user.Username) || existingUser != null)
            {
                return BadRequest(new { message = "Пользователь уже существует" });
            }

            if (user.Password != user.RepeatPassword)
            {
                return BadRequest(new { message = "Пароли не совпадают" });
            }
            var newUser = new IdentityUser()
            {
                UserName = user.Username,
                Email = user.Email,
                PhoneNumber = user.Phone

            };
            var result = await _userManager.CreateAsync(
                newUser,
                user.Password
            );
            await _userManager.AddToRoleAsync(newUser, "Customer");
            if (result.Succeeded)
            {
                return Ok(new { message = "User was registered" });
            }
            else
            {
                return BadRequest(new { message = "Coudln't create user" });
            }
           
        }

        [HttpPost]
        public void Logout()
        {
            Response.Cookies.Delete("refreshToken");
        }

        [HttpPost]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            using(var context = new TrialPIdentityServerContext())
            {
                var currentToken = await context.RefreshTokens.Where(w => w.Token == refreshToken).FirstOrDefaultAsync();
                if (currentToken == null)
                {
                    return Unauthorized();
                }
                else if (currentToken.Expires < DateTime.Now)
                {
                    return Unauthorized(new { result = "Token expired", success = false });
                }

                var currentUser = await _userManager.FindByIdAsync(currentToken.UserId);
                string accessToken = await CreateToken(currentUser.UserName);
                var newRefreshToken = GenerateRefreshToken(currentUser.Id);
                SetRefreshToken(newRefreshToken);
                return Ok(new { result = accessToken, success = true });
            }
        }

        private RefreshToken GenerateRefreshToken(string userId)
        {
            var refreshToken = new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Expires = DateTime.Now.AddDays(7),
                Created = DateTime.Now,
                UserId = userId
            };
            using(var c = new TrialPIdentityServerContext())
            {
                c.RefreshTokens.Add(refreshToken);
                c.SaveChanges();
            }
            return refreshToken;
        }

        private void SetRefreshToken(RefreshToken newRefreshToken, bool rememberMe = true)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                IsEssential = true,
                Domain = "rhino.acme.com",
                Expires = newRefreshToken.Expires,
                //Secure = true,
                SameSite = SameSiteMode.Lax
            };
            if (rememberMe)
            {
                Response.Cookies.Append("refreshToken", newRefreshToken.Token, cookieOptions);
            }
            else
            {
                HttpContext.Session.SetString("refreshToken", newRefreshToken.Token);
            }
        }

        private async Task<string> CreateToken(string login)
        {
            var user = await _userManager.FindByNameAsync(login);
            var roles = await _userManager.GetRolesAsync(user);
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, login),
                new Claim("id", user.Id),
                new Claim(System.Security.Claims.ClaimTypes.MobilePhone, user.PhoneNumber ?? ""),
                new Claim(System.Security.Claims.ClaimTypes.Email, user.Email ?? ""),
                new Claim(ClaimsIdentity.DefaultRoleClaimType, roles.FirstOrDefault() ?? "")
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("this is my custom Secret key for authentication"));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(1), //change
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        [HttpGet]
        public async Task<IActionResult> AllCustomers()
        {
            var users = await _userManager.GetUsersInRoleAsync("Customer");
            return Ok(users);
        }
    }
}
