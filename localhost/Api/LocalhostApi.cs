using AForge.Video;
using AForge.Video.DirectShow;
using Microsoft.AspNetCore.SignalR.Client;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace localhost.Api
{
    public class LocalhostApi
    {
        public static readonly string ULR_TO_HUB = ApiBase.APP_PATH + "/socket/localhost";
        public static HubConnection connection;

        public static bool SteramWebCam { get; set; } = false;
        FilterInfoCollection videoDevices;
        VideoCaptureDevice videoSource;

        public LocalhostApi()
        {
            videoDevices = new FilterInfoCollection(FilterCategory.VideoInputDevice);
            videoSource = new VideoCaptureDevice(videoDevices[0].MonikerString);

            connection = new HubConnectionBuilder()
                .WithUrl(ULR_TO_HUB, options => options.Cookies = ApiBase.CookieContainer)
                .WithAutomaticReconnect()
                .Build();
            connection.StartAsync().Wait();

            connection.On("ReceiveMessage", (string messateText) =>
            {
                Console.WriteLine(messateText);
            });

            connection.On("ToggleWebCam", (bool flag) =>
            {
                SteramWebCam = flag;
                
                if (flag)
                {
                    videoSource.NewFrame += VideoSource_NewFrame;
                    videoSource.Start();
                }
                else
                {
                    videoSource.NewFrame -= VideoSource_NewFrame;
                    videoSource.SignalToStop();
                }
            });

        }

        private static void VideoSource_NewFrame(object sender, NewFrameEventArgs eventArgs)
        {
            var bmp = new Bitmap(eventArgs.Frame, 640, 480);
            try
            {
                using (var ms = new MemoryStream())
                {
                    bmp.Save(ms, ImageFormat.Jpeg);
                    var bytes = ms.ToArray();
                    connection.InvokeCoreAsync("SendWebCamFrame", new[] { bytes });
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
        }

        public static async void RecordingScreenAsync()
        {
            await Task.Run(() => RecordingScreen());
        }

        public static void RecordingScreen()
        {
            while (true)
            {
                Bitmap bitmap = new Bitmap(1920, 1080);
                Graphics graphics = Graphics.FromImage(bitmap);
                graphics.CopyFromScreen(0, 0, 0, 0, bitmap.Size);
                using (var ms = new MemoryStream())
                {
                    bitmap.Save(ms, ImageFormat.Jpeg);
                    var bytes = ms.ToArray();
                    connection.InvokeCoreAsync("SendVideo", new[] { bytes });
                }
                Thread.Sleep(500);
            }
        }

        
    }
}
