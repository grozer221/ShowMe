using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using ShowMe.Repositories;
using ShowMe.Models;

namespace ShowMe.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AccountController : Controller
    {
        private AppDatabaseContext _ctx;
        private UserRepository _userRep;
        public AccountController(AppDatabaseContext ctx)
        {
            _ctx = ctx;
            _userRep = new UserRepository(_ctx);
        }

        [HttpGet]
        public IActionResult IsAuth()
        {
            if (HttpContext.User.Identity.IsAuthenticated)
            {
                var user = _userRep.GetUserByLogin(HttpContext.User.Identity.Name);
                return Ok(new ResponseModel()
                {
                    ResultCode = 0,
                    Data = user,
                });
            }
            return Unauthorized(new ResponseModel()
            {
                ResultCode = 1,
                Messages = new string[] { "User unautorized" },
                Data = null,
            });
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (ModelState.IsValid)
            {
                UserModel user = _userRep.GetUserByLoginAndPass(model.Login, model.Password);
                if (user != null)
                {
                    await Authenticate(user); // аутентификация
                    user.Password = null;
                    return Ok(new ResponseModel()
                    {
                        ResultCode = 0,
                        Data = user,
                    });
                }
            }
            return BadRequest(new ResponseModel()
            {
                ResultCode = 1,
                Messages = new string[] { "Login or password is invalid" },
            });
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.Password != model.ConfirmPassword)
                    return BadRequest(new ResponseModel()
                    {
                        ResultCode = 1,
                        Messages = new string[] { "Password do not match" },
                    });
                UserModel user = _userRep.GetUserByLogin(model.Login);
                if (user == null)
                {
                    user = new UserModel
                    {
                        Login = model.Login,
                        Password = model.Password,
                    };
                    _userRep.AddUser(user);
                    await Authenticate(user); // аутентификация
                    user.Password = null;
                    return Ok(new ResponseModel()
                    {
                        ResultCode = 0,
                        Data = user,
                    });
                }
                return BadRequest(new ResponseModel()
                {
                    ResultCode = 1,
                    Messages = new string[] { "User with wrote login already exist" },
                });
            }
            return BadRequest(new ResponseModel()
            {
                ResultCode = 1,
                Messages = new string[] { "Model is invalid" },
            });
        }

        [NonAction]
        private async Task Authenticate(UserModel user)
        {
            // создаем один claim
            var claims = new List<Claim> {
                new Claim(ClaimsIdentity.DefaultNameClaimType, user.Login),
            };
            // создаем объект ClaimsIdentity
            ClaimsIdentity id = new ClaimsIdentity(claims, "ApplicationCookie", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
            // установка аутентификационных куки
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(id));
        }

        [HttpDelete]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new ResponseModel() { ResultCode = 0 });
        }
    }
}
