from telethon import TelegramClient

api_id = 2597670
api_hash = 'b297821038840dd1d60a471f71105cd2'
tlclient = TelegramClient('session_name', api_id, api_hash)
tlclient.start()

def send_telegram_message(user_name, message):
    
    if user_name is None:
        user_name = 'shakhrillo'
    
    async def _send_messages():
        await tlclient.send_message(
            f'https://t.me/{user_name}',
            message
        )
        print('Message sent successfully')

    tlclient.loop.run_until_complete(_send_messages())