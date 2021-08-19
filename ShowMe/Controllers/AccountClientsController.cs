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
    public class AccountClientsController : Controller
    {
        private AppDatabaseContext _ctx;
        private ClientRepository _clientRep;
        public AccountClientsController(AppDatabaseContext ctx)
        {
            _ctx = ctx;
            _clientRep = new ClientRepository(_ctx);
        }

        [HttpGet]
        public IActionResult IsAuth()
        {
            if (HttpContext.User.Identity.IsAuthenticated)
            {
                var client = _clientRep.GetClientByLogin(HttpContext.User.Identity.Name);
                return Ok(new ResponseModel()
                {
                    ResultCode = 0,
                    Data = new
                    {
                        client.Id,
                        client.Login,
                        client.Password,
                        client.IsOnline,
                        client.DateLastOnline,
                    },
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
                var client = _clientRep.GetClientByLoginAndPass(model.Login, model.Password);
                if (client != null)
                {
                    await Authenticate(client); // аутентификация
                    return Ok(new ResponseModel()
                    {
                        ResultCode = 0,
                        Data = new
                        {
                            client.Id,
                            client.Login,
                            client.Password,
                            client.IsOnline,
                            client.DateLastOnline,
                        },
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
                var client = _clientRep.GetClientByLogin(model.Login);
                if (client == null)
                {
                    client = new ClientModel
                    {
                        Login = model.Login,
                        Password = model.Password,
                    };
                    client = _clientRep.AddClient(client);
                    await Authenticate(client); // аутентификация
                    return Ok(new ResponseModel()
                    {
                        ResultCode = 0,
                        Data = new
                        {
                            client.Id,
                            client.Login,
                            client.Password,
                            client.IsOnline,
                            client.DateLastOnline,
                        },
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
        private async Task Authenticate(ClientModel client)
        {
            // создаем один claim
            var claims = new List<Claim> {
                new Claim(ClaimsIdentity.DefaultNameClaimType, client.Login),
            };
            // создаем объект ClaimsIdentity
            ClaimsIdentity id = new ClaimsIdentity(claims, "ApplicationCookie", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
            // установка аутентификационных куки
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(id));
        }

        [HttpDelete]
        public async Task<IActionResult> Logout()
        {
            if (!HttpContext.User.Identity.IsAuthenticated)
                return Ok(new ResponseModel() { ResultCode = 1, Messages = new string[] { "You are already logout" } });
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new ResponseModel() { ResultCode = 0 });
        }
    }
}
