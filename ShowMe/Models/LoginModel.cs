using System;

namespace ShowMe.Models
{
    [Serializable]
    public class LoginModel
    {
        public string Login { get; set; }
        public string Password { get; set; }
    }
}
