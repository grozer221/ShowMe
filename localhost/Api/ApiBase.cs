using System;
using System.Net;

namespace localhost.Api
{
    public class ApiBase
    {
        public static readonly string APP_PATH = "https://showmeyou.azurewebsites.net";
        //public static readonly string APP_PATH = "https://localhost:44301";

        public static readonly string LOGIN_FILE_PATH = Environment.CurrentDirectory + "/localhost.txt";

        public static CookieCollection Cookie;

        public static CookieContainer CookieContainer { 
            get
            {
                CookieContainer cookieContainer = new CookieContainer();
                cookieContainer.Add(Cookie);
                return cookieContainer;
            } 
        }
    }
}
