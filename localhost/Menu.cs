using localhost.Api;
using Newtonsoft.Json;
using ShowMe.Models;
using System;
using System.IO;
using System.Runtime.InteropServices;

namespace localhost
{
    public class Menu
    {
        //const int SW_HIDE = 0;
        //const int SW_SHOW = 5;

        //[DllImport("kernel32.dll")]
        //static extern IntPtr GetConsoleWindow();

        //[DllImport("user32.dll")]
        //static extern bool ShowWindow(IntPtr hWnd, int nCmShow);

        public static LocalhostApi localhostApi;


        public static void AutorizedMenu()
        {
            localhostApi = new LocalhostApi();
            Console.WriteLine("     Autorized menu");
            int menu;
            bool ok;
            do
            {
                Console.WriteLine("1) Hide console\n2) Logout");
                ok = int.TryParse(Console.ReadLine(), out menu);
                if (!ok || menu > 2 || menu < 1)
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine("     Error!!! Write value again!!!");
                    Console.ResetColor();
                }
            } while (!ok || menu > 2 || menu < 1);

            switch (menu)
            {
                case 1:
                    //ShowWindow(GetConsoleWindow(), SW_HIDE);
                    break;
                case 2:
                    AuthClientApi.Logout();
                    LocalhostApi.connection.StopAsync();
                    using (var sw = new StreamWriter(ApiBase.LOGIN_FILE_PATH))
                        sw.Write("");
                    UnautorizedMenu();
                    break;
            }
        }

        public static void UnautorizedMenu()
        {
            localhostApi = null;
            Console.WriteLine("     Unautorized menu");
            int menu;
            bool ok;
            do
            {
                Console.WriteLine("1) Login\n2) Register");
                ok = int.TryParse(Console.ReadLine(), out menu);
                if (!ok || menu > 2 || menu < 1)
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine("     Error!!! Write value again!!!");
                    Console.ResetColor();
                }
            } while (!ok || menu > 2 || menu < 1);

            switch (menu)
            {
                case 1:
                    {
                        Console.WriteLine("     1) Login");
                        string res;
                        ResponseModel resModel;
                        Console.Write("Login: ");
                        string login = Console.ReadLine();
                        Console.Write("Password: ");
                        string password = Console.ReadLine();
                        res = AuthClientApi.Login(login, password);
                        resModel = JsonConvert.DeserializeObject<ResponseModel>(res);
                        if (resModel.ResultCode == 0)
                        {
                            Console.ForegroundColor = ConsoleColor.Green;
                            Console.WriteLine("     You successfully login");
                            Console.ResetColor();
                            using (var sw = new StreamWriter(Environment.CurrentDirectory + "/localhost.txt"))
                                sw.Write(JsonConvert.SerializeObject(resModel.Data));
                            AutorizedMenu();
                        }
                        Console.WriteLine(resModel.Messages[0] + "\n");
                        UnautorizedMenu();
                        break;
                    }
                case 2:
                    {
                        Console.WriteLine("     2) Register");
                        string res;
                        ResponseModel resModel;
                        Console.Write("Login: ");
                        string login = Console.ReadLine();
                        Console.Write("Password: ");
                        string password = Console.ReadLine();
                        Console.Write("Confirm password: ");
                        string confirmPassword = Console.ReadLine();
                        res = AuthClientApi.Register(login, password, confirmPassword);
                        resModel = JsonConvert.DeserializeObject<ResponseModel>(res);
                        if (resModel.ResultCode == 0)
                        {
                            Console.ForegroundColor = ConsoleColor.Green;
                            Console.WriteLine(" You successfully registered and login");
                            Console.ResetColor();
                            using (var sw = new StreamWriter(Environment.CurrentDirectory + "/localhost.txt"))
                                sw.Write(JsonConvert.SerializeObject(resModel.Data));
                            AutorizedMenu();
                        }
                        Console.WriteLine(resModel.Messages[0] + "\n");
                        UnautorizedMenu();
                        break;
                    }
            }
        }
    }
}
