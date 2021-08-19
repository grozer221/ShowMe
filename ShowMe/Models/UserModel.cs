using System.Collections.Generic;

namespace ShowMe.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public virtual List<ClientModel> Clients { get; set; }
    }
}
