using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ShowMe.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShowMe.Repositories
{
    [Authorize]
    public class ClientRepository
    {
        private readonly AppDatabaseContext _ctx;
        public ClientRepository(AppDatabaseContext appDatabaseContext)
        {
            _ctx = appDatabaseContext;
        }

        public int GetClientIdByLogin(string login)
        {
            return _ctx.Clients.FirstOrDefault(u => u.Login == login).Id;
        }

        public ClientModel GetClientByLogin(string login)
        {
            return _ctx.Clients.FirstOrDefault(u => u.Login == login); ;
        }

        public ClientModel GetClientById(int id)
        {
            return _ctx.Clients.Find(id);
        }
        
        public ClientModel GetClientByLoginAndPass(string login, string password)
        {
            return _ctx.Clients.FirstOrDefault(u => u.Login == login && u.Password == password);
        }

        public ClientModel AddClient(ClientModel client)
        {
            _ctx.Clients.Add(client);
            _ctx.SaveChanges();
            return client;
        }
        
        public List<ClientModel> GetClientByUserLogin(string userLogin)
        {
            return _ctx.Users.Include(u => u.Clients).FirstOrDefault(u => u.Login == userLogin).Clients.Select(c => c).ToList();
        }
        
        public bool IsClient(string clientLogin)
        {
            return _ctx.Clients.Any(c => c.Login == clientLogin);
        }
        
        public List<UserModel> GetUsersInClient(string clientLogin)
        {
            return _ctx.Clients.Include(c => c.Users).FirstOrDefault(c => c.Login == clientLogin).Users;
        }
        
        public void ToggleClientOnline(string clientLogin, bool flag)
        {
            var client = _ctx.Clients.FirstOrDefault(c => c.Login == clientLogin);
            client.IsOnline = flag;
            client.DateLastOnline = DateTime.UtcNow;
            _ctx.SaveChanges();
        }
    }
}
