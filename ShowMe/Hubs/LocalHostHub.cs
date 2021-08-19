using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using ShowMe.Repositories;
using ShowMe.Interfaces;
using System;
using System.Linq;

namespace ShowMe.Hubs
{
    [Authorize]
    public class LocalHostHub: Hub<ILocalHostClient>
    {
        private AppDatabaseContext _ctx;
        private UserRepository _userRep;
        private ClientRepository _clientRep;

        public LocalHostHub(AppDatabaseContext ctx)
        {
            _ctx = ctx;
            _userRep = new UserRepository(ctx);
            _clientRep = new ClientRepository(ctx);
        }

        public async Task SendMessage(string messageText)
        {
            await Clients.All.ReceiveMessage(messageText);
        }
        
        public async Task SendWebCamFrame(byte[] bytes)
        {
            await Clients.Others.ReceiveWebCamFrame(bytes);
        }
        
        public async Task ToggleWebCam(string clientLogin, bool flag)
        {
            await Clients.User(clientLogin).ToggleWebCam(flag);
            await Clients.All.ReceiveMessage($"{Context.User.Identity.Name}: toogle in {clientLogin} webcam to {flag}");
        }

        public override async Task OnConnectedAsync()
        {
            string currentLogin = Context.User.Identity.Name;
            if (_clientRep.IsClient(currentLogin))
            {
                _clientRep.ToggleClientOnline(currentLogin, true);
                var usersInClient = _clientRep.GetUsersInClient(currentLogin).Select(u => u.Login);
                await Clients.Users(usersInClient).ToggleClientOnline(currentLogin, true);
            }    
            await Clients.All.ReceiveMessage(currentLogin + " connected");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            string currentLogin = Context.User.Identity.Name;
            if (_clientRep.IsClient(currentLogin))
            {
                _clientRep.ToggleClientOnline(currentLogin, false);
                var usersInClient = _clientRep.GetUsersInClient(currentLogin).Select(u => u.Login);
                await Clients.Users(usersInClient).ToggleClientOnline(currentLogin, false);
            }
            await Clients.All.ReceiveMessage(currentLogin + " disconnected");
            await base.OnDisconnectedAsync(exception);
        }
    }
}
