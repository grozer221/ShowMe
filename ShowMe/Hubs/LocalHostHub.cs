using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using ShowMe.Repositories;
using ShowMe.Interfaces;

namespace ShowMe.Hubs
{
    [AllowAnonymous]
    public class LocalHostHub: Hub<ILocalHostClient>
    {
        private AppDatabaseContext _ctx;
        private UserRepository _userRep;

        public LocalHostHub(AppDatabaseContext ctx)
        {
            _ctx = ctx;
            _userRep = new UserRepository(ctx);
        }

        public async Task SendMessage(string messageText)
        {
            await Clients.All.ReceiveMessage(messageText);
        }
        
        public async Task SendVideo(byte[] bytes)
        {
            await Clients.Others.ReceiveVideo(bytes);
        }
    }
}
