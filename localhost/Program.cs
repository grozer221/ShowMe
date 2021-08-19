using Microsoft.AspNetCore.SignalR.Client;
using System;
using AForge.Video.DirectShow;
using AForge.Video;
using System.Drawing;
using System.IO;
using System.Drawing.Imaging;
using System.Threading.Tasks;
using System.Threading;
using System.Net.Http;
using System.Text;
using System.Net;
using ShowMe.Models;
using Newtonsoft.Json;
using localhost.Api;

namespace localhost
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.InputEncoding = Encoding.UTF8;
            Console.OutputEncoding = Encoding.UTF8;

            if (File.Exists(ApiBase.LOGIN_FILE_PATH))
            {
                string data;
                using (var sr = new StreamReader(ApiBase.LOGIN_FILE_PATH, Encoding.UTF8))
                    data = sr.ReadToEnd();
                var client = JsonConvert.DeserializeObject<ClientModel>(data);
                if (client != null)
                {
                    string result = AuthClientApi.Login(client.Login, client.Password);
                    var resultModel = JsonConvert.DeserializeObject<ResponseModel>(result);
                    if (resultModel.ResultCode == 0)
                        Menu.AutorizedMenu();
                    Console.WriteLine(resultModel.Messages[0]);
                }
            }
            Menu.UnautorizedMenu();
        }
    }
}
