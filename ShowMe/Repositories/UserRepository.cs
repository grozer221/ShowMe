using Microsoft.AspNetCore.Authorization;
using ShowMe.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShowMe.Repositories
{
    [Authorize]
    public class UserRepository
    {
        private readonly AppDatabaseContext _ctx;
        public UserRepository(AppDatabaseContext appDatabaseContext)
        {
            _ctx = appDatabaseContext;
        }

        public int GetUserIdByLogin(string login)
        {
            return _ctx.Users.FirstOrDefault(u => u.Login == login).Id;
        }

        public UserModel GetUserByLogin(string login)
        {
            var user = _ctx.Users.FirstOrDefault(u => u.Login == login);
            return user;
        }

        public UserModel GetUserById(int id)
        {
            return _ctx.Users.Find(id);
        }
        
        public UserModel GetUserByLoginAndPass(string login, string password)
        {
            return _ctx.Users.FirstOrDefault(u => u.Login == login && u.Password == password);
        }

        public UserModel AddUser(UserModel user)
        {
            _ctx.Users.Add(user);
            _ctx.SaveChanges();
            return user;
        }
    }
}
