﻿namespace TrialP.Auth.DTO
{
    public class UserDto
    {
        public string Email { get; set; }   
        public string Password { get; set; }
        public string? RedirectUrl { get; set; }
    }
}
