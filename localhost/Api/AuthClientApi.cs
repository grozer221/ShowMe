using System;
using System.Net.Http;

namespace localhost.Api
{
    public class AuthClientApi : ApiBase
    {

        //var cookieContainer = new CookieContainer();
        //cookieContainer.Add(cookie);
        //using (var handler = new HttpClientHandler() { CookieContainer = cookieContainer })
        //{
        //    using (var client = new HttpClient(handler))
        //    {
        //        var response = client.GetStringAsync(APP_PATH + "/api/account/isauth").Result;
        //        Console.WriteLine(response);
        //    }
        //}

        public static string Login(string login, string password)
        {
            var model = new
            {
                login = login,
                password = password,
            };
            using (var handler = new HttpClientHandler())
            {
                using (var client = new HttpClient(handler))
                {
                    var res = client.PostAsJsonAsync(APP_PATH + "/api/accountclients/login", model);
                    var setCookieHeaders = res.Result.Headers.Contains("Set-Cookie")
                               ? res.Result.Headers.GetValues("Set-Cookie")
                               : Array.Empty<string>();
                    Cookie = handler.CookieContainer.GetCookies(new Uri(APP_PATH));
                    return res.Result.Content.ReadAsStringAsync().Result;
                }
            }
        }

        public static string Register(string login, string password, string confirmPassword)
        {
            var model = new
            {
                login = login,
                password = password,
                confirmPassword = confirmPassword,
            };
            using (var handler = new HttpClientHandler())
            {
                using (var client = new HttpClient(handler))
                {
                    var res = client.PostAsJsonAsync(APP_PATH + "/api/accountclients/register", model);
                    var setCookieHeaders = res.Result.Headers.Contains("Set-Cookie")
                               ? res.Result.Headers.GetValues("Set-Cookie")
                               : Array.Empty<string>();
                    Cookie = handler.CookieContainer.GetCookies(new Uri(APP_PATH));
                    return res.Result.Content.ReadAsStringAsync().Result;
                }
            }
        }
        public static void Logout()
        {
            Cookie = null;
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("You successfully logout");
            Console.ResetColor();
        }
    }
}
