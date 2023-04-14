using System.Threading;
using Telegram.Bot;
using Telegram.Bot.Exceptions;
using Telegram.Bot.Polling;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.ReplyMarkups;
using System.Net.Http;

const string completeOrdersDisplayName = "Подтвердить заказы";
const string showOrdersDisplayName = "Посмотреть действующие заказы";
HttpClient client = new HttpClient();

var botClient = new TelegramBotClient("6026812025:AAF6J7iXE_DtmsnshBhPSGMMA3jwqJL49pc");

using CancellationTokenSource cts = new();

// StartReceiving does not block the caller thread. Receiving is done on the ThreadPool.
ReceiverOptions receiverOptions = new()
{
    AllowedUpdates = Array.Empty<UpdateType>() // receive all update types
};

botClient.StartReceiving(
    updateHandler: HandleUpdateAsync,
    pollingErrorHandler: HandlePollingErrorAsync,
    receiverOptions: receiverOptions,
    cancellationToken: cts.Token
);

var me = await botClient.GetMeAsync();

Console.WriteLine($"Start listening for @{me.Username}");
Console.ReadLine();

// Send cancellation request to stop bot
cts.Cancel();

async Task HandleUpdateAsync(ITelegramBotClient botClient, Update update, CancellationToken cancellationToken)
{
    // Only process Message updates: https://core.telegram.org/bots/api#message
    if (update.Message is not { } message)
        return;
    // Only process text messages
    if (message.Text is not { } messageText)
        return;

    var chatId = message.Chat.Id;

    Console.WriteLine($"Received a '{messageText}' message in chat {chatId}.");

    // Echo received message text
    ReplyKeyboardMarkup replyKeyboardMarkup = new(new[]
    {
        new KeyboardButton[] { showOrdersDisplayName },
        new KeyboardButton[] { completeOrdersDisplayName },
    })
    {
        ResizeKeyboard = true
    };

    switch (messageText)
    {
        case completeOrdersDisplayName:
            await botClient.SendTextMessageAsync(
                chatId: chatId,
                text: "Все заказы подтверждены",
                replyMarkup: replyKeyboardMarkup,
                cancellationToken: cancellationToken);
            await client.PostAsync("http://localhost:5003/api/product/apispoof/CompleteAllOrders", null);
            break;
        case showOrdersDisplayName:
            await botClient.SendTextMessageAsync(
                chatId: chatId,
                text: $"Список заказов",
                replyMarkup: replyKeyboardMarkup,
                cancellationToken: cancellationToken);
            break;
        default:
            await botClient.SendTextMessageAsync(
                chatId: chatId,
                text: "Choose a response",
                replyMarkup: replyKeyboardMarkup,
                cancellationToken: cancellationToken);
            break;
    }
    
}

Task HandlePollingErrorAsync(ITelegramBotClient botClient, Exception exception, CancellationToken cancellationToken)
{
    var ErrorMessage = exception switch
    {
        ApiRequestException apiRequestException
            => $"Telegram API Error:\n[{apiRequestException.ErrorCode}]\n{apiRequestException.Message}",
        _ => exception.ToString()
    };

    Console.WriteLine(ErrorMessage);
    return Task.CompletedTask;
}
