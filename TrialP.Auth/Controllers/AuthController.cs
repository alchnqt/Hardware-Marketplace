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
        private readonly IConfiguration _configuration;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AuthController(IConfiguration configuration, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _configuration = configuration;
            _userManager = userManager;
            _roleManager = roleManager;
            //_userService = userService;
        }

        [HttpGet, Authorize]
        public ActionResult<string> Secret()
        {
            return Ok("secret");
        }

        [HttpGet, Authorize(Roles = "Admin")]
        public ActionResult<string> AdminSecret()
        {
            return Ok("admin secret");
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
        public async Task<ActionResult<string>> Login(UserDto user)
        {
            var existingUser = await _userManager.FindByEmailAsync(user.Email);

            if (existingUser == null)
            {
                return BadRequest("User not found");
            }

            if (user.Email != existingUser.Email)
            {
                return BadRequest("User not found");
            }

            if (string.IsNullOrEmpty(user.Password))
            {
                return BadRequest("Wrong password");
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
                return BadRequest(new { message = "Пароли не совпдают" });
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
        public async Task<IActionResult> RefreshToken(RefreshTokenDto dto)
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var user = await _userManager.FindByNameAsync(dto.Login);
            if(user == null) 
            {
                return Unauthorized("User is not found");
            }
            using(var context = new TrialPIdentityServerContext())
            {
                var userRefreshTokens = await context.RefreshTokens.Where(w => w.UserId == user.Id).ToListAsync();
                var currentToken = await context.RefreshTokens.Where(w => w.Token == refreshToken).FirstOrDefaultAsync();
                if (!userRefreshTokens.Any(a => a.Token == refreshToken))
                {
                    return Unauthorized("Invalid Refresh Token");
                }
                else if (currentToken.Expires < DateTime.Now)
                {
                    return Unauthorized("Token expired");
                }
            }
            
            string accessToken = await CreateToken(dto.Login);
            var newRefreshToken = GenerateRefreshToken(dto.UserId);
            SetRefreshToken(newRefreshToken);
            return Ok(accessToken);
        }

        private RefreshToken GenerateRefreshToken(string userId)
        {
            var refreshToken = new TrialP.Auth.Models.RefreshToken
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
                Expires = newRefreshToken.Expires,
                Secure = true,
                SameSite = SameSiteMode.None
            };
            if (rememberMe)
            {
                Response.Cookies.Append("refreshToken", newRefreshToken.Token, cookieOptions);
            }
            else
            {
                HttpContext.Session.SetString("refreshToken", newRefreshToken.Token);
            }

            //user.RefreshToken = newRefreshToken.Token;
            //user.TokenCreated = newRefreshToken.Created;
            //user.TokenExpires = newRefreshToken.Expires;
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
