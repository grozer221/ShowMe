using System.Threading.Tasks;

namespace ShowMe.Interfaces
{
    public interface ILocalHostClient
    {
        Task ReceiveMessage(string messageText);
        Task ReceiveWebCamFrame(byte[] bytes);
        Task ToggleWebCam(bool flag);
        Task ToggleClientOnline(string clientLogin, bool isOnline);
    }
}
