using Microsoft.AspNetCore.SignalR.Client;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ShowMeYouself
{
    public partial class Form1 : Form
    {
        public static HubConnection connection;

        public Form1()
        {
            InitializeComponent();
            try
            {
                string url = "https://localhost:44301/socket/localhost";
                connection = new HubConnectionBuilder()
                    .WithUrl(url)
                    .WithAutomaticReconnect()
                    .Build();
                connection.StartAsync().Wait();
                connection.On("ReceiveMessage", (string messateText) =>
                {
                    this.Text = messateText;
                });

                connection.On("ReceiveVideo", (byte[] bytes) =>
                {
                    using (var ms = new MemoryStream(bytes))
                    {
                        pictureBox1.Image = new Bitmap(ms);
                    }
                });
            }
            catch(Exception e)
            {
                MessageBox.Show(e.Message);
            }
        }

    }
}
