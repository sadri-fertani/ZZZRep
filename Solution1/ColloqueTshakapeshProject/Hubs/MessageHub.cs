using ColloqueTshakapeshProject.Models;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace ColloqueTshakapeshProject.Hubs
{
    public class MessageHub : Hub
    {
        public async Task NewMessage(Message msg)
        {
            await Clients.Others.SendAsync("MessageReceived", msg);
        }
    }
}
