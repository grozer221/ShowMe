using System.Threading.Tasks;

namespace ShowMe.Interfaces
{
    public interface ILocalHostClient
    {
        Task ReceiveMessage(string messageText);
        Task ReceiveVideo(byte[] bytes);
    }
}
