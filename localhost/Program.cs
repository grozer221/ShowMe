using Microsoft.AspNetCore.SignalR.Client;
using System;
using AForge.Video.DirectShow;
using System.Drawing;
using System.IO;
using System.Drawing.Imaging;

namespace localhost
{
    class Program
    {
        public static HubConnection connection;
        static void Main(string[] args)
        {
            //string url = "https://showmeyou.azurewebsites.net/socket/localhost";
            string url = "https://localhost:44301/socket/localhost";
            connection = new HubConnectionBuilder()
                .WithUrl(url)
                .WithAutomaticReconnect()
                .Build();
            connection.StartAsync().Wait();
            connection.On("ReceiveMessage", (string messateText) =>
            {
                Console.WriteLine(messateText);
            });
            FilterInfoCollection videoDevices = new FilterInfoCollection(FilterCategory.VideoInputDevice);
            VideoCaptureDevice videoSource = new VideoCaptureDevice(videoDevices[0].MonikerString);
            videoSource.NewFrame += VideoSource_NewFrame;
            videoSource.Start();
            Console.ReadLine();
        }

        private static void VideoSource_NewFrame(object sender, AForge.Video.NewFrameEventArgs eventArgs)
        {
            var bmp = new Bitmap(eventArgs.Frame, 800, 600);
            try
            {
                using(var ms = new MemoryStream())
                {
                    bmp.Save(ms, ImageFormat.Jpeg);
                    var bytes = ms.ToArray();
                    connection.InvokeCoreAsync("SendVideo", new[] { bytes });
                }
            }
            catch(Exception e)
            {
                Console.WriteLine(e);
            }
        }
    }
}
