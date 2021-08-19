using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShowMe.Models
{
    public class ClientModel
    {
        public int Id { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public virtual List<UserModel> Users { get; set; }
        public bool IsOnline { get; set; }
        public DateTime DateLastOnline { get; set; }

    }
}
