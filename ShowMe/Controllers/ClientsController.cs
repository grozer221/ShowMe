using Microsoft.AspNetCore.Mvc;
using ShowMe.Repositories;
using ShowMe.Models;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace ShowMe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ClientsController : Controller
    {
        private AppDatabaseContext _ctx;
        private UserRepository _userRep;
        private ClientRepository _clientRep;
        public ClientsController(AppDatabaseContext ctx)
        {
            _ctx = ctx;
            _userRep = new UserRepository(_ctx);
            _clientRep = new ClientRepository(_ctx);
        }

        [HttpGet]
        public IActionResult Get()
        {
            var clients = _clientRep.GetClientByUserLogin(HttpContext.User.Identity.Name);
            return Ok(new ResponseModel()
            {
                ResultCode = 0,
                Data = clients.Select(c => new
                {
                    c.Id,
                    c.Login,
                }),
            });
        }
        
        [HttpPut]
        public IActionResult Put([FromBody]LoginModel model)
        {
            var client = _clientRep.GetClientByLoginAndPass(model.Login, model.Password);
            if (client == null)
                return Ok(new ResponseModel()
                {
                    ResultCode = 1,
                    Messages = new string[] { "Current client does not exist" }
                });
            bool result = _userRep.AddClientToUser(HttpContext.User.Identity.Name, client.Login);
            if(!result)
                return Ok(new ResponseModel()
                {
                    ResultCode = 1,
                    Messages = new string[] { "You already added current client" }
                });
            return Ok(new ResponseModel()
            {
                ResultCode = 0,
                Data = new
                {
                    client.Id,
                    client.Login,
                },
            });
        }

    }
}
